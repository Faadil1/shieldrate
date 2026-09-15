# Commit-Before-Know — ShieldRate V4

## Thesis

ShieldRate does not only hide the worker's private evidence. It also fixes the verifier's qualification rule **before** the worker proves anything.

Canonical sequence:

`Employer commits policy → Worker consents → Private qualification → QUALIFIED receipt`

This prevents a verifier from moving the goalposts after seeing a candidate-specific outcome.

## Protocol rule

For one `employer + jobScope`:

- exactly one work request can ever be registered;
- that request fixes a public policy code, challenge and expiry;
- cancelling the request closes the opportunity and does not permit replacement under the same job scope;
- each holder can publish at most one successful qualification receipt for that opportunity;
- failed qualification writes no public negative receipt.

The employer identity comes from `ownPublicKey()` inside Compact, not from a caller-supplied employer id.

## What this proves

A successful receipt proves:

1. a specific wallet-authenticated employer committed a qualification standard for a job;
2. the standard was already registered before the holder proof;
3. the request was still active and unexpired;
4. the holder's issuer-attested private work profile satisfied the entire standard;
5. the same holder cannot publish another qualification receipt for that employer/job scope;
6. no component-level income/rating/job-count result was published.

## What this does not prove

Commit-Before-Know does **not** claim that a policy is lawful, unbiased, non-discriminatory or appropriate. It proves criteria immutability and privacy, not legal or ethical validity.

## Why it matters

Most privacy credential systems protect the holder's data but leave the verifier free to ask a sequence of increasingly specific questions. ShieldRate treats verifier behavior itself as part of the privacy boundary.

The request registry therefore creates a second trust guarantee:

> **The worker cannot be silently profiled by changing the standard after the opportunity has been opened.**

That is the product-level reason the work request registry is on-chain rather than a UI-only setting.
