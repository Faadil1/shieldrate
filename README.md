<p align="center">
  <img src="assets/logo.svg" alt="Criterion logo" width="440" />
</p>

<p align="center">
  <strong>Prove you qualify. Reveal nothing you do not owe.</strong><br>
  Commit-Before-Know private work qualification on <strong>Midnight</strong>.
</p>

# Criterion

Criterion lets an employer fix a qualification standard **before** a worker proves anything, then lets an issuer-attested worker prove that they qualify without publishing raw income, exact rating, completed-job count, or a public rejection trail.

Built for **Midnight Buildathon — Wave 1**.

> Technical continuity: the repository, Compact contract, storage keys and some protocol identifiers retain the historical `shieldrate` / `SR-*` namespace so the already-deployed contract and evidence chain remain unchanged. **Criterion** is the judge-facing product name.

## The one sentence

**The employer commits the criteria first. The worker proves qualification privately. Only a positive scoped receipt becomes public.**

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Why it is different

Most private-credential systems focus on hiding the answer. Criterion also constrains the question.

For one employer scope + job scope:

- one qualification policy is fixed before holder proof;
- policy, challenge and expiry become immutable request state;
- cancelling does not reopen the job for a replacement policy;
- the holder proves the already-registered policy, not a proof-time threshold;
- a failed/refused qualification writes no holder-specific public negative receipt;
- a successful qualification produces one opportunity-scoped public receipt.

This creates a second privacy boundary: **the verifier cannot silently move the standard after seeing the candidate outcome.**

## Network-verified canonical run

Status: **`NETWORK_VERIFIED`** on Midnight Preprod.

| Evidence | Canonical value |
|---|---|
| Contract | `c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2` |
| Provider | `2`, epoch `0` |
| Provider registration tx | `00f51998e02cad86df03e65954de9c5ae53191f749ce71b11b74ebf260ecf79ea2` |
| Provider registration block | `2568791` |
| Job scope | `sr-wave1-canonical-2026-09-15-03` |
| Policy | `SR-WORK-02` / code `2` |
| Work request | `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1` |
| Commit tx | `00a18b7182d20be241c81d1de17bfa8d1d84d1621c2da921b27a8714b57e0a8eee` |
| Commit block | `2575087` |
| Verification | `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1` |
| Qualification tx | `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836` |
| Qualification block | `2575167` |
| Indexed receipt | expected verification id confirmed in `workReceipts` before the UI returned `QUALIFIED` |

Full public evidence bundle: [`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`](evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md).

No raw credential or issuer secret is included in that bundle.

## What stays private

| Public | Private |
|---|---|
| employer/job-scoped request | raw income |
| fixed policy code | exact rating |
| request expiry | completed-job count |
| provider id / epoch | holder secret |
| `QUALIFIED` receipt | signed credential opening |

Wave 1 policies remain fixed protocol rules:

| Policy | Public standard |
|---|---|
| `SR-WORK-01` | established work history |
| `SR-WORK-02` | proven professional |
| `SR-WORK-03` | elite track record |

## Integrity gates

1. Provider-signed credential is verified in Compact.
2. Arbitrary threshold tuning is rejected; only fixed policy codes are accepted.
3. Employer/job policy is committed before proof.
4. Request and credential time checks use **Unix seconds** on the live Preprod path.
5. Credential validity must cover the registered request window.
6. Holder subject is scoped to employer + job.
7. Work nullifier is opportunity-scoped.
8. Failed qualification aborts before receipt insertion.
9. Transaction finalization alone is insufficient: the expected receipt is re-read from indexed ledger state before the UI reports success.

## Judge path

Start here:

1. [`docs/DEMO-90S.md`](docs/DEMO-90S.md) — recording script.
2. [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md) — falsification-first technical review.
3. [`evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md`](evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-2026-09-16.md) — canonical network evidence.
4. [`contracts/shieldrate.compact`](contracts/shieldrate.compact) — Compact source.
5. [`docs/COMMIT-BEFORE-KNOW.md`](docs/COMMIT-BEFORE-KNOW.md) — protocol rationale.

Local verification:

```bash
npm ci
npm run verify:judge
npm audit --audit-level=moderate
```

Compact:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

## Truth boundary

Criterion is network-verified for the canonical Preprod run above. It does **not** claim production issuer governance, production RBAC/billing/webhooks, legal fairness of a committed policy, or that a job-scope identifier uniquely maps to a real-world requisition outside the protocol.

The current contract derives its employer scope from the Midnight public-key context exposed through `ownPublicKey()`. A future hardening step should move authorization-sensitive identity to a secret-witness-derived scheme rather than treating that helper as a production authentication boundary.

## License

Apache-2.0. The Schnorr verification module preserves attribution for the Apache-2.0 Midnight `example-zkloan` pattern it is adapted from.
