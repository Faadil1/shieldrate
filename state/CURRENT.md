# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_DEPLOYMENT_READY_PROVIDER_GATE_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Winning Intelligence V4 adds Commit-Before-Know: the employer fixes the qualification policy before holder proof, while failure/refusal leaves no holder-specific public negative receipt.

## Locked source/runtime state

- employer-authenticated work requests via `ownPublicKey()`;
- immutable policy per employer + job scope;
- composite private qualification across income/rating/completed jobs;
- opportunity-scoped nullifier and scoped holder pseudonym;
- Schnorr issuer attestation;
- Unix-millisecond time boundary;
- monotonic provider epoch revocation;
- independent indexed request/receipt verification path;
- bounded deploy stages and submitted-deployment recovery;
- hosted wallet prover preference with delegated fallback;
- browser `Buffer` bootstrap;
- Vite browser runtime deduped across `compact-runtime`, `onchain-runtime-v3`, and `ledger-v8`;
- protocol-compatible browser aliases for `onchain-runtime-v3@3.0.0` and `ledger-v8@8.1.0`.

Commit `de6b1baa60538a72d6e96908b286e1abf21963d5` passed Compact compile, Node 20 verification, Node 22 audit/typecheck/tests/build, Vite web build, proving-asset publication, and GitHub Pages deployment.

## Latest supervised operator result — deployment gate CLOSED

A third supervised 1AM / Midnight Preprod browser run on 2026-09-15 successfully crossed the prior browser-runtime failures.

Observed sequence:

1. Midnight wallet connected on `preprod`.
2. ShieldRate deploy started.
3. 1AM displayed **Balance & Sign Transaction** for `https://faadil1.github.io` and the transaction was approved.
4. 1AM then displayed a distinct **Submit Transaction** confirmation with the action text `Submit a finalized transaction to the network`; it was approved.
5. ShieldRate returned from the wallet flow, completed indexing/join recovery, and populated `CURRENT CONTRACT`.

Observed contract address:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Because `deployMidnightContract()` only returns the address after its bounded indexer wait and join path complete, the final populated contract state is sufficient to close the **browser deployment gate** for this supervised run.

Truth boundary:

- this does **not** yet promote the whole V4 flow to `NETWORK_VERIFIED`;
- the video did not expose the deployment transaction id/block number, so those values still need to be captured if required for the final public evidence bundle;
- search-engine lookup of the contract address is not treated as an independent Midnight indexer check.

## Current open gate

`PROVIDER_REGISTRATION_THEN_COMMIT_BEFORE_KNOW_EVIDENCE_PENDING`

Required next sequence:

1. Keep the same browser session/tab open so the current private/admin state remains available.
2. Register the issuer/provider on the deployed contract.
3. Capture provider id + registration transaction/block evidence.
4. Create one fresh employer work request using a fresh job scope and policy code `2`.
5. Capture work request id + transaction/block + Unix-millisecond expiry.
6. Confirm the work request through the indexed read path.
7. Load/import the signed private credential.
8. Execute private qualification.
9. Capture qualification verification id + transaction/block.
10. Independently re-read `workReceiptExists=true`.
11. Create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after those public values are checked.

Do not call the full V4 flow network-validated before provider registration, real request, real proof, and indexed receipt evidence exist.

## Known honest limits

- authenticated job scope is not universal proof of unique real-world ATS requisition identity;
- one provider currently signs the composite credential;
- Commit-Before-Know proves immutable criteria, not legal fairness/non-discrimination;
- broad Enterprise V3 RBAC/billing/webhook surfaces remain architecture/UX previews unless backed by production services.

## TRACE gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`deployment READY → provider registration → real request → real private proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`
