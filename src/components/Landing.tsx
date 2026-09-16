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
  { code: "01", title: "Criteria committed first", desc: "The employer fixes one qualification policy for the job before seeing any holder outcome.", accent: "var(--copper)" },
  { code: "02", title: "Issuer attested", desc: "Private work facts arrive signed by a registered provider before Compact evaluates them.", accent: "var(--mineral)" },
  { code: "03", title: "Scoped identity", desc: "The public result uses an opportunity-scoped subject instead of a reusable worker identity.", accent: "var(--iris)" },
  { code: "04", title: "Pass-only publication", desc: "Qualification produces a receipt. Refusal or failure leaves no holder-specific public rejection trail.", accent: "var(--verify)" },
];

const CANONICAL = {
  contract: "c67fcd95e1620693817a1248bceda34e507d39416a7e9c3038ad89f9844513d2",
  request: "d7f42cc52438981bcd093e39c4e738004d9ff9b26af7348f4cea8abe690c9ed1",
  requestBlock: "2575087",
  verification: "6eef4d8dfd28dcee6dd95502e4baf14b1838525fc8cc6b2b67c94d8c618583b1",
  qualificationBlock: "2575167",
};

export function Landing({ wallet, onConnect, onEnter, onMobile }: LandingProps) {
  const live = executionMode() === "midnight-live";

  return (
    <div className="app-shell security-field px-3 py-3 md:px-6 md:py-6">
      <div className="paper-panel mx-auto min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[2px] md:min-h-[calc(100vh-48px)]">
        <nav className="grid min-h-[76px] grid-cols-[1fr_auto] items-center border-b border-[var(--ink)] px-5 md:grid-cols-[1fr_auto_1fr] md:px-8 lg:px-11">
          <button onClick={onEnter} className="flex items-center gap-3 text-left" aria-label="Open SealedFit">
            <BrandMark compact />
            <span>
              <span className="trust-wordmark block text-[19px] text-[var(--ink)]">SEALEDFIT</span>
              <span className="evidence-mono mt-0.5 block text-[7px] uppercase tracking-[0.23em] text-[var(--muted)]">private qualification protocol</span>
            </span>
          </button>

          <div className="hidden items-center border-x border-[var(--rule)] md:flex">
            <a href="#proof" className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]">Live proof</a>
            <a href="#integrity" className="border-l border-[var(--rule)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]">Integrity</a>
          </div>

          <div className="flex items-center justify-end gap-2">
            <span className="mode-badge mode-live hidden sm:inline-flex">Network verified</span>
            <button className="btn-primary" onClick={onEnter}>Open protocol</button>
          </div>
        </nav>

        <main>
          <section className="grid min-h-[690px] grid-cols-1 border-b border-[var(--ink)] xl:grid-cols-[1.04fr_0.96fr]">
            <div className="relative flex flex-col justify-between overflow-hidden border-b border-[var(--ink)] px-6 py-10 md:px-10 md:py-14 xl:border-b-0 xl:border-r xl:px-14 xl:py-16">
              <div className="pointer-events-none absolute -left-20 top-24 h-[360px] w-[360px] rounded-full border border-[rgba(43,97,113,.10)]" />
              <div className="pointer-events-none absolute -left-11 top-32 h-[290px] w-[290px] rounded-full border border-[rgba(43,97,113,.10)]" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="micro-label">SF / COMMIT-BEFORE-KNOW</span>
                  <span className="h-px w-12 bg-[var(--copper)]" />
                  <span className="evidence-mono text-[8px] font-bold uppercase tracking-[0.17em] text-[var(--verify)]">Midnight Preprod · verified</span>
                </div>

                <h1 className="display-serif mt-7 max-w-[760px] text-[52px] leading-[0.91] text-[var(--ink)] sm:text-[68px] lg:text-[82px] xl:text-[88px]">
                  Prove you qualify.
                  <br />
                  <span className="text-[var(--mineral)]">Reveal nothing</span>
                  <br />
                  you do not owe.
                </h1>

                <p className="mt-7 max-w-[650px] text-[16px] leading-7 text-[var(--ink-soft)]">
                  SealedFit makes the employer commit the qualification standard before the worker proves anything. The public outcome is a scoped <strong>QUALIFIED</strong> receipt; the underlying income, rating and work history stay private.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  {wallet.connected ? (
                    <button className="btn-primary" onClick={onEnter}>Open live proof <span aria-hidden>→</span></button>
                  ) : (
                    <button className="btn-primary" onClick={onConnect}>{live ? "Connect wallet" : "Open protocol"} <span aria-hidden>→</span></button>
                  )}
                  <button className="btn-secondary" onClick={onMobile}>See holder boundary</button>
                </div>

                <div className="mt-8 grid max-w-[690px] grid-cols-1 border-y border-[var(--ink)] sm:grid-cols-3">
                  <Boundary tone="requested" label="Commit" value="Block 2,575,087" note="policy fixed first" />
                  <Boundary tone="proven" label="Qualified" value="Block 2,575,167" note="indexed receipt" />
                  <Boundary tone="hidden" label="Hidden" value="Raw work data" note="never published" last />
                </div>
              </div>

              <div className="relative z-10 mt-10 grid gap-3 border-t border-[var(--rule)] pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="micro-label">Canonical run</div>
                  <div className="evidence-mono mt-1.5 break-all text-[8px] font-semibold text-[var(--muted)]">CONTRACT {CANONICAL.contract}</div>
                </div>
                <span className="mode-badge mode-live">NETWORK_VERIFIED</span>
              </div>
            </div>

            <div id="proof" className="guilloche relative flex items-center justify-center overflow-hidden px-5 py-12 md:px-10 xl:py-16">
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 border-r border-[rgba(16,44,49,.18)] bg-[rgba(43,97,113,.055)] xl:block">
                <div className="receipt-serial evidence-mono absolute bottom-8 left-[16px] text-[7px] font-bold uppercase text-[rgba(16,44,49,.38)]">SF · COMMITTED FIRST · PRIVATE PROOF · INDEXED RECEIPT</div>
              </div>

              <div className="proof-instrument-v2 receipt-hover cut-corner w-full max-w-[570px]" tabIndex={0}>
                <div className="grid grid-cols-[16px_1fr]">
                  <div className="security-band" />
                  <div className="relative z-10 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-5 border-b border-[var(--ink)] pb-5">
                      <div className="flex items-center gap-3">
                        <BrandMark compact />
                        <div>
                          <div className="micro-label">Canonical qualification receipt</div>
                          <div className="evidence-mono mt-1.5 text-[9px] font-semibold text-[var(--muted)]">PREPROD / BLOCK {CANONICAL.qualificationBlock}</div>
                        </div>
                      </div>
                      <span className="mode-badge mode-live">Network verified</span>
                    </div>

                    <div className="grid gap-6 py-8 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <div className="micro-label">Committed standard</div>
                        <div className="display-serif mt-2 text-[43px] leading-[.94] text-[var(--ink)]">SR-WORK-02<br />Proven professional</div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[rgba(43,97,113,.35)] bg-[var(--mineral-bg)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[var(--mineral)]">Committed before proof</span>
                          <span className="rounded-full border border-[rgba(105,91,120,.35)] bg-[var(--iris-bg)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[var(--iris)]">Private evidence hidden</span>
                        </div>
                      </div>
                      <div className="verify-seal">Qualified</div>
                    </div>

                    <div className="grid grid-cols-1 border-y border-[var(--ink)] sm:grid-cols-2">
                      <DataCell label="Employer" value="Wallet-scoped" />
                      <DataCell label="Provider" value="Provider 2 · epoch 0" lastCol />
                      <DataCell label="Commit block" value={CANONICAL.requestBlock} />
                      <DataCell label="Qualification block" value={CANONICAL.qualificationBlock} lastCol />
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto] items-stretch gap-3">
                      <div className="redacted-field p-4">
                        <div className="micro-label text-[var(--iris)]">Private evidence field</div>
                        <div className="evidence-mono mt-2 text-[9px] font-bold uppercase tracking-[.16em] text-[var(--iris)]">INCOME / RATING / WORK HISTORY · NOT PUBLISHED</div>
                      </div>
                      <div className="seal-copper grid min-w-[92px] place-items-center border px-3 text-center">
                        <div>
                          <div className="evidence-mono text-[8px] font-bold uppercase tracking-[.12em]">Receipt</div>
                          <div className="mt-1 text-[11px] font-black">INDEXED</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--ink)] pt-5 sm:grid-cols-3">
                      <Meta label="Request" value={`${CANONICAL.request.slice(0, 7)}…${CANONICAL.request.slice(-5)}`} />
                      <Meta label="Verification" value={`${CANONICAL.verification.slice(0, 7)}…${CANONICAL.verification.slice(-5)}`} />
                      <Meta label="State" value="workReceipts=true" />
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

          <section className="grid gap-4 bg-[var(--verify-bg)] px-6 py-5 text-[10px] md:grid-cols-[160px_1fr] md:px-10">
            <span className="font-black uppercase tracking-[0.14em] text-[var(--ink)]">Trust boundary</span>
            <span className="leading-5 text-[var(--ink-soft)]">
              Canonical Preprod run: employer policy finalized at block {CANONICAL.requestBlock} → private qualification finalized at block {CANONICAL.qualificationBlock} → expected verification id independently found in indexed <code>workReceipts</code>. Transaction submission alone is never treated as proof.
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
