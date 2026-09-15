import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";

interface HeaderProps {
  wallet: WalletState;
  pendingCount: number;
  onDisconnect: () => void;
  onGenerateProof: () => void;
}

export function Header({ wallet, pendingCount, onDisconnect, onGenerateProof }: HeaderProps) {
  const live = executionMode() === "midnight-live";

  return (
    <header className="mb-7 flex flex-col gap-5 border-b border-[#c8cac2] pb-6 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="micro-label">Employer workspace / evidence desk</div>
        <h1 className="display-serif mt-2 text-[38px] leading-none text-[#171b1d] md:text-[44px]">Verification desk</h1>
        <p className="mt-3 max-w-[700px] text-[13px] leading-5 text-[#6b706e]">
          Review only successful, context-bound proof receipts. Negative predicates remain private and never enter the shared ledger.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>
          {live ? "Midnight live" : "Demo attested"}
        </span>
        <span className="mode-badge">{pendingCount} fixture{pendingCount === 1 ? "" : "s"}</span>
        {wallet.connected ? (
          <div className="flex items-center gap-2 rounded-[4px] border border-[#c8cac2] bg-[#f8f7f0] px-3 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[#1f6b4d]" : "bg-[#9a5b1e]"}`} />
            <span className="evidence-mono text-[10px] font-semibold text-[#4d5451]">{wallet.displayAddress}</span>
            <button onClick={onDisconnect} className="ml-1 text-[11px] font-bold text-[#8a8f8b] hover:text-[#171b1d]" aria-label="Disconnect wallet">×</button>
          </div>
        ) : null}
        <button onClick={onGenerateProof} className="btn-primary">New proof request <span aria-hidden>→</span></button>
      </div>
    </header>
  );
}
