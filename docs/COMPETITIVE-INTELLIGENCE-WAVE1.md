# Wave 1 Competitive Intelligence — Winning Intelligence V4

Date: 2026-09-15

This is a reviewed-field intelligence record, not a claim that every public repository is an accepted AKINDO submission or that no undiscovered project shares a mechanism.

## Strong public field references reviewed

### ZK-Sentinel — `mdlog/zk-sentinel`

Public risk standard + private trading strategy/returns; strong custodian provenance, adversarial tests, replay and block-time constraints.

**Lesson:** source-level privacy claims need tamper/falsification evidence, not only happy paths.

### VINPassport — `VINPassport/VINPassport`

Privacy-preserving vehicle passport with a concrete regulatory wedge, real Preprod evidence, evaluator path and mutation testing.

**Lesson:** a buyer-specific workflow plus independently checkable deployment evidence beats broad feature count.

### Candor — `PhiBao/candor`

Verified, unlinkable, aggregate-only compensation benchmarking. Strong worker-facing thesis, Preprod flow and epoch nullifiers. Its README explicitly places multi-issuer/zkEmail in later waves.

**Collision:** do not position ShieldRate as compensation benchmarking or generic salary privacy.

### Umbra — `nelsonksh/umbra`

Blind evaluation with a memorable `Submit → Grade → Reveal` protocol.

**Lesson:** the judge should remember one protocol sequence.

### BACCHIRI! — `commun-platform/midnight_buildathons_bacchili`

Private sensor-threshold compliance with Preprod/field evidence, large tests and judge assurance artifacts.

**Lesson:** evidence packaging is part of product quality.

### ClearScope — `trinnode/clearscope`

Broad selective-disclosure/compliance SaaS with multiple roles and policy composition.

**Collision:** do not become generic selective-disclosure SaaS.

### Attesta — `ceciliagalvaoo/Attesta`

Reusable compliance attestations with live validity/revocation, chain time, Preprod evidence, detailed limitations and real usability sessions.

**Lesson:** lifecycle semantics, explicit limits and user validation are a high bar.

### Redress — `Emmanuellsensai/redress-app`

Private consumer claims/evidence with AI verdicts, commitments and a reported Preprod contract.

**Lesson:** privacy is stronger when embedded in an end-to-end domain workflow.

### VeilPass — `himanshu748/veilpass`

Private credential → public eligibility receipt with honest local-vs-Preprod limits.

**Collision:** a generic eligibility receipt is not enough differentiation for ShieldRate.

## White-space analysis

### 1. Commit-Before-Know — exploited in V4

The reviewed field contains strong holder-side privacy, credential validity, revocation and selective-disclosure systems. We did **not surface another reviewed public Wave 1 project centered on a wallet-authenticated employer fixing hiring/contractor criteria before the candidate proof**.

ShieldRate now implements this in Compact:

`Employer commits policy → Holder consents → Private qualification → QUALIFIED`

The work request fixes one policy for one employer/job scope. Cancelling does not free that scope for a hidden replacement.

### 2. Failure privacy — exploited in V4

Many verification products focus on what a successful proof discloses. ShieldRate also treats **the absence of qualification** as sensitive.

A failed or declined qualification leaves no holder-specific public rejection record. The employer request can be public; the candidate appears only through a successful scoped qualification receipt.

### 3. Verifier accountability without applicant surveillance — exploited in V4

Employer standards are public request objects, while candidate evidence and failed attempts are not. This means policy history can be audited independently of applicant records.

This creates a useful asymmetry:

- auditors can inspect what standards an employer committed;
- they do not need candidate salary/reputation/job-count data;
- they do not get a public list of rejected workers.

### 4. Opportunity-scoped privacy budget — exploited in V4

The work nullifier is holder + authenticated employer + job scope. It excludes challenge and policy code. A successful proof therefore consumes the public qualification budget for that opportunity instead of letting a verifier repeatedly interrogate the same candidate under new request parameters.

### 5. Federated/multi-source work evidence — high-value future white space

The reviewed field did not surface a Wave 1 project composing multiple independent work-data issuers into one private hiring qualification proof. Candor explicitly lists multi-issuer as later-wave work.

ShieldRate does **not** claim this today. The current V4 credential is signed by one registered provider. This is the clearest next protocol expansion after the canonical V4 Preprod proof is locked: independent income/reputation/work-history issuers bound to the same holder secret and composed into one qualification proof.

We deliberately do not destabilize the Wave 1 canonical proof path by claiming unfinished federation as shipped.

## Strategic decision

ShieldRate's Wave 1 wedge is:

**private workforce / contractor qualification with bargaining privacy and verifier-side criteria discipline.**

The flagship question is not:

- “Is salary above X?”
- “Can I selectively disclose any credential?”
- “Can I benchmark compensation?”

It is:

> **What standard did this employer commit before seeing my outcome, and can I prove privately that I satisfy it?**

The public output is a scoped `QUALIFIED` receipt. Raw work data, margin above thresholds and component outcomes stay private.

## Hidden spots found and disposition

| Hidden spot | Risk | V4 action |
|---|---|---|
| Proof-time employer scope was caller supplied | verifier spoofing | employer identity now derives from `ownPublicKey()` |
| Fixed bands still allowed adaptive valid queries | cumulative privacy leakage | immutable composite work request |
| Policy-specific nullifier allowed switching policies | repeated probing | opportunity-scoped nullifier |
| Provider removal could reset epoch on re-registration | old credential resurrection | preserve + increment provider epoch on removal |
| Request expiry depended too heavily on DApp | weak trust boundary | block-time enforcement in Compact |
| Successful tx id could be mistaken for receipt proof | false verification | independent indexed `workReceiptExists` required |
| Default bundle eagerly loaded Midnight runtime | slow judge first impression | dynamic runtime import; entry JS reduced materially |
| Vite/Vitest audit findings | avoidable supply-chain noise | upgrade to Vite 8.3.0 / Vitest 5.0.1; remediation audit = 0 |
| Generic SaaS breadth collided with field | weak memorability | signature protocol now dominates product thesis |

## Remaining honest limits

- An authenticated `jobScope` is not proof that two different IDs cannot refer to the same real-world requisition.
- One registered provider currently attests the composite credential; federated field issuers are future work.
- A fixed policy is not automatically a lawful/fair policy.
- V4 still needs the canonical real Lace/Preprod request + qualification + indexed receipt evidence bundle.

## Next competitive bar

1. final source/dependency CI green;
2. real registered work request on Midnight;
3. real private qualification transaction;
4. independent indexed receipt capture;
5. judge-facing demo built around `COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`;
6. only then reopen the deeper TRACE UI/UX redesign.
