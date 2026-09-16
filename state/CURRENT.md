# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_PROVIDER_SUBMISSION_182_RECOVERY_PATCHED_RETEST_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Winning Intelligence V4 adds Commit-Before-Know: the employer fixes the qualification policy before holder proof, while failure/refusal leaves no holder-specific public negative receipt.

## Deployment gate — CLOSED

The supervised 1AM / Midnight Preprod run successfully deployed and joined the V4 contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

The wallet showed distinct **Balance & Sign Transaction** and **Submit Transaction** confirmations, and ShieldRate returned with `CURRENT CONTRACT` populated. Do not deploy another contract for this evidence run.

## Latest supervised operator result — provider submission gate OPEN

The first provider-registration attempt for provider id `1` reached the 1AM **Submit Transaction** confirmation on `PREPROD` and was approved. ShieldRate then received:

`1010: Invalid Transaction · Custom error: 182`

wrapped by MidnightJS as a `SubmissionError` / `Unexpected error submitting scoped transaction '<unnamed>'`.

This is materially different from the earlier browser-runtime failures: the provider call crossed the wallet submission boundary. Therefore **no blind second registration is allowed** until indexed provider state is read.

### Error interpretation

Midnight node history maps legacy custom error `182` to the generic `TransactionApplicationError` bucket. A Midnight experiment documents the same `1010 ... Custom error: 182` surface for an expired initial intent TTL, but that does not prove TTL expiry was the cause in this run.

The exact MidnightJS `4.1.1` code used by ShieldRate constructs contract-call intents with `Intent.new(ttlOneHour())`. The provider attempt did not visibly spend an hour between construction and submit, so TTL remains a hypothesis rather than a locked root cause.

The Compact `registerProvider` circuit itself checks admin authorization and provider non-membership before insertion. No Compact assertion message such as `admin authorization failed` or `provider already registered` was surfaced in this attempt.

## Recovery hardening applied

The browser runtime now implements provider registration as a reconciled state machine rather than a fire-and-forget call:

- `ShieldRateAPI.providerStatus()` independently reads indexed `providers` + `providerEpochs` state;
- the operator UI exposes **Check provider on-chain**, which performs no transaction;
- registration performs a read-before-write preflight;
- an already-indexed provider with the expected public key is treated as recovered state and is never resubmitted;
- an existing provider with a different key is a hard stop;
- after any submission/finalization error, ShieldRate polls indexed state for the expected provider before reporting failure;
- ShieldRate never automatically retries provider registration;
- an ambiguous error with no indexed provider explicitly instructs the operator to run the state check before any fresh transaction;
- local `issuer-demo*.json` artifacts are now ignored by Git to reduce credential-handling mistakes.

This repair does not claim the rejected provider transaction succeeded and does not promote V4 to `NETWORK_VERIFIED`.

## Current open gate

`PROVIDER_INDEXED_STATE_CHECK_THEN_SAFE_RETRY_IF_ABSENT`

Required next sequence after CI + Pages publish this patch:

1. Keep the same browser origin/session; a hard refresh preserves the sessionStorage holder/admin secrets and remembered contract address.
2. Re-enter provider id `1` and the exact already-generated provider public key. Do not rerun `npm run issue:demo` because that script used a random issuer secret for this credential pair.
3. Click **Check provider on-chain** only.
4. If the expected key is already indexed, do not register again; recover provider evidence and proceed.
5. If provider `1` is definitively absent, one fresh registration transaction may be constructed and submitted. This creates a new Midnight intent rather than replaying the rejected transaction.
6. If custom error `182` repeats on the fresh transaction, stop again and inspect the wallet/node transaction application path before any third attempt.
7. Once provider registration is indexed, continue fresh job scope + policy `2` → indexed request → credential import → private qualification → independently indexed `workReceiptExists=true`.
8. Only then create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` and promote the exact flow to `NETWORK_VERIFIED`.

## Credential continuity

The signed credential already generated for the current holder binding must remain paired with its exact provider public key. Do not rerun issuance unless intentionally starting a new provider/credential pair.

The current credential satisfies `SR-WORK-02` by construction (`68000 > 50000`, `487 >= 450`, `120 >= 100`) but this qualification is not a network claim until the registered private proof succeeds and its indexed receipt is confirmed.

## Known honest limits

- authenticated job scope is not universal proof of unique real-world ATS requisition identity;
- one provider currently signs the composite credential;
- Commit-Before-Know proves immutable criteria, not legal fairness/non-discrimination;
- broad Enterprise V3 RBAC/billing/webhook surfaces remain architecture/UX previews unless backed by production services.

## TRACE gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`deployment READY → provider indexed-state reconciliation → provider registration → real request → real private proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`
