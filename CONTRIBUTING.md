# Contributing to ShieldRate

Thanks for wanting to contribute! ShieldRate is built for the Midnight
Buildathon Wave 1, so contributions that make the demo stronger, the contract
more correct, or the privacy story clearer are especially welcome.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating, you agree to uphold it. Report unacceptable behavior to the
maintainers.

## How to get started

1. **Fork** the repository and clone your fork.
2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Run the app** in dev mode:

   ```bash
   npm run dev
   ```

4. **Run the checks** before pushing anything:

   ```bash
   npm run typecheck   # TypeScript strict
   npm test            # vitest suite
   npm run build       # production build
   ```

## Branch & PR workflow

- Work on a descriptive branch: `feat/verify-batch`,
  `fix/proof-modal-abort`, `docs/privacy-notes`.
- Keep changes small and focused; one logical change per PR.
- Open a PR against `main` describing *what* and *why*.
- Reference any related issue in the PR description.
- Keep commits clean and use conventional messages, e.g.
  `feat(dashboard): add batch verify toggle`.

## What we're looking for

### Contract improvements (`contracts/shieldrate.compact`)
- Additional proof types (skill certifications, client budgets, etc.).
- Proof expiry / revocation semantics.
- Gas/ledger-size optimizations.

### SDK integration (`src/hooks/*`)
- Replacing the mock `useWallet`/`useContract` bodies with real MidnightJS /
  Lace wallet calls. These are the exact swap points for going live.

### UX polish (`src/components/*`)
- Empty, loading, and error states coverage.
- Accessibility (keyboard nav, `aria` labels).
- Responsive behavior across breakpoints.

### Documentation
- README accuracy, architecture diagrams, and the 2-minute demo script.

## Style

- TypeScript, strict mode. No `any` unless justified.
- Components are functional; Tailwind utility classes (see `src/index.css` for
  the shared `card`, `btn-primary`, `badge-live` classes).
- No new comments unless they explain *why*, not *what*.
- No secrets, keys, or mnemonic phrases — ever.

## Questions?

Open a discussion or ask on the HackList/community channels linked in the
README. Happy building!