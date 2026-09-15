import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";
import { BrandMark } from "./BrandMark";

interface LandingProps {
  wallet: WalletState;
  onConnect: () => void;
  onEnter: () => void;
  onMobile: () => void;
}

const EVIDENCE = [
  { code: "01", title: "Issuer attested", desc: "Credential facts arrive signed before the proof evaluates them.", accent: "var(--mineral)" },
  { code: "02", title: "Scoped identity", desc: "Each employer and job receives a different holder pseudonym.", accent: "var(--iris)" },
  { code: "03", title: "Replay protected", desc: "Challenge, policy and expiry are bound into one request context.", accent: "var(--amber)" },
  { code: "04", title: "Pass-only", desc: "A failed predicate creates no public negative receipt.", accent: "var(--verify)" },
];

export function Landing({ wallet, onConnect, onEnter, onMobile }: LandingProps) {
  const live = executionMode() === "midnight-live";

  return (
    <div className="app-shell security-field px-3 py-3 md:px-6 md:py-6">
      <div className="paper-panel mx-auto min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[2px] md:min-h-[calc(100vh-48px)]">
        <nav className="grid min-h-[76px] grid-cols-[1fr_auto] items-center border-b border-[var(--ink)] px-5 md:grid-cols-[1fr_auto_1fr] md:px-8 lg:px-11">
          <button onClick={onEnter} className="flex items-center gap-3 text-left" aria-label="Open ShieldRate">
            <BrandMark compact />
            <span>
              <span className="trust-wordmark block text-[19px] text-[var(--ink)]">SHIELDRATE</span>
              <span className="evidence-mono mt-0.5 block text-[7px] uppercase tracking-[0.23em] text-[var(--muted)]">private verification bureau</span>
            </span>
          </button>

          <div className="hidden items-center border-x border-[var(--rule)] md:flex">
            <a href="#instrument" className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]">Instrument</a>
            <a href="#integrity" className="border-l border-[var(--rule)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]">Integrity</a>
          </div>

          <div className="flex items-center justify-end gap-2">
            <span className={`mode-badge hidden sm:inline-flex ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
            <button className="btn-primary" onClick={onEnter}>Open bureau</button>
          </div>
        </nav>

        <main>
          <section className="grid min-h-[690px] grid-cols-1 border-b border-[var(--ink)] xl:grid-cols-[1.04fr_0.96fr]">
            <div className="relative flex flex-col justify-between overflow-hidden border-b border-[var(--ink)] px-6 py-10 md:px-10 md:py-14 xl:border-b-0 xl:border-r xl:px-14 xl:py-16">
              <div className="pointer-events-none absolute -left-20 top-24 h-[360px] w-[360px] rounded-full border border-[rgba(43,97,113,.10)]" />
              <div className="pointer-events-none absolute -left-11 top-32 h-[290px] w-[290px] rounded-full border border-[rgba(43,97,113,.10)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="micro-label">SR / TRUST INSTRUMENT 02</span>
                  <span className="h-px w-12 bg-[var(--copper)]" />
                  <span className="evidence-mono text-[8px] font-bold uppercase tracking-[0.17em] text-[var(--copper)]">Proof integrity</span>
                </div>

                <h1 className="display-serif mt-7 max-w-[760px] text-[52px] leading-[0.91] text-[var(--ink)] sm:text-[68px] lg:text-[82px] xl:text-[88px]">
                  Prove the policy.
                  <br />
                  <span className="text-[var(--mineral)]">Keep the evidence</span>
                  <br />
                  private.
                </h1>

                <p className="mt-7 max-w-[630px] text-[16px] leading-7 text-[var(--ink-soft)]">
                  ShieldRate turns issuer-attested work credentials into scoped proof receipts. The employer receives a trustworthy answer; the underlying income, reputation and work history remain holder-side evidence.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  {wallet.connected ? (
                    <button className="btn-primary" onClick={onEnter}>Enter verification bureau <span aria-hidden>→</span></button>
                  ) : (
                    <button className="btn-primary" onClick={onConnect}>{live ? "Connect Lace" : "Enter demo bureau"} <span aria-hidden>→</span></button>
                  )}
                  <button className="btn-secondary" onClick={onMobile}>Inspect holder dossier</button>
                </div>
              </div>

              <div className="relative z-10 mt-14 grid grid-cols-1 border-y border-[var(--ink)] sm:grid-cols-3">
                <Boundary tone="requested" label="Requested" value="Income ≥ $50k" note="standard band" />
                <Boundary tone="proven" label="Proven" value="Policy passed" note="shareable receipt" />
                <Boundary tone="hidden" label="Hidden" value="Raw income" note="never published" last />
              </div>
            </div>

            <div id="instrument" className="guilloche relative flex items-center justify-center overflow-hidden px-5 py-12 md:px-10 xl:py-16">
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 border-r border-[rgba(16,44,49,.18)] bg-[rgba(43,97,113,.055)] xl:block">
                <div className="receipt-serial evidence-mono absolute bottom-8 left-[16px] text-[7px] font-bold uppercase text-[rgba(16,44,49,.38)]">SR · ISSUER ATTESTED · CONTEXT SCOPED · PASS ONLY</div>
              </div>

              <div className="proof-instrument-v2 receipt-hover cut-corner w-full max-w-[570px]" tabIndex={0}>
                <div className="grid grid-cols-[16px_1fr]">
                  <div className="security-band" />
                  <div className="relative z-10 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-5 border-b border-[var(--ink)] pb-5">
                      <div className="flex items-center gap-3">
                        <BrandMark compact />
                        <div>
                          <div className="micro-label">Private verification receipt</div>
                          <div className="evidence-mono mt-1.5 text-[9px] font-semibold text-[var(--muted)]">SR-CANON-0001 / PREVIEW</div>
                        </div>
                      </div>
                      <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
                    </div>

                    <div className="grid gap-6 py-8 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <div className="micro-label">Requested claim</div>
                        <div className="display-serif mt-2 text-[43px] leading-[.94] text-[var(--ink)]">Income policy<br />≥ $50,000</div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[rgba(43,97,113,.35)] bg-[var(--mineral-bg)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[var(--mineral)]">Employer scoped</span>
                          <span className="rounded-full border border-[rgba(105,91,120,.35)] bg-[var(--iris-bg)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[var(--iris)]">Raw value hidden</span>
                        </div>
                      </div>
                      <div className="verify-seal">Passed</div>
                    </div>

                    <div className="grid grid-cols-1 border-y border-[var(--ink)] sm:grid-cols-2">
                      <DataCell label="Issuer" value="Registered provider" />
                      <DataCell label="Scope" value="Employer + role + challenge" lastCol />
                      <DataCell label="Subject" value="Context pseudonym" />
                      <DataCell label="Publication" value="Pass-only receipt" lastCol />
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto] items-stretch gap-3">
                      <div className="redacted-field p-4">
                        <div className="micro-label text-[var(--iris)]">Private evidence field</div>
                        <div className="evidence-mono mt-2 text-[9px] font-bold uppercase tracking-[.16em] text-[var(--iris)]">RAW VALUE / REDACTED BY DESIGN</div>
                      </div>
                      <div className="seal-copper grid min-w-[92px] place-items-center border px-3 text-center">
                        <div>
                          <div className="evidence-mono text-[8px] font-bold uppercase tracking-[.12em]">Receipt</div>
                          <div className="mt-1 text-[11px] font-black">VALID</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--ink)] pt-5">
                      <Meta label="Request" value="…A7D91C" />
                      <Meta label="Nullifier" value="…204E6B" />
                      <Meta label="Fresh until" value="31 DEC 2026" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="integrity" className="grid grid-cols-1 border-b border-[var(--ink)] md:grid-cols-2 xl:grid-cols-4">
            {EVIDENCE.map((item, index) => (
              <article key={item.code} className={`min-h-[205px] px-7 py-7 ${index < EVIDENCE.length - 1 ? "border-b md:border-r xl:border-b-0" : ""} border-[var(--rule)]`}>
                <div className="flex items-center justify-between">
                  <span className="evidence-mono text-[9px] font-black" style={{ color: item.accent }}>{item.code}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: item.accent }} />
                </div>
                <h2 className="display-serif mt-8 text-[24px] leading-none text-[var(--ink)]">{item.title}</h2>
                <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">{item.desc}</p>
              </article>
            ))}
          </section>

          <section className={`grid gap-4 px-6 py-5 text-[10px] md:grid-cols-[160px_1fr] md:px-10 ${live ? "bg-[var(--verify-bg)]" : "bg-[var(--amber-bg)]"}`}>
            <span className="font-black uppercase tracking-[0.14em] text-[var(--ink)]">Trust boundary</span>
            <span className="leading-5 text-[var(--ink-soft)]">
              {live
                ? "Verified means transaction finalized + expected receipt independently found in indexed Midnight contract state. Submission alone is never enough."
                : "DEMO_ATTESTED is explicit. This build demonstrates the integrity model and never invents a Midnight transaction, block or network confirmation."}
            </span>
          </section>
        </main>
      </div>
    </div>
  );
}

function Boundary({ tone, label, value, note, last = false }: { tone: "requested" | "proven" | "hidden"; label: string; value: string; note: string; last?: boolean }) {
  const toneClass = tone === "requested" ? "privacy-requested" : tone === "proven" ? "privacy-proven" : "privacy-hidden";
  return (
    <div className={`border-b border-[var(--rule)] p-4 sm:border-b-0 ${last ? "" : "sm:border-r"} ${toneClass}`}>
      <div className="micro-label !text-current">{label}</div>
      <div className="mt-2 text-[13px] font-black">{value}</div>
      <div className="evidence-mono mt-1 text-[8px] uppercase tracking-[.12em] opacity-70">{note}</div>
    </div>
  );
}

function DataCell({ label, value, lastCol = false }: { label: string; value: string; lastCol?: boolean }) {
  return (
    <div className={`border-b border-[var(--rule)] px-3 py-3 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 ${lastCol ? "sm:border-l" : ""}`}>
      <div className="micro-label">{label}</div>
      <div className="mt-1.5 text-[10px] font-bold text-[var(--ink-soft)]">{value}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="micro-label">{label}</div>
      <div className="evidence-mono mt-1.5 text-[9px] font-bold text-[var(--ink-soft)]">{value}</div>
    </div>
  );
}
