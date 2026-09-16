import type { ContractAddress } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";
import { initializeShieldRateProviders } from "./providers";

const hex = (bytes: Uint8Array): string =>
  Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

const fromHex = (value: string): Uint8Array => {
  const cleaned = value.replace(/^0x/, "");
  if (cleaned.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    throw new Error("Expected a 32-byte hex value.");
  }
  return new Uint8Array(cleaned.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
};

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
