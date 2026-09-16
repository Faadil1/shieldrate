# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_PROVIDER_INDEXED_COMMIT_BEFORE_KNOW_REQUEST_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Deployment is READY — do not redeploy

Current Midnight Preprod contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Keep using the same browser origin/session because holder/admin private state is session-scoped.

## Provider registration is now indexed

History:

- first provider-registration attempt for id `1` reached 1AM Submit Transaction and returned `1010: Invalid Transaction · Custom error: 182`;
- ShieldRate was patched with provider state reconciliation;
- read-only check confirmed `NOT REGISTERED`, allowing one fresh attempt;
- after the fresh attempt, supervised browser evidence shows:

`INDEXED · Provider 1 exists · epoch 0 · expected key matches.`

Therefore provider id `1` is now present in indexed contract state with the exact expected public key and epoch `0`. Do **not** submit any further provider-registration transaction for this run.

The successful registration transaction id and block height are not visible in the latest video. Treat those metadata as still missing; recover later from wallet/indexer history if possible, otherwise document their absence honestly.

## Existing provider/credential pair — do not regenerate

Provider id: `1`

Provider public key X:

`42848969277721310029114432532667054135720119005484359189255060317143764534159`

Provider public key Y:

`37973363005075625546044948588170817933783603251788102975603190164298483319067`

Credential payload originally generated for this pair:

- income `68000`
- ratingX100 `487`
- completedJobs `120`
- issuedAtEpoch `1789522255905`
- expiresAtEpoch `1792114255905`
- providerEpoch `0`
- signature announcement X `39727092603094829665083599291533771802369356540324642898591923293710774392790`
- signature announcement Y `19216289918660159001430231696189147917219779301071910519969541987185607939876`
- signature response `309346400474748242122019296616861016450537810228354672912399066652064654955`

The issuer secret was random and not printed. Do not rerun `npm run issue:demo` unless intentionally discarding this provider/credential pair.

## Immediate continuation

1. Keep the same browser tab/session and current contract.
2. Import the existing signed credential payload in Card 04. Never put the raw credential or issuer secret into Git evidence.
3. In Card 05 use fresh job scope `sr-wave1-canonical-2026-09-15-01` and policy `SR-WORK-02` / code `2`.
4. Click **Commit policy before proof** once and approve the wallet flow once.
5. Capture work request id + tx id + block height + Unix-millisecond request expiry.
6. Confirm the work request through indexed state before proof.
7. Run Card 06 private qualification once against that exact registered work request.
8. Capture verification id + tx id + block height.
9. Independently confirm `workReceiptExists=true` for the verification id.
10. Recover provider registration tx/block later if available and include them in final evidence; never invent them.
11. Lock `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after the public evidence bundle is complete.

## Truth boundary

- Deployment READY is proven.
- Provider id `1`, epoch `0`, and expected-key match are independently indexed.
- Provider tx/block metadata remain uncaptured.
- Full V4 `NETWORK_VERIFIED` is still pending committed request + real private proof + independent indexed work receipt.
- A submitted transaction alone is never enough; indexed ledger state is authoritative.
- Never expose holder/admin/issuer secrets.

## TRACE gate

Do not reopen TRACE UI/UX until committed request → private proof → indexed receipt → evidence lock is complete.
