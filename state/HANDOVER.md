# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on branch `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / BUILD_COMPOSED_CI_PENDING`.
Upstream PR #1 and PR #2 are already merged into `opeblow/shieldrate:main`.

## Product thesis

ShieldRate is now centered on **private workforce / contractor qualification with bargaining privacy**, not generic selective disclosure and not salary verification alone.

Canonical promise:

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`Employer policy request → holder consent → private composite proof → QUALIFIED receipt`

## New V4 primitive

`verifyWorkPolicy(...)` proves a fixed composite policy across private issuer-attested income, rating and completed-job facts.

Properties:

- one public policy code;
- no separate public component outcomes;
- failure creates no public receipt;
- employer/job scoped subject;
- request hash binds employer/job/policy/challenge/expiry;
- scope-stable policy nullifier blocks same-scope re-probing with a fresh challenge;
- request expiry is enforced against block time;
- credential issuance cannot be in the future;
- credential validity must cover the request window;
- provider signature and provider epoch remain mandatory.

## Immediate continuation

1. Run/inspect branch CI.
2. If Compact fails, fix the contract rather than weakening V4 semantics.
3. If Node jobs fail, preserve API/types/test invariants while fixing generated-binding mismatches.
4. After CI is green, update `state/WINNING-INTELLIGENCE-V4.md` and `state/CURRENT.md` to source-validated.
5. Do NOT redesign the UI yet.
6. Give Opeyemi `docs/REAL-TX-RUNBOOK.md` for the canonical Lace run.
7. Capture public tx/block/contract/verificationId evidence only after a real successful run.
8. Promote `docs/CLAIMS.md` from `LIVE_PENDING` to `NETWORK_VERIFIED` only after independent receipt lookup succeeds.
9. Then perform the next TRACE UI/UX pass around the single signature behavior, not generic SaaS breadth.

## Competitive field reminders

Strong current Wave 1 references include ZK-Sentinel, VINPassport, Candor, Umbra, BACCHIRI! and ClearScope. The competitive implications and collision decisions are recorded in `docs/COMPETITIVE-INTELLIGENCE-WAVE1.md`.

## Truth boundary

Never claim V4 is Preprod/network-validated from CI, source compilation, a transaction function, or screenshots alone. The final live gate is still a real Lace transaction plus independently indexed `workReceipts` lookup.
