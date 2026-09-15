import { describe, expect, it } from "vitest";
import { sha256 } from "../src/utils/crypto";
import { userHashFor } from "../src/utils/contractHelpers";
import { deviceProof } from "../src/utils/proofGenerator";
import {
  bindRequest,
  CLAIM_POLICIES,
  DEMO_CREDENTIAL,
  requestHash,
  requestNullifier,
  scopedSubject,
  validateCredential,
} from "../src/security/integrity";

const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();

describe("sha256", () => {
  it("matches the NIST test vector for empty string", () => {
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("matches the NIST test vector for 'abc'", () => {
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("legacy wallet hash", () => {
  it("remains deterministic but is no longer used as shared proof identity", () => {
    expect(userHashFor("wallet-a")).toBe(userHashFor("wallet-a"));
    expect(userHashFor("wallet-a")).not.toBe(userHashFor("wallet-b"));
  });
});

describe("Proof Integrity v1", () => {
  it("accepts the registered, active demo issuer credential", () => {
    expect(validateCredential(DEMO_CREDENTIAL, new Date("2026-09-14T12:00:00Z")).valid).toBe(true);
  });

  it("rejects a revoked demo credential before claim evaluation", () => {
    const revoked = { ...DEMO_CREDENTIAL, revoked: true };
    const result = validateCredential(revoked, new Date("2026-09-14T12:00:00Z"));
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("revoked");
  });

  it("uses fixed policy bands instead of arbitrary thresholds", () => {
    expect(CLAIM_POLICIES.income).toContain(50000);
    expect(CLAIM_POLICIES.reputation).toContain(4.5);
    expect(CLAIM_POLICIES.skills).toContain(100);
  });

  it("changes the pseudonym across employer/job scopes", () => {
    const a = scopedSubject(DEMO_CREDENTIAL.holderSecret, "employer-a", "job-1");
    const b = scopedSubject(DEMO_CREDENTIAL.holderSecret, "employer-b", "job-1");
    const c = scopedSubject(DEMO_CREDENTIAL.holderSecret, "employer-a", "job-2");
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
  });

  it("binds request hash and nullifier to the challenge/context", () => {
    const a = bindRequest({
      type: "income",
      threshold: 50000,
      thresholdLabel: "Income > $50,000/yr",
      employerId: "employer-a",
      jobId: "job-1",
      challenge: "challenge-a",
      requestExpiresAt: future,
    });
    const b = { ...a, challenge: "challenge-b" };
    const hashA = requestHash(a);
    const hashB = requestHash(b);
    expect(hashA).not.toBe(hashB);
    expect(requestNullifier(DEMO_CREDENTIAL.holderSecret, hashA)).not.toBe(
      requestNullifier(DEMO_CREDENTIAL.holderSecret, hashB),
    );
  });

  it("creates a local shareable receipt only for a successful predicate", async () => {
    const result = await deviceProof({
      type: "income",
      threshold: 50000,
      thresholdLabel: "Income > $50,000/yr",
      employerId: "employer-a",
      jobId: "job-1",
      challenge: "challenge-pass",
      requestExpiresAt: future,
    });
    expect(result.passed).toBe(true);
    expect(result.receipt).not.toBeNull();
    expect(result.verifiedOnChain).toBe(false);
    expect(result.receipt?.ledgerStatus).toBe("local-only");
    expect(result.receipt && "credentialCommitment" in result.receipt).toBe(false);
  });

  it("keeps a failed predicate local and produces no receipt", async () => {
    const result = await deviceProof({
      type: "income",
      threshold: 120000,
      thresholdLabel: "Income > $120,000/yr",
      employerId: "employer-a",
      jobId: "job-1",
      challenge: "challenge-fail",
      requestExpiresAt: future,
    });
    expect(result.passed).toBe(false);
    expect(result.receipt).toBeNull();
    expect(result.disclosedValue).toBe("not published");
  });

  it("rejects an expired verification request", async () => {
    const result = await deviceProof({
      type: "income",
      threshold: 50000,
      thresholdLabel: "Income > $50,000/yr",
      employerId: "employer-a",
      jobId: "job-1",
      challenge: "challenge-expired",
      requestExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(result.passed).toBe(false);
    expect(result.receipt).toBeNull();
    expect(result.failureReason).toContain("expired");
  });

  it("rejects arbitrary probing thresholds", async () => {
    const result = await deviceProof({
      type: "income",
      threshold: 67321,
      thresholdLabel: "Income > $67,321/yr",
      employerId: "employer-a",
      jobId: "job-1",
      challenge: "challenge-probe",
      requestExpiresAt: future,
    });
    expect(result.passed).toBe(false);
    expect(result.failureReason).toContain("approved policy bands");
  });
});
