# ShieldRate — timing recovery note

Date: 2026-09-15

During the first private qualification attempt against work request `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`, Compact execution stopped before submission with:

`Unexpected error executing scoped transaction '<unnamed>': Error: failed assert: credential issuance is in the future`

No qualification transaction was submitted and no work receipt/nullifier was written by this failed attempt.

The loaded credential used provider id `1`, epoch `0`, with `issuedAtEpoch = 1789522255905` (2026-09-16T01:30:55.905Z). The contract validates issuance using `blockTimeGte(credential.issuedAtEpoch)`, so the failure means the Midnight execution block time was still earlier than that credential timestamp.

The original issuer secret for provider `1` was random and intentionally not printed or persisted. Therefore a corrected credential cannot honestly be re-signed under provider `1`.

Recovery path:

1. Keep provider `1` indexed; do not rotate/remove it.
2. Create provider id `2` with a fixed local `SHIELDRATE_ISSUER_SECRET` that is never committed.
3. Issue a new credential for the same holder binding with an explicitly backdated `SHIELDRATE_ISSUED_AT_EPOCH` and provider epoch `0`.
4. Register provider `2` once, confirm indexed key/epoch, then import the matching credential.
5. Retry the existing work request if still fresh; if the request has expired, commit a new fresh job scope with policy code `2` because the existing employer/job slot is immutable.
6. Continue to private qualification and independently indexed `workReceiptExists=true`.

Do not label this as a policy failure. The credential satisfied SR-WORK-02 values; the failure was the issuance-time guard relative to Midnight block time.
