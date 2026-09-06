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

const STATUS_CLASS: Record<Verification["status"], string> = {
  verified: "verified",
  rejected: "rejected",
  pending: "pending",
};

export function VerificationTable({ verifications, onEmptyAction }: VerificationTableProps) {
  const [filter, setFilter] = useState<ProofType | "all">("all");

  const filtered =
    filter === "all"
      ? verifications
      : verifications.filter((v) => v.type === filter);

  if (verifications.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rate-900 flex items-center justify-center text-3xl mb-6">
          🛡
        </div>
        <h3 className="text-lg font-semibold text-white">No verifications yet</h3>
        <p className="text-sm text-mist-500 mt-2 max-w-sm">
          When candidates submit ZK proofs for your jobs, they'll appear here.
          Generate your first proof to see the flow.
        </p>
        <button className="btn-primary mt-8" onClick={onEmptyAction}>
          Generate your first proof
        </button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-night-800">
        <h3 className="text-base font-semibold text-white">Recent Proof Submissions</h3>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                filter === f.key
                  ? "bg-night-800 text-neutral-200"
                  : "text-mist-500 hover:text-mist-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-night-800">
            {["Candidate", "Proof Type", "Threshold", "Result", "Status"].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-mist-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((v) => (
            <tr key={v.id} className="border-b border-night-800 last:border-0 hover:bg-night-900/50">
              <td className="px-6 py-4 text-sm font-medium text-white font-mono">
                {v.userHash}
              </td>
              <td className="px-6 py-4 text-sm text-mist-400">{v.thresholdLabel}</td>
              <td className="px-6 py-4 text-xs text-mist-600">ZK Verified</td>
              <td
                className={`px-6 py-4 text-sm font-semibold ${
                  v.result === "passed" ? "text-rate-500" : "text-red-500"
                }`}
              >
                {v.result === "passed" ? "Passed" : "Failed"}
              </td>
              <td className="px-6 py-4">
                <span className={`status-badge ${STATUS_CLASS[v.status]}`}>
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}