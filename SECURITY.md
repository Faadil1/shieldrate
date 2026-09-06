# Security Policy

ShieldRate is a zero-knowledge reputation and income verification protocol.
Because the entire product premise is **privacy and trust**, security matters
doubly. Please report issues responsibly.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

Pre-releases and hackathon builds are supported only on the `main` branch.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, report privately via one of:

- GitHub **Security Advisories**: use the "Report a vulnerability" button on
  the repository's *Security* tab.
- Private email to the maintainers (address listed in the repository profile).

Include, where possible:

1. A description of the vulnerability and its impact.
2. Steps to reproduce or a proof-of-concept.
3. Affected component or file (e.g. `contracts/shieldrate.compact`,
   `src/utils/crypto.ts`, wallet wiring).
4. Suggested mitigation, if you have one.

### What happens next

- We will acknowledge your report within **72 hours**.
- We will investigate, triage, and aim to ship a fix (or a documented
  mitigation) within a reasonable window depending on severity.
- We will not disclose the issue publicly until a fix has landed.

## Security-relevant areas in this repo

| Area                    | Why it matters                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| `contracts/shieldrate.compact` | Dual-ledger separation; only booleans/hashes must ever be disclosed.   |
| `src/utils/crypto.ts`   | Custom synchronous SHA-256 — verify against official test vectors before use in production. |
| `src/hooks/useWallet.ts`| Wallet bridging. Your seed/keys must never be exposed or logged.               |
| `src/utils/proofGenerator.ts` | Private witnesses must stay on-device; never log raw income/rating.     |

## General guidance

- Never commit secrets, private keys, mnemonic phrases, or deployer wallets.
- Treat all demo/mock flows as non-production; wire real MidnightJS SDK calls
  behind the provided hooks before any real mainnet use.
- Raw freelancer data (income, ratings, job counts) must never leave the
  prover's device — only disclosed booleans are ever sent to the ledger.