# ShieldRate — Handover

Resume from `Faadil1/shieldrate` on `winning-intelligence-v4`.

Canonical state: `WINNING_INTELLIGENCE_V4 / V4_PROVIDER_ABSENCE_CONFIRMED_FRESH_RETRY_ALLOWED`.

## Product thesis

**Prove you qualify for the work. Do not reveal why.**

Signature flow:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Deployment is already READY — never redeploy this run

Current deployed Preprod contract:

`c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2`

Keep using this exact contract and browser session/origin.

## Provider registration history

Provider id `1` with the existing issuer public key was submitted once through 1AM. After **Submit Transaction**, ShieldRate received:

`1010: Invalid Transaction · Custom error: 182`

Because submission was reached, ShieldRate was patched to reconcile indexed provider state before any retry:

- read-before-write provider preflight;
- **Check provider on-chain** read-only operator action;
- read-after-error bounded reconciliation;
- zero automatic resubmission;
- hard stop if the id belongs to another key.

## Latest operator result — provider absence confirmed

The operator ran **Check provider on-chain** using provider id `1` and the expected X/Y key. Result:

`NOT REGISTERED`

That read submits no transaction. Provider `1` is absent from indexed contract state, so the rejected `182` attempt did not write provider state. A single fresh provider registration is therefore allowed.

Do not label the root cause of `182` as confirmed. TTL expiry is only a hypothesis; exact MidnightJS `4.1.1` constructs contract-call intents with a one-hour TTL.

## Existing provider/credential pair — do not regenerate

Provider id:

`1`

Provider public key X:

`42848969277721310029114432532667054135720119005484359189255060317143764534159`

Provider public key Y:

`37973363005075625546044948588170817933783603251788102975603190164298483319067`

The already-generated signed credential is paired with this exact public key and current holder binding. Do not rerun `npm run issue:demo` unless intentionally discarding that pair.

## Immediate continuation

1. Keep the same `https://faadil1.github.io/shieldrate/` session and confirm the current contract above is still joined.
2. Enter provider id `1` and the exact X/Y values above.
3. Click **Register provider on-chain** exactly once.
4. Approve the 1AM wallet prompts once.
5. If ShieldRate returns a success message, capture the full `tx` id, block number, and indexed epoch/key confirmation.
6. If `182` or another submit/finalization error occurs, do **not** click Register again. Run **Check provider on-chain** once and capture the exact error/result. A third transaction is not allowed without new diagnosis.
7. After indexed provider registration, continue with a fresh job scope using policy code `2`, confirm indexed work request, import the existing signed credential, execute private qualification, and independently confirm `workReceiptExists=true`.
8. Lock `evidence/network/V4-COMMIT-BEFORE-KNOW-PREPROD-<date>.md` only after all public evidence is complete.

## Truth boundary

- Deployment READY is proven.
- `NOT REGISTERED` confirms provider absence after the rejected attempt.
- Full V4 `NETWORK_VERIFIED` is still pending.
- A submitted transaction alone is never enough; indexed ledger state is authoritative.
- Never expose holder/admin/issuer secrets.

## TRACE gate

Do not reopen TRACE UI/UX until provider registration → real request → private proof → indexed receipt → evidence lock is complete.
