# UI/UX TRACE Max V2 — Handover

Resume branch: `ui-ux-trace-max-v2`.

Do not merge this branch until:
- Compact 0.31.1 is green,
- Node 20 and 22 typecheck/tests/build are green,
- the Pages preview is visually inspected,
- demo/live truth labels remain accurate.

If the Pages deploy is rejected before a runner starts, add `ui-ux-trace-max-v2` to Settings → Environments → github-pages → Deployment branches and tags, then rerun only the deploy job.

The live Lace transaction gate remains owned by the Midnight live workstream / Opeyemi. This V2 workstream does not claim live-network validation.
