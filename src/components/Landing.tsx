import type { WalletState } from "../types";

interface LandingProps {
  wallet: WalletState;
  onConnect: () => void;
  onEnter: () => void;
  onMobile: () => void;
}

const NAV = ["How it works", "For Freelancers", "For Employers", "Docs"];

const STATS = [
  { value: "2,847", label: "Verified Freelancers" },
  { value: "$4.2M", label: "Private Earnings Proven" },
  { value: "12,400+", label: "ZK Proofs Generated" },
  { value: "0", label: "Data Exposures" },
];

export function Landing({ wallet, onConnect, onEnter, onMobile }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-5">
      <div className="w-full max-w-[1200px] bg-night-900 border border-night-800 rounded-2xl overflow-hidden">
        {/* Nav */}
        <nav className="flex items-center justify-between px-10 py-5 border-b border-night-800">
          <div className="text-xl font-extrabold tracking-tight text-white">
            shield<span className="text-rate-500">rate</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-mist-500">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-neutral-200 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <button className="btn-primary" onClick={onEnter}>
            Launch App
          </button>
        </nav>

        {/* Hero */}
        <div className="px-10 md:px-16 py-14 md:py-20 flex items-center gap-16 flex-col-reverse lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="badge-live">Live on Midnight Testnet</div>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.05] text-white">
              Prove your worth.
              <br />
              Reveal nothing.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-mist-500 max-w-[480px] mx-auto lg:mx-0">
              ShieldRate lets freelancers and gig workers prove income,
              reputation, and credentials using zero-knowledge proofs — without
              exposing any personal data.
            </p>
            <div className="mt-8 flex gap-3 justify-center lg:justify-start">
              {wallet.connected ? (
                <button className="btn-primary" onClick={onEnter}>
                  Open Dashboard
                </button>
              ) : (
                <button className="btn-primary" onClick={onConnect}>
                  {wallet.connected ? "Open Dashboard" : "Connect Wallet"}
                </button>
              )}
              <button className="btn-secondary" onClick={onMobile}>
                View Freelancer App
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px]">
              {[
                { size: "100%", inset: "0" },
                { size: "78%", inset: "11%" },
                { size: "57%", inset: "21%" },
              ].map((ring, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-night-800"
                  style={{
                    width: ring.size,
                    height: ring.size,
                    top: ring.inset,
                    left: ring.inset,
                    borderColor: i === 1 ? "#14532d" : undefined,
                  }}
                />
              ))}
              <div className="absolute top-[62px] left-[62px] w-20 h-20 md:top-[100px] md:left-[100px] md:w-20 md:h-20 bg-rate-900 rounded-2xl flex items-center justify-center text-4xl">
                🛡
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-between gap-8 px-10 py-6 border-t border-night-800">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-mist-600 mt-1 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}