import { createUnprovenDeployTx } from "@midnight-ntwrk/midnight-js-contracts";
import {
  CompactTypeBytes,
  sampleSigningKey,
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
import { CompiledShieldRateContract } from "./contract";
import {
  connectMidnightWallet,
  initializeShieldRateProviders,
  type MidnightWalletConnection,
} from "./providers";
import {
  shieldRatePrivateStateKey,
  type MidnightWalletSession,
  type ShieldRateProviders,
} from "./types";
import {
  createShieldRatePrivateState,
  type ShieldRatePrivateState,
  withAttestedCredential,
} from "./witnesses";

const SECRET_STORAGE_KEY = "shieldrate.midnight.session-secrets.v1";
const CONTRACT_STORAGE_KEY = "shieldrate.midnight.contract-address.v1";
const PENDING_DEPLOYMENT_STORAGE_KEY = "shieldrate.midnight.pending-deployment.v1";
const bytes32Type = new CompactTypeBytes(32);

interface PersistedSecrets {
  holderSecret: string;
  adminSecret: string;
}

interface PendingDeployment {
  contractAddress: string;
  txId: string;
  submittedAt: string;
}

export type DeployStage =
  | "RECOVERING"
  | "PREPARING"
  | "PROVING"
  | "BALANCING"
  | "SUBMITTING"
  | "INDEXING"
  | "JOINING"
  | "READY";

export interface DeployProgress {
  stage: DeployStage;
  detail?: string;
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

const delay = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));

const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  let timer: number | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timer = window.setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) window.clearTimeout(timer);
  }
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

const queryIndexedContract = async (activeProviders: ShieldRateProviders, contractAddress: ContractAddress): Promise<boolean> => {
  try {
    return Boolean(await withTimeout(
      activeProviders.publicDataProvider.queryContractState(contractAddress),
      10_000,
      "Indexer query timed out.",
    ));
  } catch {
    return false;
  }
};

const waitForIndexedContract = async (
  activeProviders: ShieldRateProviders,
  contractAddress: ContractAddress,
  timeoutMs = 120_000,
): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await queryIndexedContract(activeProviders, contractAddress)) return true;
    await delay(2_500);
  }
  return false;
};

const restoreKnownContract = async (activeProviders: ShieldRateProviders): Promise<void> => {
  if (api) return;
  const configuredAddress = import.meta.env.VITE_SHIELDRATE_CONTRACT_ADDRESS as string | undefined;
  const rememberedAddress = sessionStorage.getItem(CONTRACT_STORAGE_KEY);
  const contractAddress = configuredAddress ?? rememberedAddress ?? undefined;
  if (!contractAddress) return;

  const address = contractAddress as ContractAddress;
  if (!(await queryIndexedContract(activeProviders, address))) return;
  api = await withTimeout(
    ShieldRateAPI.join(activeProviders, address, loadPrivateState()),
    30_000,
    `Contract ${contractAddress} is indexed, but joining it timed out. Retry Join existing contract.`,
  );
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
  await restoreKnownContract(providers);
  return providers;
};

/**
 * Deploy without MidnightJS' blocking deployContract watcher. MidnightJS 4.1.1
 * waits indefinitely for watchForTxData(), which can leave a browser UI stuck
 * on NOT JOINED even after the wallet has submitted a transaction. We instead
 * make every stage explicit, submit once, then poll the indexed contract address
 * with a bounded timeout. A submitted address is persisted so retry never creates
 * a duplicate deployment while Preprod indexing catches up.
 */
export const deployMidnightContract = async (
  onProgress?: (progress: DeployProgress) => void,
): Promise<string> => {
  const activeProviders = await ensureProviders();
  if (api) return String(api.contractAddress);

  const pendingRaw = sessionStorage.getItem(PENDING_DEPLOYMENT_STORAGE_KEY);
  if (pendingRaw) {
    const pending = JSON.parse(pendingRaw) as PendingDeployment;
    const pendingAddress = pending.contractAddress as ContractAddress;
    onProgress?.({ stage: "RECOVERING", detail: `Checking submitted tx ${pending.txId}` });
    if (await queryIndexedContract(activeProviders, pendingAddress)) {
      onProgress?.({ stage: "JOINING", detail: pending.contractAddress });
      api = await withTimeout(
        ShieldRateAPI.join(activeProviders, pendingAddress, loadPrivateState()),
        30_000,
        `Submitted contract ${pending.contractAddress} is indexed, but joining timed out.`,
      );
      sessionStorage.setItem(CONTRACT_STORAGE_KEY, pending.contractAddress);
      sessionStorage.removeItem(PENDING_DEPLOYMENT_STORAGE_KEY);
      onProgress?.({ stage: "READY", detail: pending.contractAddress });
      return pending.contractAddress;
    }
    throw new Error(
      `A ShieldRate deployment was already submitted and is still waiting for the Preprod indexer. ` +
      `Do not deploy again. Contract ${pending.contractAddress} · tx ${pending.txId}. Retry this button in a minute.`,
    );
  }

  const state = loadPrivateState();
  onProgress?.({ stage: "PREPARING", detail: "Building deterministic deploy transaction" });
  const signingKey = sampleSigningKey();
  const unsubmitted = await withTimeout(
    createUnprovenDeployTx(activeProviders as any, {
      compiledContract: CompiledShieldRateContract,
      signingKey,
      initialPrivateState: state,
    }),
    45_000,
    "Preparing the ShieldRate deploy transaction timed out while loading verifier material.",
  );

  const contractAddress = unsubmitted.public.contractAddress as ContractAddress;
  onProgress?.({ stage: "PROVING", detail: String(contractAddress) });
  const provenTx = await withTimeout(
    activeProviders.proofProvider.proveTx(unsubmitted.private.unprovenTx),
    120_000,
    "Proof generation timed out. The transaction was not submitted; check the wallet proof service and retry.",
  );

  onProgress?.({ stage: "BALANCING", detail: "Wallet fee sponsorship / balancing" });
  const balancedTx = await withTimeout(
    activeProviders.walletProvider.balanceTx(provenTx),
    60_000,
    "Wallet balancing timed out before submission. No indexed ShieldRate contract was confirmed.",
  );

  onProgress?.({ stage: "SUBMITTING", detail: "Submitting once to Midnight Preprod" });
  const txId = String(await withTimeout(
    activeProviders.midnightProvider.submitTx(balancedTx),
    45_000,
    "Wallet submission timed out. Check wallet activity before retrying to avoid a duplicate deployment.",
  ));

  const pending: PendingDeployment = {
    contractAddress: String(contractAddress),
    txId,
    submittedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(PENDING_DEPLOYMENT_STORAGE_KEY, JSON.stringify(pending));

  // Preserve the deployer's local authority/private state while indexing catches up.
  activeProviders.privateStateProvider.setContractAddress(contractAddress);
  await activeProviders.privateStateProvider.set(shieldRatePrivateStateKey, unsubmitted.private.initialPrivateState);
  await activeProviders.privateStateProvider.setSigningKey(contractAddress, unsubmitted.private.signingKey);

  onProgress?.({ stage: "INDEXING", detail: `tx ${txId}` });
  const indexed = await waitForIndexedContract(activeProviders, contractAddress);
  if (!indexed) {
    throw new Error(
      `ShieldRate was submitted, but Preprod has not indexed the contract within 120s. ` +
      `Do not deploy again. Contract ${String(contractAddress)} · tx ${txId}. Retry this button to recover the submitted deployment.`,
    );
  }

  onProgress?.({ stage: "JOINING", detail: String(contractAddress) });
  api = await withTimeout(
    ShieldRateAPI.join(activeProviders, contractAddress, state),
    30_000,
    `Contract ${String(contractAddress)} is indexed, but the client join step timed out. Use Join existing contract with this address.`,
  );

  sessionStorage.setItem(CONTRACT_STORAGE_KEY, String(contractAddress));
  sessionStorage.removeItem(PENDING_DEPLOYMENT_STORAGE_KEY);
  onProgress?.({ stage: "READY", detail: String(contractAddress) });
  return String(contractAddress);
};

export const joinMidnightContract = async (contractAddress: string): Promise<void> => {
  const activeProviders = await ensureProviders();
  const address = contractAddress as ContractAddress;
  if (!(await queryIndexedContract(activeProviders, address))) {
    throw new Error(`No indexed ShieldRate contract is available yet at ${contractAddress}.`);
  }
  api = await withTimeout(
    ShieldRateAPI.join(activeProviders, address, loadPrivateState()),
    30_000,
    `Joining ${contractAddress} timed out.`,
  );
  sessionStorage.setItem(CONTRACT_STORAGE_KEY, contractAddress);
  sessionStorage.removeItem(PENDING_DEPLOYMENT_STORAGE_KEY);
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
