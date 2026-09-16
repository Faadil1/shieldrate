# Criterion — 90-Second Judge Demo

## Memory sentence

**The employer commits the criteria before the worker proves anything. The worker proves qualification without revealing the private work data.**

## 0–10s — Start on the problem

Show the Criterion landing page, not the dashboard.

Say:

> Hiring teams often need a yes-or-no qualification decision, but the evidence they collect can become negotiating leverage. Criterion lets the employer commit the standard first, then lets the worker prove only that they qualify.

Point briefly to `NETWORK_VERIFIED` and the two canonical block numbers. Do not begin with blockchain vocabulary.

## 10–27s — COMMIT

Open Runtime / Card 05 only long enough to show the registered opportunity and the fixed policy.

Canonical job:

`sr-wave1-canonical-2026-09-15-03`

Policy:

`SR-WORK-02 / Proven professional`

Say:

> The standard is fixed before the worker proves anything. For this employer and job key, it cannot be silently replaced after seeing an outcome.

Canonical evidence to show:
- work request `d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1`;
- commit block `2575087`.

Do **not** recommit the job during the recording.

## 27–40s — CONSENT / PRIVATE SIDE

Open the holder dossier.

Say:

> The worker controls the private evidence and chooses whether to prove the committed standard. Refusal or failure creates no public worker-specific rejection receipt.

Do not expose issuer secret material. Avoid lingering on raw values; the point is the boundary, not the salary number.

## 40–62s — PRIVATE PROOF

Use the already-completed canonical run as evidence rather than creating another transaction.

Say:

> Compact checked the registered policy, the provider-signed credential, freshness and the private conditions. The proof stage did not accept a new policy.

If you briefly show the Runtime panel, point to the `QUALIFIED` semantics and explain that the app only reports success after indexed receipt confirmation.

## 62–80s — QUALIFIED

Return to the landing receipt, which now shows the canonical network proof above the fold.

Canonical qualification:
- verification `6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1`;
- qualification tx `00aedb486f5ab66543f4c16bd90232566d6598bcde2829676ac4e782d098b1d836`;
- qualification block `2575167`;
- expected verification id confirmed in indexed `workReceipts` before the runtime returned `QUALIFIED`.

Say:

> The employer learns that this issuer-attested worker satisfied the committed standard — not their income, rating, job count, margin above threshold, or which private component was weakest.

## 80–90s — Close on the second privacy boundary

Say:

> Most private credentials protect the answer. Criterion also constrains the question: commit the criteria first, publish only a positive scoped qualification, and leave no public rejection trail.

End on:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

**Private evidence. Fixed criteria. No public rejection trail.**

## Recording rules

- Do not deploy another contract.
- Do not re-register Provider 2.
- Do not recommit the canonical job.
- Do not run another qualification transaction merely for the video.
- Do not spend time on generic dashboard navigation, RBAC/billing previews, dependency details or wallet plumbing.
- Use the canonical proof already captured; the goal of the video is to explain the protocol, not recreate risk.
