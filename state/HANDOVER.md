# ShieldRate — Handover

Resume from `PROOF_INTEGRITY_V1` on `Faadil1/shieldrate`, branch `proof-integrity-v1`.

1. Inspect GitHub Actions for the integration branch / PR.
2. Require `npm ci && npm run typecheck && npm test && npm run build` to pass.
3. Require the Compact 0.31.1 compile job for `contracts/shieldrate.compact` to pass.
4. If Compact compilation surfaces syntax/API deltas, fix against current Midnight documentation; do not downgrade the UI back to simulated chain states.
5. Deploy the compiled contract to the selected Midnight environment.
6. Wire the generated contract module, Lace wallet, provider/indexer and proof server.
7. Only after a real transaction receipt exists, enable `VITE_SHIELDRATE_MODE=midnight-live` and populate contract address / transaction hash / network state from the adapter.
8. Preserve the privacy invariants: fixed policy bands, scoped subject, request binding, nullifier anti-replay, pass-only publication and no stable credential identifier in shared receipts.

Canonical demo promise: **Prove an issuer-attested work claim for one employer/job context without revealing the raw credential, without a reusable cross-employer identity, and without publishing failed predicates.**
