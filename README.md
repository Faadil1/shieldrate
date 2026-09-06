<p align="center">
  <img src="assets/logo.svg" alt="ShieldRate logo" width="440" />
</p>

<p align="center">
  <em>Prove your worth. Reveal nothing.</em><br>
  Zero-knowledge reputation & income verification on <strong>Midnight</strong>.
</p>

<p align="center">
  <!-- Badges -->
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-22c55e" alt="License: Apache 2.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-passing-22c55e" alt="CI passing" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178c6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61dafb" alt="React 18" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Midnight-Buildathon%20Wave%201-6b46c1" alt="Midnight Buildathon Wave 1" />
  <img src="https://img.shields.io/badge/zero--knowledge-native-22c55e" alt="Zero-knowledge native" />
  <img src="https://img.shields.io/badge/PRs-welcome-22c55e" alt="PRs welcome" />
</p>

---

**ShieldRate** lets freelancers prove income, reputation, and credentials using
**zero-knowledge proofs on Midnight's Compact contracts** — without exposing any
personal data. Employers receive cryptographic attestations they can verify
on-chain in under two seconds.

Built for **[Midnight Buildathon — Wave 1](https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG)**
(3,500 USDT · part of a 12,500 USDT wave pool).

## Project status

| | |
|---|---|
| ✓ Contract | `contracts/shieldrate.compact` — `ledger` + `witness` + `circuit` |
| ✓ Frontend | 5 screens, React + TypeScript + Tailwind, dark/green theme |
| ✓ Wallet bridge | swap-point hooks for MidnightJS / Lace (`src/hooks/`) |
| ✓ Tests | 8 tests passing (SHA-256 NIST vectors, witness/circuit logic) |
| ✓ CI/CD | GitHub Actions: verify, tests, build, Pages deploy |
| ✓ Docs | README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, LICENSE |

---

## The problem

Freelancers on Upwork/Fiverr/Toptal have reputation trapped inside those
platforms. They can't prove to a new employer *"I earned $60k last year"* or
*"I completed 120 jobs with a 4.8 rating"* without sharing bank statements or
platform screenshots — and employers have no way to verify without trusting the
freelancer.

## The solution

1. **Freelancer** connects a wallet and generates a ZK proof of an income range
   (e.g. "Income > $50,000") using Midnight witnesses. The raw data never
   leaves the device.
2. **Employer** posts a job with verification requirements.
3. **Freelancer** submits the proof — the employer sees only the **boolean
   result** (passed/failed), never the underlying income.
4. **On-chain**: a Compact contract stores the verification result. No personal
   data ever touches the blockchain.

---

## Project structure

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml          # typecheck + tests + build (Node 20/22 matrix)
│       ├── deploy.yml      # build → GitHub Pages on push to main
│       └── issues.yml      # auto-triage comment on new issues
│
├── assets/
│   └── logo.svg            # brand wordmark (dark card + shield mark)
│
├── contracts/
│   └── shieldrate.compact  # Compact contract: ledger + witness + circuit
│
├── public/                 # copied to dist/ at build (Vite publicDir)
│   ├── favicon.svg         # browser-tab SVG favicon (green shield mark)
│   ├── favicon-32.png      # PNG fallback for older browsers
│   ├── apple-touch-icon.png# 180×180 iOS home-screen icon
│   ├── icon-192.png        # Android / PWA icon
│   ├── icon-512.png        # Android / PWA splash
│   ├── site.webmanifest    # PWA manifest
│   └── og-image.png        # social-preview image (1200×630, WhatsApp/Twitter)
│
├── scripts/
│   └── make-assets.mjs     # generates public/ PNGs + og-image (pure Node, no libs)
│
├── src/
│   ├── App.tsx             # view router (landing/dashboard/freelancer/mobile)
│   ├── main.tsx            # React entry point
│   ├── index.css           # Tailwind + shared component classes
│   ├── data.ts             # demo data + stat computation
│   ├── types.ts            # domain types (Verification, ProofResult…)
│   ├── components/
│   │   ├── Landing.tsx              # 01 · landing/hero
│   │   ├── Sidebar.tsx              # employer sidebar
│   │   ├── Header.tsx               # dashboard topbar + wallet state
│   │   ├── KPICards.tsx             # stat cards
│   │   ├── VerificationTable.tsx    # 02 · proof submissions (+ empty state)
│   │   ├── MobileView.tsx           # 03 · mobile experience
│   │   ├── FreelancerView.tsx       # 04 · credential cards
│   │   └── ProofModal.tsx           # 05 · ZK proof generation flow
│   ├── hooks/
│   │   ├── useWallet.ts             # Midnight/Lace wallet bridge (swap point)
│   │   └── useContract.ts           # Compact contract bridge (swap point)
│   └── utils/
│       ├── proofGenerator.ts        # on-device witness + circuit
│       ├── contractHelpers.ts       # user hashing + threshold formatting
│       └── crypto.ts                # synchronous SHA-256 (verified NIST vectors)
│
├── tests/
│   └── shieldrate.test.ts   # unit tests incl. NIST SHA-256 vectors
│
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE                  # Apache License 2.0
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts           # base: "./" (static-asset friendly)
├── tailwind.config.js
└── postcss.config.js
```

---

## Architecture

### Compact contract (dual-ledger model)

The contract in `contracts/shieldrate.compact` mirrors Midnight's split into
public and private state:

- **`ledger`** — public `verifications: Map<Bytes<32>, Verification>`, job
  requirements, and pass counters. Employer-facing.
- **`witness`** — `freelancer_income()`, `freelancer_rating()`,
  `freelancer_completed_jobs()`, `wallet_secret()`. Private, **never uploaded**.
- **`circuit`** — exported entry points `generate_income_proof`,
  `generate_rating_proof`, `generate_jobs_proof`, `verify_proof`, and job
  requirement helpers. Only `{ user, claim, threshold, passed, at }` are
  disclosed to the ledger.

### Privacy guarantees

- Raw income/rating/job data **never leaves the prover's device**.
- Only booleans + an anonymous `persistent_hash(wallet_secret)` go on-chain.
- Employers verify without KYC; freelancers gain portable reputation.

---

## Getting started

```bash
# From the repository root
npm install
npm run dev        # start the app at http://localhost:5173
npm test           # run the vitest suite
npm run build      # production build → dist/
```

### Favicons & social preview

Generated by `scripts/make-assets.mjs` (pure Node, no image libs):

| File | Purpose |
|---|---|
| `public/favicon.svg` | Browser-tab SVG (green shield mark on dark card) |
| `public/favicon-32.png` | PNG fallback for older browsers |
| `public/apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `public/icon-192.png` / `icon-512.png` | Android / PWA icons |
| `public/og-image.png` | Social-preview image (1200×630) — WhatsApp, Discord, X |
| `assets/logo.svg` | Full wordmark used in this README |

> **After deploying**, replace every `og-image.png` in the `<meta>` tags
> with your actual production URL (e.g.
> `https://yourusername.github.io/midnight-hack/og-image.png`) so WhatsApp,
> Slack, and Twitter can fetch the image.

### Demo flow

1. Land → **Launch App** → **Connect Wallet** (simulated Lace connect).
2. On the **Dashboard**, review the verification queue (filter by proof type).
3. **Generate Proof** → pick a type (Income / Rating / Jobs), drag the
   threshold slider, watch the on-device proof steps, and read only the
   disclosed boolean result.
4. Switch to the **Freelancer View** and **Mobile App** to see credential
   carrying and portable reputation.

---

## Midnight integration

The frontend is architected so the MidnightJS SDK drops in behind two hooks:

| Hook | File | Role |
|---|---|---|
| `useWallet()` | `src/hooks/useWallet.ts` | swap the mock `connect()` for Lace/`@midnight-ntwrk/wallet` |
| `useContract()` | `src/hooks/useContract.ts` | swap mock proof/verify for deployed `shieldrate.compact` calls |

Each hook mirrors the contract's entry points, so going live is a localized
change in one file per hook.

---

## CI/CD

- **ci.yml** — installs with `npm ci`, runs typecheck, the test suite, and a
  production build on Node 20 and 22 for every push/PR. Also sanity-checks the
  Compact contract (ledger + witness + circuit present).
- **deploy.yml** — on push to `main`, builds and publishes `dist/` to **GitHub
  Pages** (enable Pages → *GitHub Actions* in repo settings).
- **issues.yml** — posts a helpful triage comment on every new issue.

## Roadmap

- **Wave 2:** employer batch verification, proof expiration, reputation
  portability across mock marketplaces. ($4,000)
- **Wave 3:** multi-chain verification, third-party verification API, real
  marketplace partnerships. ($5,000)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues? See
[SECURITY.md](SECURITY.md). Code of conduct:
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[Apache License 2.0](LICENSE)

---

<sub>ShieldRate — Midnight Buildathon Wave 1 · Zero-knowledge reputation for the gig economy.</sub>