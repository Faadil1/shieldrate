# V4 Hardening Notes

Status: `SOURCE_VALIDATED / NETWORK_GATE_PENDING`
Date: 2026-09-15

## Resolved hidden spots

### Provider epoch resurrection — CLOSED

Provider removal no longer deletes revocation history. The provider epoch is preserved and incremented before removal, so registering the same provider id again cannot reset it to epoch 0 and revive old credentials.

### Opportunity probing — CLOSED for registered scope

The work qualification nullifier is now holder + authenticated employer + job scope. It excludes policy/challenge/expiry. A successful qualification cannot be repeated for the same registered opportunity by changing proof parameters.

### Verifier scope spoofing — CLOSED for employer identity

The flagship path no longer accepts an arbitrary employer id at proof time. `registerWorkRequest` authenticates the employer through `ownPublicKey()` and `verifyRegisteredWorkPolicy` loads the registered request from ledger state.

### Goalpost movement — CLOSED for registered employer/job scope

`jobRequests` allows one immutable standard per employer + job scope. Cancellation closes rather than frees that key.

### Request/credential temporal checks — CLOSED

Request expiry and future credential issuance are checked against block time in Compact.

### Live receipt theater — CLOSED at source/runtime level

The API requires independent indexed request/receipt state after transaction finalization. A tx id alone is insufficient.

### Judge first-load cost — REDUCED

Midnight runtime paths are dynamically imported. The validated V4 build reduced the main entry JS from roughly 1.08 MB to about 245 KB minified, with the live runtime moved to a lazy chunk. Midnight WASM remains packaged for the live path.

### Dependency audit — CLOSED at npm dependency gate

Vite/Vitest were upgraded to Vite 8.3.0 / Vitest 5.0.1. The remediation workflow ran Compact compile, npm audit, typecheck, 20 tests and production build; audit reported 0 vulnerabilities.

## Remaining limits

### Real-world job identity

An authenticated employer can still label a different `jobScope` as a different opportunity. The chain cannot independently prove that two external requisition ids are not the same real-world job. Wave 1 claims immutable authenticated scope, not universal ATS identity.

### Federated work-data provenance

The current composite credential has one registered provider. Multi-source field attestations are a high-value next expansion but are not falsely claimed as shipped.

### Legal/fairness semantics

The protocol proves the employer committed the standard before proof. It does not prove the standard is lawful, unbiased or non-discriminatory.

### Network evidence

The exact V4 Commit-Before-Know flow still needs Opeyemi's canonical Lace/Preprod run and evidence bundle.

## Final pre-UI gates

1. final branch CI after documentation/cleanup;
2. canonical V4 Lace work-request tx;
3. canonical private qualification tx;
4. indexed `workReceipts` confirmation;
5. claim-ledger promotion;
6. then TRACE UI/UX V4 around `COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`.
