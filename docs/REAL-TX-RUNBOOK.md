# ShieldRate — Canonical Lace / Preprod V4 Runbook

Status: `PENDING_OPERATOR_RUN`
Owner: Opeyemi / operator with Lace + funded Midnight environment
Quick operator checklist: [`OPEYEMI-LIVE-GATE.md`](OPEYEMI-LIVE-GATE.md)

## Promotion gate

V4 becomes `NETWORK_VERIFIED` only after one coherent run captures **both** the employer request and holder qualification on Midnight and independently confirms the expected work receipt.

A green build is not enough. A transaction id is not enough.

## Canonical scenario

Use `SR-WORK-02` because the current demo credential satisfies it while `SR-WORK-03` does not.

Use a fresh canonical job scope, for example:

`sr-wave1-canonical-<date>-01`

Do not reuse a job scope that already has a registered request: Commit-Before-Know deliberately makes the first registered policy immutable for that employer/job scope.

### Time boundary — non-negotiable

Compact `blockTimeGte` / `blockTimeLt` are treated as **Unix milliseconds** in this project. The ABI fields retain historical names such as `issuedAtEpoch`, `expiresAtEpoch` and `requestExpiresAtEpoch`, but their numeric values are milliseconds.

Do not divide browser timestamps by `1000` before sending them to Compact. The compiled-circuit regression suite rejects second-based values at this boundary.

## A. Environment

- Open the V4 build with Lace installed.
- Confirm execution mode is `MIDNIGHT_LIVE`.
- Confirm intended network.
- Confirm proof/indexer endpoints are reachable.

Record:

```text
network=
operatorTimestamp=
```

## B. Contract

Deploy a fresh V4 contract or join the agreed canonical V4 address.

Record:

```text
contractAddress=
deployOrJoinTx=
deployOrJoinBlock=
```

## C. Provider

Register the canonical test issuer public key.

Record:

```text
providerId=
providerRegistrationTx=
providerRegistrationBlock=
providerEpoch=
```

Never record the issuer private key.

## D. Holder credential

1. Generate/read the holder binding from the operator dossier.
2. Issue a provider-signed credential bound to that holder.
3. Import the signed payload into holder private state.

The credential payload must use Unix milliseconds for `issuedAtEpoch` and `expiresAtEpoch`. `npm run issue:demo` now emits millisecond values by default.

Never commit holder secret, wallet seed, issuer secret or raw credential values to evidence.

## E. Employer commits policy before proof

With the intended employer Lace wallet active:

- job scope: fresh canonical value;
- policy: `SR-WORK-02` / code `2`;
- fresh challenge;
- short future expiry expressed as Unix milliseconds at the Compact boundary.

Execute **Commit policy before proof**.

Capture public evidence:

```text
employerWallet=<public identifier only if appropriate>
jobScope=<canonical public label or its hash>
policyCode=2
workRequestId=
workRequestTx=
workRequestBlock=
requestExpiresAtMs=
contractAddress=
```

Then independently query indexed contract state and confirm:

```text
workRequestExists=true
policyCode=2
cancelled=false
```

## F. Holder consents and proves

The holder proves the registered `workRequestId`. The proof must read the already-committed policy from contract state; do not submit a new threshold/policy at proof time.

After finalization capture:

```text
verificationId=
workRequestId=
scopedSubject=
providerId=
policyCode=2
qualificationTx=
qualificationBlock=
contractAddress=
```

Then independently query indexed state and confirm:

```text
workReceiptExists=true
```

## G. Negative-path checks

The repository now contains tests that execute the **compiled Compact contract** for the verifier-side invariants. Do not create unnecessary failed public transactions merely to reproduce those checks live.

Source/compiled-circuit evidence should cover:

- second request under same employer/job scope is rejected;
- cancelled request cannot reopen the policy slot;
- expired/second-based request expiry is rejected;
- provider epoch remains monotonic across remove + re-register;
- `SR-WORK-03` fails for the demo private credential and creates no public work receipt;
- second successful qualification for the same holder/employer/job is blocked.

## H. Evidence bundle

Only after a successful live run create:

`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<YYYY-MM-DD>.md`

Include only public evidence:

- network;
- contract address;
- provider registration tx/block;
- work request id + tx/block;
- policy code + expiry in Unix milliseconds;
- qualification verification id + tx/block;
- independent indexed request/receipt checks;
- exact reproduction steps.

Do **not** include secrets, seed phrases, raw income/rating/jobs, private signature secrets or holder secret.

## Failure rules

If any network step fails:

- keep `docs/CLAIMS.md` at `LIVE_PENDING`;
- record step/error privately for repair;
- do not manufacture a successful evidence artifact;
- if the registered request itself is wrong, use a **new job scope** after repair because the original standard is intentionally immutable;
- if the request is correct but holder proof fails before receipt insertion, the same registered request may be retried with valid holder state while it remains active.

If a time-related assertion fails, first verify that every credential/request timestamp crossing into Compact is a Unix **millisecond** value.

## Promotion

After the evidence file is committed and independently checked, change only the supported claim:

`canonical V4 registered request + qualification receipt → NETWORK_VERIFIED`

Do not promote unrelated production-governance, legal-fairness, billing, RBAC or integration claims.
