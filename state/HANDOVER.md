# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_COMMIT_INDEXED_PRIVATE_QUALIFICATION_PENDING`.

## Live contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy. The same contract remains canonical.

## Provider 2 — canonical issuer / already indexed

Provider id `2`:
- public key X `281801475387186942268458825925983557163075984222258714615776155627247983780`
- public key Y `44328514486860549557980204826385043161844197115525209758451524636130274127834`
- registration tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`
- indexed epoch `0`

Never register provider 2 again. Keep the retained issuer secret private/local; never paste or commit it.

## Timestamp issue — fixed

The browser/issuer paths now use Unix seconds for Compact block-time comparisons. The old historical work request is diagnostic only because its expiry was created in milliseconds.

Historical/default request:
- job `sr-private-frontend-001`
- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`
- expiry `1789525256287` (milliseconds; not final evidence)

Do not qualify against this old request.

## Card 05 issue — resolved

Two problems were isolated:
- MidnightJS `callTx / Transaction.scoped` could produce a false duplicate assertion while direct `createUnprovenCallTx()` and indexed preflights showed the fresh job key open.
- refreshes reset the UI job field to the already-fixed historical default job.

ShieldRate now uses an explicit direct work-request lifecycle and Card 05 persists/preflights the selected job before submission.

Relevant commits:
- `7c25fa3ab874335cae2da8ec5f2b33e5c7e006d6`
- `36230dfaa0a1e1221ab4720b4581086976ac22c4`
- `59177e71e512a78c50e613fd9b86dfe0538819d2`

## Canonical clean request — INDEXED / DO NOT RECOMMIT

Job:
`sr-wave1-canonical-2026-09-15-03`

Policy:
`SR-WORK-02 / code 2`

Preflight evidence:
- jobScope `005df1d3a4ccacb3d19d75f1c9cd215251ffcc76a80b99fd5292d0860cf4f6f0`
- employerPkh `3db29be58b01b8cc56c82af1db7f71f9362d147ccdff67239afc719c7dbbe52c`
- jobKey `27bde9370c347ee387d0cea4e06374375d246166a4a56aefb445b0a138249cd0`
- pre-submit state: OPEN

Successful indexed Card 05 evidence:
- workRequestId `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
- tx `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
- block `2575087`

Card 05 is closed. **Never click Commit again for this job.**

## Immediate continuation

1. Read the indexed request `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1` and capture exact `expiresAtEpoch`.
2. Validate the corrected provider-2 local credential object before importing it. Required properties: income `68000`, ratingX100 `487`, completedJobs `120`, providerEpoch `0`, Unix-second timestamps, `issuedAt < now < expiresAt`, and credential expiry >= request expiry.
3. Import the corrected provider-2 signed credential in Card 04. Do not expose issuer secret material.
4. Ensure Card 06 targets exactly `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`.
5. Run registered private qualification exactly once.
6. Capture full `QUALIFIED · verification <id> · tx <tx> · block <block>` output.
7. Independently run the receipt check for that exact verification id and require `workReceiptExists=true`.
8. Only after that create final network evidence under `evidence/network/` and promote the state to `NETWORK_VERIFIED`.

## Safety / no-repeat rules

- Never deploy another contract.
- Never re-register provider 2.
- Never recommit `sr-wave1-canonical-2026-09-15-03`.
- Do not invent missing expiry/receipt data.
- If Card 06 errors after wallet Submit, do not retry until indexed receipt state is reconciled.
- Keep the same browser origin/session where possible; refresh can clear imported credential state even though holder/admin secrets persist in sessionStorage.

## Truth boundary

Deployment, provider 2, and the clean Commit-Before-Know request are proven live. The clean request is finalized/indexed at block `2575087`. A successful private qualification receipt has **not** yet been captured. V4 remains `NETWORK_VERIFIED = false` until Card 06 succeeds and that exact receipt is independently confirmed in indexed `workReceipts`.
