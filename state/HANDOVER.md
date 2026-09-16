# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_PROVIDER2_INDEXED_PRIVATE_QUALIFICATION_RETRY_PENDING`.

## Live contract — do not redeploy

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Keep the same browser origin/session whenever possible because holder/admin private state is session-scoped.

## Provider 1 history

Provider 1 is indexed at epoch `0`, but its original credential failed pre-submission because `credential.issuedAtEpoch` was ahead of Midnight block time. The original random issuer secret was not persisted, so do not attempt to re-sign or fabricate a provider-1 credential.

## Provider 2 recovery — indexed

Provider id `2` was created with a fixed local issuer secret and a backdated issuance timestamp for the same holder binding.

Public key:

- x `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration evidence:

- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Keep `SHIELDRATE_ISSUER_SECRET` private/local. Never add it to Git, chat evidence, screenshots, or the final proof bundle.

## Commit-Before-Know request — indexed

Job scope: `sr-wave1-canonical-2026-09-15-01`

Policy: `SR-WORK-02` / code `2`

- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

The request was finalized and indexed before holder proof. Exact `requestExpiresAtMs` remains to be recovered from indexed state for final evidence.

## First proof attempt consumed no state

Provider-1 credential failed during Compact execution with `credential issuance is in the future`. No qualification tx was submitted and no nullifier/work receipt was written. Retrying the same request with provider 2 is therefore safe while Midnight block time still considers the request fresh.

## Immediate continuation

1. Import the provider-2 `credentialPayload` from the fixed-secret/backdated credential generation run into Card 04.
2. Confirm Credential shows `Loaded`.
3. Keep Card 06 set to `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`.
4. Click **Run registered private qualification** exactly once.
5. If `work request expired` is returned before submission, create a new fresh job scope such as `sr-wave1-canonical-2026-09-15-02` with policy code `2`; the previous employer/job scope is immutable and must not be reused.
6. On success capture full `QUALIFIED · verification ... · tx ... · block ...` output.
7. Independently confirm `workReceiptExists=true` for the exact verification id.
8. Recover request expiry and provider-1 tx/block only if available; never invent missing metadata.
9. Create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after the public evidence bundle is complete.

## Truth boundary

- Deployment READY is proven.
- Provider 2 is indexed at epoch `0` with tx/block evidence.
- Commit-Before-Know request is finalized/indexed at block `2568670`.
- First proof attempt was pre-submission and consumed no replay/nullifier state.
- Full V4 `NETWORK_VERIFIED` still requires successful private proof + independently indexed work receipt.
- Never expose holder/admin/issuer secrets or raw credential data in Git evidence.

## TRACE gate

Do not reopen TRACE UI/UX until private proof → indexed receipt → evidence lock is complete.
