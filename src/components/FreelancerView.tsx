import { FREELANCER_CREDENTIALS } from "../data";
import type { WalletState } from "../types";

interface FreelancerViewProps {
  wallet: WalletState;
  onGenerateProof: () => void;
  onBack: () => void;
}

export function FreelancerView({ wallet, onGenerateProof, onBack }: FreelancerViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="card w-full max-w-[880px] overflow-hidden">
        <div className="px-8 py-6 border-b border-night-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">My Private Credentials</h1>
            <p className="text-sm text-mist-600 mt-0.5">{wallet.connected ? wallet.displayAddress : "Not connected"} · demo issuer registry</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary" onClick={onBack}>← Back</button>
            <button className="btn-primary" onClick={onGenerateProof}>Generate Proof</button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FREELANCER_CREDENTIALS.map((cred) => (
            <div key={cred.id} className="bg-night-800/60 border border-night-700 rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-lg bg-night-700 flex items-center justify-center text-xl">{cred.icon}</div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Demo attested</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-mist-600">{cred.label}</div>
              <div className="text-2xl font-bold text-white mt-1">{cred.value}</div>
              <div className="text-xs text-mist-500 mt-1">{cred.detail}</div>
              <div className="border-t border-night-700 mt-5 pt-4 flex justify-between items-center">
                <span className="text-[11px] text-mist-600">Policy example</span>
                <span className="text-xs font-medium text-mist-400">{cred.threshold}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8">
          <div className="bg-night-900 border border-night-800 rounded-xl px-6 py-4 flex items-start gap-3">
            <span className="text-mist-600 text-sm">🔐</span>
            <p className="text-xs text-mist-500">Raw values are visible only in this holder view. Employer receipts use a job-scoped pseudonym and disclose only the satisfied policy. Negative results are never added to the shared receipt list.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
