# ShieldRate Proof Integrity v1

This build removes the gap between what the UI claims and what the current runtime can prove. Until the real MidnightJS/Lace adapter is wired, the default execution mode is **DEMO_ATTESTED** and every receipt is labelled **LOCAL ONLY**.

## Integrity controls implemented

1. **Issuer-bound credential source** — the demo credential must resolve to the bundled issuer registry before a predicate can be evaluated. The Compact contract uses the stronger live pattern from Midnight’s ZK Loan example: a registered provider key verifies a private Schnorr-signed credential in-circuit, so self-reported witness values are insufficient.
2. **Anti-probing policy bands** — arbitrary threshold sliders are removed. Income, reputation, and completed-job requests must use approved bands.
3. **Scoped pseudonyms** — holder identity is derived from holder secret + employer scope + job scope, so the same holder does not expose a stable cross-employer identifier.
4. **Replay/context binding** — request hashes bind employer, job, claim, threshold, challenge, and request expiry. A request-specific nullifier prevents reuse.
5. **Verification-ID storage** — successful receipts are keyed by verification ID rather than a persistent user hash, allowing multiple proofs without overwriting a holder profile.
6. **Freshness + revocation** — credentials carry issuance/expiry metadata and request expiry is checked locally. The Compact contract requires the credential lifetime to cover the request lifetime and supports provider-epoch rotation / provider removal to invalidate previously signed credentials without disclosing a stable credential id. Per-credential private revocation accumulators are deferred beyond v1.
7. **Pass-only publication** — failed predicates generate no shareable receipt. In Compact they abort before ledger insertion.
8. **No proof theatre** — the demo does not display fake transaction hashes, fake Preprod confirmations, fake contract addresses, or fake block state. `MIDNIGHT_LIVE` fails closed until those values come from the real SDK/network.

## Trust boundary

`DEMO_ATTESTED` proves the application-level integrity flow against the bundled demo issuer registry. It is **not** a Midnight network transaction and is intentionally labelled as such.

`MIDNIGHT_LIVE` should only be enabled after all of the following are present:

- real Lace/Midnight wallet connection;
- compiled Compact artifacts;
- deployed ShieldRate contract address;
- provider/indexer/prover wiring;
- transaction submission and confirmation;
- receipt fields populated from network responses rather than UI constants.

## Next gate

**COMPILE → LOCAL CONTRACT TEST → DEPLOY PREPROD → WIRE WALLET → WIRE PROVER → LIVE RECEIPT → DEMO RECORDING**
