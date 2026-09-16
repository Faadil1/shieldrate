# ShieldRate — Judge Review Guide

Status: `V4_SOURCE_VERIFIED / NETWORK_EVIDENCE_PENDING`

## 1. Product claim in one sentence

**ShieldRate lets an employer commit a qualification standard before seeing a candidate outcome, then lets an issuer-attested worker prove they satisfy that standard without revealing the private work data or leaving a public failure trail.**

The signature sequence is:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## 2. What is different here

ShieldRate treats privacy as a two-sided protocol problem:

- **holder privacy:** raw income, rating and completed-job history remain private;
- **verifier accountability:** the employer wallet commits the policy before proof and cannot replace it under the same registered job scope;
- **failure privacy:** refusal/failure creates no holder-specific public negative receipt;
- **opportunity privacy budget:** a holder can publish at most one successful qualification receipt for that employer/job opportunity.

Among the reviewed public Wave 1 repositories, we found many strong credential, compliance, claim, eligibility and privacy products, but did not surface another submission centered on an employer-authenticated immutable pre-commit of hiring/contractor criteria before candidate proof. This is a reviewed-field observation, not a claim about every possible submission.

## 3. Source-verifiable now

- Compact 0.31.1 compiles the V4 contract.
- Employer identity is derived from `ownPublicKey()`.
- `registerWorkRequest` fixes one policy per employer + job scope.
- cancelling a request does not free the job key for a replacement standard.
- `verifyRegisteredWorkPolicy` reads the already-registered policy rather than accepting proof-time thresholds.
- provider-signed private credentials are verified in-circuit with Schnorr.
- holder identity is scoped to employer + job.
- work nullifier is opportunity-scoped rather than challenge/policy-scoped.
- request expiry is checked against Midnight block time.
- future-issued credentials are rejected against block time.
- provider removal preserves and increments epoch history.
- failed qualification writes no receipt.
- successful work receipt contains no raw income/rating/jobs or component verdicts.
- MidnightJS live adapter registers requests, submits proof transactions and re-reads indexed state.
- operator UI exposes the V4 Commit → Prove sequence.
- live runtime is code-split from the judge-facing entry bundle.
- application tests currently cover 20 integrity/privacy cases.
- dependency toolchain was refreshed to Vite 8.3.0 / Vitest 5.0.1 and the remediation validation reported 0 npm audit vulnerabilities.

## 4. Still pending

A canonical real Lace/Preprod evidence bundle for this exact V4 request-registry flow is still pending. Do not interpret source compilation or a successful build as network validation.

## 5. Clean-checkout verification

```bash
npm ci
npm audit --audit-level=moderate
npm run typecheck
npm test
npm run build
```

Then:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

## 6. Read these files in order

1. `contracts/shieldrate.compact`
2. `docs/COMMIT-BEFORE-KNOW.md`
3. `tests/shieldrate.test.ts`
4. `src/midnight/api.ts`
5. `src/midnight/runtime.ts`
6. `docs/CLAIMS.md`
7. `docs/REAL-TX-RUNBOOK.md`
8. `docs/DEMO-90S.md`

## 7. The falsification checks

A reviewer can try to break the thesis:

- register a second policy under the same employer/job scope → must fail;
- cancel then try to replace the same job policy → must still fail;
- use an expired work request → proof must fail;
- use a future-issued or revoked-epoch credential → proof must fail;
- prove a policy the private credential does not satisfy → no public qualification receipt;
- successfully prove, then attempt another qualification for the same opportunity → nullifier guard must fail;
- inspect `WorkQualificationReceipt` → no private component values or component-level verdicts.

## 8. Non-claims

ShieldRate does not currently claim:

- V4 network validation until the canonical Lace run is captured;
- production real-world issuer governance;
- that a committed employer policy is lawful, unbiased or non-discriminatory;
- that on-chain `jobScope` prevents a malicious employer from describing the same real-world role under a distinct external requisition identifier;
- production RBAC, billing or webhook infrastructure.

## 9. Winning bar before visual redesign

1. final branch CI green on Compact + Node 20/22 + npm audit gate;
2. real employer work-request transaction captured;
3. real holder qualification transaction captured;
4. expected `workReceipts` entry independently found in indexed contract state;
5. only then promote live claims and redesign the judge experience around `COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`.
