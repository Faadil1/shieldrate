# ShieldRate — Handover

Resume from `Faadil1/shieldrate`, branch `midnight-live-integration`.

Canonical state: `MIDNIGHT_LIVE_INTEGRATION / CI_VALIDATION_PENDING`.
Locked baseline: `PROOF_INTEGRITY_V1_MERGED` on `main`, squash `7910cc34cab21e8fec88a746f7e0285028f35b0d`.

## Implemented on the live-integration branch

1. Current Midnight browser dependencies pinned to the official current example stack: CompactJS 2.5.1, DApp Connector 4.0.1, MidnightJS 4.1.1.
2. Vite WASM/top-level-await configuration for the Midnight runtime.
3. Compact generation to `contracts/managed/shieldrate` plus browser sync of `keys/` and `zkir/`.
4. Real Lace discovery/connect path using injected `window.midnight` API 4.x.
5. MidnightJS providers for indexer, proof server, wallet balancing and transaction submission.
6. Contract wrapper + witnesses/private state for the compiled ShieldRate contract.
7. Contract pure helpers for holder-binding field and seven-field Schnorr challenge so an external issuer can sign the exact in-circuit message without receiving the holder secret.
8. External issuer-attestation client. Issuer private keys are not accepted in Vite/browser configuration.
9. Live `verifyClaim` path deriving the same request hash/scoped subject/nullifier/verification id off-chain, then requiring the finalized contract result to match.
10. Live receipt fields come from finalized Midnight evidence: transaction hash, block height, contract address and verification id.
11. Indexer-backed `receiptExists` verification path.
12. UI distinguishes `DEMO_ATTESTED` from `MIDNIGHT_LIVE` and produces no receipt on failed predicates/network submissions.
13. Request challenge widened to a real 32-byte value for Compact `Bytes<32>` compatibility.

## Immediate gate

Open the pull request and use GitHub Actions as the build oracle because the local execution environment has no outbound DNS. CI must:

- install Node 22 dependencies;
- compile Compact 0.31.1;
- generate contract bindings;
- copy proving keys/ZKIR;
- typecheck;
- run tests;
- build the Vite/WASM production app.

Fix only evidence-backed compiler/API deltas. Do not merge or enable public `MIDNIGHT_LIVE` until CI is green.

## After CI green

1. Add the server-side demo issuer service based on the official Midnight ZK Loan Schnorr attestation pattern.
2. Deploy ShieldRate on the selected Midnight environment with a funded Lace/testnet wallet.
3. Register the issuer provider public key.
4. Execute the canonical live proof and capture contract address, tx hash, block height, request hash, scoped subject, nullifier and expiry.
5. Verify the receipt independently through the indexer.
6. Only then set `VITE_SHIELDRATE_MODE=midnight-live` for a live deployment.

Canonical promise: **Prove an issuer-attested work claim for one employer/job context without revealing the raw credential, without a reusable cross-employer identity, and without publishing failed predicates.**
