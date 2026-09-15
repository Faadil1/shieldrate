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

ShieldRate does more than hide the holder's data. The employer must commit the qualification standard **before** the holder proves anything.

`Employer commits policy → Holder consents → Private qualification → QUALIFIED receipt`

For one wallet-authenticated employer + job scope:

- exactly one qualification policy can be registered;
- the policy, challenge and expiry become immutable request state;
- cancelling the request closes the opportunity instead of allowing a silent policy replacement;
- a holder can publish at most one successful qualification receipt for that opportunity;
- failed qualification writes no public negative receipt.

The employer identity is derived inside Compact from `ownPublicKey()`. Proof-time callers cannot supply a fake employer scope.

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

The exact numeric thresholds are protocol rules. What stays private is the holder's underlying data, margin above a threshold, and component-level outcome.

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
9. **Monotonic provider revocation** — provider removal increments and preserves its epoch, so re-registration cannot revive epoch-0 credentials.
10. **Scoped identity** — holder pseudonyms are derived per employer + job.
11. **Pass-only publication** — failed predicates abort before ledger insertion.
12. **Independent receipt re-read** — transaction finalization alone is insufficient.
13. **No proof theatre** — demo and network-derived evidence states remain explicit.

## Judge review

Start with [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md).

Fast local verification:

```bash
npm ci
npm run verify:judge
```

Compact gate:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

CI runs Compact compilation plus Node 20 and Node 22 typecheck/tests/build. The Node 22 job also emits `npm audit` evidence; audit output is informational until the dependency-risk gate is explicitly resolved.

## Live operator path

The live setup dossier now exposes the V4 sequence directly:

1. deploy/join contract;
2. register issuer;
3. import holder-bound issuer credential;
4. **commit employer policy before proof**;
5. submit registered private qualification;
6. require indexed work-receipt confirmation.

The Midnight runtime is dynamically loaded only when live functionality is requested, so the judge-facing demo does not eagerly load the full Midnight runtime path on first interaction.

## Evidence discipline

See [`docs/CLAIMS.md`](docs/CLAIMS.md). ShieldRate does **not** currently claim:

- a completed canonical Lace / Preprod V4 request + qualification receipt;
- production issuer governance;
- production RBAC, billing or webhook infrastructure;
- that the current dependency tree is vulnerability-free;
- that a committed policy is legally fair or non-discriminatory. Commit-Before-Know proves criteria immutability, not legal validity.

## Product wedge

ShieldRate is not a generic identity/compliance engine and not a salary-verification clone. Its Wave 1 wedge is **workforce / contractor qualification with bargaining privacy and verifier-side criteria discipline**.

The employer gets a durable proof that a candidate satisfied a standard. The worker does not surrender the private data that can later be used in negotiation, and the employer cannot silently move the standard after the opportunity is opened.

## Documentation

- [`docs/JUDGE-REVIEW.md`](docs/JUDGE-REVIEW.md)
- [`docs/CLAIMS.md`](docs/CLAIMS.md)
- [`docs/COMMIT-BEFORE-KNOW.md`](docs/COMMIT-BEFORE-KNOW.md)
- [`docs/WORK-QUALIFICATION.md`](docs/WORK-QUALIFICATION.md)
- [`docs/REAL-TX-RUNBOOK.md`](docs/REAL-TX-RUNBOOK.md)
- [`docs/COMPETITIVE-INTELLIGENCE-WAVE1.md`](docs/COMPETITIVE-INTELLIGENCE-WAVE1.md)

## License

Apache-2.0. The Schnorr verification module preserves attribution for the Apache-2.0 Midnight `example-zkloan` pattern it is adapted from.
