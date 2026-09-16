# Commit-Before-Know — Criterion

## Thesis

Criterion does not only hide the worker's private evidence. It also fixes the verifier's qualification rule **before** the worker proves anything.

Canonical sequence:

`Employer commits policy → Worker consents → Private qualification → QUALIFIED receipt`

This prevents a verifier from moving the goalposts after seeing a candidate-specific outcome.

## Protocol rule

For one `employer scope + jobScope`:

- exactly one work request can be registered;
- that request fixes a public policy code, challenge, nonce and expiry;
- cancelling the request closes the opportunity and does not permit replacement under the same job scope;
- each holder can publish at most one successful qualification receipt for that opportunity;
- failed qualification writes no public negative receipt.

The employer scope is derived from the Midnight public-key context exposed through `ownPublicKey()` rather than from a caller-supplied employer id.

## What a successful receipt proves

For the bounded protocol run, a successful receipt shows that:

1. an employer-scoped request committed a qualification standard for a job scope;
2. the standard was already registered before holder proof;
3. the request was active and unexpired;
4. the holder's provider-attested private work profile satisfied the entire standard;
5. the same holder cannot publish another qualification receipt for that employer/job scope;
6. no component-level income/rating/job-count result was published.

## What it does not prove

Commit-Before-Know does **not** claim that a policy is lawful, unbiased, non-discriminatory, or appropriate. It proves criteria immutability and privacy for the registered protocol scope, not legal or ethical validity.

The current `ownPublicKey()`-derived employer scope is also not claimed as final production authentication. A stronger authorization identity boundary is a separate hardening item.

## Why it matters

Most privacy credential systems protect the holder's data but can leave the verifier free to ask a sequence of increasingly specific questions. Criterion treats verifier behavior itself as part of the privacy boundary.

The request registry therefore creates a second trust guarantee:

> **The worker cannot be silently profiled by changing the standard after the opportunity has been opened.**

That is why the work request registry is on-chain rather than a UI-only setting.
