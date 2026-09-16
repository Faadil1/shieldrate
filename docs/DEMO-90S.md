# ShieldRate — 90-Second Judge Demo

## Memory sentence

**The employer has to commit the standard before the candidate proves anything. The candidate proves they qualify without revealing why.**

## 0–12s — The asymmetry

Show the opportunity and one sentence:

> Hiring teams often need a yes/no qualification decision, but ask for salary/revenue history, ratings and work history that can later become negotiating leverage.

Do not begin with blockchain vocabulary.

## 12–30s — COMMIT

Open the employer request.

Select `SR-WORK-02` and a job scope, then show that the employer wallet registers that policy before any candidate proof.

Say:

> ShieldRate fixes the question first. For this employer and job, the standard cannot be silently changed after we see a candidate outcome.

Point to the work-request id / policy / expiry.

## 30–43s — CONSENT

Switch to holder context / private credential dossier.

Say:

> The worker sees the exact public standard and chooses whether to prove it. Refusal creates no public candidate record.

Do not reveal the raw credential values in the judge-facing recording unless explicitly showing the private-side boundary for a moment.

## 43–65s — PRIVATE PROOF

Run the registered qualification.

Say:

> Compact verifies the issuer signature, credential freshness, the already-registered standard and the private conditions. The proof does not accept a new employer or policy at this stage.

If using live mode, let Lace approval be visible but do not spend time narrating wallet plumbing.

## 65–80s — QUALIFIED

Show the receipt.

The judge should be able to see immediately:

- `QUALIFIED`;
- registered work-request id;
- policy code;
- scoped subject;
- provider;
- network receipt state when genuinely live.

Say:

> The employer learns that this issuer-attested worker satisfied the committed standard — not their income, rating, job count, margin above the threshold or which component was weakest.

## 80–90s — The second privacy boundary

End on the contrast:

> Most privacy credentials protect the answer. ShieldRate also constrains the question: commit the criteria first, publish only a positive scoped qualification, and leave no public rejection trail.

If the canonical Preprod evidence exists by recording time, finish with the contract/tx/indexed-receipt evidence. If it does not, state explicitly that the shown network gate is still pending and use the source-verified demo instead.

## Do not spend demo time on

- generic dashboard navigation;
- billing/RBAC/webhook previews;
- broad selective-disclosure claims;
- explaining every cryptographic primitive;
- fake loading/proof theater;
- raw salary as the product headline.

## One-frame judge takeaway

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

Under it:

**Private evidence. Fixed criteria. No public rejection trail.**
