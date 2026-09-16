# Private Work Qualification — V4

## Product thesis

> **Prove you qualify for the work. Do not reveal why.**

ShieldRate combines two guarantees:

1. the employer fixes the qualification standard before candidate proof;
2. the worker proves the entire standard without revealing raw work data or component outcomes.

Canonical flow:

`Employer commits policy → Holder consents → Private qualification → QUALIFIED receipt`

## Registered request model

`registerWorkRequest(...)` is an employer-wallet transaction. Compact derives the employer public-key hash with `ownPublicKey()` and binds the request to:

- employer public-key hash;
- job scope;
- fixed policy code;
- challenge;
- request nonce;
- expiry.

`jobRequests` allows only one request for that employer + job scope. Cancellation marks the request closed but deliberately does not remove the job key, so the employer cannot cancel and silently replace the standard.

## Qualification model

`verifyRegisteredWorkPolicy(workRequestId)` does not accept a new policy or employer id from the prover. It loads the already-registered request and checks:

1. request exists;
2. request is not cancelled;
3. request is still valid against block time;
4. provider is registered and credential epoch is current;
5. credential issuance is not in the future;
6. credential remains valid through request expiry;
7. provider Schnorr signature binds the private credential to the holder;
8. all private conditions for the registered policy are satisfied;
9. opportunity nullifier has not been consumed;
10. one positive work receipt is inserted.

A failing condition aborts before public receipt insertion.

## Opportunity-scoped privacy budget

The work nullifier is derived from:

- holder secret;
- authenticated employer public-key hash;
- job scope.

It intentionally excludes:

- policy code;
- challenge;
- expiry.

Therefore a successful qualification consumes the public qualification slot for that opportunity. The verifier cannot obtain additional successful receipts for the same worker/opportunity by changing policy or challenge.

A failed attempt does not consume a public receipt/nullifier because the circuit aborts before state mutation. This preserves failure privacy and allows the holder to retry the **same committed standard** later if their underlying credential changes.

## Wave 1 policies

| Code | ID | Income | Rating | Jobs | Public result |
|---|---|---:|---:|---:|---|
| 1 | `SR-WORK-01` | > 40,000 | ≥ 4.0 | ≥ 50 | QUALIFIED |
| 2 | `SR-WORK-02` | > 50,000 | ≥ 4.5 | ≥ 100 | QUALIFIED |
| 3 | `SR-WORK-03` | > 80,000 | ≥ 4.9 | ≥ 200 | QUALIFIED |

These are demonstration standards, not universal hiring recommendations.

## Privacy boundary

### Public request

- authenticated employer public-key hash;
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

## Verifier accountability without worker surveillance

Because work requests are public while failed candidate interactions are not, an auditor can analyze an employer's committed standards without receiving a public list of workers who failed or declined.

ShieldRate therefore creates a public record of **the question the verifier committed to**, not a public dossier of everyone who answered.

## Honest limits

- ShieldRate authenticates the wallet that registered a job scope; it does not prove a unique mapping from that scope to one real-world external requisition.
- Commit-Before-Know proves policy immutability for the registered scope, not legality or non-discrimination.
- V4 uses one registered provider to attest the composite private credential. Independent field-level issuers are a future extension.
- Real network status remains pending until the canonical Lace/Preprod evidence run is captured.
