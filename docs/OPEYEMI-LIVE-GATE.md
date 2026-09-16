# ShieldRate — Opeyemi Live Gate

Status: `READY_FOR_OPERATOR_RUN`
Owner: Opeyemi
Target: Midnight Preprod / Lace

This is the shortest path to close ShieldRate's only remaining external V4 gate.

## Goal

Produce one coherent public evidence chain:

`provider registered -> employer policy committed -> holder proves -> indexed QUALIFIED receipt exists`

Do not call V4 network-verified until the final indexed receipt check passes.

## Before you start

- use the `winning-intelligence-v4` build;
- connect Lace to the intended Midnight network;
- use a fresh contract or the agreed V4 contract;
- use a fresh job scope, e.g. `sr-wave1-canonical-2026-09-15-01`;
- use policy `SR-WORK-02` / code `2`;
- treat every Compact timestamp as **Unix milliseconds**;
- never paste a wallet seed, holder secret, issuer private key, or raw private credential into GitHub evidence.

## 1. Contract

Deploy or join the V4 contract.

Capture:

```text
network=
contractAddress=
deployOrJoinTx=
deployOrJoinBlock=
```

## 2. Register issuer

From the live operator dossier, register the issuer public key.

Capture:

```text
providerId=
providerRegistrationTx=
providerRegistrationBlock=
providerEpoch=
```

Do not record the issuer secret.

## 3. Bind and import holder credential

- copy the holder-binding field from the UI;
- have the issuer produce a signed credential for that binding;
- import only the signed payload into the holder session;
- confirm the UI reports the credential as loaded.

The credential `issuedAtEpoch` and `expiresAtEpoch` ABI fields carry **Unix millisecond** values.

## 4. Commit policy before proof

Use the employer Lace wallet and choose:

```text
jobScope=sr-wave1-canonical-2026-09-15-01
policyCode=2
```

Click **Commit policy before proof**.

Capture:

```text
workRequestId=
workRequestTx=
workRequestBlock=
requestExpiresAtMs=
```

Then independently confirm indexed state contains the request and policy `2`.

## 5. Holder proves the registered request

Use the `workRequestId` from step 4. Run **registered private qualification**.

Capture:

```text
verificationId=
qualificationTx=
qualificationBlock=
```

Then independently confirm:

```text
workReceiptExists=true
```

That indexed receipt check is the live gate. A transaction id alone is not sufficient.

## 6. Minimum negative evidence

Do not create unnecessary failed public transactions. The repository's compiled-circuit test suite already covers the contract-side invariants. For the live run, confirm only what is operationally safe:

- a second policy for the same employer/job is refused;
- a cancelled request stays closed;
- an expired request is refused;
- a failed qualification creates no public negative receipt.

## Stop conditions

Stop and report instead of improvising if:

- Lace is on the wrong network;
- the request expiry is accidentally supplied in seconds instead of milliseconds;
- the provider epoch does not match the credential;
- the transaction finalizes but indexed state cannot find the expected request/receipt;
- the request was committed with the wrong policy.

If the policy itself was committed incorrectly, use a **new job scope** after repair. Commit-Before-Know intentionally prevents replacing the first policy under the same employer/job scope.

## Evidence to return to Faadil

Send only these public values:

```text
network
contractAddress
providerId
providerRegistrationTx + block
jobScope
policyCode
workRequestId + tx + block
requestExpiresAtMs
verificationId + tx + block
workReceiptExists=true
```

No private claims or secrets are needed.

Full canonical procedure: [`REAL-TX-RUNBOOK.md`](REAL-TX-RUNBOOK.md).
