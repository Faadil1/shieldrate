import { useState } from "react";
import type { ProofType, Verification } from "../types";

interface VerificationTableProps {
  verifications: Verification[];
  onEmptyAction: () => void;
}

const FILTERS: { key: ProofType | "all"; label: string }[] = [
  { key: "all", label: "All receipts" },
  { key: "income", label: "Income" },
  { key: "reputation", label: "Reputation" },
  { key: "skills", label: "Completed jobs" },
];

export function VerificationTable({ verifications, onEmptyAction }: VerificationTableProps) {
  const [filter, setFilter] = useState<ProofType | "all">("all");
  const filtered = filter === "all" ? verifications : verifications.filter((item) => item.type === filter);

  if (verifications.length === 0) {
    return (
      <section className="instrument px-6 py-14 text-center md:px-10">
        <div className="relative z-10 mx-auto max-w-[520px]">
          <div className="evidence-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9da39d]">Ledger / empty</div>
          <h3 className="display-serif mt-4 text-[34px] leading-none text-[#171b1d]">No public receipts exist yet.</h3>
          <p className="mt-4 text-[13px] leading-6 text-[#6b706e]">
            That is a valid state. ShieldRate only adds a receipt when a context-bound claim passes. Negative predicates stay private.
          </p>
          <button className="btn-primary mt-7" onClick={onEmptyAction}>Create first request <span aria-hidden>→</span></button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border border-[#171b1d] bg-[#f8f7f0]/80">
      <div className="flex flex-col gap-5 border-b border-[#171b1d] px-5 py-5 md:px-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="micro-label">Receipt ledger / public evidence</div>
          <h2 className="display-serif mt-2 text-[28px] leading-none text-[#171b1d]">Shareable proof receipts</h2>
          <p className="mt-2 text-[11px] text-[#6b706e]">A row exists only after a successful claim. Evidence mode is always explicit.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-[3px] border px-3 py-2 text-[10px] font-bold transition-colors ${
                filter === item.key
                  ? "border-[#171b1d] bg-[#171b1d] text-[#f8f7f0]"
                  : "border-[#c8cac2] bg-transparent text-[#6b706e] hover:border-[#171b1d] hover:text-[#171b1d]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#c8cac2] bg-[#ecece4]/75">
              {["Receipt", "Scoped subject", "Policy", "Evidence", "Freshness"].map((heading) => (
                <th key={heading} className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#6b706e] first:pl-6">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="receipt-hover border-b border-[#c8cac2] last:border-b-0">
                <td className="px-5 py-4 pl-6 align-top">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#1f6b4d] bg-[#dbece2] text-[10px] font-black text-[#1f6b4d]">✓</span>
                    <div>
                      <div className="evidence-mono text-[9px] font-bold text-[#9da39d]">SR-{String(index + 1).padStart(3, "0")}</div>
                      <div className="mt-1 text-[11px] font-bold text-[#1f6b4d]">PASSED</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="evidence-mono text-[10px] font-bold text-[#343a3d]">{item.userHash}</div>
                  <div className="mt-1 text-[9px] text-[#8a8f8b]">job-scoped pseudonym</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[12px] font-bold text-[#171b1d]">{item.thresholdLabel}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#8a8f8b]">{item.type}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <span className={`mode-badge ${item.evidenceMode === "midnight-live" ? "mode-live" : "mode-demo"}`}>
                    {item.evidenceMode === "midnight-live" ? "Midnight live" : "Demo attested"}
                  </span>
                </td>
                <td className="px-5 py-4 align-top text-[11px] text-[#565d5a]">
                  {item.freshUntil ? `Valid until ${new Date(item.freshUntil).toLocaleDateString()}` : item.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 border-t border-[#171b1d] bg-[#ecece4]/60 md:grid-cols-3">
        <LedgerNote label="Requested" value="Standardized policy band" />
        <LedgerNote label="Published" value="Pass-only receipt" />
        <LedgerNote label="Never shown" value="Raw credential value" last />
      </div>
    </section>
  );
}

function LedgerNote({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`px-5 py-4 ${last ? "" : "border-b border-[#c8cac2] md:border-b-0 md:border-r"}`}>
      <div className="micro-label">{label}</div>
      <div className="mt-1.5 text-[11px] font-semibold text-[#343a3d]">{value}</div>
    </div>
  );
}
