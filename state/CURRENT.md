# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_PROVIDER_INDEXED_COMMIT_BEFORE_KNOW_REQUEST_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Winning Intelligence V4 adds Commit-Before-Know: the employer fixes the qualification policy before holder proof, while failure/refusal leaves no holder-specific public negative receipt.

## Deployment gate — CLOSED

Current supervised Midnight Preprod contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy this contract for the current evidence run.

## Provider registration gate — INDEXED / CLOSED

Provider id `1` initially had one rejected submission with:

`1010: Invalid Transaction · Custom error: 182`

The app was hardened with read-before-write and read-after-error provider reconciliation. A read-only check then confirmed provider absence, allowing one fresh registration attempt.

After the fresh attempt, a supervised browser video shows the authoritative indexed-state result:

`INDEXED · Provider 1 exists · epoch 0 · expected key matches.`

This closes the provider-state gate functionally:

- provider id `1` exists in the indexed ShieldRate ledger state;
- provider epoch is `0`;
- the indexed public key matches the already-issued credential pair;
- no further provider registration must be submitted for this evidence run.

The video does **not** expose the successful provider-registration transaction id or block height. Those public metadata remain missing and must not be invented. Recover them later from 1AM/indexer/explorer if available, but they do not block continuing the functional V4 flow.

## Existing provider/credential pair — keep unchanged

Provider id: `1`

Provider public key X:

`42848969277721310029114432532667054135720119005484359189255060317143764534159`

Provider public key Y:

`37973363005075625546044948588170817933783603251788102975603190164298483319067`

The existing signed credential is paired with this exact key and the current holder binding. Do not rerun `npm run issue:demo` unless intentionally abandoning this pair.

Credential policy compatibility for `SR-WORK-02` is source-local only until the live proof succeeds: income `68000`, rating `487`, completed jobs `120`, provider epoch `0`.

## Current open gate

`COMMIT_BEFORE_KNOW_REQUEST_THEN_PRIVATE_QUALIFICATION`

Required sequence:

1. Keep the same browser origin/session and current contract.
2. Import the existing signed `credentialPayload` into Card 04; this is session-private state and must not go into Git evidence.
3. In Card 05 use a fresh job scope, canonical run value `sr-wave1-canonical-2026-09-15-01`, with policy code `2` / `SR-WORK-02`.
4. Click **Commit policy before proof** once and approve the wallet flow once.
5. Capture work request id + transaction id + block height + request expiry in Unix milliseconds.
6. Confirm the work request from indexed state before proof.
7. Run Card 06 private qualification exactly once against that registered request.
8. Capture verification id + transaction id + block height.
9. Independently re-read `workReceiptExists=true` for that verification id.
10. Recover provider registration tx/block if available and add them to the final evidence bundle; otherwise document them as unavailable rather than inventing values.
11. Only after all public evidence checks, create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` and promote the exact live flow to `NETWORK_VERIFIED`.

## Truth boundary

- Deployment READY is proven.
- Provider id `1`, epoch `0`, and expected public-key match are independently confirmed from indexed contract state.
- Provider registration tx/block metadata are not yet captured.
- Full V4 `NETWORK_VERIFIED` is still pending real committed request + successful private proof + independently indexed qualification receipt.
- Never expose holder/admin/issuer secrets or the raw private credential in Git evidence.
- Never claim committed criteria are automatically lawful or fair.

## TRACE gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`deployment READY → provider INDEXED → committed request → private proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`
