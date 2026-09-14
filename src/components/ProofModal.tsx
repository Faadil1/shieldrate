import { useEffect, useMemo, useState } from "react";
import type { ProofRequest, ProofResult, ProofType } from "../types";
import { CLAIM_POLICIES, DEMO_EMPLOYER_ID, DEMO_JOB_ID } from "../security/integrity";
import { formatThreshold } from "../utils/contractHelpers";

type Stage = "select" | "generating" | "result";

const TYPES: { key: ProofType; icon: string; label: string; hint: string }[] = [
  { key: "income", icon: "💰", label: "Income", hint: "Approved policy bands only" },
  { key: "reputation", icon: "⭐", label: "Reputation", hint: "Approved rating bands only" },
  { key: "skills", icon: "🎓", label: "Completed Jobs", hint: "Approved job-count bands only" },
];

interface ProofModalProps {
  walletConnected: boolean;
  busy: boolean;
  result: ProofResult | null;
  onGenerate: (req: ProofRequest) => void;
  onClose: () => void;
}

export function ProofModal({ walletConnected, busy, result, onGenerate, onClose }: ProofModalProps) {
  const [type, setType] = useState<ProofType>("income");
  const [threshold, setThreshold] = useState<number>(CLAIM_POLICIES.income[1]);
  const [stage, setStage] = useState<Stage>("select");

  const current = TYPES.find((item) => item.key === type)!;
  const options = useMemo(() => CLAIM_POLICIES[type], [type]);

  useEffect(() => {
    if (result && stage === "generating") setStage("result");
  }, [result, stage]);

  const startGeneration = () => {
    setStage("generating");
    onGenerate({
      type,
      threshold,
      thresholdLabel: formatThreshold(type, threshold),
      employerId: DEMO_EMPLOYER_ID,
      jobId: DEMO_JOB_ID,
    });
  };

  const reset = () => {
    setStage("select");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl w-full max-w-[620px] overflow-hidden">
        <div className="px-8 py-6 border-b border-night-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Generate Private Proof</h2>
              <span className="text-[10px] uppercase tracking-wider rounded px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Demo attested
              </span>
            </div>
            <p className="text-xs text-mist-600 mt-1">
              Issuer-bound credential · scoped identity · replay protected
            </p>
          </div>
          <button onClick={onClose} className="text-mist-600 hover:text-neutral-200 text-lg" aria-label="Close">✕</button>
        </div>

        <div className="p-8">
          {stage === "select" && (
            <div>
              <div className="rounded-xl border border-night-700 bg-night-800/50 p-4 mb-6 text-xs text-mist-400">
                <div className="flex justify-between gap-4"><span>Employer scope</span><span className="font-mono text-mist-300">{DEMO_EMPLOYER_ID}</span></div>
                <div className="flex justify-between gap-4 mt-2"><span>Job scope</span><span className="font-mono text-mist-300">{DEMO_JOB_ID}</span></div>
                <p className="mt-3 text-mist-600">The proof is bound to this employer, job, a fresh challenge, and an expiry window. It cannot be reused for another context.</p>
              </div>

              <div className="text-xs uppercase tracking-wider text-mist-600 mb-3">1 · Claim</div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {TYPES.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setType(item.key);
                      setThreshold(CLAIM_POLICIES[item.key][0]);
                    }}
                    className={`rounded-xl p-4 text-left border transition ${type === item.key ? "border-rate-500 bg-rate-900/40" : "border-night-700 bg-night-800/50 hover:border-night-600"}`}
                  >
                    <div className="text-xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-[10px] text-mist-600 mt-0.5">{item.hint}</div>
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-wider text-mist-600 mb-3">2 · Standardized policy band</div>
              <div className="bg-night-800/60 border border-night-700 rounded-xl p-5 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {options.map((value) => (
                    <button
                      key={value}
                      onClick={() => setThreshold(value)}
                      className={`rounded-lg border px-4 py-3 text-sm text-left ${threshold === value ? "border-rate-500 bg-rate-900/40 text-white" : "border-night-700 text-mist-400 hover:border-night-600"}`}
                    >
                      {formatThreshold(type, value)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-mist-600 mt-3">Free-form sliders are removed to reduce threshold probing. Only predefined policy bands can be requested.</p>
              </div>

              <button disabled={!walletConnected || busy} className={`btn-primary w-full ${!walletConnected || busy ? "opacity-40 cursor-not-allowed" : ""}`} onClick={startGeneration}>
                {walletConnected ? `Generate ${current.label} proof →` : "Connect demo wallet first"}
              </button>
            </div>
          )}

          {stage === "generating" && (
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full border-2 border-night-700 border-t-rate-500 animate-spin" />
              <h3 className="text-white font-semibold mt-6">Validating locally</h3>
              <p className="text-sm text-mist-500 mt-2 max-w-md mx-auto">
                Checking demo issuer registration, freshness, request binding, scoped pseudonym and anti-replay nullifier. No on-chain confirmation is simulated.
              </p>
            </div>
          )}

          {stage === "result" && result && <ResultView result={result} onReset={reset} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function ResultView({ result, onReset, onClose }: { result: ProofResult; onReset: () => void; onClose: () => void }) {
  const receipt = result.receipt;
  return (
    <div className="py-3 text-center">
      <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-4xl ${result.passed ? "bg-rate-900" : "bg-red-950/60"}`}>{result.passed ? "✓" : "×"}</div>
      <h3 className={`text-2xl font-bold mt-6 ${result.passed ? "text-rate-500" : "text-red-400"}`}>
        {result.passed ? "Attested proof ready" : "No proof published"}
      </h3>
      <p className="text-sm text-mist-500 mt-2 max-w-md mx-auto">
        {result.passed
          ? "The private credential satisfied the requested policy. This build produced a local receipt only; it does not claim a Midnight transaction yet."
          : result.failureReason ?? "The policy was not satisfied. The negative result stays local."}
      </p>

      {receipt ? (
        <div className="bg-night-800/60 border border-night-700 rounded-xl mt-6 p-4 text-left max-w-lg mx-auto">
          <Row label="Mode" value="DEMO_ATTESTED" />
          <Row label="Ledger" value="LOCAL ONLY · not submitted" />
          <Row label="Issuer" value={receipt.issuerId} />
          <Row label="Request" value={short(receipt.requestHash)} mono />
          <Row label="Scoped subject" value={short(receipt.scopedSubject)} mono />
          <Row label="Nullifier" value={short(receipt.nullifier)} mono />
          <Row label="Credential valid until" value={new Date(receipt.credentialExpiresAt).toLocaleDateString()} />
          <Row label="Request expires" value={new Date(receipt.requestExpiresAt).toLocaleTimeString()} />
        </div>
      ) : (
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl mt-6 p-4 text-left max-w-lg mx-auto text-xs text-red-200/80">
          Failed predicates intentionally generate no shareable receipt and no ledger payload.
        </div>
      )}

      <div className="flex gap-3 justify-center mt-6">
        <button className="btn-secondary" onClick={onReset}>New Proof</button>
        <button className="btn-primary" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

function short(value: string): string {
  return `${value.slice(0, 10)}…${value.slice(-8)}`;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-5 py-1.5 text-sm">
      <span className="text-mist-600">{label}</span>
      <span className={`text-mist-300 text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
