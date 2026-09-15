# Private Work Qualification

## Product thesis

ShieldRate's signature behavior is not "prove salary above X." It is:

> **Prove you qualify for the work. Do not reveal why.**

An employer or procurement team publishes a fixed work standard. The holder proves that an issuer-attested private work profile satisfies the whole standard. The verifier receives one positive receipt and no component-level disclosure.

## Why this is stronger than separate attribute proofs

Separate threshold proofs leak information cumulatively. Even when each request uses an approved band, repeated requests can reveal a coarse interval or which private dimension is weak.

The V4 work-policy path reduces that attack surface in two ways:

1. **Composite output** — income, rating and completed-job checks are evaluated together; only `QUALIFIED` is publishable.
2. **Scope-stable nullifier** — the nullifier derives from holder + employer + job + policy, not the request challenge. Reissuing the same policy with a new challenge cannot create a second receipt for the same scope.

The request hash still includes the challenge and expiry so the actual request is context-bound.

## Wave 1 policies

The numeric rules are public and fixed in Compact. They are standards, not secrets.

| Code | ID | Income | Rating | Jobs | Public result |
|---|---|---:|---:|---:|---|
| 1 | `SR-WORK-01` | > 40,000 | ≥ 4.0 | ≥ 50 | QUALIFIED |
| 2 | `SR-WORK-02` | > 50,000 | ≥ 4.5 | ≥ 100 | QUALIFIED |
| 3 | `SR-WORK-03` | > 80,000 | ≥ 4.9 | ≥ 200 | QUALIFIED |

These values are demonstration standards for Wave 1, not claims about universal hiring best practice.

## Privacy boundary

### Public

- employer scope
- job scope
- policy code
- request hash
- scoped subject
- provider id
- request expiry
- successful receipt id

### Private

- exact income
- exact rating
- exact completed-job count
- holder secret
- provider signature
- credential opening

### Not published on failure

- which component failed
- how far it failed by
- a negative worker profile
- a reusable cross-employer identity

## Contract path

`verifyWorkPolicy(...)` performs, in order:

1. policy-code validation;
2. on-chain request-expiry check;
3. registered-provider and epoch checks;
4. future-issued credential rejection;
5. credential validity across the request window;
6. holder binding + provider Schnorr verification;
7. all three private qualification checks;
8. request hash + employer/job scoped subject;
9. scope-stable work-policy nullifier and replay/probing guard;
10. one `WorkQualificationReceipt` insertion.

A failure before step 10 writes no receipt.

## Why Midnight is central

A normal database can return `qualified=true`, but the employer must trust whoever runs that database to have checked the right private values and the worker must trust that operator not to retain them.

ShieldRate uses Midnight to make the public receipt the result of an enforceable private computation against issuer-attested inputs. The public side receives a durable verification object while the sensitive work profile remains in private state.

That asymmetry — durable public qualification, private underlying evidence — is the product.
