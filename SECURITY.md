# Criterion Security Policy

Criterion is a private work-qualification protocol. Its core security requirement is simple: private holder evidence must not become public merely because a verifier needs a qualification decision.

## Reporting a vulnerability

Do **not** open a public issue for a security vulnerability.

Use GitHub Security Advisories / **Report a vulnerability** on this repository. Include reproduction steps, affected component, impact, and a suggested mitigation when available.

## Security-relevant areas

| Area | Why it matters |
|---|---|
| `contracts/shieldrate.compact` | provider verification, immutable work requests, time checks, scoped identity/nullifiers, pass-only receipts |
| `contracts/schnorr.compact` | issuer signature verification |
| `src/midnight/privateStateProvider.ts` | browser private witness state |
| `src/midnight/api.ts` / `runtime.ts` | transaction lifecycle and indexed receipt reconciliation |
| `src/security/integrity.ts` | local integrity boundaries and proof metadata |
| `scripts/issue-demo-credential.mjs` | local/test credential issuance; issuer secret must remain outside Git |

## Secret handling

Never commit or publish:

- wallet seed phrases or private keys;
- issuer secret keys;
- holder/admin secrets;
- raw production credentials;
- `.env` or local secret files.

The canonical public Preprod evidence intentionally contains transaction identifiers, blocks, request/verification ids, and public receipt state only.

## Protocol invariants

- One qualification standard is fixed per employer + job scope.
- Cancelling a request does not reopen that slot for a replacement standard.
- Credential issuance cannot be in the future.
- Credential validity must cover the request validity window.
- Failed private qualification aborts before public receipt insertion.
- Opportunity-scoped nullifiers prevent duplicate successful publication for the same holder/opportunity.
- The live UI reports `QUALIFIED` only after the expected receipt is confirmed in indexed state.

## Current authorization boundary

The deployed Preprod contract derives employer scope from the Midnight public-key context exposed through `ownPublicKey()`. This is sufficient for the bounded canonical demonstration, but Criterion does **not** claim it as the final production authentication model.

A production authorization design should move identity-sensitive authorization to a stronger secret-witness-derived scheme.

## Network scope

The canonical evidence is Midnight **Preprod** evidence. Mainnet production readiness is not claimed.
