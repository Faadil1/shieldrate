# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_TIME_UNIT_FIX_REQUIRED_PROVIDER2_INDEXED`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Live contract — CLOSED / DO NOT REDEPLOY

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

## Provider 2 — INDEXED / CLOSED

Provider id `2` is the canonical issuer for the corrected run.

Public key:
- x `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration:
- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Keep the fixed local `SHIELDRATE_ISSUER_SECRET` private. Provider 2 does not need to be re-registered; the same secret can re-sign a corrected credential under the already-indexed public key.

## Root cause now confirmed — milliseconds vs seconds

The second provider-2 qualification attempt also failed pre-submission with:

`failed assert: credential issuance is in the future`

This disproved the earlier simple clock-skew hypothesis. Compact block-time predicates use Unix **seconds**. ShieldRate was sending JavaScript `Date.now()` / `Date.getTime()` values in Unix **milliseconds** for credential issuance/expiry and work-request expiry.

Consequences:
- provider-1 and first provider-2 credential issuance timestamps were roughly 1000x too large for `blockTimeGte`;
- canonical request `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b` was indexed, but its expiry was also encoded in milliseconds and is not valid final time-semantics evidence;
- both failed qualification attempts stopped before submission and consumed no nullifier/work receipt state.

## Earlier indexed request — preserve as diagnostic evidence, not final canonical proof

Scope `sr-wave1-canonical-2026-09-15-01`, policy `SR-WORK-02` / code `2`:
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

It proves policy commitment mechanics/indexing, but because the expiry unit was wrong it must not be used as the final NETWORK_VERIFIED Commit-Before-Know evidence.

## Current recovery gate

`SECONDS_EVERYWHERE_THEN_NEW_CANONICAL_SCOPE`

Required sequence:
1. Fix `scripts/issue-demo-credential.mjs` to use Unix seconds for `issuedAtEpoch` and `expiresAtEpoch`.
2. Fix browser runtime work-request/claim expiry conversion to `Math.floor(date.getTime() / 1000)`.
3. Keep provider 2 registered; do not create provider 3.
4. Reissue provider-2 credential with the same fixed issuer secret and corrected second-based timestamps.
5. Publish/validate the runtime fix.
6. Create fresh scope `sr-wave1-canonical-2026-09-15-02` with policy code `2` so the new request expiry is second-based.
7. Capture new request id + tx + block + exact expiry seconds.
8. Import corrected provider-2 credential and run private qualification once.
9. Capture verification id + tx + block and independently confirm `workReceiptExists=true`.
10. Only then lock final network evidence and promote exact flow to `NETWORK_VERIFIED`.

## Truth boundary

- Deployment is live.
- Provider 2 registration/indexed epoch `0` is proven.
- Request `...-01` is indexed but has invalid time units and is diagnostic only.
- No successful private qualification exists yet.
- Full V4 `NETWORK_VERIFIED` remains pending a clean seconds-based request + credential + indexed receipt.

## TRACE gate

Do not reopen TRACE UI/UX until seconds fix → fresh request → private proof → indexed receipt → evidence lock are complete.
