# Wave 1 Competitive Intelligence — Winning Intelligence V4

Date: 2026-09-15

This document is strategy input, not a claim that every public Midnight repository is an accepted AKINDO submission. Projects below are included only where the repository itself identifies the Midnight Buildathon/Wave 1 or the current public work is directly relevant to the competitive field.

## Field read

### ZK-Sentinel — `mdlog/zk-sentinel`

Signature: prove a trading strategy cleared a public risk bar on custodian-attested data without revealing strategy or returns.

High-signal strengths:

- 48 tests against real compiled circuits;
- explicit public/private dual-ledger test;
- deliberate witness-tampering attacks;
- registered data custodian;
- replay + block-time freshness;
- independent Python arithmetic reference;
- clear exact claims and non-claims.

Lesson for ShieldRate: source-level privacy claims need adversarial tests and exact evidence, not only happy paths.

### VINPassport — `VINPassport/VINPassport`

Signature: a privacy-preserving vehicle passport tied to a concrete regulatory wedge.

High-signal strengths:

- deployed Midnight Preprod contract with committed deployment evidence;
- live buyer/intake/proof-explorer surfaces;
- 67 contract tests + app + SDK assertions;
- mutation tests showing guards actually matter;
- explicit evaluator path;
- blockchain abstracted away from the end user;
- regulatory/business urgency.

Lesson for ShieldRate: a real Preprod receipt and a buyer-specific workflow are stronger than broad SaaS breadth.

### Candor — `PhiBao/candor`

Signature: verified, unlinkable, aggregate-only compensation benchmarking.

High-signal strengths:

- current compensation/privacy wedge;
- epoch nullifiers;
- aggregate histograms;
- clear worker-facing market thesis and growth loop;
- claimed end-to-end Preprod path with explicit hosted-prover caveat.

Collision risk: ShieldRate should not lead with generic salary verification or compensation analytics.

### Umbra — `nelsonksh/umbra`

Signature: blind evaluation with `Submit → Grade → Reveal`.

High-signal strengths:

- memorable three-step protocol;
- clear reason blockchain/privacy is necessary;
- real-network local smoke test with proofs and block confirmations;
- browser/Lace frontend;
- focused security tests and evaluator instructions.

Lesson for ShieldRate: the judge should remember one signature behavior, not a menu of capabilities.

### BACCHIRI! — `commun-platform/midnight_buildathons_bacchili`

Signature: prove measurement threshold compliance without exposing sensor values.

High-signal strengths:

- eight-circuit contract deployed to Preprod;
- field-operation evidence;
- claim-to-evidence matrix and judge Q&A;
- review runbook;
- large automated test surface;
- operating/cost evidence and partner context.

Lesson for ShieldRate: judge assurance is itself part of product quality.

### ClearScope — `trinnode/clearscope`

Signature: general selective-disclosure policy layer with holder/verifier/issuer/system personas.

High-signal strengths:

- composed disclosure policies;
- multi-role SaaS console;
- access/licensing model;
- demo personas and guided walkthrough;
- broad compliance positioning.

Collision risk: ShieldRate should not become a generic selective-disclosure or generic compliance SaaS platform.

## Strategic decision

ShieldRate's defensible Wave 1 wedge is:

**private workforce / contractor qualification with bargaining privacy.**

The flagship question is not:

- "Is salary above X?"
- "Can I selectively disclose any attribute?"
- "Can I benchmark compensation?"

It is:

> **Does this issuer-attested worker satisfy the fixed qualification standard for this specific opportunity?**

The answer is one public `QUALIFIED` receipt. The worker does not expose exact financial or reputation data, and the employer cannot learn component-level pass/fail outcomes by decomposing the standard.

## Hidden spots found and disposition

| Hidden spot | Field consequence | V4 action |
|---|---|---|
| Request expiry only enforced in DApp | below strong Compact competitors | enforce with block time in circuit |
| Fixed bands still permit repeated valid probing | cumulative privacy leak | composite policy + scope-stable policy nullifier |
| Income proof as headline collides with prior/current privacy products | weak uniqueness | reposition to private work qualification |
| Enterprise V3 breadth risks ClearScope collision | generic SaaS framing | keep breadth as architecture; make work qualification the signature primitive |
| README stale after live adapter merge | judge confusion / trust loss | rewrite current trust boundary |
| No evaluator evidence map | weaker QA story | add Judge Review + Claim Ledger |
| No canonical network receipt for V4 | weaker than Preprod leaders | explicit real-tx gate/runbook |
| Dependency audit previously reported vulnerabilities | hidden reliability risk | keep open in claim ledger; remediate separately, never call clean |

## Next competitive bar

Do not spend the next cycle adding more menu items. The next win condition is:

1. `verifyWorkPolicy` source + CI green;
2. adversarial/privacy tests green;
3. real Lace/Preprod transaction captured;
4. independently indexed receipt captured;
5. only then redesign UI around the signature behavior.

The UI should eventually dramatize one memorable sequence: **Request → Consent → Private qualification → Qualified receipt**, not the existence of ten SaaS navigation items.
