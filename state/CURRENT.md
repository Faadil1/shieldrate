# Criterion — Canonical Current State

Date: 2026-09-16
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_NETWORK_VERIFIED / JUDGE_PACKAGING`

Public product name: **Criterion**.

Technical continuity: the repository, deployed Compact contract, storage keys and protocol identifiers retain the historical `shieldrate` / `SR-*` namespace so the verified deployment and evidence chain are not disturbed.

## Product thesis

**Prove you qualify. Reveal nothing you do not owe.**

Canonical flow: `COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`.

## Canonical live contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy.

## Provider 2 — indexed / closed

Provider id `2`, epoch `0`.

Public key:
- x `281801475387186942268458825925983557163075984222258714615776155627247983780`
- y `44328514486860549557980204826385043161844197115525209758451524636130274127834`

Registration:
- tx `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
- block `2568791`

Do not register provider 2 again. Keep issuer secret material private/local.

## Unix-seconds bug — fixed

Criterion now supplies Unix seconds to Compact block-time predicates. The historical request `971f6ab4...e36892b` remains diagnostic only because its expiry was encoded in milliseconds.

## Card 05 issue — resolved

Two client/operator issues were isolated:
1. MidnightJS `callTx / Transaction.scoped` could surface a false duplicate assertion while direct `createUnprovenCallTx()` and indexed reads showed the fresh employer/job key open.
2. Browser refreshes reset Card 05 to the already-fixed historical default job.

Relevant hardening commits:
- `7c25fa3ab874335cae2da8ec5f2b33e5c7e006d6`
- `36230dfaa0a1e1221ab4720b4581086976ac22c4`
- `59177e71e512a78c50e613fd9b86dfe0538819d2`

## Canonical Commit-Before-Know request — verified

Job: `sr-wave1-canonical-2026-09-15-03`
Policy: `SR-WORK-02 / code 2`

Pre-submit proof:
- jobScope `005df1d3a4ccacb3d19d75f1c9cd215251ffcc76a80b99fd5292d0860cf4f6f0`
- employerPkh `3db29be58b01b8cc56c82af1db7f71f9362d147ccdff67239afc719c7dbbe52c`
- jobKey `27bde9370c347ee387d0cea4e06374375d246166a4a56aefb445b0a138249cd0`
- state before submit: `OPEN`

Indexed request:
- workRequestId `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
- tx `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
- block `2575087`
- expiresAtEpoch `1789563768`
- cancelled `false`

Do not recommit this job.

## Private qualification — verified

Qualification succeeded for the exact request above.

- verificationId `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1`
- tx `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836`
- block `2575167`

The live API returns `QUALIFIED` only after the qualification transaction finalizes and the expected verification id is found in indexed `workReceipts`. Therefore this successful output also confirms `workReceiptExists=true` for the verification id above.

## Network verdict

`NETWORK_VERIFIED = true`

Verified chain:

`provider 2 indexed → employer policy committed on-chain → private qualification succeeded → indexed QUALIFIED receipt confirmed`

Public evidence bundle:
`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`

## Judge-facing promotion

Criterion is now the public identity used for the landing page, workspace shell, runtime copy, page metadata, README, Judge Review and 90-second demo narrative. The landing page surfaces the canonical commit block, qualification block, contract and indexed-receipt state above the fold.

Do not rename the repository or deployed contract namespace before submission/video; that would add avoidable routing and evidence-continuity risk.

## Truth boundary

Proven live for this Preprod flow: deployment, provider 2 registration, Unix-second request semantics, immutable employer/job commit, successful private qualification, and indexed receipt confirmation.

Not claimed: publication of raw credential/private secrets, generalized production readiness, or completion of the separate signer-authorization hardening item around `ownPublicKey()`.

## Next gate

Network proof is closed. Record the judge video using `docs/DEMO-90S.md`, then finish submission packaging. Do not reopen the canonical transaction flow merely for recording.
