# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_DEPLOYMENT_READY_PROVIDER_GATE_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

ShieldRate fixes the employer qualification standard before the holder proves anything. Failure/refusal leaves no holder-specific public negative record.

## What is now proven in the supervised browser run

The third 1AM / Midnight Preprod test on 2026-09-15 succeeded through deployment after the Buffer and WASM-runtime fixes.

Observed wallet/runtime path:

- wallet connected on `preprod`;
- 1AM **Balance & Sign Transaction** prompt approved;
- 1AM separate **Submit Transaction** prompt approved;
- submit prompt explicitly said `Submit a finalized transaction to the network`;
- ShieldRate returned from the wallet flow and populated the current deployed contract.

Contract address:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Interpretation:

- deployment has crossed `BALANCING` and `SUBMITTING`;
- the app's deploy function only returns the address after its bounded indexer confirmation + join sequence, so the supervised run reached the effective `READY` state;
- no redeploy should be attempted for this session/contract;
- this closes the browser deployment gate only, not the complete V4 network-evidence gate.

## Runtime repair that enabled this

Commit `de6b1baa60538a72d6e96908b286e1abf21963d5`:

- removed the legacy custom WASM resolver/manual chunk path;
- deduped `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/onchain-runtime-v3`, and `@midnight-ntwrk/ledger-v8`;
- pinned browser resolution to protocol-compatible `onchain-runtime-v3@3.0.0` and `ledger-v8@8.1.0`;
- passed Compact compile, Node 20 verification, Node 22 audit/typecheck/tests/build, Vite build and GitHub Pages deploy.

## Immediate continuation — do not deploy again

Keep the same browser tab/session open if possible because current holder/admin private state is session-scoped.

Continue on the already deployed contract:

1. **Issuer/provider registration**
   - enter provider id (canonical run uses `1` unless already occupied);
   - use the expected provider public key/registration values;
   - approve the wallet transaction;
   - capture provider id + tx/block/public confirmation.
2. **Employer Commit-Before-Know request**
   - use a fresh job scope;
   - policy code `2`;
   - capture work request id + tx/block + millisecond expiry;
   - confirm via indexed work-request read.
3. **Credential import**
   - load the signed private provider payload; never expose issuer private key or holder secret.
4. **Private qualification**
   - execute the registered policy proof;
   - capture verification id + tx/block.
5. **Independent receipt read**
   - verify `workReceiptExists=true` from the indexed state.
6. **Evidence lock**
   - create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only when all public values are independently checked.

## Evidence still missing from the deployment itself

The video proves that a finalized transaction was submitted and that ShieldRate reached the joined contract state, but it does not expose the deployment transaction id/block number. Capture those later if available from 1AM/indexer/explorer and add them to the evidence bundle; do not invent them.

## TRACE gate

Do not start the next TRACE UI/UX redesign before the live evidence bundle is locked.

Required order:

`deployment READY → provider registration → real request → private proof → indexed receipt → evidence lock → TRACE UI/UX`

## Truth boundary

Never call the full V4 flow network-validated from deployment alone. Never expose holder/issuer secrets. Never claim committed criteria are automatically lawful or fair.
