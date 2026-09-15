# ShieldRate — UI/UX & Judge Experience v1

Status: `BUILD_VALIDATED_PREVIEW_ENV_GATE`
Branch: `ui-ux-judge-experience-v1`
Base: `midnight-live-integration-v1`

## Current gate state

- Verification-instrument design system: IMPLEMENTED
- Landing redesign: IMPLEMENTED
- Verification desk / evidence hierarchy: IMPLEMENTED
- Receipt ledger: IMPLEMENTED
- Proof request/result flow: IMPLEMENTED
- Holder credential dossier: IMPLEMENTED
- Mobile holder concept: IMPLEMENTED
- Midnight live setup surface: IMPLEMENTED
- Reduced-motion behavior: IMPLEMENTED
- Compact 0.31.1: PASS
- Node 20 typecheck/tests/build: PASS
- Node 22 typecheck/tests/build: PASS
- GitHub Pages candidate build: PASS
- GitHub Pages deploy: BLOCKED ONLY by `github-pages` environment branch allow-list for `ui-ux-judge-experience-v1`
- Visual acceptance review: PENDING PREVIEW
- Merge: CLOSED until visual acceptance

## Design thesis

ShieldRate should not look like a generic SaaS dashboard with a green accent. It should feel like a **verification instrument**: part credential dossier, part audit receipt, part financial/security document.

The proof itself is the visual object. The interface exists to make three things instantly legible:

1. what was requested,
2. what was disclosed,
3. what was deliberately kept private.

## Aesthetic lineage

Primary lineage:
- institutional verification documents
- financial/security paper systems
- audit dossiers and evidence packets
- editorial annual-report layouts

Secondary mechanisms:
- tabular receipt structures
- dense micro-labels and serials
- constrained status color
- thin rule systems, stamps, cut marks, signature/receipt zones
- monospaced evidence identifiers paired with editorial typography

Avoid:
- dark navy/black SaaS shells
- neon gradients and glow
- glassmorphism
- generic shield/lock hero graphics
- floating rounded cards everywhere
- decorative 3D blobs
- fake live-network theater

## Visual system

- Background: mineral paper / cool parchment, not pure white.
- Ink: near-black blue-charcoal.
- Primary proof accent: verification green used sparingly as a status/seal, not as the entire UI.
- Secondary accent: safety amber for demo/pending trust boundaries.
- Borders: thin graphite rules.
- Radius: small/medium; receipts can use clipped/cut corners rather than universal rounded cards.
- Typography: editorial serif for major claims + neutral sans for UI + mono for evidence identifiers.

## Core interface primitives

### Proof Instrument
A receipt-like object containing:
- claim
- policy band
- result
- scope
- freshness
- mode
- request / receipt identifiers

### Privacy Boundary Strip
A persistent 3-column explanation:
- Requested
- Proven
- Hidden

### Evidence Rail
A compact status rail:
- issuer attested
- scoped identity
- replay protected
- pass-only publication
- independent ledger lookup in live mode

### Verification Desk
Dashboard is not a KPI SaaS panel. It is an evidence desk with:
- active receipt count
- execution path
- failed claims published = 0
- receipt ledger
- primary proof action

## Judge hierarchy

Above the fold must answer within seconds:

- What is ShieldRate? `Prove the policy. Keep the evidence private.`
- What is different? issuer-attested + scoped + replay-protected + pass-only.
- Is this actually live? exact mode is visibly labeled.
- What happens on a failed proof? nothing public is created.

## Motion grammar

1. Proof receipt hover
- TARGET: receipt/instrument
- TRIGGER: hover/focus
- MOTION: 1-2px lift + rule emphasis
- TIMING: 160ms ease-out
- RETURN: immediate reverse
- INPUT PARITY: focus-visible matches hover
- REDUCED MOTION: no translation, border emphasis only

2. Claim selection
- TARGET: policy option
- TRIGGER: click/tap
- MOTION: active rule slides/appears, no bounce
- TIMING: 140ms
- REDUCED MOTION: instant state swap

3. Proof generation
- TARGET: evidence steps
- TRIGGER: state change
- MOTION: ordered reveal of validation steps
- TIMING: 180–240ms stagger
- REDUCED MOTION: all steps appear without stagger

4. Receipt success
- TARGET: verification seal
- TRIGGER: verified state
- MOTION: opacity + subtle scale 0.98→1
- TIMING: 220ms
- REDUCED MOTION: opacity only

## Acceptance criteria

- No dominant black/dark SaaS shell.
- No emoji used as primary product iconography.
- Proof semantics visible before decorative content.
- Demo vs live mode remains impossible to confuse.
- Desktop and mobile preserve hierarchy.
- Existing runtime/proof behavior remains unchanged.
- Reduced-motion is supported.
- CI, typecheck, tests and build must remain green.
