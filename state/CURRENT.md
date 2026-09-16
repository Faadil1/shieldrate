# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_WASM_RUNTIME_DEDUP_PATCHED_OPERATOR_RETEST_PENDING`

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
- browser runtime resolution now pinned to one protocol-compatible WASM/ledger instance;
- Vite 8.3.0 / Vitest 5.0.1 dependency remediation with Node 22 as authoritative CI gate.

## Compiled-circuit validation

`tests/compact-contract.test.ts` executes the generated Compact `Contract` rather than a TypeScript-only policy replica.

It validates directly against compiled circuit assertions:

- future Unix-millisecond request expiry is accepted;
- accidental seconds-at-boundary expiry is rejected;
- a second policy under the same employer/job scope is rejected;
- cancellation does not reopen the policy slot;
- provider epochs stay monotonic across remove → re-register → rotate.

Browser compatibility commit `175df7d6db8fa274bdee0c2a4fde00bc92702871` passed:

- Compact 0.31.1 compile;
- Node 20 typecheck + 25 tests + build;
- Node 22 dependency audit + typecheck + 25 tests + build;
- GitHub Pages deploy.

## Latest operator finding — WASM runtime identity gate

A second supervised 1AM / Midnight Preprod browser run on 2026-09-15 confirmed the `Buffer` repair worked: wallet connection, network `preprod`, holder binding and the Runtime surface all loaded.

On `Deploy ShieldRate contract`, the browser then returned:

`Cannot read properties of undefined (reading 'contractstate_deserialize')`

No `SUBMITTING` stage or transaction id was reached, so this run did not submit a Preprod deployment and does not create duplicate-deployment risk.

### Root cause isolated

The lockfile currently contains two browser-relevant runtime versions:

- root `@midnight-ntwrk/onchain-runtime-v3@3.1.1`;
- `@midnight-ntwrk/midnight-js-protocol@4.1.1` nested `@midnight-ntwrk/onchain-runtime-v3@3.0.0`.

It also contains:

- root `@midnight-ntwrk/ledger-v8@8.1.2`;
- protocol-pinned nested `@midnight-ntwrk/ledger-v8@8.1.0`.

Midnight's current Vite/WASM guidance documents browser-only failures caused by multiple instances of `compact-runtime`, `onchain-runtime-v3`, and `ledger-v8`, and recommends a single deduped runtime boundary.

### Applied repair

`vite.config.ts` now:

- removes the legacy custom WASM resolver/manual chunk path that could bypass canonical package resolution;
- aliases `onchain-runtime-v3` to the protocol-pinned `3.0.0` copy;
- aliases `ledger-v8` to the protocol-pinned `8.1.0` copy;
- adds `resolve.dedupe` for `compact-runtime`, `onchain-runtime-v3`, and `ledger-v8`;
- keeps the existing browser WASM handling and Compact runtime pre-bundling.

This is a browser bundling/runtime repair only. It does not promote any network claim.

## Current open gate

`WASM_RUNTIME_RETEST_THEN_OPERATOR_NETWORK_EVIDENCE_PENDING`

Required next sequence:

1. CI + GitHub Pages validate the single-runtime Vite patch.
2. Hard refresh the published Pages build.
3. Reconnect 1AM on `preprod`.
4. Click deploy once and capture the last explicit deploy stage.
5. If deploy reaches `READY`, continue provider registration → work request → private qualification → independently indexed `workReceipts`.
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

`browser runtime repair → deploy retest → real request → real proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`

Until the network evidence file exists, TRACE UI/UX V4 remains intentionally gated.
