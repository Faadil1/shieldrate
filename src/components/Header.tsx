import type { WalletState } from "../types";

interface HeaderProps {
  wallet: WalletState;
  pendingCount: number;
  onDisconnect: () => void;
  onGenerateProof: () => void;
}

export function Header({ wallet, pendingCount, onDisconnect, onGenerateProof }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Proof Receipts</h1>
        <p className="text-sm text-mist-600 mt-0.5">Only successful, context-bound receipts are shareable. Failed predicates stay local.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="proof-badge"><span>◌</span> {pendingCount} demo fixtures</div>
        <button onClick={onGenerateProof} className="bg-rate-500 text-black text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-rate-400 transition">Generate Proof</button>
        {wallet.connected ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-night-800 border border-night-700 text-mist-400 px-3 py-2 rounded-lg text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {wallet.displayAddress} · local demo
            </span>
            <button onClick={onDisconnect} className="text-mist-600 hover:text-neutral-300 text-xs">✕</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
