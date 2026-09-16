# Criterion — Private Work Qualification

## Product thesis

> **Prove you qualify for the work. Do not reveal why.**

Criterion combines two guarantees:

1. the employer fixes the qualification standard before candidate proof;
2. the worker proves the entire standard without revealing raw work data or component outcomes.

Canonical flow:

`Employer commits policy → Holder consents → Private qualification → QUALIFIED receipt`

## Registered request model

`registerWorkRequest(...)` binds a request to:

- employer public-key scope derived from the Compact context;
- job scope;
- fixed policy code;
- challenge;
- request nonce;
- expiry.

`jobRequests` allows only one request for that employer + job scope. Cancellation marks the request closed but deliberately does not remove the job key, so the standard cannot be silently replaced under the same protocol scope.

## Qualification model

`verifyRegisteredWorkPolicy(workRequestId)` does not accept a new policy from the prover. It loads the already-registered request and checks:

1. request exists;
2. request is not cancelled;
3. request is still valid against block time;
4. provider is registered and credential epoch is current;
5. credential issuance is not in the future;
6. credential remains valid through request expiry;
7. provider Schnorr signature binds the private credential;
8. all private conditions for the registered policy are satisfied;
9. opportunity nullifier has not been consumed;
10. one positive work receipt is inserted.

A failing condition aborts before public receipt insertion.

## Opportunity-scoped privacy budget

The work nullifier is derived from holder secret + employer scope + job scope. It intentionally excludes policy code, challenge and expiry.

A successful qualification consumes the public qualification slot for that opportunity. A failed attempt does not create a public receipt/nullifier because the circuit aborts before state mutation.

## Wave 1 policies

| Code | ID | Income | Rating | Jobs | Public result |
|---|---|---:|---:|---:|---|
| 1 | `SR-WORK-01` | > 40,000 | ≥ 4.0 | ≥ 50 | QUALIFIED |
| 2 | `SR-WORK-02` | > 50,000 | ≥ 4.5 | ≥ 100 | QUALIFIED |
| 3 | `SR-WORK-03` | > 80,000 | ≥ 4.9 | ≥ 200 | QUALIFIED |

These are demonstration standards, not universal hiring recommendations.

## Privacy boundary

### Public request

- employer public-key scope;
- job scope hash;
- policy code;
- challenge;
- request nonce;
- expiry.

### Public successful receipt

- work request id;
- scoped subject;
- provider id;
- policy code;
- request expiry.

### Private

- exact income;
- exact rating;
- exact completed jobs;
- holder secret;
- provider signature opening/private witness.

### Never published on failure/refusal

- a negative worker profile;
- which criterion failed;
- how far a criterion failed by;
- a holder-specific refusal event;
- a reusable cross-employer identity.

## Canonical Preprod status

The V4 flow is `NETWORK_VERIFIED` on Midnight Preprod. The canonical run committed `SR-WORK-02`, completed a private qualification, finalized the transaction, and confirmed the expected verification id in indexed `workReceipts` before the UI returned `QUALIFIED`.

See [`../evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`](../evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md).

## Honest limits

- Criterion binds a protocol employer scope and job scope; it does not prove a unique mapping to one external real-world requisition.
- Commit-Before-Know proves policy immutability for the registered scope, not legality or non-discrimination.
- V4 uses one registered provider to attest the composite private credential. Independent field-level issuers are a future extension.
- `ownPublicKey()`-derived employer scope is not claimed as final production authentication.
