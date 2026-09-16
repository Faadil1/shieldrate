# ShieldRate — Canonical Current State

Date: 2026-09-15
Workstream: `WINNING_INTELLIGENCE_V4`
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`
Status: `V4_PROVIDER_ABSENCE_CONFIRMED_FRESH_RETRY_ALLOWED`

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Canonical flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Winning Intelligence V4 adds Commit-Before-Know: the employer fixes the qualification policy before holder proof, while failure/refusal leaves no holder-specific public negative receipt.

## Deployment gate — CLOSED

The supervised 1AM / Midnight Preprod run successfully deployed and joined the V4 contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Do not redeploy this contract for the current evidence run.

## Provider registration — rejected attempt reconciled

The first provider-registration attempt for provider id `1` reached 1AM **Submit Transaction** and then returned:

`1010: Invalid Transaction · Custom error: 182`

MidnightJS surfaced it as a submission/application error. Because submission was reached, ShieldRate was hardened with read-before-write and read-after-error provider reconciliation before any fresh attempt.

The operator then used the new **Check provider on-chain** read path with provider id `1` and the expected public key. Result:

`NOT REGISTERED`

This read performs no transaction. It confirms that provider `1` is absent from the indexed ShieldRate ledger state after the rejected `182` attempt. Therefore the rejected attempt did not write provider state and does not create a duplicate-provider risk.

## Safe retry boundary

One fresh provider-registration transaction is now allowed.

A fresh click on **Register provider on-chain** constructs a new Midnight call/intent after a read-before-write preflight; it does not replay the rejected transaction. Use exactly the existing provider id/public key pair and approve the wallet flow once.

If the fresh attempt succeeds, ShieldRate must confirm indexed provider state with the expected key before continuing.

If `182` or any other submission/finalization error repeats, stop immediately. Do not submit a third transaction. Use **Check provider on-chain** again and preserve the exact error/wallet evidence for root-cause isolation.

## Existing provider/credential pair — do not regenerate

Provider id:

`1`

Provider public key X:

`42848969277721310029114432532667054135720119005484359189255060317143764534159`

Provider public key Y:

`37973363005075625546044948588170817933783603251788102975603190164298483319067`

The already-generated signed credential remains paired with this exact public key and current holder binding. Do not rerun issuance unless intentionally discarding this pair.

## Current open gate

`ONE_FRESH_PROVIDER_REGISTRATION_ATTEMPT_THEN_INDEXED_CONFIRMATION`

Required sequence:

1. Keep the same browser origin/session and the already deployed contract.
2. Enter provider id `1` and the exact existing X/Y values.
3. Click **Register provider on-chain** exactly once.
4. Approve the 1AM wallet prompts once.
5. On success, capture provider registration tx id + block height and confirm indexed provider state / epoch.
6. If an error occurs after submission, do not click again; run **Check provider on-chain** and capture the exact error.
7. Once provider registration is indexed, continue fresh job scope + policy `2` → indexed request → credential import → private qualification → independently indexed `workReceiptExists=true`.
8. Only then create `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` and promote the exact flow to `NETWORK_VERIFIED`.

## Truth boundary

- Deployment READY is proven; the full V4 flow is not yet `NETWORK_VERIFIED`.
- `NOT REGISTERED` is evidence of provider absence in indexed contract state, not a diagnosis of the root cause of error `182`.
- TTL expiry remains only a hypothesis; MidnightJS `4.1.1` normally constructs call intents with a one-hour TTL.
- Never expose holder/admin/issuer secrets.
- Never claim committed criteria are automatically lawful or fair.

## TRACE gate

Do **not** reopen the next TRACE UI/UX workstream yet.

Required order:

`deployment READY → provider registration → real request → real private proof → indexed receipt → evidence lock → exact network claim promotion → TRACE UI/UX`
