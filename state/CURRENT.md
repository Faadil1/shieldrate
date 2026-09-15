# ShieldRate — Canonical Current State

Date: 2026-09-14
Workstream: `PROOF_INTEGRITY_V1`
Repository: `Faadil1/shieldrate`
Branch: `proof-integrity-v1`
Status: `CI_PASS_READY_TO_MERGE`

## Product state

The original ShieldRate prototype had a strong private-reputation thesis but simulated wallet, proof, transaction and chain-confirmation behavior. Proof Integrity v1 replaces those claims with an explicit `DEMO_ATTESTED` execution mode and implements the eight integrity controls documented in `docs/PROOF-INTEGRITY-V1.md`.

## Implemented

- issuer-attested demo registry + Compact Schnorr provider attestation model;
- fixed policy bands;
- employer/job scoped pseudonym;
- challenge-bound request hash;
- anti-replay nullifier;
- verification-ID receipts;
- expiry/revocation checks;
- pass-only shareable receipts;
- fail-closed `MIDNIGHT_LIVE` mode;
- Compact 0.22–0.23 source using the official ZK Loan Schnorr attestation pattern;
- CI compile gate targeting Compact compiler 0.31.1;
- authenticated Compact release fetches through `GITHUB_TOKEN` to avoid GitHub API rate-limit failures;
- UI removal of fake `preprod · confirmed`, fake live badge, fake usage stats and fake transaction language.

## Validation

GitHub Actions is enabled for the fork. CI run `34924812459` passed all three validation jobs on the integration branch:

- Verify (Node 20): PASS — install, typecheck, tests, production build;
- Verify (Node 22): PASS — install, typecheck, tests, production build;
- Compile Compact contract: PASS — Compact toolchain 0.31.1 successfully compiled `contracts/shieldrate.compact`.

Two real Compact issues were found and fixed during validation: the admin hash domain byte length (`Bytes<23>`) and explicit `Uint<64>` constraining of provider epoch increments. The Compact devtool job is authenticated with `GITHUB_TOKEN` so CI does not depend on unauthenticated GitHub API rate limits.

## Current gate

Proof Integrity v1 is CI-valid and ready to merge into `main`. `MIDNIGHT_LIVE` remains intentionally disabled/fail-closed until the real Lace/MidnightJS wallet adapter, deployed contract address and independently verifiable transaction receipts are wired.
