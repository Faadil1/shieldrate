# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_SOURCE_VALIDATED_OPERATOR_GATE_PENDING`.

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
- refreshed Vite/Vitest toolchain with zero audit findings in the validated Node 22 gate.

## Validation completed

CI run `35006331486` is the source-validation reference for the completed hardening sequence:

- Compact 0.31.1 compile PASS;
- Node 20 typecheck PASS;
- Node 20 tests PASS — 25/25;
- Node 20 build PASS;
- Node 22 dependency audit PASS — 0 known vulnerabilities at moderate-or-higher threshold;
- Node 22 typecheck PASS;
- Node 22 tests PASS — 25/25;
- Node 22 build PASS.

Five of the 25 tests execute the generated Compact `Contract` directly. They cover millisecond-vs-second expiry, immutable employer/job policy, cancellation slot closure, and monotonic provider epochs.

The seconds→milliseconds defect is fixed end-to-end in:

- `src/midnight/runtime.ts`;
- `src/hooks/useContract.ts`;
- `scripts/issue-demo-credential.mjs`.

The one-shot repair workflow/trigger was removed after the fix was committed.

## Immediate continuation — external operator gate only

Opeyemi has two runbooks:

- `docs/OPEYEMI-LIVE-GATE.md` — concise operator path;
- `docs/REAL-TX-RUNBOOK.md` — full evidence procedure.

He must perform a real Lace/Preprod V4 run using a fresh job scope and `SR-WORK-02`, then return only public evidence:

1. network + contract address;
2. provider id + registration tx/block;
3. job scope + policy code 2;
4. work request id + tx/block + millisecond expiry;
5. indexed work request confirmation;
6. qualification verification id + tx/block;
7. independently indexed `workReceiptExists=true`.

Only after those values are independently checked may we create:

`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md`

and promote the exact canonical flow from `LIVE_PENDING` to `NETWORK_VERIFIED`.

## TRACE gate

Do not start the next TRACE UI/UX redesign before the operator evidence gate is closed. The agreed order is intentional:

`source lock → real request → real proof → indexed receipt → evidence lock → TRACE UI/UX`

This prevents presentation work from getting ahead of the trust claim.

## Competitive reminder

Reviewed public Wave 1 projects already cover private eligibility, compensation, compliance, claims and generic selective disclosure. In the Wave 1 repositories reviewed, Commit-Before-Know, failure privacy and verifier-policy audit without rejected-worker surveillance remain ShieldRate's differentiated territory.

## Future white space

Federated/multi-source work evidence is the strongest next protocol expansion after V4 live evidence is locked. Do not claim it as shipped in Wave 1 unless it is actually implemented, compiled, tested and demonstrated.

## Truth boundary

Never call V4 network-validated from source/CI alone. Never claim committed criteria are automatically lawful or fair. Never expose holder/issuer secrets in evidence.
