# Criterion — Claim Ledger

Status vocabulary:

- `SOURCE_VERIFIED` — directly inspectable in current source/tests/CI.
- `NETWORK_VERIFIED` — backed by a captured Midnight Preprod transaction plus indexed state confirmation.
- `PREVIEW_ONLY` — visible product/UX surface without a production backend claim.

| Claim | Evidence | Status |
|---|---|---|
| Provider-signed credential is checked inside Compact | `contracts/shieldrate.compact`, Schnorr verification | SOURCE_VERIFIED |
| Raw income/rating/job count are absent from the public work receipt | `WorkQualificationReceipt` | SOURCE_VERIFIED |
| Work qualification is all-or-nothing | `assertWorkPolicy` + `verifyRegisteredWorkPolicy` | SOURCE_VERIFIED |
| Failed work policy creates no public negative receipt | assertions occur before `workReceipts.insert` | SOURCE_VERIFIED |
| Employer must register the standard before holder proof | `registerWorkRequest` → `verifyRegisteredWorkPolicy` | SOURCE_VERIFIED |
| One standard is fixed per employer + job scope | `jobRequests` guard | SOURCE_VERIFIED |
| Cancellation cannot silently replace the standard | job key remains occupied after cancellation | SOURCE_VERIFIED |
| Same holder cannot publish multiple successful receipts for one employer/job opportunity | opportunity-scoped nullifier | SOURCE_VERIFIED |
| Live request/credential time checks use Unix seconds | `blockTimeLt`, `blockTimeGte`, live issuance/request helpers | SOURCE_VERIFIED |
| Future-issued credentials are rejected | `blockTimeGte(issuedAtEpoch)` | SOURCE_VERIFIED |
| Credential validity must cover request validity | credential expiry ≥ registered request expiry | SOURCE_VERIFIED |
| Provider removal/rotation advances revocation epoch history | provider epoch logic + regression coverage | SOURCE_VERIFIED |
| Holder subject is scoped to employer + job | `deriveScopedSubject` | SOURCE_VERIFIED |
| Live adapter registers work requests and invokes qualification transactions | `src/midnight/api.ts`, `src/midnight/runtime.ts` | SOURCE_VERIFIED |
| Live success requires indexed receipt confirmation | `workReceiptExists` confirmation before `QUALIFIED` | SOURCE_VERIFIED |
| Compact contract is exercised by regression tests | `tests/compact-contract.test.ts` | SOURCE_VERIFIED |
| Canonical provider registration is live on Preprod | tx `00f51998...79ea2`, block `2568791` | NETWORK_VERIFIED |
| Canonical Commit-Before-Know request is live on Preprod | tx `00a18b...a8eee`, block `2575087` | NETWORK_VERIFIED |
| Canonical private qualification produced the expected indexed positive receipt | verification `6eef4d...583b1`, tx `00aedb...1d836`, block `2575167` | NETWORK_VERIFIED |
| Enterprise Team & Access backend is production-ready | no production RBAC backend committed | PREVIEW_ONLY |
| Webhooks/integration event bus is production-ready | no production integration backend committed | PREVIEW_ONLY |
| Billing/quota metering is production-ready | no production billing backend committed | PREVIEW_ONLY |
| Commit-Before-Know proves legal fairness/non-discrimination | protocol proves immutability, not legal validity | PREVIEW_ONLY |

## Important limits

Criterion binds a work request to a protocol employer scope + `jobScope`, but does not prove a unique one-to-one mapping between that scope and an external real-world requisition.

The current contract derives employer scope from the Midnight public-key context exposed through `ownPublicKey()`. This is not claimed as a production authentication boundary; stronger secret-witness-derived authorization remains a future hardening item.

A clean dependency audit or passing CI run is point-in-time engineering evidence, not a permanent security guarantee.

## Network promotion rule

A network claim is promoted only when the relevant transaction is captured and the expected indexed state is independently re-read. A build pass, transaction method, wallet approval, or UI screenshot is not enough.
