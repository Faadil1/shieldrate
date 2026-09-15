const ACTIVITIES = [
  { code: "01", text: "Income policy receipt created", time: "demo" },
  { code: "02", text: "Employer + job context bound", time: "demo" },
  { code: "03", text: "Fresh anti-replay challenge created", time: "demo" },
];

const FEATURES = [
  {
    code: "P1",
    title: "Private evaluation",
    desc: "Issuer-attested credential fields are evaluated without publishing their raw values.",
  },
  {
    code: "P2",
    title: "Scoped identity",
    desc: "Each employer and job context derives a different pseudonym to reduce cross-employer linkability.",
  },
  {
    code: "P3",
    title: "Replay protected",
    desc: "Employer, job, policy, challenge and expiry are bound into every request.",
  },
  {
    code: "P4",
    title: "Pass-only sharing",
    desc: "If a policy fails, ShieldRate creates no public negative receipt.",
  },
];

interface MobileViewProps {
  onBack: () => void;
}

export function MobileView({ onBack }: MobileViewProps) {
  return (
    <div className="app-shell px-4 py-6 md:px-7 md:py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex items-center justify-between border-b border-[#c8cac2] pb-5">
          <div>
            <div className="micro-label">Holder surface / mobile concept</div>
            <h1 className="display-serif mt-2 text-[36px] leading-none text-[#171b1d]">A private credential pass, not a wallet dashboard.</h1>
          </div>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[360px_1fr] lg:items-start lg:gap-16">
          <div className="mx-auto w-full max-w-[340px] rounded-[34px] border border-[#171b1d] bg-[#171b1d] p-[9px] shadow-[12px_18px_0_rgba(23,27,29,0.08)]">
            <div className="min-h-[650px] overflow-hidden rounded-[26px] bg-[#f8f7f0]">
              <div className="mx-auto h-5 w-[104px] rounded-b-[12px] bg-[#171b1d]" />
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="micro-label">ShieldRate holder</div>
                    <div className="mt-1 text-[16px] font-black tracking-[-0.03em] text-[#171b1d]">Private credential pass</div>
                  </div>
                  <span className="mode-badge mode-demo">Demo</span>
                </div>

                <div className="instrument mt-6 p-5">
                  <div className="relative z-10">
                    <div className="micro-label">Current request</div>
                    <div className="display-serif mt-3 text-[29px] leading-none text-[#171b1d]">Income ≥ $50k</div>
                    <div className="mt-3 text-[10px] leading-4 text-[#6b706e]">One employer · one job · one challenge</div>
                    <div className="mt-6 grid grid-cols-2 border-y border-[#171b1d]">
                      <MiniBoundary label="Shared" value="Passed" />
                      <MiniBoundary label="Hidden" value="Raw value" last />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="micro-label">Credential fields</div>
                  <div className="mt-3 grid grid-cols-3 border-y border-[#c8cac2]">
                    <CredentialChip code="INC" label="Income" />
                    <CredentialChip code="REP" label="Rating" />
                    <CredentialChip code="JOB" label="Jobs" last />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="micro-label">Integrity activity</div>
                  <div className="mt-3 border-t border-[#171b1d]">
                    {ACTIVITIES.map((item) => (
                      <div key={item.text} className="grid grid-cols-[26px_1fr_auto] items-center gap-2 border-b border-[#c8cac2] py-3">
                        <span className="evidence-mono text-[8px] font-black text-[#1f6b4d]">{item.code}</span>
                        <span className="text-[10px] font-semibold leading-4 text-[#4d5451]">{item.text}</span>
                        <span className="evidence-mono text-[8px] text-[#9da39d]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[660px] lg:pt-7">
            <div className="micro-label">Mobile product thesis</div>
            <h2 className="display-serif mt-3 text-[46px] leading-[0.98] text-[#171b1d] md:text-[58px]">The phone shows consent and scope. Not a miniature admin dashboard.</h2>
            <p className="mt-6 max-w-[610px] text-[14px] leading-7 text-[#565d5a]">
              The holder surface centers the thing the freelancer needs to understand before sharing anything: who is asking, what policy is being tested, what will be disclosed, and what remains private.
            </p>

            <div className="mt-9 grid grid-cols-1 border-y border-[#171b1d] sm:grid-cols-2">
              {FEATURES.map((feature, index) => (
                <article key={feature.code} className={`min-h-[180px] p-5 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < 2 ? "border-b" : ""} border-[#c8cac2]`}>
                  <span className="evidence-mono text-[9px] font-black text-[#1f6b4d]">{feature.code}</span>
                  <h3 className="mt-6 text-[13px] font-black text-[#171b1d]">{feature.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-[#6b706e]">{feature.desc}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-[#9a5b1e] bg-[#f0e3c9]/55 px-5 py-4 text-[11px] leading-5 text-[#565d5a]">
              This screen is explicitly a product concept. In demo mode it does not imply a Midnight transaction. In live mode, the same hierarchy must be backed by the compiled contract, Lace and an indexed receipt.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniBoundary({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`px-3 py-3 ${last ? "" : "border-r border-[#c8cac2]"}`}>
      <div className="micro-label text-[8px]">{label}</div>
      <div className={`mt-1 text-[10px] font-black ${label === "Hidden" ? "text-[#1f6b4d]" : "text-[#343a3d]"}`}>{value}</div>
    </div>
  );
}

function CredentialChip({ code, label, last = false }: { code: string; label: string; last?: boolean }) {
  return (
    <div className={`px-2 py-3 text-center ${last ? "" : "border-r border-[#c8cac2]"}`}>
      <div className="evidence-mono text-[8px] font-black text-[#1f6b4d]">{code}</div>
      <div className="mt-1.5 text-[9px] font-bold text-[#4d5451]">{label}</div>
    </div>
  );
}
