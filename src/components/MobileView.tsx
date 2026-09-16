import { BrandMark } from "./BrandMark";

const ACTIVITIES = [
  { code: "01", text: "Policy receipt prepared", tone: "verify" },
  { code: "02", text: "Employer + role scope bound", tone: "mineral" },
  { code: "03", text: "Fresh anti-replay challenge", tone: "iris" },
];

const FEATURES = [
  { code: "P1", title: "Consent first", desc: "The holder sees who is asking and exactly which policy will be tested." },
  { code: "P2", title: "Private evaluation", desc: "Issuer-attested fields stay holder-side while the proof evaluates them." },
  { code: "P3", title: "Scoped identity", desc: "A different pseudonym is derived for each employer and role." },
  { code: "P4", title: "Pass-only sharing", desc: "A failed policy creates no public negative receipt." },
];

interface MobileViewProps { onBack: () => void; }

export function MobileView({ onBack }: MobileViewProps) {
  return (
    <div className="app-shell security-field px-3 py-5 md:px-7 md:py-8">
      <div className="mx-auto max-w-[1220px]">
        <div className="mb-7 flex flex-col gap-4 border-b border-[var(--ink)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="micro-label">Holder surface / mobile credential pass</div>
            <h1 className="display-serif mt-2 max-w-[820px] text-[40px] leading-[.95] text-[var(--ink)] md:text-[52px]">Consent, scope and proof — without shrinking an admin dashboard onto a phone.</h1>
          </div>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>

        <div className="grid grid-cols-1 gap-11 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-16">
          <div className="mx-auto w-full max-w-[350px] bg-[var(--ink)] p-[8px] shadow-[14px_18px_0_rgba(16,44,49,.10)] cut-corner">
            <div className="min-h-[660px] overflow-hidden bg-[var(--paper-white)]">
              <div className="security-band h-[34px]" />
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><BrandMark compact /><div><div className="micro-label">Criterion holder</div><div className="mt-1 text-[14px] font-black tracking-[-.03em] text-[var(--ink)]">Credential pass</div></div></div>
                  <span className="mode-badge mode-demo">Demo</span>
                </div>

                <div className="proof-instrument-v2 mt-6 p-5">
                  <div className="relative z-10">
                    <div className="micro-label">Current request</div>
                    <div className="display-serif mt-3 text-[31px] leading-[.94] text-[var(--ink)]">Income<br />≥ $50k</div>
                    <div className="mt-3 evidence-mono text-[8px] uppercase tracking-[.1em] text-[var(--muted)]">Employer 001 · Role 041 · Fresh challenge</div>
                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <MiniBoundary tone="proven" label="Shared" value="Passed" />
                      <MiniBoundary tone="hidden" label="Hidden" value="Raw value" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="micro-label">Credential register</div>
                  <div className="mt-3 grid grid-cols-3 border-y border-[var(--ink)]">
                    <CredentialChip code="INC" label="Income" tone="mineral" />
                    <CredentialChip code="REP" label="Rating" tone="iris" />
                    <CredentialChip code="JOB" label="Jobs" tone="verify" last />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="micro-label">Integrity activity</div>
                  <div className="status-rail mt-3">
                    {ACTIVITIES.map((item) => (
                      <div key={item.text} className="grid grid-cols-[16px_26px_1fr] items-center gap-2 py-3">
                        <span className="status-dot" />
                        <span className={`evidence-mono text-[7px] font-black ${item.tone === "verify" ? "text-[var(--verify)]" : item.tone === "mineral" ? "text-[var(--mineral)]" : "text-[var(--iris)]"}`}>{item.code}</span>
                        <span className="text-[9px] font-bold leading-4 text-[var(--ink-soft)]">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[690px] lg:pt-7">
            <div className="micro-label">Mobile product thesis</div>
            <h2 className="display-serif mt-3 text-[48px] leading-[.94] text-[var(--ink)] md:text-[62px]">A private pass that explains the boundary before asking for consent.</h2>
            <p className="mt-6 max-w-[620px] text-[13px] leading-7 text-[var(--ink-soft)]">The holder surface centers the four questions that matter: who is asking, what is being tested, what can be shared, and what remains private.</p>

            <div className="mt-9 grid grid-cols-1 border-y border-[var(--ink)] sm:grid-cols-2">
              {FEATURES.map((feature, index) => (
                <article key={feature.code} className={`min-h-[190px] p-5 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < 2 ? "border-b" : ""} border-[var(--rule)]`}>
                  <span className="evidence-mono text-[8px] font-black text-[var(--copper)]">{feature.code}</span>
                  <h3 className="display-serif mt-6 text-[23px] leading-none text-[var(--ink)]">{feature.title}</h3>
                  <p className="mt-3 text-[10px] leading-5 text-[var(--muted)]">{feature.desc}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-[6px_1fr] border border-[rgba(173,113,47,.35)] bg-[var(--amber-bg)]/65">
              <div className="bg-[var(--amber)]" />
              <p className="px-5 py-4 text-[10px] leading-5 text-[var(--ink-soft)]">This is a product concept surface. Demo mode does not imply a Midnight transaction. Live mode must be backed by the compiled contract, Lace and a confirmed indexed receipt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniBoundary({ tone, label, value }: { tone: "proven" | "hidden"; label: string; value: string }) {
  return <div className={`border p-3 ${tone === "proven" ? "privacy-proven" : "privacy-hidden"}`}><div className="micro-label !text-current text-[7px]">{label}</div><div className="mt-1 text-[9px] font-black">{value}</div></div>;
}
function CredentialChip({ code, label, tone, last = false }: { code: string; label: string; tone: "mineral" | "iris" | "verify"; last?: boolean }) {
  const color = tone === "mineral" ? "text-[var(--mineral)]" : tone === "iris" ? "text-[var(--iris)]" : "text-[var(--verify)]";
  return <div className={`px-2 py-3 text-center ${last ? "" : "border-r border-[var(--rule)]"}`}><div className={`evidence-mono text-[7px] font-black ${color}`}>{code}</div><div className="mt-1.5 text-[8px] font-bold text-[var(--ink-soft)]">{label}</div></div>;
}
