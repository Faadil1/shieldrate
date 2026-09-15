# ShieldRate — Canonical Lace / Real Transaction Runbook

Status: `PENDING_OPERATOR_RUN`
Owner: Opeyemi / operator with Lace + funded Midnight environment

This runbook exists so the final live claim is promoted from evidence, not inference.

## Gate

A passing build is not enough. A transaction id is not enough. ShieldRate may call V4 `NETWORK_VERIFIED` only after all of the following are captured from one coherent run:

1. Lace connected to the intended Midnight network.
2. ShieldRate contract deployed or joined.
3. Attestation provider registered.
4. Holder binding established.
5. Provider-signed credential loaded into private state.
6. `verifyWorkPolicy` submitted for a fresh employer/job scope.
7. Transaction finalized.
8. Expected work verification id derived locally.
9. `workReceiptExists(verificationId)` returns true from independently queried contract state.
10. Contract address, tx id and block height are recorded.

## Recommended policy for the canonical run

Use `SR-WORK-02` (`policyCode = 2`) because the current demo credential satisfies it while `SR-WORK-03` does not. Use a brand-new job scope for the live run so the scope-stable policy nullifier has never been consumed.

## Operator sequence

### A. Environment

- Open the V4 build in a browser with Lace installed.
- Confirm the displayed execution mode is `MIDNIGHT_LIVE`.
- Confirm Lace reports the intended network.
- Confirm proof-server / provider endpoints are reachable.

### B. Contract

Either:

- deploy a fresh ShieldRate contract and copy the resulting address, or
- join the agreed canonical contract address.

Record:

```text
network=
contractAddress=
deployedOrJoined=
operatorTimestamp=
```

### C. Provider

Register the canonical test issuer/provider id and public key.

Record:

```text
providerId=
providerRegistrationTx=
providerRegistrationBlock=
```

Do not record the issuer private key.

### D. Credential

Load the provider-signed credential into holder private state. Confirm the holder binding used by the issuer matches the active holder secret.

Never paste the holder secret or issuer private key into an evidence file.

### E. Qualification request

Use:

```text
policyCode=2
employerScope=<fresh canonical employer scope>
jobScope=<fresh canonical job scope>
challenge=<fresh random challenge>
requestExpiresAtEpoch=<short future deadline>
```

Submit `verifyWorkPolicy`.

### F. Evidence capture

After finalization, record only public evidence:

```text
verificationId=
requestHash=
scopedSubject=
policyCode=2
providerId=
txId=
blockHeight=
contractAddress=
indexedReceiptExists=true
```

Then independently query the contract state / indexer path and confirm the expected `verificationId` is present in `workReceipts`.

## Failure rules

If any step fails:

- do not create a `NETWORK_VERIFIED` evidence record;
- preserve the error and step name;
- keep `docs/CLAIMS.md` at `LIVE_PENDING`;
- repair the path and run again with a fresh job scope where required.

A failed qualification attempt should not create a public negative work receipt.

## Evidence file after success

Only after a successful run, add something like:

`evidence/network/V4-WORK-POLICY-PREPROD-<YYYY-MM-DD>.md`

It should contain the public fields above plus exact reproduction steps. Do not include secrets, seed phrases, raw credential values or private signatures.

After that file is committed and independently checked, update `docs/CLAIMS.md`:

`V4 work qualification has a canonical real Lace transaction → NETWORK_VERIFIED`
