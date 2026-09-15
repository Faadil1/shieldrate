<p align="center">
  <img src="assets/logo.svg" alt="ShieldRate logo" width="440" />
</p>

<p align="center">
  <em>Prove your worth. Reveal nothing.</em><br>
  Privacy-preserving work credentials for freelancers on <strong>Midnight</strong>.
</p>

# ShieldRate

ShieldRate lets a freelancer prove that an **issuer-attested** work fact satisfies an employer policy — for example, income above a standard band, rating above a minimum, or completed jobs above a threshold — without sharing the raw credential.

Built for **Midnight Buildathon — Wave 1**.

## Current trust boundary

ShieldRate now has two explicit execution modes:

| Mode | What it means |
|---|---|
| `DEMO_ATTESTED` | Local integrity demo. The UI exercises issuer registration, fixed policy bands, scoped pseudonyms, request binding, anti-replay nullifiers, freshness checks and pass-only receipts. It does **not** claim a Midnight transaction. |
| `MIDNIGHT_LIVE` | Reserved for the real MidnightJS/Lace + deployed Compact adapter. It currently fails closed until genuine network receipts are available. |

**The public demo must never display a fake transaction hash, fake contract address, fake block confirmation, or fake “Preprod confirmed” state.**

## Proof Integrity v1

The first integrity build closes eight gaps from the original prototype:

1. **Issuer authenticity** — self-reported witness values are not enough. The live Compact design follows Midnight's ZK Loan attestation pattern: a registered provider signs a private credential and the Schnorr signature is verified inside the circuit.
2. **Anti-probing policies** — employers choose from standardized bands instead of arbitrary sliders, reducing binary-search leakage.
3. **Scoped identity** — the holder pseudonym is derived per employer + job, so there is no reusable cross-employer identifier in a receipt.
4. **Context binding + anti-replay** — employer, job, claim, threshold, challenge and expiry are bound into the request hash; a request-specific nullifier prevents replay.
5. **Verification-ID storage** — receipts are keyed by verification ID, not by a persistent user hash, so multiple proofs do not overwrite a public holder profile.
6. **Freshness + revocation** — credentials carry issuance/expiry metadata. The DApp rejects expired requests; the Compact contract requires credential validity to cover the request window and supports provider epoch rotation/removal for revocation in v1.
7. **Pass-only publication** — a failed predicate creates no shareable receipt; the Compact circuit aborts before ledger insertion.
8. **No proof theatre** — demo and live states are visibly different. Network claims appear only when returned by the real adapter.

See [`docs/PROOF-INTEGRITY-V1.md`](docs/PROOF-INTEGRITY-V1.md) for the security model and remaining live-network gate.

## Canonical demo flow

1. Open ShieldRate and connect the **demo wallet**.
2. Choose an income, reputation or completed-jobs claim.
3. Select one of the approved policy bands.
4. ShieldRate binds the request to the demo employer/job, creates a fresh challenge and expiry, and derives a scoped subject + nullifier.
5. The local demo issuer credential is validated.
6. If the predicate fails, the result stays local and no receipt is produced.
7. If it passes, ShieldRate shows a `DEMO_ATTESTED · LOCAL ONLY` receipt containing only the scoped proof metadata.

No step in this demo is presented as a real Midnight transaction.

## Compact contract

`contracts/shieldrate.compact` targets Compact language `>= 0.22 && <= 0.23` / toolchain `0.31.x` and imports `contracts/schnorr.compact`, adapted from Midnight's Apache-2.0 `example-zkloan` Schnorr verification module.

The contract contains:

- registered attestation providers (`providerId → JubjubPoint`);
- provider epochs for revocation without a stable per-holder credential id;
- in-circuit verification of a private provider-signed credential;
- fixed threshold policy bands;
- employer/job scoped holder pseudonyms;
- challenge-bound request hashes;
- anti-replay nullifiers;
- pass-only `VerificationReceipt` storage keyed by verification ID.

The CI workflow now contains a real Compact compiler gate instead of checking whether the source merely contains the words `ledger`, `witness`, and `circuit`.

## Project structure

```text
.
├── contracts/
│   ├── shieldrate.compact      # Proof Integrity v1 contract
│   └── schnorr.compact         # Schnorr verification module (Apache-2.0 source pattern)
├── docs/
│   └── PROOF-INTEGRITY-V1.md   # security model / trust boundary
├── state/
│   ├── CURRENT.md              # canonical current state
│   └── HANDOVER.md             # continuation instructions
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── hooks/
│   │   ├── useWallet.ts        # demo wallet / fail-closed live adapter
│   │   └── useContract.ts      # integrity adapter / local replay guard
│   ├── security/
│   │   └── integrity.ts        # policies, issuer registry, scoping, request/nullifier logic
│   └── utils/
│       └── proofGenerator.ts   # pass-only local demo proof flow
└── tests/
    └── shieldrate.test.ts      # integrity behavior tests
```

## Run the web app

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

By default, the app uses `DEMO_ATTESTED`.

Do **not** set `VITE_SHIELDRATE_MODE=midnight-live` until the actual wallet, generated Compact module, deployment, provider/indexer/prover and network receipt mapping are wired. Live mode intentionally fails closed before that gate.

## Compile the Compact contract

Use the toolchain compatible with the current ledger-8 / 0.31.x environment:

```bash
compact update 0.31.1
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

CI performs the same compile gate.

## What is still required for `MIDNIGHT_LIVE`

- real Lace/Midnight wallet connection;
- generated contract bindings from a successful Compact build;
- deployed ShieldRate contract address;
- registered attestation provider + signing service;
- prover/provider/indexer wiring;
- real transaction submission and confirmation;
- receipt fields populated from network responses;
- independent verification link/receipt for the judge demo.

Until those items exist, ShieldRate remains deliberately labelled **DEMO_ATTESTED**, not “live on Midnight.”

## License

Apache-2.0. The Schnorr verification module preserves the attribution/source note for the Apache-2.0 Midnight `example-zkloan` pattern it is adapted from.
