import type { ProofRequest, ProofResult } from "../types";
import {
  bindRequest,
  DEMO_CREDENTIAL,
  evaluateCredential,
  executionMode,
  isAllowedThreshold,
  requestHash,
  requestIsFresh,
  requestNullifier,
  scopedSubject,
  validateCredential,
  verificationId,
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

export async function deviceProof(req: ProofRequest): Promise<ProofResult> {
  const generatedAt = new Date().toISOString();
  const mode = executionMode();

  if (mode === "midnight-live") {
    return localFailure(
      "MIDNIGHT_LIVE requested but the live SDK adapter is not wired yet",
      generatedAt,
    );
  }

  const bound = bindRequest(req);
  if (!isAllowedThreshold(bound.type, bound.threshold)) {
    return localFailure("threshold is outside the approved policy bands", generatedAt);
  }
  if (!requestIsFresh(bound)) {
    return localFailure("verification request expired", generatedAt);
  }

  const validation = validateCredential(DEMO_CREDENTIAL);
  if (!validation.valid) {
    return localFailure(validation.reason ?? "credential invalid", generatedAt);
  }

  const hash = requestHash(bound);
  const subject = scopedSubject(
    DEMO_CREDENTIAL.holderSecret,
    bound.employerId,
    bound.jobId,
  );
  const nullifier = requestNullifier(DEMO_CREDENTIAL.holderSecret, hash);
  const passed = evaluateCredential(DEMO_CREDENTIAL, bound.type, bound.threshold);

  // Failed predicates intentionally produce no shareable receipt and no ledger
  // payload. This avoids publishing negative financial/reputation information.
  if (!passed) {
    return localFailure("threshold not met; result kept local", generatedAt);
  }

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
