# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_COMMIT_INDEXED_PRIVATE_QUALIFICATION_PENDING`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Winning Intelligence V4 adds Commit-Before-Know: the employer fixes the qualification policy before holder proof, while failure/refusal leaves no holder-specific public negative receipt.

## Deployment gate — CLOSED

Current supervised Midnight Preprod contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy this contract for the current evidence run.

## Provider registration gate — INDEXED / CLOSED

Indexed read confirms:

`INDEXED · Provider 1 exists · epoch 0 · expected key matches.`

Provider registration transaction id/block metadata remain uncaptured and must not be invented. No further provider registration is allowed for this run.

## Commit-Before-Know request gate — INDEXED / CLOSED

The operator committed the fresh job scope `sr-wave1-canonical-2026-09-15-01` using policy code `2` / `SR-WORK-02` before holder proof.

ShieldRate returned only after finalization plus its indexed `workRequests` membership check:

- workRequestId: `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- transaction id: `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block height: `2568670`
- policy: `2` / `SR-WORK-02`

This is live Commit-Before-Know evidence: the employer-standard transaction is finalized and the resulting work request is present in indexed contract state before private qualification.

The request expiry in Unix milliseconds is not displayed by the current success message. Recover `requestExpiresAtMs` from indexed work-request state before the final evidence lock; do not infer or fabricate it from local clock time.

## Existing provider/credential pair — keep unchanged

Provider id `1`, provider epoch `0`, and the exact expected public key are indexed. The already-generated signed credential remains paired with that provider key and the current holder binding. Do not rerun issuance for this evidence run.

Credential values are compatible with `SR-WORK-02` by source-local inspection (`68000`, `487`, `120`), but qualification is not a network claim until the private proof succeeds and the expected receipt is indexed.

## Current open gate

`PRIVATE_QUALIFICATION_THEN_INDEPENDENT_WORK_RECEIPT_CONFIRMATION`

Required next sequence:

1. Keep the same browser origin/session and the already deployed contract.
2. Ensure Card 04 shows the issuer-attested credential as loaded; if not, re-import the existing payload without regenerating it.
3. Card 06 must target exactly `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`.
4. Click **Run registered private qualification** exactly once and approve the wallet flow once if prompted.
5. Capture the resulting verification id + qualification transaction id + block height.
6. Do not rerun qualification after any ambiguous submit/finalization outcome until indexed `workReceipts` state is checked.
7. Independently re-read `workReceiptExists=true` for the exact verification id.
8. Recover `requestExpiresAtMs` from indexed request state and provider registration tx/block if available.
9. Create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after those public values are checked.
10. Only then promote the exact live flow to `NETWORK_VERIFIED` and reopen TRACE UI/UX.

## Truth boundary

- Deployment READY is proven.
- Provider id `1`, epoch `0`, and expected-key match are indexed.
- Commit-Before-Know request `971f6a...6892b` is finalized and indexed at block `2568670`.
- Request expiry metadata and provider-registration tx/block remain uncaptured.
- Full V4 `NETWORK_VERIFIED` still requires a successful private qualification and independent indexed `workReceipts` confirmation.
- Never expose holder/admin/issuer secrets or raw private credential data in Git evidence.

## TRACE gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`deployment READY → provider INDEXED → committed request INDEXED → private proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`
