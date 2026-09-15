import type { ProofCredential, Verification } from "./types";

const DEMO_FRESH_UNTIL = "2026-12-31T23:59:59.000Z";

export const SHIELD_VERIFICATIONS: Verification[] = [
  { id: "v1", candidateId: "c1", candidateLabel: "scope-a", userHash: "demo-a…19c2", type: "income", thresholdLabel: "Income > $50k/yr", threshold: "50000", result: "passed", status: "verified", timestamp: "demo fixture", evidenceMode: "demo-attested", freshUntil: DEMO_FRESH_UNTIL },
  { id: "v2", candidateId: "c2", candidateLabel: "scope-b", userHash: "demo-b…4f7a", type: "reputation", thresholdLabel: "Rating ≥ 4.5/5.0", threshold: "4.5", result: "passed", status: "verified", timestamp: "demo fixture", evidenceMode: "demo-attested", freshUntil: DEMO_FRESH_UNTIL },
  { id: "v3", candidateId: "c3", candidateLabel: "scope-c", userHash: "demo-c…6e1d", type: "skills", thresholdLabel: "100+ Completed Jobs", threshold: "100", result: "passed", status: "verified", timestamp: "demo fixture", evidenceMode: "demo-attested", freshUntil: DEMO_FRESH_UNTIL },
  { id: "v5", candidateId: "c5", candidateLabel: "scope-e", userHash: "demo-e…3a9e", type: "reputation", thresholdLabel: "Rating ≥ 4.0/5.0", threshold: "4.0", result: "passed", status: "verified", timestamp: "demo fixture", evidenceMode: "demo-attested", freshUntil: DEMO_FRESH_UNTIL },
];

export const FREELANCER_CREDENTIALS: ProofCredential[] = [
  { id: "inc", icon: "💰", label: "Income", value: "$68,000", detail: "Local demo fixture · issuer registered", verified: true, threshold: "Income > $50k" },
  { id: "rat", icon: "⭐", label: "Rating", value: "4.87", detail: "Local demo fixture · issuer registered", verified: true, threshold: "Rating ≥ 4.5" },
  { id: "job", icon: "🎓", label: "Completed Jobs", value: "120 jobs", detail: "Local demo fixture · issuer registered", verified: true, threshold: "100+ jobs" },
];

export function displayAddress(addr: string): string {
  if (!addr) return "Not connected";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
}

export function computeStats(verifications: Verification[] = SHIELD_VERIFICATIONS) {
  return {
    active: verifications.length,
    pending: verifications.filter((item) => item.status === "pending").length,
    failed: verifications.filter((item) => item.result === "failed").length,
    listed: verifications,
  };
}
