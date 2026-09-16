# ShieldRate — Canonical Current State

Date: 2026-09-16
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_COMMIT_INDEXED_PRIVATE_QUALIFICATION_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Live contract — CLOSED / DO NOT REDEPLOY

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

The deployed contract remains canonical. Do not deploy another contract.

## Provider 2 — INDEXED / CLOSED

Provider id `2` remains the canonical issuer for the clean run.

Public key:
- x `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration evidence:
- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Do not register provider 2 again. Keep the retained issuer secret private/local and never commit or paste it.

## Unix-seconds defect — FIXED / DEPLOYED

The live runtime now converts credential and request time values to Unix seconds before entering Compact block-time predicates.

Canonical corrective chain:
- `9142b6a1b69a0e07ccb60d9639af4cb6f3a26130` — functional Unix-seconds fix;
- `616874271cf4d1a1bdab061c8cd86bcddbaccbd0` — encoding cleanup preserving the fix.

The old request below remains diagnostic only because it was created with millisecond expiry.

## Old request — diagnostic only / do not qualify

Historical/default job `sr-private-frontend-001`:
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`
- jobScope `e408256b77d506ec775f088b078c3d1c6ea8795d76f020d4bca5c44cdfae684e`
- policy code `2`
- indexed expiry `1789525256287` — milliseconds, therefore invalid final time-semantics evidence.

Preserve it only as diagnostic evidence. Do not run the final qualification against it.

## Card 05 debugging — CLOSED

The repeated duplicate-policy failures were traced to two client-side/operator-path issues rather than a second indexed request:

1. MidnightJS `callTx / Transaction.scoped` produced a false duplicate assertion in this browser path even while `queryZSwapAndContractState()` and direct `createUnprovenCallTx()` showed the fresh job key as open.
2. Browser refreshes reset Card 05 to the historical default job `sr-private-frontend-001`, which is genuinely already fixed on-chain.

The runtime now uses the explicit controlled work-request lifecycle and the UI persists/preflights the selected job scope before any commit.

Relevant hardening commits include:
- `7c25fa3ab874335cae2da8ec5f2b33e5c7e006d6` — direct work-request submission path, no unnecessary private-state write;
- `36230dfaa0a1e1221ab4720b4581086976ac22c4` — restore remembered contract with initialized providers;
- `59177e71e512a78c50e613fd9b86dfe0538819d2` — persist and preflight Card 05 job scope.

## Canonical fresh Commit-Before-Know request — INDEXED / CLOSED

Job:

`sr-wave1-canonical-2026-09-15-03`

Policy:

`SR-WORK-02 / code 2 / Proven professional`

Preflight before submit proved the current employer/job key was open:
- jobScope `005df1d3a4ccacb3d19d75f1c9cd215251ffcc76a80b99fd5292d0860cf4f6f0`
- employerPkh `3db29be58b01b8cc56c82af1db7f71f9362d147ccdff67239afc719c7dbbe52c`
- jobKey `27bde9370c347ee387d0cea4e06374375d246166a4a56aefb445b0a138249cd0`

Authoritative indexed commit evidence:
- workRequestId `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
- tx `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
- block `2575087`

**Do not recommit this job. Card 05 is closed.**

## Current open gate

`VALIDATE_REQUEST_EXPIRY_AND_PROVIDER2_CREDENTIAL_THEN_PRIVATE_QUALIFICATION`

Required next sequence:
1. Inspect the indexed request `d7f42c...9ed1` and capture its exact `expiresAtEpoch` in Unix seconds.
2. Validate the local corrected provider-2 credential object only: values `68000 / 487 / 120`, `providerEpoch=0`, approximately 10-digit Unix-second timestamps, `issuedAt < now < expiresAt`, and credential expiry covering the request expiry.
3. Do not expose provider-2 issuer secret or raw signing secret material.
4. Import the corrected provider-2 signed credential into Card 04 in the same browser session.
5. Card 06 must target workRequestId `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`.
6. Run registered private qualification exactly once.
7. Capture the full `QUALIFIED` output: verification id + tx + block.
8. Independently confirm `workReceiptExists=true` for that exact verification id.
9. Only then create the final network evidence bundle and promote V4 to `NETWORK_VERIFIED`.

## Truth boundary

- Deployment is live and canonical.
- Provider 2 registration/indexed epoch `0` is proven.
- Unix-seconds client fix is deployed.
- Historical default request is indexed but time-unit-invalid for final evidence.
- Fresh canonical request `d7f42c...9ed1` is successfully finalized/indexed at block `2575087`.
- No successful private qualification receipt has been captured yet.
- Full V4 `NETWORK_VERIFIED` remains **false** until Card 06 succeeds and the exact receipt is independently found in indexed `workReceipts`.

## TRACE gate

Do not reopen final TRACE UI/UX promotion until private proof → indexed receipt → evidence lock are complete.
