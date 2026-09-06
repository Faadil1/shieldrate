import type { ProofRequest, ProofResult } from "../types";

/**
 * On-device ZK proof generation.
 *
 * Mirrors the Compact `witness`/`circuit` pattern:
 *   freelancer_income(): Uint<64>;   <- private witness, never leaves device
 *   generate_income_proof(threshold) -> { user, passed, type }
 *
 * Only the disclosed boolean result is returned to the caller. The raw
 * private inputs (income, rating, completed jobs) are never surfaced here.
 */
const PRIVATE_DATA = {
  income: 68000,
  rating: 4.87,
  completedJobs: 120,
  ratingReviews: 142,
} as const;

function thresholdPasses(type: ProofRequest["type"], threshold: number): boolean {
  switch (type) {
    case "income":
      return PRIVATE_DATA.income > threshold;
    case "reputation":
      return PRIVATE_DATA.rating >= threshold;
    case "skills":
      return PRIVATE_DATA.completedJobs >= threshold;
  }
}

export function deviceProof(req: ProofRequest, userHash: string): Promise<ProofResult> {
  return new Promise((resolve) => {
    // Witnesses + circuit prove on-device. Latency simulates proof compile.
    setTimeout(() => {
      const passed = thresholdPasses(req.type, req.threshold);
      resolve({
        passed,
        userHash,
        proofId: (passed ? "ok-" : "no-") + Math.random().toString(16).slice(2, 10),
        disclosedValue: passed ? req.thresholdLabel : "threshold not met",
        generatedAt: new Date().toISOString(),
        verifiedOnChain: false,
      });
    }, 1200);
  });
}