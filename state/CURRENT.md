# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_PROVIDER2_INDEXED_PRIVATE_QUALIFICATION_RETRY_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Deployment gate — CLOSED

Current Midnight Preprod contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy.

## Provider 1 — indexed / legacy credential unusable for this proof

Provider id `1`, epoch `0`, expected-key match are indexed. Its first credential failed pre-submission on the contract time guard because `issuedAtEpoch` was ahead of Midnight block time. The original provider-1 issuer secret was random and not persisted, so that credential cannot be honestly re-signed.

## Provider 2 recovery — INDEXED / CLOSED

A new provider/credential pair was created with a fixed local issuer secret and a backdated issuance timestamp for the same holder binding.

Provider 2 public key:

- x: `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y: `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Live registration result:

- provider id: `2`
- transaction id: `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block height: `2568791`
- indexed epoch: `0`

Provider 2 is now the canonical credential issuer for the next qualification attempt. Keep `SHIELDRATE_ISSUER_SECRET` local/private and never commit or paste it into evidence.

## Commit-Before-Know request — INDEXED / CLOSED

Canonical job scope: `sr-wave1-canonical-2026-09-15-01`

Policy: `SR-WORK-02` / code `2`

- workRequestId: `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- transaction id: `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block height: `2568670`

The request is finalized and indexed before holder proof. Exact `requestExpiresAtMs` still needs indexed recovery for the final evidence bundle.

## First qualification attempt — PRE-SUBMISSION / NO STATE CONSUMED

The provider-1 proof attempt failed during Compact execution with:

`failed assert: credential issuance is in the future`

No qualification transaction was submitted, and no nullifier/work receipt was written. Therefore the same work request may be retried safely with the corrected provider-2 credential while the request remains fresh in Midnight block time.

## Current open gate

`IMPORT_PROVIDER2_CREDENTIAL_THEN_RETRY_EXISTING_PRIVATE_QUALIFICATION`

Required sequence:

1. Keep the same browser origin/session and deployed contract.
2. Import the provider-2 `credentialPayload` generated from the fixed-secret/backdated issuance run into Card 04.
3. Confirm credential status is `Loaded`.
4. Keep Card 06 pointed at work request `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`.
5. Run registered private qualification once.
6. If the circuit returns `work request expired` before submission, create a new fresh job scope (e.g. `sr-wave1-canonical-2026-09-15-02`) with policy code `2`; do not reuse the immutable previous employer/job scope.
7. On success capture verification id + qualification tx id + block height.
8. Independently confirm `workReceiptExists=true` for that verification id.
9. Recover request expiry and missing provider-1 metadata only if available; never fabricate them.
10. Lock `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after all public evidence checks.

## Truth boundary

- Deployment READY is proven.
- Provider 2 registration/indexed epoch `0` is proven at block `2568791`.
- Commit-Before-Know request is finalized/indexed at block `2568670`.
- The first proof attempt failed pre-submission and consumed no replay/nullifier state.
- Full V4 `NETWORK_VERIFIED` remains pending successful private qualification + independently indexed work receipt.
- Never expose holder/admin/issuer secrets or raw credential data in Git evidence.

## TRACE gate

Do not reopen TRACE UI/UX until private proof → indexed receipt → evidence lock is complete.
