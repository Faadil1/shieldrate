# ShieldRate — Claim Ledger

The purpose of this file is to prevent claims from outrunning evidence.

Status vocabulary:

- `SOURCE_VERIFIED` — directly inspectable in current source/tests/CI.
- `IMPLEMENTED_UNDER_TEST` — implemented, but final branch CI or evaluator run still pending.
- `NETWORK_VERIFIED` — backed by a real captured Midnight transaction and independently checked receipt.
- `LIVE_PENDING` — live path exists, but canonical network evidence has not been captured yet.
- `PREVIEW_ONLY` — product architecture/UX preview, not a working backend capability.

| Claim | Evidence | Status |
|---|---|---|
| Provider-signed credential is checked inside Compact | `contracts/shieldrate.compact`, Schnorr verify | SOURCE_VERIFIED |
| Raw income/rating/jobs are not fields in public work receipt | `WorkQualificationReceipt` | SOURCE_VERIFIED |
| Work qualification is all-or-nothing | `assertWorkPolicy` + `verifyWorkPolicy` | SOURCE_VERIFIED |
| Failed work policy creates no public negative receipt | assertion order before `workReceipts.insert` | SOURCE_VERIFIED |
| Request expiry is enforced on-chain | `blockTimeLt(requestExpiresAtEpoch)` | SOURCE_VERIFIED |
| Future credential issuance is rejected on-chain | `blockTimeGte(issuedAtEpoch)` | SOURCE_VERIFIED |
| Same work policy cannot be re-probed in same employer/job by changing challenge | scope-stable `deriveWorkPolicyNullifier` | SOURCE_VERIFIED |
| Holder identity is scoped to employer + job | `deriveScopedSubject` | SOURCE_VERIFIED |
| Provider epoch rotation invalidates older credentials | `providerEpochs` check | SOURCE_VERIFIED |
| Live adapter deploys/joins and invokes Midnight transactions | `src/midnight/api.ts` + providers/runtime modules | SOURCE_VERIFIED |
| UI/API requires indexed receipt after finalization | `receiptExists` / `workReceiptExists` | SOURCE_VERIFIED |
| V4 work qualification has a canonical real Lace transaction | `evidence/network/...` (not created yet) | LIVE_PENDING |
| Enterprise Team & Access backend is production-ready | no production RBAC backend committed | PREVIEW_ONLY |
| Webhooks/integration event bus is production-ready | no production integration backend committed | PREVIEW_ONLY |
| Billing/quota metering is production-ready | no production billing backend committed | PREVIEW_ONLY |
| Dependency tree is vulnerability-free | audit remediation not completed | LIVE_PENDING |

## Promotion rule

Never replace `LIVE_PENDING` with `NETWORK_VERIFIED` because a build passed, a transaction function exists, or a UI screenshot looks live. Promotion requires a real transaction artifact and an independently readable receipt or contract-state record.
