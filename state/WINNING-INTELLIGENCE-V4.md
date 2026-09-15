# ShieldRate — Winning Intelligence V4

Status: `SOURCE_VALIDATED / NETWORK_EVIDENCE_PENDING`
Date: 2026-09-15
Repository: `Faadil1/shieldrate`
Branch: `winning-intelligence-v4`

## Trigger

After Proof Integrity, Midnight Live and Enterprise SaaS V3 were merged upstream, the workstream paused visual expansion and re-ran Winning Intelligence against the public Wave 1 field.

## Field conclusion

Strong reviewed projects already occupy:

- private eligibility credentials;
- compensation privacy;
- compliance attestations;
- private claims;
- broad selective-disclosure SaaS;
- domain-specific ZK threshold proofs.

ShieldRate therefore does not lead with “salary > X” or generic selective disclosure.

## Canonical product wedge

**Private workforce / contractor qualification with bargaining privacy and verifier-side criteria discipline.**

Memory sentence:

**Prove you qualify for the work. Do not reveal why.**

Signature sequence:

`COMMIT → CONSENT → PRIVATE PROOF → QUALIFIED`

## Unique protocol layer implemented

### Commit-Before-Know

The employer wallet registers one immutable qualification standard for one job scope before candidate proof.

- employer identity derives from `ownPublicKey()`;
- one `jobRequests` entry per employer + job;
- cancellation does not permit silent replacement;
- holder proves the registered request rather than proof-time thresholds;
- failed/refused holders leave no public negative record;
- successful holder gets one opportunity-scoped public receipt.

Reviewed public Wave 1 repos did not surface another project centered on this exact employer-authenticated pre-commit mechanism. Treat that as reviewed-field differentiation, not a universal exclusivity claim.

## Hardening completed

- provider epoch resurrection closed;
- opportunity-scoped anti-probing nullifier;
- verifier-supplied employer scope removed from flagship path;
- block-time request expiry;
- future credential issuance rejection;
- provider Schnorr attestation preserved;
- independent indexed request/receipt reads;
- V4 operator path exposed in live setup dossier;
- Midnight runtime dynamically loaded;
- main judge-facing JS materially reduced;
- Vite/Vitest upgraded;
- dependency remediation audit reported zero vulnerabilities;
- 20 app-level integrity/privacy tests pass in validated remediation run;
- Compact 0.31.1 compiles the V4 contract.

## Additional white space captured without overclaiming

- public employer-policy history can be audited without public rejected-worker records;
- holder refusal/failure privacy is part of the protocol, not only successful disclosure minimization;
- federated multi-source work evidence is the clearest future expansion, but remains unshipped until V4 network evidence is locked.

## Remaining gate

Opeyemi must execute the canonical Lace/Preprod run:

1. deploy/join V4 contract;
2. register provider;
3. commit `SR-WORK-02` under a fresh employer/job scope;
4. confirm indexed work request;
5. load holder-attested credential;
6. prove registered policy;
7. capture tx/block/verification id;
8. independently confirm `workReceiptExists=true`.

Until then V4 remains `NETWORK_EVIDENCE_PENDING`.

## UI decision

Do not reopen broad UI redesign until the network gate is stable. The next TRACE UI/UX pass must make the signature sequence visually dominant instead of adding more generic SaaS breadth.
