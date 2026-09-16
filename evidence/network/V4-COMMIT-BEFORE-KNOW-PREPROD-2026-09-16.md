# ShieldRate V4 — Preprod Network Evidence

Date: 2026-09-16
Status: NETWORK_VERIFIED

## Contract

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

## Canonical issuer

Provider id: `2`
Registration tx: `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2`
Registration block: `2568791`
Provider epoch: `0`

## Commit-Before-Know request

Job: `sr-wave1-canonical-2026-09-15-03`
Policy: `SR-WORK-02` / code `2`
Job scope: `005df1d3a4ccacb3d19d75f1c9cd215251ffcc76a80b99fd5292d0860cf4f6f0`
Employer PKH: `3db29be58b01b8cc56c82af1db7f71f9362d147ccdff67239afc719c7dbbe52c`
Job key: `27bde9370c347ee387d0cea4e06374375d246166a4a56aefb445b0a138249cd0`

Work request id: `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`
Commit tx: `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee`
Commit block: `2575087`
Expiry: `1789563768` Unix seconds
Cancelled: `false`

## Private qualification

Verification id: `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1`
Qualification tx: `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836`
Qualification block: `2575167`

ShieldRate returned `QUALIFIED` only after the qualification transaction finalized and the expected verification id was confirmed in indexed `workReceipts` state. Therefore this run includes an indexed receipt confirmation, not only a submitted transaction.

## Verified chain

`provider 2 indexed -> employer policy committed -> private holder qualification -> indexed QUALIFIED receipt`

## Privacy boundary

This evidence file intentionally excludes raw credential contents, issuer secret material, holder secret material, admin secret material, and wallet seed/private keys.

## Scope boundary

This evidence verifies the ShieldRate V4 Preprod flow above. It does not by itself claim generalized production readiness or resolve the separate future hardening item around employer authorization identity derived from `ownPublicKey()`.
