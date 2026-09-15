# ShieldRate — Judge Review Guide

Status: `SOURCE_CANDIDATE / LIVE_RECEIPT_PENDING`

This is the shortest path for evaluating ShieldRate without relying on presentation claims.

## 1. Product claim in one sentence

**ShieldRate proves that an issuer-attested worker satisfies a fixed employer qualification policy for one opportunity, while revealing neither the underlying work data nor any component-level result.**

The flagship circuit is `verifyWorkPolicy` in `contracts/shieldrate.compact`.

## 2. What is actually implemented

### Source-verifiable now

- Compact contract compiles on compiler 0.31.1.
- Provider-signed private credentials are verified in-circuit with Schnorr.
- Holder identity is scoped to employer + job.
- Work policy requests bind employer, job, policy, challenge and expiry.
- Work-policy nullifiers are stable per holder + employer + job + policy, preventing a verifier from bypassing repeat protection merely by changing the challenge.
- Request expiry is enforced against Midnight block time.
- Future-issued credentials are rejected against block time.
- Provider epoch rotation/removal supports coarse credential revocation.
- Failed qualification creates no public receipt.
- A successful work-policy receipt contains policy metadata but no raw income/rating/jobs and no component-level verdict.
- MidnightJS live adapter deploys/joins, calls proof circuits and re-reads the indexed ledger receipt before returning a verified result.

### Not yet promoted to canonical evidence

The final interactive Lace run for the V4 work-policy path remains `PENDING` until a real transaction is executed and the resulting indexed receipt is captured.

## 3. Clean-checkout verification

```bash
npm ci
npm run verify:judge
```

Then compile Compact:

```bash
compact update 0.31.1
rm -rf .compact-build/shieldrate
compact compile --compact-path contracts contracts/shieldrate.compact .compact-build/shieldrate
```

Expected source gates:

- TypeScript typecheck passes.
- Vitest suite passes.
- Production bundle builds.
- Compact compiles `verifyClaim`, `verifyWorkPolicy`, provider governance and receipt-query circuits.

## 4. Read these files in order

1. `contracts/shieldrate.compact` — canonical privacy/integrity boundary.
2. `tests/shieldrate.test.ts` — application-level invariants, including composite qualification and anti-probing semantics.
3. `src/midnight/api.ts` — live transaction + indexed-receipt verification path.
4. `src/security/integrity.ts` — fixed policy definitions and demo parity helpers.
5. `docs/CLAIMS.md` — claim/evidence/status map.
6. `docs/REAL-TX-RUNBOOK.md` — exact final network gate.

## 5. Signature demo

The judge-facing signature behavior should be one coherent action, not three attribute proofs:

`Employer policy request → holder consent → private composite proof → QUALIFIED receipt`

Example: `SR-WORK-02` requires a fixed combination of income, rating and completed-job history. The holder's exact values never become public. If any component fails, no negative receipt is inserted.

The public receipt answers only:

> This issuer-attested holder satisfied SR-WORK-02 for this employer/job scope before the request expired.

## 6. 90-second demo narrative

**0–15s — Problem**  
Hiring and procurement teams routinely ask contractors for far more evidence than they need. Salary/revenue history, platform rating and completed-job history become negotiating data.

**15–35s — Request**  
Employer selects one fixed qualification standard and one job scope. The request has a fresh challenge and expiry.

**35–60s — Prove**  
Holder consents. Compact verifies the provider signature, credential freshness, policy conditions, scope and replay rules privately.

**60–75s — Receipt**  
If qualified, ShieldRate writes one scoped receipt. It does not publish raw values or separate component results. If not qualified, no public negative receipt exists.

**75–90s — Independent verification**  
In live mode the UI does not trust a transaction id alone: it re-queries contract state for the expected verification id before saying verified.

## 7. Non-claims

Do not say any of the following until the corresponding evidence exists:

- “V4 is validated on Midnight Preprod” — pending the canonical Lace transaction + indexed receipt.
- “Production issuer network” — only the protocol/provider boundary is implemented.
- “Production team/RBAC/billing/integrations” — current enterprise surfaces may show architecture previews but are not promoted as working backend services.
- “Dependency security clean” — dependency audit remediation is a separate open gate.

## 8. Winning bar for the next gate

Before another visual redesign, ShieldRate should have:

1. Compact + Node CI green on this branch.
2. V4 composite proof source-validated.
3. A real Lace transaction for `verifyWorkPolicy`.
4. Captured contract address, tx id, block height and indexed receipt.
5. Claim ledger updated from `LIVE_PENDING` to `NETWORK_VERIFIED` only after item 4.
