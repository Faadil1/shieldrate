# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_PROVIDER_SUBMISSION_182_RECOVERY_PATCHED_RETEST_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

ShieldRate fixes the employer qualification standard before the holder proves anything. Failure/refusal leaves no holder-specific public negative record.

## Deployment is already READY — never redeploy this run

Supervised 1AM / Midnight Preprod deployment succeeded on:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Observed: wallet connected on `preprod`, Balance & Sign approved, separate Submit Transaction approved, then ShieldRate populated `CURRENT CONTRACT` after its indexed/join path.

## Current blocker — provider registration submission

Provider id `1` was prepared using the already-generated issuer public key and matching signed credential. The operator approved 1AM **Submit Transaction**, after which ShieldRate received:

`1010: Invalid Transaction · Custom error: 182`

MidnightJS wrapped it as `SubmissionError` / `Unexpected error submitting scoped transaction '<unnamed>'`.

Because submission was reached, do not tell the operator to click Register again without first reconciling indexed provider state.

## What error 182 means / does not mean

Legacy Midnight node code maps `182` to generic `TransactionApplicationError`. Midnight also has an official experiment where this exact `1010 ... Custom error: 182` surface is produced by an expired initial intent TTL. That example is useful evidence, but it is not sufficient to label this run as TTL-expired.

Exact MidnightJS `4.1.1` source used by the app creates contract-call intents with `Intent.new(ttlOneHour())`. The supervised provider flow was much shorter than one hour by observation, so keep TTL as a hypothesis unless a future run proves it.

The Compact circuit's own provider-registration guards are `admin authorization failed` and `provider already registered`; neither message was surfaced.

## Recovery patch now staged

The source patch adds:

- `ShieldRateAPI.providerStatus(providerId, expectedPk?)` to read indexed `providers` and `providerEpochs`;
- `inspectMidnightProvider()` runtime API;
- operator button **Check provider on-chain** with no write/transaction;
- read-before-write provider registration preflight;
- expected-key match recovery if the provider is already indexed;
- hard stop if the provider id belongs to a different key;
- bounded post-error provider-state polling;
- zero automatic re-submission;
- explicit ambiguity messaging if no provider can be confirmed;
- `issuer-demo*.json` added to `.gitignore`.

## Existing provider/credential pair — do not regenerate

Holder binding used for the credential:

`21544717071399442165233035540203216262818168327435337317305162660448280343824`

Provider id:

`1`

Provider public key X:

`42848969277721310029114432532667054135720119005484359189255060317143764534159`

Provider public key Y:

`37973363005075625546044948588170817933783603251788102975603190164298483319067`

Credential fields:

- income `68000`
- ratingX100 `487`
- completedJobs `120`
- issuedAtEpoch `1789522255905`
- expiresAtEpoch `1792114255905`
- providerEpoch `0`

Signature announcement X:

`39727092603094829665083599291533771802369356540324642898591923293710774392790`

Signature announcement Y:

`19216289918660159001430231696189147917219779301071910519969541987185607939876`

Signature response:

`309346400474748242122019296616861016450537810228354672912399066652064654955`

`npm run issue:demo` used a random issuer secret because `SHIELDRATE_ISSUER_SECRET` was not fixed. **Do not rerun it** unless intentionally discarding this provider/credential pair.

## Immediate operator continuation after CI + Pages pass

1. Hard refresh the same `https://faadil1.github.io/shieldrate/` browser origin. Session storage should retain holder/admin secrets and the remembered contract.
2. Confirm `CURRENT CONTRACT` is still the deployed address above. If not automatically restored, Join that exact existing contract; do not deploy.
3. Enter provider id `1` and the exact X/Y values above.
4. Click **Check provider on-chain** only.
5. Branch on the read result:
   - `INDEXED ... expected key matches` → do **not** register again. Recover evidence/transaction metadata if available and continue.
   - `NOT REGISTERED` → one fresh registration attempt is allowed because the read confirms no provider state was written. Approve once. If `182` repeats, stop again.
   - `DIFFERENT public key` → hard stop; do not overwrite/re-register.
6. After provider is indexed, import the existing signed credential payload, create a fresh job scope with policy code `2`, independently confirm the request, execute private qualification, and independently confirm `workReceiptExists=true`.
7. Lock `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after all public evidence is complete.

## Truth boundary

- Deployment READY is proven; full V4 `NETWORK_VERIFIED` is not.
- A submitted transaction is not enough; indexed ledger state is the source of truth.
- Do not invent provider tx/block metadata if recovery shows the provider but the original metadata is unavailable.
- Never expose holder/admin/issuer secrets.
- Never claim committed criteria are automatically lawful or fair.

## TRACE gate

Do not start the next TRACE UI/UX redesign before provider reconciliation → real request → private proof → indexed receipt → evidence lock.
