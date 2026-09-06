export type ProofType = "income" | "reputation" | "skills";

export type ProofStatus = "verified" | "rejected" | "pending";

export interface Verification {
  id: string;
  candidateId: string;
  candidateLabel: string;
  userHash: string;
  type: ProofType;
  thresholdLabel: string;
  threshold: string;
  result: "passed" | "failed";
  status: ProofStatus;
  timestamp: string;
}

export interface ProofCredential {
  id: string;
  icon: string;
  label: string;
  value: string;
  detail: string;
  verified: boolean;
  threshold: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  displayAddress: string;
  network: "preprod" | "devnet" | "none";
}

export type View =
  | "landing"
  | "dashboard"
  | "freelancer"
  | "generate-proof"
  | "mobile";

export interface ProofRequest {
  type: ProofType;
  threshold: number;
  thresholdLabel: string;
}

export interface ProofResult {
  passed: boolean;
  userHash: string;
  proofId: string;
  disclosedValue: string;
  generatedAt: string;
  verifiedOnChain: boolean;
}