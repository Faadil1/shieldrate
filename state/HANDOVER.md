# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_UNIX_SECONDS_FIX_DEPLOYED_FRESH_SCOPE_PENDING`.

## Live contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy. Keep the same browser origin/session whenever possible because holder/admin private state is session-scoped.

## Provider 2 — canonical issuer / already indexed

Provider id `2`:
- public key X `281801475387186942268458825925983557163075984222258714615776155627247983780`
- public key Y `44328514486860549557980204826385043161844197115525209758451524636130274127834`
- registration tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Do not register provider 2 again. The operator retained the fixed local issuer secret and regenerated a seconds-based credential whose public key exactly matches this already-indexed provider. Keep the secret private/local; do not paste or commit it.

## Timestamp bug — fixed and deployed

Confirmed root cause: Compact block-time predicates use Unix seconds; ShieldRate was feeding JavaScript milliseconds.

Fix chain:
- `9142b6a...` introduced seconds conversion but also accidental Windows encoding noise;
- `616874271cf4d1a1bdab061c8cd86bcddbaccbd0` removed BOM/mojibake while preserving the seconds fix.

Final published behavior:
- issuer `now = floor(Date.now()/1000)`;
- issuer expiry adds 30 days in seconds;
- registered work requests convert ISO expiry to `floor(getTime()/1000)`;
- generic proof requests do the same.

Validation on `6168742`:
- local typecheck PASS;
- local tests 25/25 PASS;
- local build PASS;
- CI run `35051149085` success;
- Pages run `35051149094` success.

The public GitHub Pages app therefore contains the Unix-seconds correction.

## Old request is diagnostic only

`sr-wave1-canonical-2026-09-15-01` / policy 2:
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

It is finalized/indexed but its expiry used milliseconds. Do not use it as final live proof. Preserve it only as diagnostic evidence of the discovered unit mismatch.

The two qualification failures were pre-submission and wrote no nullifier or work receipt.

## Immediate continuation

1. Hard-refresh `https://faadil1.github.io/shieldrate/` on the same browser origin so the `6168742` runtime is loaded.
2. Confirm `CURRENT CONTRACT` is still `c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`.
3. Do not touch Deploy and do not re-register provider 2.
4. In Card 05 use fresh scope `sr-wave1-canonical-2026-09-15-02` and policy `SR-WORK-02` / code `2`.
5. Submit **Commit policy before proof** exactly once and capture the full success line: workRequestId + tx + block.
6. If submission errors after wallet Submit Transaction, do not click again blindly; reconcile indexed state first.
7. Recover exact indexed request expiry in Unix seconds before evidence lock.
8. Import the corrected provider-2 `credentialPayload` from the local seconds-based issuance file into Card 04. Do not expose raw credential data in Git evidence.
9. Card 06 must target the new workRequestId from step 5; run private qualification exactly once.
10. Capture full `QUALIFIED` output (verification id + tx + block).
11. Independently confirm `workReceiptExists=true` for that exact verification id.
12. Create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after the complete public evidence bundle is checked.

## Truth boundary

Deployment and provider 2 are proven live. Unix-seconds fix is published and CI-green. Old request `...-01` is not valid final time-semantics evidence. Full V4 `NETWORK_VERIFIED` still requires fresh seconds-based request + successful private proof + independently indexed receipt.

## TRACE gate

Do not reopen TRACE UI/UX until clean network evidence is locked.
