# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / SOURCE_VALIDATED_NETWORK_EVIDENCE_PENDING`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

ShieldRate is now deliberately differentiated from generic selective disclosure and salary proof. The employer must commit the standard before holder proof, while failure/refusal leaves no holder-specific public negative record.

## Core V4 mechanisms

- `registerWorkRequest` authenticates employer with `ownPublicKey()`;
- one immutable standard per employer + job scope;
- cancellation closes the request but does not free the job key;
- `verifyRegisteredWorkPolicy` consumes the registered request;
- opportunity-scoped holder nullifier;
- provider-signed private credential with Schnorr verification;
- composite policy with one positive receipt;
- block-time expiry / future-issued credential rejection;
- monotonic provider epoch revocation;
- indexed request/receipt verification after tx finalization;
- V4 operator UI;
- lazy-loaded Midnight runtime;
- refreshed Vite/Vitest toolchain with zero audit findings in remediation validation.

## Validation already completed

Winning Intelligence V4 / Commit-Before-Know source gate has passed:

- Compact 0.31.1 compile;
- Node typecheck;
- 20 tests;
- production build;
- npm audit after Vite 8.3.0 / Vitest 5.0.1 refresh: 0 findings.

Run the final branch CI again after any state/docs cleanup before opening/merging the upstream PR.

## Immediate continuation

1. Ensure final CI green on current branch head.
2. Keep `docs/CLAIMS.md` at `LIVE_PENDING` for the network evidence claim.
3. Give Opeyemi `docs/REAL-TX-RUNBOOK.md`.
4. Opeyemi performs a real Lace/Preprod V4 run using a fresh job scope.
5. Capture request tx/block + indexed request.
6. Capture qualification tx/block + indexed work receipt.
7. Add `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after actual success.
8. Promote only the supported network claim.
9. Then reopen TRACE UI/UX around `COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`.

## Competitive reminder

Reviewed public Wave 1 projects already cover private eligibility, compensation, compliance, claims and generic selective disclosure. Commit-Before-Know, failure privacy and verifier-policy audit without rejected-worker surveillance are ShieldRate's current differentiated territory.

## Future white space

Federated/multi-source work evidence is the strongest next protocol expansion after V4 live evidence is locked. Do not claim it as shipped in Wave 1 unless it is actually implemented, compiled, tested and demonstrated.

## Truth boundary

Never call V4 network-validated from source/CI alone. Never claim committed criteria are automatically lawful or fair. Never expose holder/issuer secrets in evidence.
