import type {
  IssuerCredential,
  ProofExecutionMode,
  ProofRequest,
  ProofType,
  WorkPolicyCode,
  WorkPolicyRequest,
} from "../types";
import { sha256 } from "../utils/crypto";
import { formatThreshold } from "../utils/contractHelpers";

export const CLAIM_POLICIES: Record<ProofType, readonly number[]> = {
  income: [40000, 50000, 80000, 120000],
  reputation: [4.0, 4.5, 4.9],
  skills: [50, 100, 200],
} as const;

export interface WorkPolicyDefinition {
  code: WorkPolicyCode;
  id: string;
  label: string;
  incomeGreaterThan: number;
  ratingAtLeast: number;
  completedJobsAtLeast: number;
}

export const WORK_POLICIES: Record<WorkPolicyCode, WorkPolicyDefinition> = {
  1: { code: 1, id: "SR-WORK-01", label: "Established", incomeGreaterThan: 40000, ratingAtLeast: 4.0, completedJobsAtLeast: 50 },
  2: { code: 2, id: "SR-WORK-02", label: "Proven professional", incomeGreaterThan: 50000, ratingAtLeast: 4.5, completedJobsAtLeast: 100 },
  3: { code: 3, id: "SR-WORK-03", label: "Elite track record", incomeGreaterThan: 80000, ratingAtLeast: 4.9, completedJobsAtLeast: 200 },
};

export const DEMO_EMPLOYER_ID = "shieldrate-demo-employer";
export const DEMO_JOB_ID = "sr-private-frontend-001";

export const DEMO_CREDENTIAL: IssuerCredential = {
  credentialId: "cred-demo-2026-09-14-001",
  issuerId: "shieldrate-demo-issuer-v1",
  holderSecret: "holder-secret-demo-4fd23d71a0a14f4c",
  income: 68000,
  rating: 4.87,
  completedJobs: 120,
  issuedAt: "2026-09-14T00:00:00.000Z",
  expiresAt: "2026-12-31T23:59:59.000Z",
  nonce: "cred-nonce-0c4388fb910e",
  revoked: false,
};

function canonicalCredential(credential: IssuerCredential): string {
  return [credential.credentialId, credential.issuerId, credential.income, credential.rating.toFixed(2), credential.completedJobs, credential.issuedAt, credential.expiresAt, credential.nonce].join("|");
}

export function credentialCommitment(credential: IssuerCredential): string {
  return sha256(`shieldrate:credential:v1|${canonicalCredential(credential)}`);
}

const DEMO_ISSUER_REGISTRY = new Set<string>([credentialCommitment(DEMO_CREDENTIAL)]);
const DEMO_REVOKED_COMMITMENTS = new Set<string>();

export function executionMode(): ProofExecutionMode {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.VITE_SHIELDRATE_MODE === "midnight-live" ? "midnight-live" : "demo-attested";
}

export function isAllowedThreshold(type: ProofType, threshold: number): boolean {
  return CLAIM_POLICIES[type].some((value) => value === threshold);
}

export function randomChallenge(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  if (bytes.some((value) => value !== 0)) return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return sha256(`${Date.now()}|${Math.random()}`).slice(0, 32);
}

export function bindRequest(req: ProofRequest): Required<ProofRequest> {
  const now = Date.now();
  return {
    ...req,
    thresholdLabel: req.thresholdLabel || formatThreshold(req.type, req.threshold),
    employerId: req.employerId ?? DEMO_EMPLOYER_ID,
    jobId: req.jobId ?? DEMO_JOB_ID,
    challenge: req.challenge ?? randomChallenge(),
    requestExpiresAt: req.requestExpiresAt ?? new Date(now + 10 * 60 * 1000).toISOString(),
  };
}

export function bindWorkPolicyRequest(req: WorkPolicyRequest): Required<WorkPolicyRequest> {
  const now = Date.now();
  return {
    ...req,
    employerId: req.employerId ?? DEMO_EMPLOYER_ID,
    jobId: req.jobId ?? DEMO_JOB_ID,
    challenge: req.challenge ?? randomChallenge(),
    requestExpiresAt: req.requestExpiresAt ?? new Date(now + 10 * 60 * 1000).toISOString(),
  };
}

export function requestHash(req: Required<ProofRequest>): string {
  return sha256(["shieldrate:request:v1", req.employerId, req.jobId, req.type, req.threshold, req.challenge, req.requestExpiresAt].join("|"));
}

export function workPolicyRequestHash(req: Required<WorkPolicyRequest>): string {
  return sha256(["shieldrate:work-request:v1", req.employerId, req.jobId, req.policyCode, req.challenge, req.requestExpiresAt].join("|"));
}

export function scopedSubject(holderSecret: string, employerId: string, jobId: string): string {
  return sha256(`shieldrate:subject:v1|${employerId}|${jobId}|${holderSecret}`);
}

export function requestNullifier(holderSecret: string, hash: string): string {
  return sha256(`shieldrate:nullifier:v1|${hash}|${holderSecret}`);
}

export function workPolicyNullifier(holderSecret: string, employerId: string, jobId: string): string {
  return sha256(`shieldrate:work-nullifier:v1|${employerId}|${jobId}|${holderSecret}`);
}

export function verificationId(hash: string, subject: string, nullifier: string): string {
  return sha256(`shieldrate:verification:v1|${hash}|${subject}|${nullifier}`);
}

export function workPolicyVerificationId(hash: string, subject: string, nullifier: string): string {
  return sha256(`shieldrate:work-verification:v1|${hash}|${subject}|${nullifier}`);
}

export interface CredentialValidation { valid: boolean; commitment: string; reason?: string; }

export function validateCredential(credential: IssuerCredential, now = new Date()): CredentialValidation {
  const commitment = credentialCommitment(credential);
  if (!DEMO_ISSUER_REGISTRY.has(commitment)) return { valid: false, commitment, reason: "demo issuer registration not found" };
  if (credential.revoked || DEMO_REVOKED_COMMITMENTS.has(commitment)) return { valid: false, commitment, reason: "credential revoked" };
  if (new Date(credential.issuedAt).getTime() > now.getTime()) return { valid: false, commitment, reason: "credential issuance is in the future" };
  if (new Date(credential.expiresAt).getTime() <= now.getTime()) return { valid: false, commitment, reason: "credential expired" };
  return { valid: true, commitment };
}

export function requestIsFresh(req: Required<ProofRequest> | Required<WorkPolicyRequest>, now = new Date()): boolean {
  return new Date(req.requestExpiresAt).getTime() > now.getTime();
}

export function evaluateCredential(credential: IssuerCredential, type: ProofType, threshold: number): boolean {
  switch (type) {
    case "income": return credential.income > threshold;
    case "reputation": return credential.rating >= threshold;
    case "skills": return credential.completedJobs >= threshold;
  }
}

export function evaluateWorkPolicy(credential: IssuerCredential, policyCode: WorkPolicyCode): boolean {
  const policy = WORK_POLICIES[policyCode];
  return credential.income > policy.incomeGreaterThan && credential.rating >= policy.ratingAtLeast && credential.completedJobs >= policy.completedJobsAtLeast;
}
