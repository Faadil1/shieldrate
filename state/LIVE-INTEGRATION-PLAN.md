# ShieldRate — Midnight Live Integration v1

Status: `INTERACTIVE_LIVE_GATE_PENDING`

Repository: `Faadil1/shieldrate`
Branch: `midnight-live-integration-v1`

Goal: replace the fail-closed `MIDNIGHT_LIVE` placeholder with a real, evidence-backed Midnight path without weakening Proof Integrity v1.

## Gate state

1. **COMPILE_ASSETS — PASS**
   - Compact compiler 0.31.1 generates the managed TypeScript contract module plus prover/verifier keys and ZKIR assets.
   - CI persists those generated assets and feeds them into Node 20/22 verification jobs.

2. **LACE_CONNECT — IMPLEMENTED / INTERACTIVE CHECK PENDING**
   - Browser adapter uses Midnight DApp Connector API 4.x through `window.midnight`.
   - Requested network must exactly match the Lace connection status.
   - Prover/indexer endpoints and shielded public keys come from Lace configuration; no endpoints or wallet state are faked.

3. **PROVIDERS — IMPLEMENTED / BUILD-VALIDATED**
   - MidnightJS 4.1.1 providers are initialized for proof, public data/indexer, wallet balancing, submission, ZK config and private state.
   - `FetchZkConfigProvider` loads real generated `keys/` + `zkir/` assets from the deployed site origin.

4. **DEPLOY_OR_JOIN — IMPLEMENTED / INTERACTIVE CHECK PENDING**
   - UI Settings exposes explicit deploy/join actions.
   - Contract private state is scoped only after a real contract address exists.

5. **ISSUER ATTESTATION — IMPLEMENTED / INTERACTIVE CHECK PENDING**
   - Provider registration is an admin circuit transaction using only provider ID + Jubjub public key on-chain.
   - Browser exposes only a derived `holderBindingField` to the issuer; it never sends `holderSecret`.
   - `scripts/issue-demo-credential.mjs` signs the seven-field credential message using the exact generated Compact challenge helper.
   - Issuer secret is never printed or committed.

6. **REAL_TX — PENDING**
   - One canonical `verifyClaim` must be executed through Lace on the chosen Midnight network.
   - The real transaction ID and block height must be captured.

7. **RECEIPT — IMPLEMENTED / REAL_TX VALIDATION PENDING**
   - After transaction finalization, ShieldRate independently queries indexed contract state and requires the expected `verificationId` receipt to exist.
   - UI exposes live contract address, transaction ID, block height and request evidence only after that independent lookup succeeds.
   - Failed predicates produce no shareable receipt.

8. **LIVE_GATE — CLOSED**
   - Do not merge or advertise the branch as network-validated until REAL_TX + indexed receipt succeed.

## Current security boundary

- No wallet mnemonic, seed, issuer private key, holder secret or admin secret is committed to GitHub.
- Holder/admin secrets are session-only in the browser for this v1 integration prototype; closing the browser tab destroys them. This is safer than plaintext persistent storage but is not the final production private-state persistence design.
- A production version needs encrypted/recoverable private-state storage before long-lived credentials/admin operations are claimed.
- The issuer receives only `holderBindingField`, never `holderSecret`.
- A receipt is marked verified only after transaction finalization and independent indexed-ledger confirmation.

## Canonical live scenario

Employer requests an approved income band -> holder consents -> issuer-attested private credential satisfies the Compact circuit -> real Midnight proof/transaction -> expected receipt exists in indexed ledger state -> raw income and stable credential identity remain undisclosed.

## Next interactive gate

1. Open the candidate build in a desktop browser with a compatible Midnight Lace extension.
2. Set execution mode to `midnight-live` / network `preprod` for the candidate build.
3. Connect Lace.
4. Deploy ShieldRate (or join a known test contract).
5. Copy only the displayed `holderBindingField` into the dev issuer command.
6. Register the issuer public key on-chain.
7. Import the resulting signed credential payload.
8. Submit the canonical income proof.
9. Require a real `txId`, block height and positive indexed receipt lookup before advancing `LIVE_GATE`.
