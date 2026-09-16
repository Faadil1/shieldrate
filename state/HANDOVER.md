# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_CREDENTIAL_BLOCKTIME_RECOVERY_PROVIDER2_PENDING`.

## Live contract — do not redeploy

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Keep the same browser origin/session whenever possible because holder/admin private state is session-scoped.

## Provider 1 — indexed

Provider id `1`, epoch `0`, expected public-key match are confirmed in indexed state. Successful registration tx/block metadata are still missing.

## Commit-Before-Know — indexed

Job scope: `sr-wave1-canonical-2026-09-15-01`

Policy: `SR-WORK-02` / code `2`

- workRequestId `971f6ab489418b29039ae945a9b197238da5eed6f00c394305cf12366e36892b`
- tx `003cda886aeecf397418920ee7317c8dc7ee784ae0b4da742438c175451e4bf084`
- block `2568670`

Exact request expiry still needs indexed recovery.

## Latest blocker — credential issuance time vs Midnight block time

First private qualification attempt failed during local/Compact execution before submission:

`Unexpected error executing scoped transaction '<unnamed>': Error: failed assert: credential issuance is in the future`

No qualification tx, nullifier, or work receipt was created by that failed attempt.

Contract guard: `blockTimeGte(credential.issuedAtEpoch)`.

Provider-1 credential issuance timestamp is `1789522255905` (`2026-09-16T01:30:55.905Z`), so the Midnight execution block time was behind that timestamp.

This is not a qualification-policy failure.

## Why provider 1 cannot simply be reissued

The original provider-1 issuer secret was random and intentionally not printed/persisted. Do not fabricate a credential under provider 1, and do not rotate/remove provider 1.

## Immediate recovery

1. Keep the same holder binding/browser session.
2. Create a **new fixed local issuer secret** and keep it outside Git/chat.
3. Generate a fresh credential with:
   - provider id `2`;
   - provider epoch `0`;
   - same holder binding;
   - `SHIELDRATE_ISSUED_AT_EPOCH` explicitly backdated by 24 hours;
   - existing policy-compatible values (68000 / 487 / 120).
4. Register provider `2` exactly once, then confirm indexed key + epoch `0`.
5. Import its matching `credentialPayload`.
6. Retry the current work request if fresh. If expired, use a new job scope such as `sr-wave1-canonical-2026-09-15-02` with policy code `2`; the previous employer/job slot is immutable.
7. On successful qualification capture verification id + tx + block.
8. Independently confirm `workReceiptExists=true`.
9. Lock final network evidence only after public values are checked.

## Truth boundary

- Deployment READY is proven.
- Provider 1 indexed is proven.
- Commit-Before-Know request finalized/indexed at block `2568670` is proven.
- The first private proof attempt failed pre-submission on credential time.
- Full V4 `NETWORK_VERIFIED` still requires successful private proof + independently indexed receipt.
- Never expose holder/admin/issuer secrets or raw credential data in Git evidence.

## TRACE gate

Do not reopen TRACE UI/UX until private proof → indexed receipt → evidence lock is complete.
