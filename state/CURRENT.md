# ShieldRate — Canonical Current State

Date: 2026-09-14
Workstream: `PROOF_INTEGRITY_V1`
Repository: `Faadil1/shieldrate`
Branch: `main`
Status: `PROOF_INTEGRITY_V1_MERGED`

## Product state

Proof Integrity v1 is merged into `main` via squash commit `7910cc34cab21e8fec88a746f7e0285028f35b0d`. The original ShieldRate prototype's simulated wallet/proof/transaction claims have been replaced by an explicit `DEMO_ATTESTED` trust boundary plus a fail-closed `MIDNIGHT_LIVE` mode.

## Implemented

- issuer-attested demo registry + Compact Schnorr provider attestation model;
- fixed policy bands to reduce threshold probing;
- employer/job-scoped pseudonyms;
- challenge-bound request hashes;
- anti-replay nullifiers;
- verification-ID receipts instead of persistent holder keys;
- credential freshness + provider-epoch revocation;
- pass-only publication for successful predicates;
- no stable credential identifier in shared receipts;
- fail-closed `MIDNIGHT_LIVE` mode;
- UI removal of fake `preprod · confirmed`, fake live badge, fake usage stats and fake transaction language;
- authenticated Compact release fetches through `GITHUB_TOKEN`;
- real Compact compiler gate targeting toolchain 0.31.1.

## Validation

Final PR CI run `34924939844` passed all three jobs:

- Verify (Node 20): PASS — install, typecheck, tests, production build;
- Verify (Node 22): PASS — install, typecheck, tests, production build;
- Compile Compact contract: PASS — Compact 0.31.1 successfully compiled `contracts/shieldrate.compact`.

During validation, two real Compact issues were found and fixed: the admin hash domain byte length (`Bytes<23>`) and explicit `Uint<64>` constraining of provider epoch increments. A transient unauthenticated GitHub API rate-limit in `compact update` was also removed by passing `GITHUB_TOKEN` to the Compact devtools job.

## Current gate

`PROOF_INTEGRITY_V1` is complete and merged. The next gate is `MIDNIGHT_LIVE_INTEGRATION`: deploy the compiled contract, wire Lace/MidnightJS + generated contract bindings + provider/indexer/proof infrastructure, execute a real verification transaction, and expose only independently verifiable network receipts. Do not enable `VITE_SHIELDRATE_MODE=midnight-live` before that evidence exists.
