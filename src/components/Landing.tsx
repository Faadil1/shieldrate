import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";

interface LandingProps {
  wallet: WalletState;
  onConnect: () => void;
  onEnter: () => void;
  onMobile: () => void;
}

const NAV = ["Integrity", "Receipt anatomy", "Holder view", "Docs"];

const EVIDENCE = [
  ["01", "Issuer attested", "Credential facts are signed before they reach the proof."],
  ["02", "Scoped identity", "Employer and job context receive a different subject pseudonym."],
  ["03", "Replay protected", "Challenge, policy and expiry are bound into every request."],
  ["04", "Pass-only", "A failed predicate creates no public negative receipt."],
];

export function Landing({ wallet, onConnect, onEnter, onMobile }: LandingProps) {
  const live = executionMode() === "midnight-live";

  return (
    <div className="app-shell px-4 py-4 md:px-7 md:py-7">
      <div className="paper-panel mx-auto min-h-[calc(100vh-56px)] max-w-[1420px] overflow-hidden rounded-[6px]">
        <nav className="flex min-h-[72px] items-center justify-between border-b border-[#c8cac2] px-5 md:px-8 lg:px-10">
          <button onClick={onEnter} className="group flex items-baseline gap-2 text-left" aria-label="Open ShieldRate">
            <span className="text-[20px] font-black tracking-[-0.05em] text-[#171b1d]">SHIELDRATE</span>
            <span className="evidence-mono text-[9px] uppercase tracking-[0.18em] text-[#6b706e]">private verification</span>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a key={item} href="#proof-instrument" className="text-[12px] font-semibold text-[#6b706e] transition-colors hover:text-[#171b1d]">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className={`mode-badge hidden sm:inline-flex ${live ? "mode-live" : "mode-demo"}`}>
              {live ? "Midnight live" : "Demo attested"}
            </span>
            <button className="btn-primary" onClick={onEnter}>Open desk</button>
          </div>
        </nav>

        <main>
          <section className="grid min-h-[610px] grid-cols-1 border-b border-[#c8cac2] lg:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-between border-b border-[#c8cac2] px-6 py-10 md:px-10 md:py-14 lg:border-b-0 lg:border-r lg:px-14 lg:py-16">
              <div>
                <div className="micro-label">Private work verification / proof integrity v1</div>
                <h1 className="display-serif mt-7 max-w-[700px] text-[48px] leading-[0.96] text-[#171b1d] sm:text-[64px] lg:text-[76px]">
                  Prove the policy.
                  <br />
                  Keep the evidence private.
                </h1>
                <p className="mt-7 max-w-[610px] text-[17px] leading-7 text-[#565d5a]">
                  ShieldRate converts issuer-attested work credentials into context-bound proof receipts. Employers learn whether a policy is satisfied — not the raw income, rating or work history behind it.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  {wallet.connected ? (
                    <button className="btn-primary" onClick={onEnter}>Enter verification desk <span aria-hidden>→</span></button>
                  ) : (
                    <button className="btn-primary" onClick={onConnect}>{live ? "Connect Lace" : "Enter demo desk"} <span aria-hidden>→</span></button>
                  )}
                  <button className="btn-secondary" onClick={onMobile}>Inspect holder view</button>
                </div>
              </div>

              <div className="mt-14 grid grid-cols-3 border-y border-[#c8cac2]">
                <Boundary label="Requested" value="Income ≥ $50k" />
                <Boundary label="Proven" value="Policy passed" />
                <Boundary label="Hidden" value="Raw income" last />
              </div>
            </div>

            <div id="proof-instrument" className="hairline-grid flex items-center justify-center px-5 py-12 md:px-10 lg:py-16">
              <div className="instrument receipt-hover w-full max-w-[510px] p-6 md:p-8" tabIndex={0}>
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-6 border-b border-[#171b1d] pb-5">
                    <div>
                      <div className="micro-label">ShieldRate / private claim receipt</div>
                      <div className="evidence-mono mt-2 text-[11px] text-[#6b706e]">SR · CANONICAL · 0001</div>
                    </div>
                    <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-6 py-8">
                    <div>
                      <div className="micro-label">Claim requested</div>
                      <div className="display-serif mt-2 text-[38px] leading-none text-[#171b1d]">Income ≥ $50,000</div>
                      <p className="mt-3 max-w-[310px] text-[13px] leading-5 text-[#6b706e]">
                        Bound to one employer, one role, one challenge and one expiry window.
                      </p>
                    </div>
                    <div className="verify-seal" aria-label="Passed">Passed</div>
                  </div>

                  <div className="border-t border-[#c8cac2]">
                    <ReceiptRow label="Issuer" value="Registered provider / epoch current" />
                    <ReceiptRow label="Subject" value="Scoped pseudonym / no stable identity" mono />
                    <ReceiptRow label="Publication" value="Pass-only receipt" />
                    <ReceiptRow label="Raw value" value="Not disclosed" emph />
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#171b1d] pt-5 md:grid-cols-3">
                    <Meta label="Request" value="…A7D91C" />
                    <Meta label="Nullifier" value="…204E6B" />
                    <Meta label="Fresh until" value="31 DEC 2026" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {EVIDENCE.map(([index, title, desc], idx) => (
              <article key={title} className={`min-h-[180px] px-7 py-7 ${idx < EVIDENCE.length - 1 ? "border-b md:border-r xl:border-b-0" : ""} border-[#c8cac2]`}>
                <div className="evidence-mono text-[10px] font-bold text-[#1f6b4d]">{index}</div>
                <h2 className="mt-7 text-[15px] font-bold text-[#171b1d]">{title}</h2>
                <p className="mt-2 text-[12px] leading-5 text-[#6b706e]">{desc}</p>
              </article>
            ))}
          </section>

          <section className={`flex flex-col gap-3 border-t border-[#c8cac2] px-6 py-5 text-[11px] md:flex-row md:items-center md:justify-between md:px-10 ${live ? "bg-[#dbece2]" : "bg-[#f0e3c9]"}`}>
            <span className="font-bold uppercase tracking-[0.12em] text-[#343a3d]">Trust boundary</span>
            <span className="max-w-[880px] text-[#565d5a]">
              {live
                ? "A receipt is shown as verified only after a real Midnight transaction finalizes and the expected receipt is found independently in indexed contract state."
                : "This deployment is explicitly DEMO_ATTESTED. It demonstrates the integrity model and does not simulate a Midnight transaction, block or network confirmation."}
            </span>
          </section>
        </main>
      </div>
    </div>
  );
}

function Boundary({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`py-4 pr-4 ${last ? "pl-4" : "border-r border-[#c8cac2] px-4 first:pl-0"}`}>
      <div className="micro-label">{label}</div>
      <div className="mt-2 text-[12px] font-semibold text-[#171b1d]">{value}</div>
    </div>
  );
}

function ReceiptRow({ label, value, mono = false, emph = false }: { label: string; value: string; mono?: boolean; emph?: boolean }) {
  return (
    <div className="grid grid-cols-[112px_1fr] gap-4 border-b border-[#c8cac2] py-3 text-[12px] last:border-b-0">
      <span className="text-[#6b706e]">{label}</span>
      <span className={`${mono ? "evidence-mono text-[10px]" : ""} ${emph ? "font-bold text-[#1f6b4d]" : "font-semibold text-[#343a3d]"}`}>{value}</span>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="micro-label">{label}</div>
      <div className="evidence-mono mt-1.5 text-[10px] font-bold text-[#343a3d]">{value}</div>
    </div>
  );
}
