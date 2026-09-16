# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_TIME_UNIT_FIX_REQUIRED_PROVIDER2_INDEXED`.

## Live contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy.

## Provider 2 is already correct on-chain

Provider id `2`:
- public key X `281801475387186942268458825925983557163075984222258714615776155627247983780`
- public key Y `44328514486860549557980204826385043161844197115525209758451524636130274127834`
- registration tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

The fixed `SHIELDRATE_ISSUER_SECRET` used for provider 2 should still be kept only in the operator's local PowerShell environment. Do not create provider 3; reissue under provider 2 after fixing time units.

## Confirmed root cause

Two qualification attempts failed before submission with `credential issuance is in the future`, including a credential backdated by 24 hours.

Compact block-time predicates compare against Unix **seconds**. ShieldRate currently feeds Unix **milliseconds** from JavaScript into:
- credential `issuedAtEpoch` / `expiresAtEpoch` generation;
- registered work-request `requestExpiresAtEpoch`;
- generic proof request expiry.

That is the real bug. The contract itself does not need redeployment; its `Uint<64>` fields and `blockTime*` predicates can operate with seconds once callers use the correct unit.

## Existing request is diagnostic only

`sr-wave1-canonical-2026-09-15-01` / policy 2:
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

It is genuinely finalized/indexed, but its expiry was encoded in milliseconds. Preserve it as diagnostic evidence of the discovered bug; do not use it for the final NETWORK_VERIFIED proof.

Both failed qualification attempts were pre-submission, so no nullifier/work receipt was consumed.

## Exact recovery

1. Patch `scripts/issue-demo-credential.mjs`:
   - `now = floor(Date.now()/1000)`;
   - 30-day expiry adds seconds, not milliseconds.
2. Patch `src/midnight/runtime.ts` conversions for `requestExpiresAtEpoch` to `floor(Date.getTime()/1000)` in both registered work requests and generic proof requests.
3. Run CI/build and publish Pages.
4. With the same fixed provider-2 secret, clear old timestamp env overrides and regenerate provider-2 credential. The public key must remain identical to the already-indexed provider 2 key.
5. Import that corrected credential.
6. Create fresh scope `sr-wave1-canonical-2026-09-15-02` with policy code `2`; capture id/tx/block/second-based expiry.
7. Run private qualification exactly once.
8. Capture verification id/tx/block and independently verify `workReceiptExists=true`.
9. Lock final evidence only after all public checks pass.

## Truth boundary

Deployment and provider 2 are proven live. Request `...-01` is indexed but time-unit-invalid for final evidence. No successful qualification receipt exists yet. Do not claim `NETWORK_VERIFIED` until a clean seconds-based run succeeds.

## TRACE gate

Do not reopen TRACE UI/UX until the seconds fix and clean network evidence are complete.
