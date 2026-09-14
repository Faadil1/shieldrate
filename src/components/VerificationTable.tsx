import { useState } from "react";
import type { ProofType, Verification } from "../types";

interface VerificationTableProps {
  verifications: Verification[];
  onEmptyAction: () => void;
}

const FILTERS: { key: ProofType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "income", label: "Income" },
  { key: "reputation", label: "Reputation" },
  { key: "skills", label: "Skills" },
];

export function VerificationTable({ verifications, onEmptyAction }: VerificationTableProps) {
  const [filter, setFilter] = useState<ProofType | "all">("all");
  const filtered = filter === "all" ? verifications : verifications.filter((item) => item.type === filter);

  if (verifications.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rate-900 flex items-center justify-center text-3xl mb-6">🛡</div>
        <h3 className="text-lg font-semibold text-white">No shareable receipts yet</h3>
        <p className="text-sm text-mist-500 mt-2 max-w-sm">Only successful, context-bound proofs appear here. Failed predicates stay local.</p>
        <button className="btn-primary mt-8" onClick={onEmptyAction}>Generate first proof</button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-night-800">
        <div>
          <h3 className="text-base font-semibold text-white">Shareable Proof Receipts</h3>
          <p className="text-[11px] text-mist-600 mt-1">Demo receipts are labelled explicitly; no simulated on-chain confirmations.</p>
        </div>
        <div className="flex gap-1">
          {FILTERS.map((item) => (
            <button key={item.key} onClick={() => setFilter(item.key)} className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition ${filter === item.key ? "bg-night-800 text-neutral-200" : "text-mist-500 hover:text-mist-400"}`}>{item.label}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="border-b border-night-800">
              {["Scoped subject", "Policy", "Result", "Evidence", "Freshness"].map((heading) => (
                <th key={heading} className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-mist-600">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-night-800 last:border-0 hover:bg-night-900/50">
                <td className="px-6 py-4 text-xs font-mono text-white">{item.userHash}</td>
                <td className="px-6 py-4 text-sm text-mist-400">{item.thresholdLabel}</td>
                <td className="px-6 py-4 text-sm font-semibold text-rate-500">Passed</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-amber-300">
                    {item.evidenceMode === "midnight-live" ? "Midnight live" : "Demo attested"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-mist-500">{item.freshUntil ? `until ${new Date(item.freshUntil).toLocaleDateString()}` : item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
