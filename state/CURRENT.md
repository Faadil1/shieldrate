# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `MIDNIGHT_LIVE_INTEGRATION`
Repository: `Faadil1/shieldrate`
Branch: `midnight-live-integration`
Status: `CI_VALIDATION_PENDING`

## Locked baseline

`PROOF_INTEGRITY_V1` is merged into `main` and validated:

- Compact compiler 0.31.1: PASS;
- web typecheck/tests/production build: PASS;
- GitHub Pages build + deploy: PASS after Pages was enabled;
- issuer authenticity, fixed policy bands, scoped subject, request binding, nullifier anti-replay, provider-epoch revocation and pass-only publication remain mandatory invariants.

## Current live-integration scope

This branch replaces the former live-mode swap points with the current Midnight browser stack while keeping demo mode intact:

- Midnight DApp Connector API 4.0.1 / Lace discovery and connection;
- MidnightJS 4.1.1 providers for wallet balancing, proving, indexer reads and transaction submission;
- CompactJS 2.5.1 compiled-contract wrapper;
- generated Compact bindings + browser `keys/` and `zkir/` assets;
- holder/admin private state with no secrets in Vite environment variables;
- external issuer-attestation client; issuer signing key stays server-side;
- live `verifyClaim` transaction path returning finalized tx hash, block height, contract address and verification id;
- indexer-backed receipt verification;
- UI separation between `DEMO_ATTESTED` and `MIDNIGHT_LIVE`.

## Trust boundary

`MIDNIGHT_LIVE` remains opt-in. It requires all of the following before it may be presented as live:

1. a deployed ShieldRate contract address;
2. a reachable issuer-attestation service;
3. a compatible Lace wallet on the configured Midnight network;
4. a provider registered in the deployed contract;
5. a successful finalized `verifyClaim` transaction.

Until those gates are satisfied, the public Pages build remains `DEMO_ATTESTED` by default.

## Current gate

Open a PR from `midnight-live-integration` and let GitHub Actions validate the real current package/API surface. Fix generated-binding, MidnightJS, Vite/WASM, Compact or TypeScript deltas from actual CI evidence. Do not merge until contract compile, typecheck, tests and production build are green.
