const ACTIVITIES = [
  { dot: "bg-rate-500", text: "Income proof submitted to Acme Corp", time: "2m ago" },
  { dot: "bg-blue-500", text: "Rating verification passed", time: "1h ago" },
  { dot: "bg-rate-500", text: "New skill badge earned", time: "3h ago" },
];

const FEATURES = [
  {
    icon: "🔐",
    title: "On-Device Proof Generation",
    desc: "All ZK proofs are generated locally. Raw data never touches the network.",
  },
  {
    icon: "⚡",
    title: "Instant Verification",
    desc: "Employers verify proofs on-chain in under 2 seconds. No manual document review.",
  },
  {
    icon: "🔗",
    title: "Cross-Platform Portable",
    desc: "Your proof reputation travels with you across any marketplace or employer.",
  },
  {
    icon: "🛡",
    title: "Selective Disclosure",
    desc: 'Prove "income > $50k" without revealing if you make $51k or $500k.',
  },
];

const CHIPS = [
  { icon: "💰", label: "Income", status: "✓ Proven" },
  { icon: "⭐", label: "Rating", status: "✓ Proven" },
  { icon: "🎓", label: "Skills", status: "✓ Proven" },
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
        {/* Phone frame */}
        <div className="w-[300px] min-h-[600px] bg-night-900 border border-night-800 rounded-[28px] overflow-hidden flex-shrink-0 flex flex-col">
          <div className="w-[100px] h-6 bg-night-950 rounded-b-[14px] mx-auto flex-shrink-0" />
          <div className="p-[18px] flex flex-col">
            <div className="text-xs text-mist-700">Good evening</div>
            <div className="text-xl font-bold text-white -mt-1 mb-5">Alex Chen</div>

            <div className="bg-night-800 rounded-xl p-5 mb-4">
              <div className="text-[10px] uppercase tracking-wider text-mist-600 mb-1.5">
                Shielded Reputation
              </div>
              <div className="text-[30px] font-extrabold tracking-tight text-white">
                4.87
              </div>
              <div className="text-xs text-mist-500 mt-0.5">From 142 verified reviews</div>
            </div>

            <div className="flex gap-1.5 mb-4">
              {CHIPS.map((c) => (
                <div
                  key={c.label}
                  className="flex-1 bg-night-800 rounded-lg py-3.5 px-2 text-center"
                >
                  <div className="text-lg mb-1">{c.icon}</div>
                  <div className="text-[10px] text-mist-600">{c.label}</div>
                  <div className="text-[9px] text-rate-500 font-semibold mt-1">
                    {c.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[13px] font-semibold text-white mb-2 mt-2">
              Recent Activity
            </div>
            {ACTIVITIES.map((a) => (
              <div key={a.text} className="flex items-center gap-2.5 py-2.5 border-b border-night-800 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full ${a.dot} flex-shrink-0`} />
                <span className="text-xs text-mist-500 flex-1">{a.text}</span>
                <span className="text-[10px] text-mist-700">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 max-w-[420px]">
          <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight text-white leading-tight mb-4">
            Your data stays yours.
            <br />
            Forever.
          </h2>
          <p className="text-base text-mist-500 leading-relaxed mb-8">
            ShieldRate generates zero-knowledge proofs on your device. Your income,
            reviews, and credentials never leave your phone. Only the proof goes
            on-chain.
          </p>
          <div className="flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-rate-900 flex items-center justify-center text-lg flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white">{f.title}</h4>
                  <p className="text-[13px] text-mist-600 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}