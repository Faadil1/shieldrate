import type { ProofRequest } from "../types";
import { sha256 } from "./crypto";

/** Legacy helper retained for demo fixtures only. Live proof identity uses a
 * job-scoped holder pseudonym from security/integrity.ts, not this wallet hash. */
export function userHashFor(walletAddress: string): string {
  return sha256(`shield::${walletAddress}`).slice(0, 18);
}

export function waitForTx(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatThreshold(type: ProofRequest["type"], threshold: number): string {
  switch (type) {
    case "income":
      return `Income > $${threshold.toLocaleString()}/yr`;
    case "reputation":
      return `Rating ≥ ${threshold.toFixed(1)}/5.0`;
    case "skills":
      return `${threshold}+ Completed Jobs`;
  }
}
