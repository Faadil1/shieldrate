# Criterion — Judge Review Guide

Status: `V4_NETWORK_VERIFIED`

Technical continuity: the deployed Compact contract and repository retain the historical `shieldrate` / `SR-*` namespace. Criterion is the judge-facing product name.

## 1. Product claim in one sentence

**Criterion makes the employer commit a qualification standard before the worker proves anything, then lets an issuer-attested worker prove they qualify without revealing the private work data or leaving a public failure trail.**

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## 2. Why this matters

Criterion treats privacy as a two-sided protocol problem:

- **holder privacy:** raw income, rating and completed-job history remain private;
- **criteria discipline:** one policy is fixed for the employer/job scope before holder proof;
- **failure privacy:** refusal/failure creates no holder-specific public negative receipt;
- **opportunity privacy budget:** successful publication is scoped to the opportunity rather than a reusable worker identity.

The key distinction is not simply “zero-knowledge credentials.” The verifier's ability to change the question is part of the privacy model.

## 3. Canonical Preprod proof

Contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Provider 2:
- registration tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Committed employer request:
- job `sr-wave1-canonical-2026-09-15-03`
- policy `SR-WORK-02` / code `2`
- request `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
- tx `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
- block `2575087`

Private qualification:
- verification `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1`
- tx `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836`
- block `2575167`
- expected verification id confirmed in indexed `workReceipts` before the runtime returned `QUALIFIED`.

Evidence bundle:

`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`

## 4. Source-verifiable properties

- Compact 0.31.1 compiles the V4 contract.
- `registerWorkRequest` fixes one policy per employer + job key.
- cancelling does not free that job key for policy replacement.
- `verifyRegisteredWorkPolicy` reads the already-registered request instead of accepting proof-time thresholds.
- provider-signed private credentials are verified in-circuit with Schnorr.
- holder subject is scoped to employer + job.
- work nullifier is opportunity-scoped.
- request and credential time checks use Unix seconds on the live path.
- future-issued credentials are rejected.
- provider epoch history is monotonic.
- failed qualification aborts before receipt insertion.
- successful receipt contains no raw income, rating, completed-job count or component verdicts.
- the MidnightJS adapter requires indexed receipt confirmation before reporting a successful live qualification.

## 5. Falsification checks

A reviewer can try to break the thesis:

- register a second policy under the same employer/job key → must fail;
- cancel then replace that policy → must still fail;
- use an expired work request → qualification must fail;
- use a future-issued or revoked-epoch credential → qualification must fail;
- use a credential that does not satisfy the policy → no public qualification receipt;
- successfully qualify twice for the same opportunity → nullifier guard must stop duplicate publication;
- inspect `WorkQualificationReceipt` → no private component values or component-level verdicts.

## 6. Clean-checkout verification

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

## 7. Read these files in order

1. `README.md`
2. `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`
3. `contracts/shieldrate.compact`
4. `docs/COMMIT-BEFORE-KNOW.md`
5. `src/midnight/api.ts`
6. `src/midnight/runtime.ts`
7. `tests/compact-contract.test.ts`
8. `docs/DEMO-90S.md`

## 8. Truth boundary / non-claims

Criterion does not claim production issuer governance, production RBAC/billing/webhooks, legal fairness of a committed policy, or a guaranteed one-to-one mapping between `jobScope` and an external real-world requisition.

The current contract derives employer scope from the Midnight public-key context exposed by `ownPublicKey()`. This is sufficient for the canonical demonstration but should not be treated as the final production authorization boundary; secret-witness-derived identity remains a hardening item.
