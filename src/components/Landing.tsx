import type { WalletState } from "../types";

interface LandingProps {
  wallet: WalletState;
  onConnect: () => void;
  onEnter: () => void;
  onMobile: () => void;
}

const NAV = ["Integrity model", "For Freelancers", "For Employers", "Docs"];

const STATS = [
  { value: "3", label: "Protected Claim Types" },
  { value: "4", label: "Context Bindings" },
  { value: "0", label: "Failed Claims Published" },
  { value: "Fail-closed", label: "Live Adapter Policy" },
];

export function Landing({ wallet, onConnect, onEnter, onMobile }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-5">
      <div className="w-full max-w-[1200px] bg-night-900 border border-night-800 rounded-2xl overflow-hidden">
        <nav className="flex items-center justify-between px-10 py-5 border-b border-night-800">
          <div className="text-xl font-extrabold tracking-tight text-white">
            shield<span className="text-rate-500">rate</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-mist-500">
            {NAV.map((item) => (
              <a key={item} href="#" className="hover:text-neutral-200 transition-colors">{item}</a>
            ))}
          </div>
          <button className="btn-primary" onClick={onEnter}>Launch App</button>
        </nav>

        <div className="px-10 md:px-16 py-14 md:py-20 flex items-center gap-16 flex-col-reverse lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              Proof Integrity v1 · Demo Attested
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.05] text-white">
              Prove the claim.
              <br />
              Not the raw data.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-mist-500 max-w-[520px] mx-auto lg:mx-0">
              ShieldRate turns issuer-attested work credentials into context-bound private proofs. The demo labels every trust boundary explicitly and never simulates a Midnight confirmation.
            </p>
            <div className="mt-8 flex gap-3 justify-center lg:justify-start">
              {wallet.connected ? (
                <button className="btn-primary" onClick={onEnter}>Open Dashboard</button>
              ) : (
                <button className="btn-primary" onClick={onConnect}>Connect Demo Wallet</button>
              )}
              <button className="btn-secondary" onClick={onMobile}>View Freelancer App</button>
            </div>
            <p className="mt-4 text-[11px] text-mist-700 max-w-[520px] mx-auto lg:mx-0">
              MIDNIGHT_LIVE is intentionally fail-closed until the real Lace/MidnightJS adapter, deployed contract address and verifiable transaction receipts are wired.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px]">
              {[{ size: "100%", inset: "0" }, { size: "78%", inset: "11%" }, { size: "57%", inset: "21%" }].map((ring, i) => (
                <div key={i} className="absolute rounded-full border border-night-800" style={{ width: ring.size, height: ring.size, top: ring.inset, left: ring.inset, borderColor: i === 1 ? "#14532d" : undefined }} />
              ))}
              <div className="absolute top-[62px] left-[62px] w-20 h-20 md:top-[100px] md:left-[100px] md:w-20 md:h-20 bg-rate-900 rounded-2xl flex items-center justify-center text-4xl">🛡</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-8 px-10 py-6 border-t border-night-800">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-mist-600 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
