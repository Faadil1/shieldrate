# ShieldRate — Enterprise SaaS Scale V3

Status: `BUILD_COMPOSED_CI_PENDING`
Date: 2026-09-15
Repository: `Faadil1/shieldrate`
Branch: `ui-ux-enterprise-saas-v3`
Base: `ui-ux-trace-max-v2`

## Trigger

Opeyemi approved the TRACE Max V2 visual direction after upstream Proof Integrity v1 was merged in `opeblow/shieldrate#1`, with one product-direction request: ShieldRate should read like a **big SaaS product** rather than a polished single-workflow demo.

## V3 thesis

Do not replace the approved ShieldRate identity with generic SaaS chrome. Instead, keep the security-paper / trust-instrument visual language and expand the **perceived product scale** around it.

The app shell now presents ShieldRate as an enterprise verification operations product with:

- persistent full-height product navigation
- workspace-level product chrome
- operations overview / command center
- verification request lifecycle surface
- receipt register
- scoped subject directory
- governed policy catalog
- issuer/provider governance surface
- receipt-level audit surface
- runtime control
- integrations surface
- team/access architecture preview
- usage surface

## Honesty boundary

Enterprise scale must not create fake capability claims.

Current or evidence-backed surfaces are presented as such. Features that are not wired yet are explicitly labelled **Preview**, **Planned**, or described as product architecture. In particular:

- no persistent multi-user request queue is claimed
- no RBAC/auth implementation is claimed
- no webhook/event-bus implementation is claimed
- no billing/quota metering is claimed
- audit history is limited to evidence actually present in the current build

## Preserved invariants

- TRACE Max V2 visual identity remains canonical.
- New ShieldRate trust mark/favicon remains canonical.
- Requested / Proven / Hidden semantics remain canonical.
- No Compact, cryptographic, Midnight adapter, proof-generation or receipt-verification logic is intentionally changed.
- Demo vs live truthfulness remains explicit.
- Failed predicates still create no public negative receipt.

## Gates

1. Compact 0.31.1 compile.
2. Node 20 typecheck/tests/build.
3. Node 22 typecheck/tests/build.
4. GitHub Pages candidate build.
5. `github-pages` environment permits `ui-ux-enterprise-saas-v3`.
6. Opeyemi / visual acceptance review.
7. Keep merge closed until review.
