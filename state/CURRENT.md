# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_BROWSER_RUNTIME_GATE_PATCHED_OPERATOR_RETEST_PENDING`

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
- Compact time boundary normalized to Unix milliseconds;
- browser request expiry and issuer credential timestamps remain in milliseconds end-to-end;
- future issuance rejection;
- monotonic provider epoch across removal/re-registration;
- independent indexed work-request and work-receipt confirmation;
- operator UI for register → prove path;
- lazy Midnight runtime loading;
- bounded deploy stages with single-submit recovery semantics;
- hosted wallet prover preferred with delegated prover fallback;
- browser `Buffer` compatibility boundary installed before lazy Midnight runtime import;
- Vite 8.3.0 / Vitest 5.0.1 dependency remediation with current Node 22 audit gate at zero known vulnerabilities.

## Compiled-circuit validation

`tests/compact-contract.test.ts` executes the generated Compact `Contract` rather than a TypeScript-only policy replica.

It currently validates directly against compiled circuit assertions:

- future Unix-millisecond request expiry is accepted;
- accidental seconds-at-boundary expiry is rejected;
- a second policy under the same employer/job scope is rejected;
- cancellation does not reopen the policy slot;
- provider epochs stay monotonic across remove → re-register → rotate.

CI run `35006331486` remains the last fully locked source-validation reference before the browser runtime patch:

- Compact 0.31.1 compile;
- Node 20 typecheck + 25 tests + build;
- Node 22 `npm audit --audit-level=moderate` + typecheck + 25 tests + build;
- audit result: 0 known vulnerabilities at the configured threshold.

Node 20 is retained as a compatibility signal; Vitest 5 officially targets newer Node releases, so Node 22 is the authoritative supported verification gate.

## Performance state

The lazy-runtime build keeps judge-facing entry JS around ~241–245 KB minified instead of the earlier roughly 1.08 MB eager bundle. Midnight runtime/WASM remains available through the live path rather than dominating initial app execution.

## Latest operator finding — browser runtime gate

A supervised 1AM / Midnight Preprod browser run on 2026-09-15 reached:

- wallet connected;
- network = `preprod`;
- holder binding generated;
- contract still `NOT JOINED`.

On `Deploy ShieldRate contract`, the browser returned:

`Buffer is not defined`

The failure occurred before a deploy stage/transaction submission was reached. No Preprod contract address or transaction id was produced, so this run does **not** create duplicate-deployment risk.

Root cause: MidnightJS 4.x utilities still reference the Node `Buffer` global (for example their hex helper uses `Buffer.from(...)`), while Vite 8 browser builds do not install Node globals automatically.

Applied repair:

- `src/main.tsx` imports `Buffer` from the already-declared `buffer` package;
- installs it on `globalThis` before any lazy Midnight runtime module executes;
- no network/protocol claim is promoted by this repair alone.

## Current open gate

`BROWSER_POLYFILL_RETEST_THEN_OPERATOR_NETWORK_EVIDENCE_PENDING`

Required next sequence:

1. CI + GitHub Pages must validate the browser compatibility patch.
2. Hard refresh the published Pages build.
3. Reconnect 1AM on `preprod`.
4. Click deploy once and capture the last explicit deploy stage.
5. If deploy reaches `READY`, continue provider registration → work request → private qualification → indexed `workReceipts` confirmation.
6. Lock the resulting public evidence bundle before promoting any `NETWORK_VERIFIED` claim.

Do not call V4 Preprod/network validated before that evidence exists.

## Known honest limits

- authenticated job scope is not universal proof of unique real-world ATS requisition identity;
- one provider currently signs the composite credential;
- Commit-Before-Know proves immutable criteria, not legal fairness/non-discrimination;
- broad Enterprise V3 RBAC/billing/webhook surfaces remain architecture/UX previews unless backed by production services;
- current clean dependency audit does not guarantee future dependency states remain clean.

## Next gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`browser runtime repair → operator deploy retest → real request → real proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`

Until the network evidence file exists, TRACE UI/UX V4 remains intentionally gated.
