# ShieldRate — Canonical Current State

Date: 2026-09-14
Workstream: `PROOF_INTEGRITY_V1`
Repository: `Faadil1/shieldrate`
Branch: `proof-integrity-v1`
Status: `CI_VALIDATION_TRIGGERED`

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
- UI removal of fake `preprod · confirmed`, fake live badge, fake usage stats and fake transaction language.

## Current gate

GitHub Actions was enabled for the fork on 2026-09-14. This state-only commit intentionally retriggers the open pull request so CI can validate the integration branch. The next gate is CI validation, especially the real Compact compile job. Do not merge or enable `MIDNIGHT_LIVE` if the Compact compile or web build fails.
