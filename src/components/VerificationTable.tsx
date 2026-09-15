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
      <section className="proof-instrument-v2 px-6 py-14 text-center md:px-10">
        <div className="relative z-10 mx-auto max-w-[540px]">
          <div className="evidence-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--iris)]">PUBLIC REGISTER / ZERO ENTRIES</div>
          <h3 className="display-serif mt-4 text-[38px] leading-[.96] text-[var(--ink)]">No receipt is also evidence.</h3>
          <p className="mt-4 text-[12px] leading-6 text-[var(--muted)]">ShieldRate writes nothing when the requested predicate fails. The public register therefore contains successful policy proofs only.</p>
          <button className="btn-primary mt-7" onClick={onEmptyAction}>Issue first request <span aria-hidden>→</span></button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border border-[var(--ink)] bg-[rgba(255,248,232,.78)]">
      <div className="grid gap-5 border-b border-[var(--ink)] px-5 py-5 md:px-6 xl:grid-cols-[1fr_auto] xl:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="micro-label">Public receipt register</span>
            <span className="h-px w-9 bg-[var(--copper)]" />
            <span className="evidence-mono text-[7px] font-black uppercase tracking-[.14em] text-[var(--copper)]">SR/LEDGER</span>
          </div>
          <h2 className="display-serif mt-2 text-[31px] leading-none text-[var(--ink)]">Shareable proof receipts</h2>
          <p className="mt-2 text-[10px] text-[var(--muted)]">Successful context-bound claims only. Evidence mode remains visible on every record.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`border px-3 py-2 text-[9px] font-black uppercase tracking-[.08em] transition-colors ${
                filter === item.key
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper-white)]"
                  : "border-[var(--rule)] bg-transparent text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--rule)] bg-[var(--field-cool)]/55">
              {["Receipt", "Scoped subject", "Policy", "Evidence mode", "Freshness"].map((heading) => (
                <th key={heading} className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.16em] text-[var(--muted)] first:pl-6">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="receipt-hover group border-b border-[var(--rule)] last:border-b-0">
                <td className="px-5 py-4 pl-6 align-top">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--verify)] bg-[var(--verify-bg)] evidence-mono text-[8px] font-black text-[var(--verify)]">PASS</span>
                    <div>
                      <div className="evidence-mono text-[8px] font-black text-[var(--copper)]">SR-{String(index + 1).padStart(4, "0")}</div>
                      <div className="mt-1 text-[9px] font-black uppercase tracking-[.1em] text-[var(--verify)]">published</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="evidence-mono text-[9px] font-bold text-[var(--ink-soft)]">{item.userHash}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[.08em] text-[var(--iris)]">context pseudonym</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[11px] font-black text-[var(--ink)]">{item.thresholdLabel}</div>
                  <div className="mt-1 evidence-mono text-[8px] uppercase tracking-[.1em] text-[var(--muted)]">{item.type}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <span className={`mode-badge ${item.evidenceMode === "midnight-live" ? "mode-live" : "mode-demo"}`}>{item.evidenceMode === "midnight-live" ? "Midnight live" : "Demo attested"}</span>
                </td>
                <td className="px-5 py-4 align-top text-[10px] text-[var(--ink-soft)]">{item.freshUntil ? `Valid until ${new Date(item.freshUntil).toLocaleDateString()}` : item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 border-t border-[var(--ink)] md:grid-cols-3">
        <LedgerNote tone="requested" label="Requested" value="Standardized policy band" />
        <LedgerNote tone="proven" label="Published" value="Pass-only receipt" />
        <LedgerNote tone="hidden" label="Never shown" value="Raw credential value" last />
      </div>
    </section>
  );
}

function LedgerNote({ tone, label, value, last = false }: { tone: "requested" | "proven" | "hidden"; label: string; value: string; last?: boolean }) {
  const toneClass = tone === "requested" ? "privacy-requested" : tone === "proven" ? "privacy-proven" : "privacy-hidden";
  return (
    <div className={`px-5 py-4 ${last ? "" : "border-b border-[var(--rule)] md:border-b-0 md:border-r"} ${toneClass}`}>
      <div className="micro-label !text-current">{label}</div>
      <div className="mt-1.5 text-[10px] font-black">{value}</div>
    </div>
  );
}
