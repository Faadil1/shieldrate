# ShieldRate — Midnight Live Integration v1

Status: STARTED

Goal: replace the fail-closed `MIDNIGHT_LIVE` placeholder with a real, evidence-backed Midnight path without weakening Proof Integrity v1.

Gates:

1. COMPILE_ASSETS — generate the Compact 0.31.1 managed contract module and ZK assets reproducibly.
2. LACE_CONNECT — connect through DApp Connector API 4.x and verify the wallet/network configuration returned by Lace.
3. PROVIDERS — initialize zk config, proof, public-data/indexer, wallet and Midnight submission providers.
4. DEPLOY_OR_JOIN — deploy ShieldRate or join a configured contract address using MidnightJS 4.1.1.
5. REAL_TX — submit one canonical `verifyClaim` transaction and capture the real transaction identifier.
6. RECEIPT — surface only network-derived contract address / transaction id / network state in the UI.
7. LIVE_GATE — enable `MIDNIGHT_LIVE` only when the runtime can independently verify the configured contract and receipt.

Canonical live scenario:
Employer requests an approved income band -> holder consents -> issuer-attested private credential satisfies the Compact circuit -> real Midnight proof/transaction -> successful receipt exists on ledger -> raw income and stable credential identity remain undisclosed.

No wallet mnemonic, seed, signing secret, issuer private key, or other credential secret is committed to GitHub.
