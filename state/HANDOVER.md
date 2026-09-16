# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_BROWSER_RUNTIME_GATE_PATCHED_OPERATOR_RETEST_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

ShieldRate is deliberately differentiated from generic selective disclosure and salary proof. The employer must commit the standard before holder proof, while failure/refusal leaves no holder-specific public negative record.

## Core V4 mechanisms

- `registerWorkRequest` authenticates employer with `ownPublicKey()`;
- one immutable standard per employer + job scope;
- cancellation closes the request but does not free the job key;
- `verifyRegisteredWorkPolicy` consumes the registered request;
- opportunity-scoped holder nullifier;
- provider-signed private credential with Schnorr verification;
- composite policy with one positive receipt;
- Unix-millisecond Compact time boundary;
- block-time expiry / future-issued credential rejection;
- monotonic provider epoch revocation;
- indexed request/receipt verification after tx finalization;
- V4 operator UI;
- lazy-loaded Midnight runtime;
- controlled deploy stages with bounded indexer waiting and submitted-deployment recovery;
- wallet hosted prover preference with delegated prover fallback;
- browser Buffer compatibility bootstrap before Midnight runtime execution;
- refreshed Vite/Vitest toolchain with zero audit findings in the validated Node 22 gate.

## Previously locked source validation

CI run `35006331486` is the last fully locked source-validation reference before the browser compatibility patch:

- Compact 0.31.1 compile PASS;
- Node 20 typecheck PASS;
- Node 20 tests PASS — 25/25;
- Node 20 build PASS;
- Node 22 dependency audit PASS — 0 known vulnerabilities at moderate-or-higher threshold;
- Node 22 typecheck PASS;
- Node 22 tests PASS — 25/25;
- Node 22 build PASS.

Five of the 25 tests execute the generated Compact `Contract` directly. They cover millisecond-vs-second expiry, immutable employer/job policy, cancellation slot closure, and monotonic provider epochs.

## Latest supervised operator result — 2026-09-15

The 1AM / Midnight Preprod browser test reached wallet connected + `preprod` + holder binding, but deploy failed with:

`Buffer is not defined`

Important interpretation:

- the failure happened before a deploy transaction was submitted;
- no contract address or tx id was produced;
- duplicate deployment protection was therefore not exercised yet;
- it is safe to retest after the browser patch is published.

Root cause is a browser/Node boundary: MidnightJS 4.x still contains runtime helpers using `Buffer.from(...)`, while Vite 8 does not inject Node globals.

Repair now applied in `src/main.tsx`:

- import `Buffer` from the existing `buffer` dependency;
- install `globalThis.Buffer` before React and before any lazy Midnight runtime import can execute.

Do not treat this repair as network evidence by itself.

## Immediate continuation

1. Confirm CI and GitHub Pages pass for the Buffer bootstrap commit.
2. Hard refresh `https://faadil1.github.io/shieldrate/`.
3. Reconnect 1AM on `preprod`.
4. Click `Deploy ShieldRate contract` exactly once.
5. Record the last explicit stage shown: `PREPARING`, `PROVING`, `BALANCING`, `SUBMITTING`, `INDEXING`, `JOINING`, or `READY`.
6. If `SUBMITTING` errors or times out, do not blindly click again; inspect wallet activity first.
7. If `INDEXING` times out, the submitted deployment is persisted and recovery should be used rather than redeploying.
8. If `READY`, continue the canonical gate: provider registration → employer work request → private qualification → independent indexed `workReceipts` confirmation.

Only after those public values are independently checked may we create:

`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md`

and promote the exact canonical flow from `LIVE_PENDING` to `NETWORK_VERIFIED`.

## TRACE gate

Do not start the next TRACE UI/UX redesign before the operator evidence gate is closed.

Required order:

`browser runtime repair → deploy retest → real request → real proof → indexed receipt → evidence lock → TRACE UI/UX`

## Truth boundary

Never call V4 network-validated from source/CI alone. Never claim committed criteria are automatically lawful or fair. Never expose holder/issuer secrets in evidence.
