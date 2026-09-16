# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_COMMIT_INDEXED_PRIVATE_QUALIFICATION_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Live Preprod contract — do not redeploy

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Keep using the same browser origin/session whenever possible because holder/admin private state is session-scoped.

## Provider gate — CLOSED

Read-only indexed state confirms provider id `1`, epoch `0`, and exact expected-key match. No further provider-registration transaction is allowed. Successful provider-registration tx/block metadata are still missing; recover later if possible, never invent.

## Commit-Before-Know request — CLOSED / INDEXED

Fresh canonical job scope:

`sr-wave1-canonical-2026-09-15-01`

Policy:

`SR-WORK-02` / code `2`

Finalized/indexed work request:

- workRequestId: `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx id: `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block: `2568670`

The UI only emits this message after `registerWorkRequest()` finalizes and `workRequestExists(workRequestId)` succeeds against indexed ledger state. Therefore the committed standard is now proven to exist before holder proof.

Still missing from this request evidence: exact `requestExpiresAtMs`. Retrieve it from indexed work-request state before evidence lock rather than deriving it from approximate local time.

## Existing credential continuity

Do not regenerate issuance. Use the same existing signed credential payload bound to provider id `1`, epoch `0`, and the current holder binding. If the browser credential status is not `Loaded`, re-import the same payload in Card 04.

## Immediate continuation

1. Confirm Card 06 contains exactly:
   `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
2. Confirm credential status is `Loaded`.
3. Click **Run registered private qualification** exactly once.
4. Approve the 1AM wallet flow once if prompted.
5. Capture the full success result: `verification id`, `tx id`, `block height`.
6. If an error happens after Submit Transaction, do not click the proof button again until indexed receipt state is checked.
7. Independently verify `workReceiptExists=true` for the exact verification id.
8. Recover request expiry + provider registration tx/block if possible.
9. Lock `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after the public evidence bundle is complete.

## Truth boundary

- Deployment READY is proven.
- Provider state is indexed.
- Commit-Before-Know request is finalized and indexed at block `2568670`.
- Full V4 `NETWORK_VERIFIED` is still pending private qualification + independent indexed work receipt.
- Never expose holder/admin/issuer secrets or raw credential data in Git evidence.

## TRACE gate

Do not reopen TRACE UI/UX until private proof → indexed receipt → evidence lock is complete.
