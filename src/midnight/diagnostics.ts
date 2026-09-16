import {
  createCircuitContext,
  type ContractAddress,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";
import { initializeShieldRateProviders } from "./providers";
import { createShieldRatePrivateState, witnesses } from "./witnesses";

const hex = (bytes: Uint8Array): string =>
  Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

const fromHex = (value: string): Uint8Array => {
  const cleaned = value.replace(/^0x/, "");
  if (cleaned.length !== 64) throw new Error("Expected a 32-byte hex value.");
  return new Uint8Array(cleaned.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
};

const hash32 = async (value: string): Promise<Uint8Array> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
};

const loadLedger = async (contractAddress: string) => {
  const { providers } = await initializeShieldRateProviders();
  const state = await providers.publicDataProvider.queryContractState(contractAddress as ContractAddress);
  if (!state) throw new Error("ShieldRate contract state is unavailable.");
  return ShieldRateGenerated.ledger(state.data);
};

export interface WorkRequestDiagnostic {
  exists: boolean;
  workRequestId: string;
  employerPkh: string | null;
  jobScope: string | null;
  policyCode: string | null;
  challenge: string | null;
  requestNonce: string | null;
  expiresAtEpoch: string | null;
  cancelled: boolean | null;
}

export async function inspectWorkRequest(
  contractAddress: string,
  workRequestIdHex: string,
): Promise<WorkRequestDiagnostic> {
  const ledger = await loadLedger(contractAddress);
  const workRequestId = fromHex(workRequestIdHex);
  if (!ledger.workRequests.member(workRequestId)) {
    return {
      exists: false,
      workRequestId: workRequestIdHex.replace(/^0x/, ""),
      employerPkh: null,
      jobScope: null,
      policyCode: null,
      challenge: null,
      requestNonce: null,
      expiresAtEpoch: null,
      cancelled: null,
    };
  }

  const request = ledger.workRequests.lookup(workRequestId);
  return {
    exists: true,
    workRequestId: hex(workRequestId),
    employerPkh: hex(request.employerPkh),
    jobScope: hex(request.jobScope),
    policyCode: request.policyCode.toString(),
    challenge: hex(request.challenge),
    requestNonce: hex(request.requestNonce),
    expiresAtEpoch: request.expiresAtEpoch.toString(),
    cancelled: ledger.cancelledWorkRequests.member(workRequestId),
  };
}

export interface JobScopeDiagnostic {
  jobId: string;
  jobScope: string;
  referenceWorkRequestId: string;
  referenceEmployerPkh: string;
  jobKey: string;
  alreadyFixed: boolean;
  fixedWorkRequestId: string | null;
}

export async function preflightJobScope(
  contractAddress: string,
  jobId: string,
  referenceWorkRequestIdHex: string,
): Promise<JobScopeDiagnostic> {
  const ledger = await loadLedger(contractAddress);
  const referenceWorkRequestId = fromHex(referenceWorkRequestIdHex);
  if (!ledger.workRequests.member(referenceWorkRequestId)) {
    throw new Error("Reference work request is not indexed.");
  }

  const reference = ledger.workRequests.lookup(referenceWorkRequestId);
  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const jobKey = ShieldRateGenerated.pureCircuits.deriveJobKey(reference.employerPkh, jobScope);
  const alreadyFixed = ledger.jobRequests.member(jobKey);

  return {
    jobId,
    jobScope: hex(jobScope),
    referenceWorkRequestId: hex(referenceWorkRequestId),
    referenceEmployerPkh: hex(reference.employerPkh),
    jobKey: hex(jobKey),
    alreadyFixed,
    fixedWorkRequestId: alreadyFixed ? hex(ledger.jobRequests.lookup(jobKey)) : null,
  };
}

export interface CurrentEmployerJobScopeDiagnostic {
  jobId: string;
  jobScope: string;
  currentEmployerPkh: string;
  referenceEmployerPkh: string;
  sameEmployerAsReference: boolean;
  currentJobKey: string;
  alreadyFixedForCurrentEmployer: boolean;
  fixedWorkRequestId: string | null;
}

export async function preflightCurrentEmployerJobScope(
  contractAddress: string,
  jobId: string,
  referenceWorkRequestIdHex: string,
): Promise<CurrentEmployerJobScopeDiagnostic> {
  const { providers, wallet } = await initializeShieldRateProviders();
  const state = await providers.publicDataProvider.queryContractState(contractAddress as ContractAddress);
  if (!state) throw new Error("ShieldRate contract state is unavailable.");

  const ledger = ShieldRateGenerated.ledger(state.data);
  const referenceWorkRequestId = fromHex(referenceWorkRequestIdHex);
  if (!ledger.workRequests.member(referenceWorkRequestId)) {
    throw new Error("Reference work request is not indexed.");
  }
  const reference = ledger.workRequests.lookup(referenceWorkRequestId);

  // Run the already-deployed contract's exported callerPkh() circuit locally.
  // This mirrors the identity material MidnightJS supplies to a call without
  // balancing, signing, proving, or submitting any transaction.
  const contract = new ShieldRateGenerated.Contract(witnesses);
  const context = createCircuitContext(
    contractAddress as ContractAddress,
    wallet.shieldedCoinPublicKey,
    state as any,
    createShieldRatePrivateState(),
  );
  const currentEmployerPkh = contract.impureCircuits.callerPkh(context as any).result;

  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const currentJobKey = ShieldRateGenerated.pureCircuits.deriveJobKey(currentEmployerPkh, jobScope);
  const alreadyFixedForCurrentEmployer = ledger.jobRequests.member(currentJobKey);

  return {
    jobId,
    jobScope: hex(jobScope),
    currentEmployerPkh: hex(currentEmployerPkh),
    referenceEmployerPkh: hex(reference.employerPkh),
    sameEmployerAsReference: hex(currentEmployerPkh) === hex(reference.employerPkh),
    currentJobKey: hex(currentJobKey),
    alreadyFixedForCurrentEmployer,
    fixedWorkRequestId: alreadyFixedForCurrentEmployer
      ? hex(ledger.jobRequests.lookup(currentJobKey))
      : null,
  };
}

export async function workReceiptExists(
  contractAddress: string,
  verificationIdHex: string,
): Promise<boolean> {
  const ledger = await loadLedger(contractAddress);
  return ledger.workReceipts.member(fromHex(verificationIdHex));
}
