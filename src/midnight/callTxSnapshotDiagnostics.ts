import { createUnprovenCallTx } from "@midnight-ntwrk/midnight-js-contracts";
import type { ContractAddress } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";
import { CompiledShieldRateContract } from "./contract";
import { initializeShieldRateProviders } from "./providers";
import { shieldRatePrivateStateKey } from "./types";
import { createShieldRatePrivateState } from "./witnesses";

const hex = (bytes: Uint8Array): string =>
  Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

const fromHex = (value: string): Uint8Array => {
  const cleaned = value.replace(/^0x/, "");
  if (cleaned.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    throw new Error("Expected a 32-byte hex value.");
  }
  return new Uint8Array(cleaned.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
};

const bytesEqual = (a: Uint8Array, b: Uint8Array): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const hash32 = async (value: string): Promise<Uint8Array> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
};

export interface CallTxSnapshotDiagnostic {
  jobId: string;
  jobScope: string;
  employerPkh: string;
  jobKey: string;
  alreadyFixedInCallTxSnapshot: boolean;
  fixedWorkRequestId: string | null;
}

/**
 * Read the same public-state surface MidnightJS 4.1.1 uses while constructing
 * callTx transactions: queryZSwapAndContractState(). This is strictly read-only.
 */
export async function inspectCallTxSnapshot(
  contractAddress: string,
  jobId: string,
  employerPkhHex: string,
): Promise<CallTxSnapshotDiagnostic> {
  const { providers } = await initializeShieldRateProviders();
  const snapshot = await providers.publicDataProvider.queryZSwapAndContractState(
    contractAddress as ContractAddress,
  );
  if (!snapshot) throw new Error("ShieldRate callTx snapshot is unavailable.");

  const [, contractState] = snapshot;
  const ledger = ShieldRateGenerated.ledger(contractState.data);
  const employerPkh = fromHex(employerPkhHex);
  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const jobKey = ShieldRateGenerated.pureCircuits.deriveJobKey(employerPkh, jobScope);
  const alreadyFixedInCallTxSnapshot = ledger.jobRequests.member(jobKey);

  return {
    jobId,
    jobScope: hex(jobScope),
    employerPkh: hex(employerPkh),
    jobKey: hex(jobKey),
    alreadyFixedInCallTxSnapshot,
    fixedWorkRequestId: alreadyFixedInCallTxSnapshot
      ? hex(ledger.jobRequests.lookup(jobKey))
      : null,
  };
}

export interface IndexedWorkRequestForJobMatch {
  workRequestId: string;
  employerPkh: string;
  jobKey: string;
  policyCode: string;
  expiresAtEpoch: string;
  cancelled: boolean;
  fixedInJobIndex: boolean;
}

export interface IndexedWorkRequestsForJobDiagnostic {
  jobId: string;
  jobScope: string;
  totalWorkRequests: string;
  matches: IndexedWorkRequestForJobMatch[];
}

/**
 * Read only: scan the indexed ShieldRate ledger for any work request whose
 * stored jobScope matches the supplied human-readable job id. This is the
 * authoritative recovery check after an ambiguous/failed UI submission: it
 * does not construct, prove, sign, or submit a transaction.
 */
export async function inspectIndexedWorkRequestsForJob(
  contractAddress: string,
  jobId: string,
): Promise<IndexedWorkRequestsForJobDiagnostic> {
  const { providers } = await initializeShieldRateProviders();
  const state = await providers.publicDataProvider.queryContractState(
    contractAddress as ContractAddress,
  );
  if (!state) throw new Error("ShieldRate indexed contract state is unavailable.");

  const ledger = ShieldRateGenerated.ledger(state.data);
  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const matches: IndexedWorkRequestForJobMatch[] = [];

  for (const [workRequestId, request] of ledger.workRequests) {
    if (!bytesEqual(request.jobScope, jobScope)) continue;
    const jobKey = ShieldRateGenerated.pureCircuits.deriveJobKey(
      request.employerPkh,
      request.jobScope,
    );
    const fixedInJobIndex = ledger.jobRequests.member(jobKey)
      && bytesEqual(ledger.jobRequests.lookup(jobKey), workRequestId);

    matches.push({
      workRequestId: hex(workRequestId),
      employerPkh: hex(request.employerPkh),
      jobKey: hex(jobKey),
      policyCode: request.policyCode.toString(),
      expiresAtEpoch: request.expiresAtEpoch.toString(),
      cancelled: ledger.cancelledWorkRequests.member(workRequestId),
      fixedInJobIndex,
    });
  }

  return {
    jobId,
    jobScope: hex(jobScope),
    totalWorkRequests: ledger.workRequests.size().toString(),
    matches,
  };
}

export interface RuntimeBindingDiagnostic {
  connected: boolean;
  networkId: string | null;
  activeContractAddress: string | null;
  rememberedContractAddress: string | null;
  hasAttestedCredential: boolean;
}

/** Read only: reports the contract address held by the actual runtime module. */
export async function inspectRuntimeBinding(): Promise<RuntimeBindingDiagnostic> {
  const runtime = await import("./runtime");
  const snapshot = runtime.getMidnightRuntimeSnapshot();
  return {
    connected: snapshot.connected,
    networkId: snapshot.wallet?.networkId ?? null,
    activeContractAddress: snapshot.contractAddress,
    rememberedContractAddress: sessionStorage.getItem("shieldrate.midnight.contract-address.v1"),
    hasAttestedCredential: snapshot.hasAttestedCredential,
  };
}

export interface UnprovenWorkRequestDiagnostic {
  jobId: string;
  jobScope: string;
  policyCode: string;
  requestExpiresAtEpoch: string;
  workRequestId: string;
  prepared: boolean;
  circuitResultWorkRequestId: string | null;
  error: string | null;
}

/**
 * Execute MidnightJS createUnprovenCallTx() for registerWorkRequest and stop
 * before proving, balancing, wallet signing, or submission. This is a local
 * transaction-construction reproducer only; it cannot write chain state.
 */
export async function simulateUnprovenWorkRequest(
  contractAddress: string,
  jobId: string,
  policyCode = 2,
): Promise<UnprovenWorkRequestDiagnostic> {
  const { providers } = await initializeShieldRateProviders();
  const address = contractAddress as ContractAddress;
  const privateState = createShieldRatePrivateState();
  providers.privateStateProvider.setContractAddress(address);
  await providers.privateStateProvider.set(shieldRatePrivateStateKey, privateState);

  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const challenge = await hash32(`shieldrate:diagnostic:challenge:v1|${jobId}`);
  const requestNonce = await hash32(`shieldrate:diagnostic:nonce:v1|${jobId}`);
  const requestExpiresAtEpoch = BigInt(Math.floor(Date.now() / 1000) + 600);
  const policy = BigInt(policyCode);
  const workRequestId = ShieldRateGenerated.pureCircuits.deriveWorkRequestId(
    jobScope,
    policy,
    challenge,
    requestNonce,
    requestExpiresAtEpoch,
  );

  try {
    const unproven = await createUnprovenCallTx(providers as any, {
      compiledContract: CompiledShieldRateContract,
      contractAddress: address,
      circuitId: "registerWorkRequest" as any,
      privateStateId: shieldRatePrivateStateKey,
      args: [jobScope, policy, challenge, requestNonce, requestExpiresAtEpoch] as any,
    } as any);

    const result = unproven.private.result as Uint8Array;
    return {
      jobId,
      jobScope: hex(jobScope),
      policyCode: policy.toString(),
      requestExpiresAtEpoch: requestExpiresAtEpoch.toString(),
      workRequestId: hex(workRequestId),
      prepared: true,
      circuitResultWorkRequestId: result instanceof Uint8Array ? hex(result) : null,
      error: null,
    };
  } catch (error) {
    return {
      jobId,
      jobScope: hex(jobScope),
      policyCode: policy.toString(),
      requestExpiresAtEpoch: requestExpiresAtEpoch.toString(),
      workRequestId: hex(workRequestId),
      prepared: false,
      circuitResultWorkRequestId: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}