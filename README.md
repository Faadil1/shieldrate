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

## Signature primitive — Commit-Before-Know

ShieldRate protects both sides of the decision boundary: the worker's evidence stays private, and the employer must fix the qualification rule **before** the worker proves anything.

`Employer commits policy → Holder consents → Private qualification → QUALIFIED receipt`

For one wallet-authenticated employer + job scope:

- exactly one qualification policy can be registered;
- policy, challenge and expiry become immutable public request state;
- cancelling closes the opportunity instead of permitting a silent policy replacement;
- a holder can publish at most one successful qualification receipt for that opportunity;
- refusal or failure creates no holder-specific public negative record.

The employer identity is derived inside Compact from `ownPublicKey()`. A proof-time caller cannot inject an arbitrary employer identity.

See [`docs/COMMIT-BEFORE-KNOW.md`](docs/COMMIT-BEFORE-KNOW.md).

## Private Work Qualification

The holder proves a complete fixed policy instead of answering a sequence of private attribute questions.

| Public | Private |
|---|---|
| employer-authenticated work request | raw income |
| job scope + fixed policy code | exact rating |
| request expiry | completed-job count |
| issuer/provider id | holder secret |
| QUALIFIED receipt | provider signature + credential opening |

Wave 1 policies are fixed in code:

| Policy | Public standard |
|---|---|
| `SR-WORK-01` | established work history |
| `SR-WORK-02` | proven professional |
| `SR-WORK-03` | elite track record |

The exact numeric thresholds are public protocol rules. What remains private is the holder's underlying data, margin above a threshold, and component-level outcome.

## Why the request registry matters

Many privacy systems protect credential values but still let a verifier adapt the questions it asks. ShieldRate treats **verifier behavior itself** as part of the privacy boundary.

A work request is therefore a public, wallet-authenticated commitment to the standard before any candidate proof. That creates three properties at once:

1. **bargaining privacy** — raw work data never becomes negotiating data;
2. **criteria consistency** — the employer cannot move the goalposts for that registered opportunity;
3. **failure privacy** — no candidate-specific rejection or refusal is written publicly.

Public work requests can also be audited over time without publishing applicant records. This is verifier accountability without a candidate surveillance trail.

## Trust boundary

| Mode | What it means |
|---|---|
| `DEMO_ATTESTED` | Local integrity demo using a registered demo credential. It never claims a Midnight transaction. |
| `MIDNIGHT_LIVE` | Real Lace / DApp Connector + MidnightJS execution path. The adapter deploys or joins the contract, registers providers and work requests, submits proof transactions and independently re-reads indexed state before the UI may call the result verified. |

**Current live gate:** source/runtime implementation exists, but the canonical V4 judge evidence still needs one supervised Lace run that captures a real registered work request, qualification transaction and independently indexed `workReceipts` entry. Until that artifact exists, ShieldRate is **not** described as network-validated V4 proof.

## Proof Integrity v2

1. **Issuer authenticity** — provider signs the private credential and Schnorr verification runs inside Compact.
2. **Fixed standards** — arbitrary threshold tuning is rejected.
3. **Commit-Before-Know** — employer policy is fixed on-chain before holder proof.
4. **Authenticated verifier scope** — employer identity comes from `ownPublicKey()`.
5. **Composite qualification** — one complete work policy produces one public result.
6. **Opportunity-scoped anti-probing** — one successful qualification per holder + employer + job opportunity.
7. **On-chain request expiry** — Compact checks the deadline against block time.
8. **Credential temporal validity** — future issuance is rejected and validity must cover the request window.
9. **Monotonic provider revocation** — provider removal increments and preserves its epoch, so re-registration cannot revive old epoch credentials.
10. **Scoped identity** — holder pseudonyms are derived per employer + job.
11. **Pass-only publication** — failed predicates abort before ledger insertion.
12. **Independent receipt re-read** — transaction finalization alone is insufficient.
13. **No proof theatre** — demo and network-derived evidence states remain explicit.

## Judge review

Start with [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md) and [`docs/DEMO-90S.md`](docs/DEMO-90S.md).

Fast local verification:

```bash
npm ci
npm run verify:judge
npm audit --audit-level=moderate
```

Compact gate:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

The current toolchain uses Vite `8.3.0` and Vitest `5.0.1`. The dependency-remediation validation reported **0 npm audit vulnerabilities**, and CI now treats moderate-or-higher audit findings as a failing gate on Node 22.

## Performance boundary

The Midnight live runtime is dynamically imported only when live functionality is requested. The judge-facing entry bundle dropped from roughly **1.08 MB to ~245 KB minified** in the validated V4 build; the larger Midnight runtime remains in a separate lazy chunk. Midnight WASM assets are still packaged for the live path.

## Live operator path

The live setup dossier exposes the V4 sequence directly:

1. deploy/join contract;
2. register issuer;
3. import holder-bound issuer credential;
4. **commit employer policy before proof**;
5. submit registered private qualification;
6. require indexed work-receipt confirmation.

## Evidence discipline

See [`docs/CLAIMS.md`](docs/CLAIMS.md). ShieldRate does **not** currently claim:

- a completed canonical Lace / Preprod V4 request + qualification receipt;
- production issuer governance;
- production RBAC, billing or webhook infrastructure;
- that Commit-Before-Know proves a policy is legally fair or non-discriminatory;
- that employer/job scope maps to a unique real-world requisition beyond the authenticated on-chain scope supplied by that employer.

## Product wedge

ShieldRate is not a generic identity/compliance engine and not a salary-verification clone. Its Wave 1 wedge is **workforce / contractor qualification with bargaining privacy and verifier-side criteria discipline**.

The employer gets a durable proof that a candidate satisfied a standard. The worker does not surrender the private data that can later be used in negotiation, and the employer cannot silently move the registered standard after the opportunity is opened.

## Documentation

- [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md)
- [`docs/DEMO-90S.md`](docs/DEMO-90S.md)
- [`docs/CLAIMS.md`](docs/CLAIMS.md)
- [`docs/COMMIT-BEFORE-KNOW.md`](docs/COMMIT-BEFORE-KNOW.md)
- [`docs/WORK-QUALIFICATION.md`](docs/WORK-QUALIFICATION.md)
- [`docs/REAL-TX-RUNBOOK.md`](docs/REAL-TX-RUNBOOK.md)
- [`docs/COMPETITIVE-INTELLIGENCE-WAVE1.md`](docs/COMPETITIVE-INTELLIGENCE-WAVE1.md)

## License

Apache-2.0. The Schnorr verification module preserves attribution for the Apache-2.0 Midnight `example-zkloan` pattern it is adapted from.
