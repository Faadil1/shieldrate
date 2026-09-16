# ShieldRate — Claim Ledger

Status vocabulary:

- `SOURCE_VERIFIED` — directly inspectable in current source/tests/CI.
- `NETWORK_VERIFIED` — backed by a real captured Midnight transaction and independently checked indexed state.
- `LIVE_PENDING` — live path exists, but canonical network evidence has not been captured yet.
- `PREVIEW_ONLY` — product architecture/UX preview, not a working backend capability.

| Claim | Evidence | Status |
|---|---|---|
| Provider-signed credential is checked inside Compact | `contracts/shieldrate.compact`, Schnorr verify | SOURCE_VERIFIED |
| Raw income/rating/jobs are absent from public work receipt | `WorkQualificationReceipt` | SOURCE_VERIFIED |
| Work qualification is all-or-nothing | `assertWorkPolicy` + `verifyRegisteredWorkPolicy` | SOURCE_VERIFIED |
| Failed work policy creates no public negative receipt | assertions occur before `workReceipts.insert` | SOURCE_VERIFIED |
| Employer must register the standard before holder proof | `registerWorkRequest` → `verifyRegisteredWorkPolicy` | SOURCE_VERIFIED |
| Employer identity is wallet-authenticated in Compact | `callerPkh()` from `ownPublicKey()` | SOURCE_VERIFIED |
| One standard is fixed per employer + job scope | `jobRequests` guard in `registerWorkRequest`; compiled-circuit regression test | SOURCE_VERIFIED |
| Cancellation cannot silently replace the standard | `cancelledWorkRequests`; `jobRequests` remains occupied; compiled-circuit regression test | SOURCE_VERIFIED |
| Same holder cannot publish multiple successful qualification receipts for one employer/job | opportunity-scoped `deriveWorkPolicyNullifier` | SOURCE_VERIFIED |
| Request expiry is enforced on-chain using Unix milliseconds | `blockTimeLt`; `tests/compact-contract.test.ts` accepts ms and rejects seconds-at-boundary | SOURCE_VERIFIED |
| Future credential issuance is rejected on-chain | `blockTimeGte(issuedAtEpoch)`; issuer helper emits Unix milliseconds | SOURCE_VERIFIED |
| Provider removal cannot reset revocation history | removal increments/preserves `providerEpochs`; compiled-circuit remove→re-register→rotate test | SOURCE_VERIFIED |
| Holder identity is scoped to employer + job | `deriveScopedSubject` | SOURCE_VERIFIED |
| Live adapter registers work requests and invokes qualification transactions | `src/midnight/api.ts`, `src/midnight/runtime.ts` | SOURCE_VERIFIED |
| Live result requires indexed receipt after finalization | `workReceiptExists` | SOURCE_VERIFIED |
| Live operator UI exposes Commit → Prove sequence | `src/components/LiveSetupPanel.tsx` | SOURCE_VERIFIED |
| Midnight runtime is lazy-loaded from judge-facing entry path | dynamic imports in wallet/contract/operator paths + build chunk output | SOURCE_VERIFIED |
| Generated Compact contract is exercised directly by regression tests | `tests/compact-contract.test.ts`, 5 compiled-contract tests | SOURCE_VERIFIED |
| Current npm dependency audit reports zero known vulnerabilities at configured threshold | CI `35006331486`, Node 22 `npm audit --audit-level=moderate` | SOURCE_VERIFIED |
| V4 registered work request + qualification has a canonical real Lace/Preprod evidence bundle | `evidence/network/...` not created yet | LIVE_PENDING |
| Enterprise Team & Access backend is production-ready | no production RBAC backend committed | PREVIEW_ONLY |
| Webhooks/integration event bus is production-ready | no production integration backend committed | PREVIEW_ONLY |
| Billing/quota metering is production-ready | no production billing backend committed | PREVIEW_ONLY |
| Commit-Before-Know proves legal fairness/non-discrimination | protocol proves immutability, not legal validity | PREVIEW_ONLY |

## Important limits

An employer can authenticate an on-chain `jobScope`, but ShieldRate cannot prove by itself that two different job scopes do not refer to the same real-world requisition. Wave 1 therefore claims **authenticated scope immutability**, not universal real-world job-identity uniqueness.

A clean dependency audit is a point-in-time CI result, not a permanent guarantee about future transitive dependency states.

## Promotion rule

Never replace `LIVE_PENDING` with `NETWORK_VERIFIED` because a build passed, a transaction method exists, or a UI screenshot looks live. Promotion requires a real registered work-request transaction, a real qualification transaction, and independent indexed confirmation of the expected `workReceipts` entry.
