# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_UNIX_SECONDS_FIX_DEPLOYED_FRESH_SCOPE_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Live contract — CLOSED / DO NOT REDEPLOY

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

The deployed contract remains valid. The discovered defect was in client/issuer timestamp units, not in the Compact ledger schema or block-time predicates.

## Provider 2 — INDEXED / CLOSED

Provider id `2` remains the canonical issuer for the clean run.

Public key:
- x `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration evidence:
- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

The operator reissued a corrected provider-2 credential with the same fixed local issuer secret and confirmed that the generated public key still matches the indexed provider-2 key exactly. Do not re-register provider 2 and do not expose the issuer secret.

## Unix-seconds defect — FIXED / DEPLOYED

Root cause: Compact `blockTimeGte` / `blockTimeLt` compare Unix seconds while ShieldRate previously supplied JavaScript millisecond timestamps.

Corrective commit:

`616874271cf4d1a1bdab061c8cd86bcddbaccbd0` — `fix: normalize encoding after Unix-seconds patch`

Published behavior now uses:
- credential `now = floor(Date.now() / 1000)`;
- credential 30-day expiry expressed in seconds;
- registered work-request `requestExpiresAtEpoch = floor(date.getTime() / 1000)`;
- generic proof-request expiry expressed in seconds.

Validation:
- local TypeScript typecheck: PASS;
- local tests: 25/25 PASS;
- local production build: PASS;
- GitHub CI run `35051149085`: completed / success;
- GitHub Pages run `35051149094`: completed / success.

The branch and public Pages runtime now contain the corrected Unix-seconds behavior.

## Earlier request `...-01` — diagnostic only

Scope `sr-wave1-canonical-2026-09-15-01`, policy `SR-WORK-02` / code `2`:
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

It is genuinely finalized/indexed, but its expiry was encoded in milliseconds. Preserve it as diagnostic evidence only; do not use it as final NETWORK_VERIFIED Commit-Before-Know evidence.

Both failed qualification attempts occurred before transaction submission and consumed no nullifier/work-receipt state.

## Current open gate

`FRESH_SECONDS_BASED_COMMIT_THEN_PRIVATE_QUALIFICATION`

Required next sequence:
1. Keep the same browser origin/session and do not redeploy the contract.
2. Hard-refresh the public Pages app so commit `6168742` is loaded; same-origin `sessionStorage` should preserve holder/admin state.
3. Confirm the current contract is still `c67fcd95...4513d2`.
4. Do not register provider 2 again.
5. Create fresh job scope `sr-wave1-canonical-2026-09-15-02` with policy `2` / `SR-WORK-02`.
6. Submit the work-request transaction exactly once and capture new request id + tx + block.
7. Recover/confirm the exact indexed `expiresAtEpoch` in Unix seconds before final evidence lock.
8. Import the corrected provider-2 `credentialPayload` from the local seconds-based issuance file; never commit raw private credential data.
9. Run registered private qualification exactly once for the new request.
10. Capture verification id + qualification tx + block and independently confirm `workReceiptExists=true`.
11. Only then create the final network evidence bundle and promote the exact clean flow to `NETWORK_VERIFIED`.

## Truth boundary

- Deployment is live.
- Provider 2 registration/indexed epoch `0` is proven.
- Unix-seconds fix is tested, CI-green, and deployed to Pages.
- Request `...-01` is indexed but time-unit-invalid for final evidence.
- No successful private qualification receipt exists yet.
- Full V4 `NETWORK_VERIFIED` remains pending the clean `...-02` request + private proof + independently indexed receipt.

## TRACE gate

Do not reopen TRACE UI/UX until fresh seconds-based request → private proof → indexed receipt → evidence lock are complete.
