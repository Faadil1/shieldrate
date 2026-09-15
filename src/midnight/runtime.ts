import {
  CompactTypeBytes,
  transientHash,
  type ContractAddress,
  type JubjubPoint,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";
import type { PrivateCredential, Schnorr_SchnorrSignature } from "../../.compact-build/shieldrate/contract/index.js";
import type { ProofRequest, WorkPolicyRequest } from "../types";
import { bindRequest, bindWorkPolicyRequest, randomChallenge } from "../security/integrity";
import {
  ShieldRateAPI,
  type LiveVerificationReceipt,
  type LiveWorkQualificationReceipt,
  type RegisteredWorkRequestResult,
} from "./api";
import {
  connectMidnightWallet,
  initializeShieldRateProviders,
  type MidnightWalletConnection,
} from "./providers";
import type { MidnightWalletSession, ShieldRateProviders } from "./types";
import {
  createShieldRatePrivateState,
  type ShieldRatePrivateState,
  withAttestedCredential,
} from "./witnesses";

const SECRET_STORAGE_KEY = "shieldrate.midnight.session-secrets.v1";
const bytes32Type = new CompactTypeBytes(32);

interface PersistedSecrets {
  holderSecret: string;
  adminSecret: string;
}

export interface AttestedCredentialPayload {
  providerId: string | number;
  credential: {
    income: string | number;
    ratingX100: string | number;
    completedJobs: string | number;
    issuedAtEpoch: string | number;
    expiresAtEpoch: string | number;
    providerEpoch: string | number;
  };
  signature: {
    announcement: { x: string; y: string };
    response: string;
  };
}

export interface MidnightRuntimeSnapshot {
  connected: boolean;
  wallet: MidnightWalletSession | null;
  contractAddress: string | null;
  hasAttestedCredential: boolean;
}

export interface AttestationRequest {
  holderBindingField: string;
  contractAddress: string | null;
}

let privateState: ShieldRatePrivateState | null = null;
let providers: ShieldRateProviders | null = null;
let wallet: MidnightWalletSession | null = null;
let walletConnection: MidnightWalletConnection | null = null;
let api: ShieldRateAPI | null = null;

const hex = (bytes: Uint8Array): string => Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
const fromHex = (value: string): Uint8Array => {
  const cleaned = value.replace(/^0x/, "");
  if (cleaned.length !== 64) throw new Error("Expected a 32-byte hex value.");
  return new Uint8Array(cleaned.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
};

const loadPrivateState = (): ShieldRatePrivateState => {
  if (privateState) return privateState;
  const stored = sessionStorage.getItem(SECRET_STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored) as PersistedSecrets;
    privateState = createShieldRatePrivateState(fromHex(parsed.holderSecret), fromHex(parsed.adminSecret));
    return privateState;
  }
  privateState = createShieldRatePrivateState();
  sessionStorage.setItem(SECRET_STORAGE_KEY, JSON.stringify({
    holderSecret: hex(privateState.holderSecret),
    adminSecret: hex(privateState.adminSecret),
  } satisfies PersistedSecrets));
  return privateState;
};

const hash32 = async (value: string): Promise<Uint8Array> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
};

const thresholdForCircuit = (request: Required<ProofRequest>): bigint => {
  if (request.type === "reputation") return BigInt(Math.round(request.threshold * 100));
  return BigInt(Math.round(request.threshold));
};

const claimCode = (request: Required<ProofRequest>): bigint => {
  if (request.type === "income") return 1n;
  if (request.type === "reputation") return 2n;
  return 3n;
};

export const getMidnightRuntimeSnapshot = (): MidnightRuntimeSnapshot => ({
  connected: !!wallet,
  wallet,
  contractAddress: api?.contractAddress ? String(api.contractAddress) : null,
  hasAttestedCredential: !!privateState && privateState.attestationProviderId !== 0n,
});

/** Connect the wallet only. Heavy proving/provider initialization is lazy. */
export const connectMidnightRuntime = async (): Promise<MidnightRuntimeSnapshot> => {
  if (wallet && walletConnection) return getMidnightRuntimeSnapshot();
  loadPrivateState();
  walletConnection = await connectMidnightWallet();
  wallet = walletConnection.wallet;
  return getMidnightRuntimeSnapshot();
};

const ensureProviders = async (): Promise<ShieldRateProviders> => {
  if (providers) return providers;
  if (!walletConnection) await connectMidnightRuntime();
  if (!walletConnection) throw new Error("Midnight wallet connection was not initialized.");

  const initialized = await initializeShieldRateProviders(walletConnection);
  providers = initialized.providers;
  wallet = initialized.wallet;

  const configuredAddress = import.meta.env.VITE_SHIELDRATE_CONTRACT_ADDRESS as string | undefined;
  if (configuredAddress && !api) {
    api = await ShieldRateAPI.join(providers, configuredAddress as ContractAddress, loadPrivateState());
  }

  return providers;
};

export const deployMidnightContract = async (): Promise<string> => {
  const activeProviders = await ensureProviders();
  api = await ShieldRateAPI.deploy(activeProviders, loadPrivateState());
  return String(api.contractAddress);
};

export const joinMidnightContract = async (contractAddress: string): Promise<void> => {
  const activeProviders = await ensureProviders();
  api = await ShieldRateAPI.join(activeProviders, contractAddress as ContractAddress, loadPrivateState());
};

export const registerMidnightProvider = async (providerId: bigint, providerPk: JubjubPoint): Promise<{ txId: string; blockHeight: number }> => {
  await ensureProviders();
  if (!api) throw new Error("Deploy or join a ShieldRate contract before registering an issuer.");
  const tx = await api.registerProvider(providerId, providerPk);
  return { txId: String(tx.txId), blockHeight: tx.blockHeight };
};

export const createAttestationRequest = (): AttestationRequest => {
  const state = loadPrivateState();
  const holderBinding = ShieldRateGenerated.pureCircuits.deriveHolderBinding(state.holderSecret);
  return {
    holderBindingField: transientHash(bytes32Type, holderBinding).toString(),
    contractAddress: api?.contractAddress ? String(api.contractAddress) : null,
  };
};

export const importAttestedCredential = async (payload: AttestedCredentialPayload): Promise<void> => {
  const credential: PrivateCredential = {
    income: BigInt(payload.credential.income),
    ratingX100: BigInt(payload.credential.ratingX100),
    completedJobs: BigInt(payload.credential.completedJobs),
    issuedAtEpoch: BigInt(payload.credential.issuedAtEpoch),
    expiresAtEpoch: BigInt(payload.credential.expiresAtEpoch),
    providerEpoch: BigInt(payload.credential.providerEpoch),
  };
  const signature: Schnorr_SchnorrSignature = {
    announcement: { x: BigInt(payload.signature.announcement.x), y: BigInt(payload.signature.announcement.y) },
    response: BigInt(payload.signature.response),
  };
  privateState = withAttestedCredential(loadPrivateState(), credential, signature, BigInt(payload.providerId));
  if (api) await api.setPrivateState(privateState);
};

export const registerMidnightWorkRequest = async (rawRequest: WorkPolicyRequest): Promise<RegisteredWorkRequestResult> => {
  await ensureProviders();
  if (!api) throw new Error("No live ShieldRate contract is configured.");
  const request = bindWorkPolicyRequest(rawRequest);
  const requestNonce = await hash32(`shieldrate:work-request-nonce:v1|${randomChallenge()}|${Date.now()}`);
  return api.registerWorkRequest({
    jobScope: await hash32(`shieldrate:job:v1|${request.jobId}`),
    policyCode: BigInt(request.policyCode),
    challenge: await hash32(`shieldrate:challenge:v1|${request.challenge}`),
    requestNonce,
    requestExpiresAtEpoch: BigInt(new Date(request.requestExpiresAt).getTime()),
  });
};

export const verifyMidnightRegisteredWorkPolicy = async (workRequestIdHex: string): Promise<LiveWorkQualificationReceipt> => {
  await ensureProviders();
  if (!api) throw new Error("No live ShieldRate contract is configured.");
  const state = loadPrivateState();
  if (state.attestationProviderId === 0n) throw new Error("No issuer-attested credential is loaded for MIDNIGHT_LIVE.");
  return api.verifyRegisteredWorkPolicy(fromHex(workRequestIdHex), state);
};

export const verifyMidnightProof = async (rawRequest: ProofRequest): Promise<LiveVerificationReceipt> => {
  await ensureProviders();
  if (!api) throw new Error("No live ShieldRate contract is configured. Set VITE_SHIELDRATE_CONTRACT_ADDRESS or deploy a contract first.");
  const state = loadPrivateState();
  if (state.attestationProviderId === 0n) throw new Error("No issuer-attested credential is loaded for MIDNIGHT_LIVE.");

  const request = bindRequest(rawRequest);
  return api.verifyClaim({
    employerScope: await hash32(`shieldrate:employer:v1|${request.employerId}`),
    jobScope: await hash32(`shieldrate:job:v1|${request.jobId}`),
    claimCode: claimCode(request),
    threshold: thresholdForCircuit(request),
    challenge: await hash32(`shieldrate:challenge:v1|${request.challenge}`),
    requestExpiresAtEpoch: BigInt(new Date(request.requestExpiresAt).getTime()),
  }, state);
};

export const verifyLiveReceipt = async (verificationIdHex: string): Promise<boolean> => {
  await ensureProviders();
  return api ? api.receiptExists(fromHex(verificationIdHex)) : false;
};

export const verifyLiveWorkReceipt = async (verificationIdHex: string): Promise<boolean> => {
  await ensureProviders();
  return api ? api.workReceiptExists(fromHex(verificationIdHex)) : false;
};

export const bytesToHex = hex;
