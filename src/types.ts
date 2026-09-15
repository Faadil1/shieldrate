export type ProofType = "income" | "reputation" | "skills";
export type ProofStatus = "verified" | "rejected" | "pending";
export type ProofExecutionMode = "demo-attested" | "midnight-live";
export type LedgerStatus = "local-only" | "submitted" | "confirmed";
export type MidnightNetwork = "preprod" | "preview" | "devnet" | "undeployed" | "none";

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
  evidenceMode?: ProofExecutionMode;
  requestHash?: string;
  freshUntil?: string;
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
  network: MidnightNetwork;
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
  employerId?: string;
  jobId?: string;
  challenge?: string;
  requestExpiresAt?: string;
}

export interface IssuerCredential {
  credentialId: string;
  issuerId: string;
  holderSecret: string;
  income: number;
  rating: number;
  completedJobs: number;
  issuedAt: string;
  expiresAt: string;
  nonce: string;
  revoked: boolean;
}

export interface ProofReceipt {
  verificationId: string;
  requestHash: string;
  scopedSubject: string;
  nullifier: string;
  issuerId: string;
  employerId: string;
  jobId: string;
  claim: ProofType;
  thresholdLabel: string;
  generatedAt: string;
  requestExpiresAt: string;
  credentialExpiresAt: string;
  mode: ProofExecutionMode;
  network: "not-submitted" | "preprod" | "preview" | "devnet";
  ledgerStatus: LedgerStatus;
  txHash?: string;
  contractAddress?: string;
  blockHeight?: string;
}

export interface ProofResult {
  passed: boolean;
  userHash: string;
  proofId: string;
  disclosedValue: string;
  generatedAt: string;
  verifiedOnChain: boolean;
  mode: ProofExecutionMode;
  receipt: ProofReceipt | null;
  failureReason?: string;
}
