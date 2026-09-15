# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `main`.

Canonical state: `PROOF_INTEGRITY_V1_MERGED`.
Merge commit: `7910cc34cab21e8fec88a746f7e0285028f35b0d`.
Final PR validation: GitHub Actions run `34924939844` — Node 20 PASS, Node 22 PASS, Compact 0.31.1 compile PASS.

## Next workstream — MIDNIGHT_LIVE_INTEGRATION

1. Keep the current privacy/security invariants intact: fixed policy bands, issuer authenticity, employer/job-scoped subject, challenge-bound request hash, request nullifier, pass-only publication, expiry/revocation, and no stable credential identifier in shared receipts.
2. Deploy `contracts/shieldrate.compact` to the selected Midnight environment using the validated Compact 0.31.1 toolchain.
3. Register the intended attestation provider / issuer public key and define the demo issuer bootstrap path.
4. Generate and wire the contract TypeScript bindings.
5. Replace the demo wallet path with a real Lace/MidnightJS adapter without weakening the fail-closed behavior.
6. Wire the provider/indexer/proof infrastructure required by the deployed environment.
7. Execute one canonical live scenario end-to-end: employer requests an approved policy band → freelancer consents → private issuer-attested credential satisfies it → real Compact proof/transaction → employer verifies a receipt while the raw credential remains undisclosed.
8. Capture the real contract address, network, transaction hash / ledger reference, request hash, nullifier and expiry in a judge-readable receipt.
9. Only after that evidence is reproducible, enable `VITE_SHIELDRATE_MODE=midnight-live` and update the README/UI from `LOCAL ONLY` to genuine network-derived status.
10. After the live integrity path is locked, proceed to the larger UI/UX redesign and judge-performance polish.

Canonical demo promise: **Prove an issuer-attested work claim for one employer/job context without revealing the raw credential, without a reusable cross-employer identity, and without publishing failed predicates.**
