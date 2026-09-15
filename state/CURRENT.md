# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `SOURCE_VALIDATED_NETWORK_EVIDENCE_PENDING`

## Upstream baseline

- `opeblow/shieldrate#1` — Proof Integrity v1 — merged.
- `opeblow/shieldrate#2` — Midnight Live integration + Enterprise SaaS V3 — merged.

## Product state

Winning Intelligence V4 repositions ShieldRate around **private work qualification with bargaining privacy** and adds a verifier-accountability primitive: **Commit-Before-Know**.

Canonical promise:

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Source-validated V4

- employer-authenticated `registerWorkRequest` via `ownPublicKey()`;
- one immutable policy per employer + job scope;
- cancellation without policy replacement;
- `verifyRegisteredWorkPolicy` reads registered criteria from ledger state;
- composite private policy across income/rating/completed jobs;
- no component-level public outcomes;
- no public negative receipt on failure/refusal;
- opportunity-scoped nullifier;
- employer/job-scoped holder pseudonym;
- Schnorr issuer attestation;
- block-time request expiry;
- future issuance rejection;
- monotonic provider epoch across removal/re-registration;
- independent indexed work-request and work-receipt confirmation;
- operator UI for register → prove path;
- lazy Midnight runtime loading;
- dependency refresh to Vite 8.3.0 / Vitest 5.0.1;
- remediation workflow: Compact PASS, npm audit 0, typecheck PASS, 20 tests PASS, build PASS.

## Performance state

The V4 lazy-runtime build reduced judge-facing entry JS from roughly 1.08 MB to ~245 KB minified. Midnight runtime/WASM remains available through the live path rather than dominating initial app execution.

## Current open gate

`NETWORK_EVIDENCE_PENDING`

Opeyemi must run `docs/REAL-TX-RUNBOOK.md` and capture:

- V4 contract/network;
- provider registration;
- employer work-request id + tx/block;
- indexed request confirmation;
- holder qualification verification id + tx/block;
- independently indexed work receipt.

Do not call V4 Preprod/network validated before this evidence exists.

## Known honest limits

- authenticated job scope is not universal proof of unique real-world ATS requisition identity;
- one provider currently signs the composite credential;
- Commit-Before-Know proves immutable criteria, not legal fairness/non-discrimination;
- broad Enterprise V3 RBAC/billing/webhook surfaces remain architecture/UX previews unless backed by production services.

## Next gate after network evidence

TRACE UI/UX V4 centered on the signature protocol, not generic SaaS breadth.
