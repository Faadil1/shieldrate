# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_WASM_RUNTIME_DEDUP_PATCHED_OPERATOR_RETEST_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

ShieldRate fixes the employer's qualification policy before a holder proves anything, while failure/refusal leaves no holder-specific public negative record.

## Core V4 mechanisms

- employer-authenticated work requests via `ownPublicKey()`;
- one immutable standard per employer + job scope;
- cancellation without policy replacement;
- provider-signed private credential with Schnorr verification;
- composite qualification with one positive receipt;
- opportunity-scoped nullifier and scoped holder pseudonym;
- Unix-millisecond time boundary;
- monotonic provider epoch revocation;
- independent indexed request/receipt verification;
- V4 operator UI;
- lazy Midnight runtime;
- explicit bounded deploy stages and submitted-deployment recovery;
- hosted wallet prover preference with delegated fallback;
- browser `Buffer` bootstrap;
- single browser WASM/runtime resolution boundary.

## Validation immediately before this handover

Commit `175df7d6db8fa274bdee0c2a4fde00bc92702871` passed Compact compile, Node 20 verification, Node 22 audit/typecheck/tests/build, and GitHub Pages.

The second supervised browser test then advanced beyond the prior `Buffer is not defined` defect and exposed the next browser-only failure:

`Cannot read properties of undefined (reading 'contractstate_deserialize')`

Interpretation:

- wallet was connected;
- network was `preprod`;
- holder binding was generated;
- deploy was invoked;
- no `SUBMITTING` stage or tx id was observed;
- no duplicate-deployment risk was created by this run.

## Root cause now isolated

`package-lock.json` contains parallel runtime families:

- root `onchain-runtime-v3@3.1.1` vs protocol-pinned `3.0.0`;
- root `ledger-v8@8.1.2` vs protocol-pinned `8.1.0`.

Midnight's current Vite/WASM guidance identifies multiple runtime instances as a browser-only failure class because wasm-bindgen object identity is instance-scoped. CI and CLI paths can therefore pass while the browser fails.

## Repair applied

`vite.config.ts` is normalized to one runtime boundary:

- remove the legacy custom resolver/manual WASM chunk path;
- alias `@midnight-ntwrk/onchain-runtime-v3` to the `midnight-js-protocol@4.1.1` pinned `3.0.0` copy;
- alias `@midnight-ntwrk/ledger-v8` to the protocol-pinned `8.1.0` copy;
- dedupe `compact-runtime`, `onchain-runtime-v3`, and `ledger-v8`;
- keep Vite browser WASM handling and Compact runtime pre-bundling.

No contract semantics or public claim changes are part of this repair.

## Immediate continuation

1. Confirm CI and Pages pass for the WASM dedup/pinning commit.
2. Hard refresh `https://faadil1.github.io/shieldrate/`.
3. Reconnect 1AM on `preprod`.
4. Click `Deploy ShieldRate contract` exactly once.
5. Capture the last stage: `PREPARING`, `PROVING`, `BALANCING`, `SUBMITTING`, `INDEXING`, `JOINING`, or `READY`.
6. If `SUBMITTING` errors or times out, inspect wallet activity before any retry.
7. If `INDEXING` times out, recover the persisted deployment rather than redeploy.
8. If `READY`, continue provider registration → employer work request → private qualification → independent `workReceipts` re-read.

Only after those public values are independently checked may we create:

`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md`

and promote the exact canonical flow from `LIVE_PENDING` to `NETWORK_VERIFIED`.

## TRACE gate

Do not start the next TRACE UI/UX redesign before the operator evidence gate is closed.

Required order:

`browser runtime repair → deploy retest → real request → real proof → indexed receipt → evidence lock → TRACE UI/UX`

## Truth boundary

Never call V4 network-validated from source/CI alone. Never claim committed criteria are automatically lawful or fair. Never expose holder/issuer secrets in evidence.
