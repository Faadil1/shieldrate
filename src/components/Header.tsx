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
    <header className="mb-7 grid gap-5 border-b border-[var(--ink)] pb-6 xl:grid-cols-[1fr_auto] xl:items-end">
      <div>
        <div className="flex items-center gap-3">
          <span className="micro-label">Employer workspace / evidence bureau</span>
          <span className="h-px w-10 bg-[var(--copper)]" />
          <span className="evidence-mono text-[7px] font-bold uppercase tracking-[.17em] text-[var(--copper)]">SR-DESK / 02</span>
        </div>
        <h1 className="display-serif mt-3 text-[42px] leading-[.94] text-[var(--ink)] md:text-[52px]">Verification bureau</h1>
        <p className="mt-3 max-w-[760px] text-[12px] leading-5 text-[var(--muted)]">A public evidence desk for successful, scoped proof receipts. Negative predicates remain private and never enter the shared register.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
        <span className="mode-badge">{pendingCount} fixture{pendingCount === 1 ? "" : "s"}</span>
        {wallet.connected ? (
          <div className="flex items-center gap-2 border border-[var(--rule-strong)] bg-[rgba(255,248,232,.72)] px-3 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[var(--verify)]" : "bg-[var(--amber)]"}`} />
            <span className="evidence-mono text-[9px] font-semibold text-[var(--ink-soft)]">{wallet.displayAddress}</span>
            <button onClick={onDisconnect} className="ml-1 text-[11px] font-bold text-[var(--muted)] hover:text-[var(--ink)]" aria-label="Disconnect wallet">×</button>
          </div>
        ) : null}
        <button onClick={onGenerateProof} className="btn-primary">Issue proof request <span aria-hidden>→</span></button>
      </div>
    </header>
  );
}
