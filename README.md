<p align="center">
  <img src="assets/logo.svg" alt="ShieldRate logo" width="440" />
</p>

<p align="center">
  <strong>Prove you qualify for the work. Do not reveal why.</strong><br>
  Issuer-attested private work qualification on <strong>Midnight</strong>.
</p>

# ShieldRate

ShieldRate lets a freelancer or contractor prove that an **issuer-attested work profile satisfies a fixed employer qualification policy** without revealing raw income, exact rating, completed-job count, or which component carried the decision.

Built for **Midnight Buildathon — Wave 1**.

## The flagship primitive: Private Work Qualification

The original ShieldRate prototype proved one attribute at a time. Winning Intelligence V4 turns that into a stronger product primitive:

> An employer asks one scoped question — **does this holder satisfy SR-WORK-02 for this job?** — and receives one public answer: **QUALIFIED**.

The holder proves all required facts together inside Compact. A failed policy creates no public negative receipt.

| Public | Private |
|---|---|
| employer/job scope | raw income |
| fixed policy code | exact rating |
| request expiry | completed-job count |
| issuer/provider id | holder secret |
| QUALIFIED receipt | provider signature + credential opening |

Wave 1 policies are fixed in code so a verifier cannot tune a custom bundle around one person:

| Policy | Public standard |
|---|---|
| `SR-WORK-01` | established work history |
| `SR-WORK-02` | proven professional |
| `SR-WORK-03` | elite track record |

The exact numeric thresholds are public protocol rules. What remains private is the holder's underlying data, margin above a threshold, and any component-level outcome.

### Why the composite proof matters

A sequence of valid single-attribute requests can still become a privacy attack. ShieldRate's work-policy nullifier is stable for **holder + employer + job + policy**, so issuing the same policy again with a fresh challenge cannot be used as a repeated probe. The request hash still binds employer, job, policy, challenge and expiry for integrity.

## Trust boundary

ShieldRate has two explicit execution modes:

| Mode | What it means |
|---|---|
| `DEMO_ATTESTED` | Local integrity demo using a registered demo credential. It never claims a Midnight transaction. |
| `MIDNIGHT_LIVE` | Real Lace / DApp Connector + MidnightJS execution path. The adapter deploys or joins the Compact contract, registers providers, submits proof transactions and independently re-reads the indexed receipt before the UI may call the result verified. |

**Current live gate:** the adapter is implemented and compiles, but the canonical judge evidence still needs one supervised interactive run on Lace that captures a real transaction and independently indexed receipt. Until that artifact exists, ShieldRate is **not** described as network-validated live proof.

## Proof Integrity v2

The current contract closes the major integrity and privacy gaps from the original prototype:

1. **Issuer authenticity** — the provider signs the private credential and the Schnorr signature is verified inside Compact.
2. **Fixed standards** — arbitrary threshold tuning is rejected.
3. **Composite qualification** — the flagship path proves a whole work policy and publishes one result instead of component verdicts.
4. **Scoped identity** — holder pseudonyms are derived per employer + job.
5. **Challenge/context binding** — request hashes bind the verifier context.
6. **Anti-replay / anti-probing** — legacy claims use request nullifiers; work policies use a scope-stable policy nullifier.
7. **On-chain request expiry** — Compact checks the request deadline against block time.
8. **Credential temporal validity** — future issuance is rejected and credential validity must cover the request window.
9. **Provider revocation** — provider epoch rotation invalidates prior credentials without exposing a stable credential id.
10. **Pass-only publication** — failed predicates abort before ledger insertion.
11. **Independent receipt re-read** — a finalized transaction id alone is not enough for live verification.
12. **No proof theatre** — demo and live evidence states remain explicit.

## Compact contract

`contracts/shieldrate.compact` targets Compact language `>= 0.22 && <= 0.23` / compiler `0.31.1`.

Public state includes:

- registered provider public keys;
- provider epochs;
- used nullifiers;
- legacy single-claim receipts;
- composite work-qualification receipts;
- verification counters.

The two proof paths are:

- `verifyClaim(...)` — retained for compatibility and narrow evidence requests;
- `verifyWorkPolicy(...)` — the flagship all-or-nothing private qualification primitive.

## Judge review path

Start with [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md). It separates source-verified claims from live-network evidence that is still pending.

Fast local verification:

```bash
npm ci
npm run verify:judge
```

Compact compile gate:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

CI runs Compact compilation plus Node 20 and Node 22 typecheck/tests/build.

## Midnight Live integration

The live path contains:

- Lace / DApp Connector integration;
- MidnightJS `4.1.1` providers;
- deploy / join contract flow;
- provider registration, epoch rotation and removal;
- signed private credential import;
- real `verifyClaim` and `verifyWorkPolicy` transaction methods;
- post-finalization indexed receipt lookup;
- proving assets packaged with the web build.

The remaining interactive run is documented in [`docs/REAL-TX-RUNBOOK.md`](docs/REAL-TX-RUNBOOK.md).

## Evidence discipline

ShieldRate intentionally separates what exists from what is planned. See [`docs/CLAIMS.md`](docs/CLAIMS.md) for the claim ledger.

In particular, the project does **not** currently claim:

- a completed canonical Lace / Preprod receipt for the V4 work-policy circuit;
- production issuer infrastructure;
- production RBAC, team management, billing or webhook integrations shown as product architecture previews;
- that the current dependency tree is vulnerability-free.

## Product wedge

ShieldRate is not a generic identity or compliance engine. Its Wave 1 wedge is **workforce / contractor qualification with bargaining privacy**:

- employer or procurement team defines a standard;
- an attested worker proves they qualify for a specific opportunity;
- the employer gets a reusable audit receipt, not the worker's private profile;
- the worker does not reveal exact financial or reputation data to enter the hiring funnel.

That product boundary is what keeps ShieldRate distinct from general-purpose selective-disclosure systems and compensation benchmarking products.

## Documentation

- [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md) — shortest evaluator path
- [`docs/CLAIMS.md`](docs/CLAIMS.md) — claim → evidence → status ledger
- [`docs/WORK-QUALIFICATION.md`](docs/WORK-QUALIFICATION.md) — flagship privacy primitive
- [`docs/REAL-TX-RUNBOOK.md`](docs/REAL-TX-RUNBOOK.md) — Lace / real transaction evidence capture
- [`docs/COMPETITIVE-INTELLIGENCE-WAVE1.md`](docs/COMPETITIVE-INTELLIGENCE-WAVE1.md) — field analysis and differentiation decisions
- [`docs/PROOF-INTEGRITY-V1.md`](docs/PROOF-INTEGRITY-V1.md) — original integrity foundation

## License

Apache-2.0. The Schnorr verification module preserves attribution for the Apache-2.0 Midnight `example-zkloan` pattern it is adapted from.
