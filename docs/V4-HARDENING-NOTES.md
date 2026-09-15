# V4 Hardening Notes

Status: `IMPLEMENTATION_IN_PROGRESS`

This pass closes three protocol gaps found after the first green Winning Intelligence V4 build:

1. **Provider epoch resurrection** — provider removal must not reset revocation history if the same provider id is registered again.
2. **Opportunity probing** — one employer/job opportunity must not permit multiple successful qualification receipts simply by changing policy/challenge.
3. **Verifier scope spoofing** — the employer/job/policy tuple must come from an employer-authenticated on-chain request, not caller-supplied strings at proof time.

Additional product/engineering hardening:

- lazy-load the Midnight runtime so judge-facing first load does not eagerly pull the entire live runtime/WASM path;
- expose the registered work-request path to the operator runbook/UI;
- surface dependency-audit output explicitly in CI without pretending unresolved vulnerabilities are fixed.

Promotion rule: none of these items are considered complete until Compact 0.31.1 + Node 20 + Node 22 CI pass on the final branch head.
