# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_NETWORK_VERIFIED`.

## Live contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy.

## Provider 2 — closed

Provider id `2`, epoch `0`.

Public key:
- X `281801475387186942268458825925983557163075984222258714615776155627247983780`
- Y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration:
- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`

Never register provider 2 again. Keep issuer secret material private/local.

## Historical request — diagnostic only

The old/default job request `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b` used a millisecond expiry and is not valid final evidence. Do not qualify against it.

## Card 05 resolution

Two issues were isolated and fixed:
- the MidnightJS `callTx / Transaction.scoped` browser path could emit a false duplicate assertion;
- refreshes reset Card 05 to the historical already-fixed job.

Current runtime uses a controlled direct work-request submission path, restores the remembered contract, persists the chosen job id, and preflights employer/job occupancy before commit.

Relevant commits:
- `7c25fa3ab874335cae2da8ec5f2b33e5c7e006d6`
- `36230dfaa0a1e1221ab4720b4581086976ac22c4`
- `59177e71e512a78c50e613fd9b86dfe0538819d2`

## Canonical request — verified / never recommit

Job: `sr-wave1-canonical-2026-09-15-03`
Policy: `SR-WORK-02 / code 2`

Pre-submit:
- jobScope `005df1d3a4ccacb3d19d75f1c9cd215251ffcc76a80b99fd5292d0860cf4f6f0`
- employerPkh `3db29be58b01b8cc56c82af1db7f71f9362d147ccdff67239afc719c7dbbe52c`
- jobKey `27bde9370c347ee387d0cea4e06374375d246166a4a56aefb445b0a138249cd0`
- state `OPEN`

Commit evidence:
- workRequestId `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
- tx `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
- block `2575087`
- expiresAtEpoch `1789563768`
- cancelled `false`

## Private qualification — verified

- verificationId `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1`
- tx `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836`
- block `2575167`

The app only returned `QUALIFIED` after independently finding the expected verification id in indexed `workReceipts`, so `workReceiptExists=true` is already satisfied for this exact run.

## Evidence

Public evidence bundle:
`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`

Core verified chain:
`provider 2 indexed → employer policy committed → private qualification → indexed receipt`

## Safety / no-repeat rules

- Never deploy another contract.
- Never re-register provider 2.
- Never recommit `sr-wave1-canonical-2026-09-15-03`.
- Do not publish raw credential contents or issuer/holder/admin secret material.
- Preserve exact tx/block/request/verification ids above as canonical evidence.

## Truth boundary

`NETWORK_VERIFIED = true` for the documented Preprod flow.

This does not claim generalized production readiness. A separate future hardening item remains around employer authorization identity derived from `ownPublicKey()`.

## Immediate continuation

Do not reopen the network proof flow. Continue with judge-facing evidence packaging, README/demo narrative, TRACE/UI polish, and optional authorization hardening.
