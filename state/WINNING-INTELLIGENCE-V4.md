# ShieldRate — Winning Intelligence V4

Status: `BUILD_COMPOSED_CI_PENDING`
Date: 2026-09-15
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Base: `ui-ux-enterprise-saas-v3` (already merged upstream in `opeblow/shieldrate#2`)

## Trigger

After Enterprise SaaS V3 was approved and merged, the next request was to pause visual expansion, re-run Winning Intelligence, inspect the current Wave 1 field, identify hidden spots, apply the strongest product/security/evidence improvements, and only then reopen UI/UX.

## Field conclusion

The current Wave 1 field contains several strong evidence-heavy products, including ZK-Sentinel, VINPassport, Candor, Umbra, BACCHIRI! and ClearScope.

Two collision risks are material:

1. compensation/private-income territory is already crowded;
2. generic selective-disclosure / compliance SaaS is already occupied.

ShieldRate therefore narrows its signature behavior to **private work qualification with bargaining privacy**.

## Signature behavior

`Employer policy request → holder consent → private composite proof → QUALIFIED receipt`

The verifier does not receive separate income/rating/jobs results.

## V4 structural changes

- new `verifyWorkPolicy` Compact circuit;
- three fixed `SR-WORK-*` composite standards;
- one `WorkQualificationReceipt` public object;
- no component-level outcome fields in that receipt;
- request expiry enforced with Compact block time;
- future-issued credentials rejected with Compact block time;
- scope-stable work-policy nullifier blocks re-probing the same policy by changing challenge;
- new live MidnightJS `verifyWorkPolicy` path;
- post-finalization `workReceiptExists` independent ledger check;
- local parity helpers + qualification proof generator;
- expanded tests for composite qualification and anti-probing semantics;
- updated README current-state truth boundary;
- Judge Review guide;
- machine-readable-style claim/evidence status ledger;
- real Lace transaction runbook;
- competitive intelligence record.

## Preserved invariants

- provider Schnorr signature remains mandatory;
- raw work values remain private;
- employer/job scoped subject remains canonical;
- provider epoch revocation remains canonical;
- failed predicates create no public negative receipt;
- demo/live distinction remains explicit;
- no production capability is promoted from preview without evidence.

## Open gates

1. Compact 0.31.1 compile for V4.
2. Node 20 typecheck/tests/build.
3. Node 22 typecheck/tests/build.
4. inspect dependency audit; existing vulnerabilities are not declared fixed.
5. Opeyemi canonical Lace run for `verifyWorkPolicy`.
6. capture tx id + block + contract + indexed work receipt.
7. promote claim ledger to `NETWORK_VERIFIED` only after gate 6.
8. UI/UX V4 redesign remains deliberately closed until the product/evidence gates above are stable.

## UI decision

Do not expand generic SaaS breadth further before the next visual pass. The next UI should dramatize the signature qualification sequence and make the privacy asymmetry immediately legible.
