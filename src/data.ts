import type { ProofCredential, Verification } from "./types";

export const SHIELD_VERIFICATIONS: Verification[] = [
  {
    id: "v1",
    candidateId: "c1",
    candidateLabel: "0x7a3f...8b2c",
    userHash: "0x7a3f...8b2c",
    type: "income",
    thresholdLabel: "Income > $50k/yr",
    threshold: "50000",
    result: "passed",
    status: "verified",
    timestamp: "2m ago",
  },
  {
    id: "v2",
    candidateId: "c2",
    candidateLabel: "0x9d1e...4f7a",
    userHash: "0x9d1e...4f7a",
    type: "reputation",
    thresholdLabel: "Rating > 4.5/5.0",
    threshold: "4.5",
    result: "passed",
    status: "verified",
    timestamp: "9m ago",
  },
  {
    id: "v3",
    candidateId: "c3",
    candidateLabel: "0x2b8c...6e1d",
    userHash: "0x2b8c...6e1d",
    type: "skills",
    thresholdLabel: "100+ Completed Jobs",
    threshold: "100",
    result: "passed",
    status: "verified",
    timestamp: "22m ago",
  },
  {
    id: "v4",
    candidateId: "c4",
    candidateLabel: "0x5f4a...9c3b",
    userHash: "0x5f4a...9c3b",
    type: "income",
    thresholdLabel: "Income > $80k/yr",
    threshold: "80000",
    result: "failed",
    status: "rejected",
    timestamp: "41m ago",
  },
  {
    id: "v5",
    candidateId: "c5",
    candidateLabel: "0x1c7b...3a9e",
    userHash: "0x1c7b...3a9e",
    type: "reputation",
    thresholdLabel: "Rating > 4.0/5.0",
    threshold: "4.0",
    result: "passed",
    status: "verified",
    timestamp: "1h ago",
  },
  {
    id: "v6",
    candidateId: "c6",
    candidateLabel: "0xd3a9...7c2f",
    userHash: "0xd3a9...7c2f",
    type: "income",
    thresholdLabel: "Income > $40k/yr",
    threshold: "40000",
    result: "passed",
    status: "pending",
    timestamp: "1h ago",
  },
  {
    id: "v7",
    candidateId: "c7",
    candidateLabel: "0x0f6e...2d88",
    userHash: "0x0f6e...2d88",
    type: "skills",
    thresholdLabel: "50+ Completed Jobs",
    threshold: "50",
    result: "passed",
    status: "pending",
    timestamp: "2h ago",
  },
];

export const FREELANCER_CREDENTIALS: ProofCredential[] = [
  {
    id: "inc",
    icon: "💰",
    label: "Income",
    value: "$20k – $80k",
    detail: "Private verifiable range",
    verified: true,
    threshold: "Income > $50k",
  },
  {
    id: "rat",
    icon: "⭐",
    label: "Rating",
    value: "4.87",
    detail: "From 142 verified reviews",
    verified: true,
    threshold: "Rating > 4.5",
  },
  {
    id: "job",
    icon: "🎓",
    label: "Completed Jobs",
    value: "120 jobs",
    detail: "Zero-knowledge attestation",
    verified: true,
    threshold: "100+ jobs",
  },
];

export function displayAddress(addr: string): string {
  if (!addr) return "Not connected";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function computeStats(verifications: Verification[] = SHIELD_VERIFICATIONS) {
  return {
    active: verifications.length,
    pending: verifications.filter((v) => v.status === "pending").length,
    failed: verifications.filter((v) => v.result === "failed").length,
    listed: verifications,
  };
}