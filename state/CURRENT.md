# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `BUILD_COMPOSED_CI_PENDING`

## Upstream state

- `opeblow/shieldrate#1` — Proof Integrity v1 — merged.
- `opeblow/shieldrate#2` — Midnight Live integration + Enterprise SaaS V3 — merged.

The upstream product now contains the real Midnight adapter and the approved Enterprise SaaS V3 visual direction. The final canonical Lace transaction / independently indexed receipt remains the open live-evidence gate.

## Winning Intelligence V4 decision

The current Wave 1 field is strong enough that ShieldRate should not compete as a generic selective-disclosure SaaS or a salary-threshold demo.

Canonical product wedge:

**Private work qualification with bargaining privacy.**

Signature behavior:

`Employer policy request → holder consent → private composite proof → QUALIFIED receipt`

## V4 implementation composed

- `verifyWorkPolicy` Compact circuit;
- fixed `SR-WORK-01/02/03` composite standards;
- one public `WorkQualificationReceipt` with no component verdicts;
- on-chain request-expiry enforcement;
- on-chain future-issuance rejection;
- scope-stable work-policy nullifier to stop same-scope challenge replay/probing;
- live MidnightJS work-policy method + independent indexed work-receipt lookup;
- local parity helpers and demo qualification generator;
- expanded privacy/anti-probing tests;
- current README rewrite;
- Judge Review Guide, Claim Ledger, Work Qualification spec, competitive intelligence and Real TX runbook.

## Preserved invariants

- provider Schnorr attestation;
- fixed standards rather than arbitrary thresholds;
- employer/job scoped subject;
- provider-epoch revocation;
- pass-only publication;
- demo/live evidence separation;
- no secret material in public receipts/evidence.

## Current gate

Run V4 CI:

1. Compact 0.31.1 compile.
2. Node 20 typecheck/tests/build.
3. Node 22 typecheck/tests/build.
4. Fix any compiler/runtime defects before claiming V4 source-ready.
5. Keep dependency-audit risk explicit.
6. After source gate, Opeyemi runs the canonical Lace `verifyWorkPolicy` scenario from `docs/REAL-TX-RUNBOOK.md`.
7. Only a real tx + independently indexed receipt promotes the V4 live claim to `NETWORK_VERIFIED`.

UI/UX V4 is intentionally not started yet.
