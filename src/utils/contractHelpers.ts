import type { ProofRequest } from "../types";
import { sha256 } from "./crypto";

/**
 * Deterministic anonymous-ish identifier for a wallet address.
 *
 * In the contract this is `persistent_hash<Bytes<32>>(wallet_secret())` —
 * the same wallet always maps to the same hash, but the hash reveals no
 * address information.
 */
export function userHashFor(walletAddress: string): string {
  return sha256(`shield::${walletAddress}`).slice(0, 18);
}

export function waitForTx(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function formatThreshold(
  type: ProofRequest["type"],
  threshold: number
): string {
  switch (type) {
    case "income":
      return `Income > $${threshold.toLocaleString()}/yr`;
    case "reputation":
      return `Rating > ${threshold.toFixed(1)}/5.0`;
    case "skills":
      return `${threshold}+ Completed Jobs`;
  }
}