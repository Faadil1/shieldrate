const ACTIVITIES = [
  { dot: "bg-rate-500", text: "Income policy receipt created locally", time: "demo" },
  { dot: "bg-blue-500", text: "Employer/job scope bound", time: "demo" },
  { dot: "bg-rate-500", text: "Fresh anti-replay challenge created", time: "demo" },
];

const FEATURES = [
  {
    icon: "🔐",
    title: "Private Claim Evaluation",
    desc: "The live design evaluates issuer-attested credential fields inside the proof instead of publishing raw values.",
  },
  {
    icon: "◎",
    title: "Scoped Reputation",
    desc: "A different pseudonym is derived for each employer and job context to reduce cross-employer linkability.",
  },
  {
    icon: "↻",
    title: "Replay Protected",
    desc: "Employer, job, policy, challenge and expiry are bound into each request, with a request-specific nullifier.",
  },
  {
    icon: "🛡",
    title: "Pass-Only Sharing",
    desc: 'If a policy is not satisfied, ShieldRate produces no shareable receipt. The negative result stays local.',
  },
];

const CHIPS = [
  { icon: "💰", label: "Income", status: "Demo issuer" },
  { icon: "⭐", label: "Rating", status: "Demo issuer" },
  { icon: "🎓", label: "Jobs", status: "Demo issuer" },
];

interface MobileViewProps {
  onBack: () => void;
}

export function MobileView({ onBack }: MobileViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-12">
      <button className="btn-secondary" onClick={onBack}>
        ← Back to app
      </button>
      <div className="flex flex-col lg:flex-row gap-14 items-center lg:items-start w-full max-w-[1200px]">
        <div className="w-[300px] min-h-[600px] bg-night-900 border border-night-800 rounded-[28px] overflow-hidden flex-shrink-0 flex flex-col">
          <div className="w-[100px] h-6 bg-night-950 rounded-b-[14px] mx-auto flex-shrink-0" />
          <div className="p-[18px] flex flex-col">
            <div className="inline-flex self-start rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] uppercase tracking-wider text-amber-300 mb-4">
              Demo attested · local only
            </div>
            <div className="text-xs text-mist-700">Holder view</div>
            <div className="text-xl font-bold text-white -mt-1 mb-5">Private work credential</div>

            <div className="bg-night-800 rounded-xl p-5 mb-4">
              <div className="text-[10px] uppercase tracking-wider text-mist-600 mb-1.5">Current request</div>
              <div className="text-[22px] font-extrabold tracking-tight text-white">Income &gt; $50k</div>
              <div className="text-xs text-mist-500 mt-1">Bound to one employer + one job</div>
            </div>

            <div className="flex gap-1.5 mb-4">
              {CHIPS.map((item) => (
                <div key={item.label} className="flex-1 bg-night-800 rounded-lg py-3.5 px-2 text-center">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] text-mist-600">{item.label}</div>
                  <div className="text-[9px] text-amber-300 font-semibold mt-1">{item.status}</div>
                </div>
              ))}
            </div>

            <div className="text-[13px] font-semibold text-white mb-2 mt-2">Integrity activity</div>
            {ACTIVITIES.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 py-2.5 border-b border-night-800 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot} flex-shrink-0`} />
                <span className="text-xs text-mist-500 flex-1">{item.text}</span>
                <span className="text-[10px] text-mist-700">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-[440px]">
          <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight text-white leading-tight mb-4">
            Privacy claims should be verifiable — not simulated.
          </h2>
          <p className="text-base text-mist-500 leading-relaxed mb-5">
            This screen is the <strong className="text-neutral-300">DEMO_ATTESTED</strong> product flow. It demonstrates the integrity model but does not claim a Midnight transaction or network confirmation.
          </p>
          <p className="text-sm text-mist-600 leading-relaxed mb-8">
            In <strong className="text-neutral-400">MIDNIGHT_LIVE</strong>, the same experience will be backed by the compiled Compact contract, a registered issuer signature, Lace/MidnightJS, and a real receipt. Until then, live mode fails closed.
          </p>
          <div className="flex flex-col gap-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-rate-900 flex items-center justify-center text-lg flex-shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white">{feature.title}</h4>
                  <p className="text-[13px] text-mist-600 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
