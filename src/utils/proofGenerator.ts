import type {
  ProofRequest,
  ProofResult,
  WorkPolicyRequest,
  WorkQualificationResult,
} from "../types";
import {
  bindRequest,
  bindWorkPolicyRequest,
  DEMO_CREDENTIAL,
  evaluateCredential,
  evaluateWorkPolicy,
  executionMode,
  isAllowedThreshold,
  requestHash,
  requestIsFresh,
  requestNullifier,
  scopedSubject,
  validateCredential,
  verificationId,
  WORK_POLICIES,
  workPolicyNullifier,
  workPolicyRequestHash,
  workPolicyVerificationId,
} from "../security/integrity";

function localFailure(reason: string, generatedAt: string): ProofResult {
  return {
    passed: false,
    userHash: "local-only",
    proofId: `local-${reason.replace(/\s+/g, "-")}`,
    disclosedValue: "not published",
    generatedAt,
    verifiedOnChain: false,
    mode: executionMode(),
    receipt: null,
    failureReason: reason,
  };
}

function qualificationFailure(reason: string, generatedAt: string): WorkQualificationResult {
  return {
    qualified: false,
    proofId: `local-${reason.replace(/\s+/g, "-")}`,
    generatedAt,
    verifiedOnChain: false,
    mode: executionMode(),
    receipt: null,
    failureReason: reason,
  };
}

export async function deviceProof(req: ProofRequest): Promise<ProofResult> {
  const generatedAt = new Date().toISOString();
  const mode = executionMode();
  if (mode === "midnight-live") return localFailure("local demo proof generator is disabled in MIDNIGHT_LIVE; use the Midnight adapter", generatedAt);

  const bound = bindRequest(req);
  if (!isAllowedThreshold(bound.type, bound.threshold)) return localFailure("threshold is outside the approved policy bands", generatedAt);
  if (!requestIsFresh(bound)) return localFailure("verification request expired", generatedAt);

  const validation = validateCredential(DEMO_CREDENTIAL);
  if (!validation.valid) return localFailure(validation.reason ?? "credential invalid", generatedAt);

  const hash = requestHash(bound);
  const subject = scopedSubject(DEMO_CREDENTIAL.holderSecret, bound.employerId, bound.jobId);
  const nullifier = requestNullifier(DEMO_CREDENTIAL.holderSecret, hash);
  if (!evaluateCredential(DEMO_CREDENTIAL, bound.type, bound.threshold)) return localFailure("threshold not met; result kept local", generatedAt);

  const id = verificationId(hash, subject, nullifier);
  return {
    passed: true,
    userHash: subject,
    proofId: id,
    disclosedValue: bound.thresholdLabel,
    generatedAt,
    verifiedOnChain: false,
    mode,
    receipt: {
      verificationId: id,
      requestHash: hash,
      scopedSubject: subject,
      nullifier,
      issuerId: DEMO_CREDENTIAL.issuerId,
      employerId: bound.employerId,
      jobId: bound.jobId,
      claim: bound.type,
      thresholdLabel: bound.thresholdLabel,
      generatedAt,
      requestExpiresAt: bound.requestExpiresAt,
      credentialExpiresAt: DEMO_CREDENTIAL.expiresAt,
      mode,
      network: "not-submitted",
      ledgerStatus: "local-only",
    },
  };
}

export async function deviceWorkQualification(req: WorkPolicyRequest): Promise<WorkQualificationResult> {
  const generatedAt = new Date().toISOString();
  const mode = executionMode();
  if (mode === "midnight-live") return qualificationFailure("local qualification generator is disabled in MIDNIGHT_LIVE; use the registered Midnight work-request path", generatedAt);

  const policy = WORK_POLICIES[req.policyCode];
  if (!policy) return qualificationFailure("unknown work qualification policy", generatedAt);
  const bound = bindWorkPolicyRequest(req);
  if (!requestIsFresh(bound)) return qualificationFailure("verification request expired", generatedAt);

  const validation = validateCredential(DEMO_CREDENTIAL);
  if (!validation.valid) return qualificationFailure(validation.reason ?? "credential invalid", generatedAt);
  if (!evaluateWorkPolicy(DEMO_CREDENTIAL, bound.policyCode)) return qualificationFailure("work qualification not satisfied; no public receipt", generatedAt);

  const hash = workPolicyRequestHash(bound);
  const subject = scopedSubject(DEMO_CREDENTIAL.holderSecret, bound.employerId, bound.jobId);
  const nullifier = workPolicyNullifier(DEMO_CREDENTIAL.holderSecret, bound.employerId, bound.jobId);
  const id = workPolicyVerificationId(hash, subject, nullifier);

  return {
    qualified: true,
    proofId: id,
    generatedAt,
    verifiedOnChain: false,
    mode,
    receipt: {
      verificationId: id,
      requestHash: hash,
      scopedSubject: subject,
      nullifier,
      issuerId: DEMO_CREDENTIAL.issuerId,
      employerId: bound.employerId,
      jobId: bound.jobId,
      policyCode: bound.policyCode,
      policyLabel: `${policy.id} · ${policy.label}`,
      generatedAt,
      requestExpiresAt: bound.requestExpiresAt,
      credentialExpiresAt: DEMO_CREDENTIAL.expiresAt,
      mode,
      network: "not-submitted",
      ledgerStatus: "local-only",
    },
  };
}
