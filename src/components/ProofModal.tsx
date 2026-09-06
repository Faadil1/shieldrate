import { useEffect, useState } from "react";
import type { ProofRequest, ProofResult, ProofType } from "../types";
import { formatThreshold } from "../utils/contractHelpers";

type Stage = "select" | "generating" | "result";

const TYPES: {
  key: ProofType;
  icon: string;
  label: string;
  hint: string;
  defaultThreshold: number;
  max: number;
  step: number;
  min: number;
  format: (v: number) => string;
}[] = [
  {
    key: "income",
    icon: "💰",
    label: "Income",
    hint: "Prove an annual income range",
    defaultThreshold: 50000,
    max: 150000,
    step: 5000,
    min: 10000,
    format: (v) => `$${v.toLocaleString()}`,
  },
  {
    key: "reputation",
    icon: "⭐",
    label: "Reputation",
    hint: "Prove your rating threshold",
    defaultThreshold: 4.5,
    max: 5.0,
    step: 0.1,
    min: 3,
    format: (v) => v.toFixed(1),
  },
  {
    key: "skills",
    icon: "🎓",
    label: "Skills / Jobs",
    hint: "Prove completed job count",
    defaultThreshold: 100,
    max: 500,
    step: 10,
    min: 10,
    format: (v) => `${v} jobs`,
  },
];

const STEPS = [
  "Reading private witness data…",
  "Compiling circuit…",
  "Building zero-knowledge proof…",
  "Posting disclosed boolean to ledger…",
];

interface ProofModalProps {
  walletConnected: boolean;
  busy: boolean;
  result: ProofResult | null;
  onGenerate: (req: ProofRequest) => void;
  onClose: () => void;
}

export function ProofModal({
  walletConnected,
  busy,
  result,
  onGenerate,
  onClose,
}: ProofModalProps) {
  const [type, setType] = useState<ProofType>("income");
  const [threshold, setThreshold] = useState(TYPES[0].defaultThreshold);
  const [stage, setStage] = useState<Stage>("select");

  const current = TYPES.find((t) => t.key === type)!;

  // auto-advance to result step once the proof comes back
  useEffect(() => {
    if (result && stage === "generating") setStage("result");
  }, [result, stage]);

  const startGeneration = () => {
    setStage("generating");
    onGenerate({
      type,
      threshold,
      thresholdLabel: formatThreshold(type, threshold),
    });
  };

  const reset = () => {
    setStage("select");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl w-full max-w-[560px] overflow-hidden">
        <div className="px-8 py-6 border-b border-night-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Generate ZK Proof</h2>
            <p className="text-xs text-mist-600 mt-0.5">
              On-device · zero raw data leaves your wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-mist-600 hover:text-neutral-200 text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {stage === "select" && (
            <div>
              <div className="text-xs uppercase tracking-wider text-mist-600 mb-3">
                1 · Proof type
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setType(t.key);
                      setThreshold(t.defaultThreshold);
                    }}
                    className={`rounded-xl p-4 text-left border transition ${
                      type === t.key
                        ? "border-rate-500 bg-rate-900/40"
                        : "border-night-700 bg-night-800/50 hover:border-night-600"
                    }`}
                  >
                    <div className="text-xl mb-2">{t.icon}</div>
                    <div className="text-sm font-medium text-white">{t.label}</div>
                    <div className="text-[10px] text-mist-600 mt-0.5">{t.hint}</div>
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-wider text-mist-600 mb-3">
                2 · Threshold
              </div>
              <div className="bg-night-800/60 border border-night-700 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-mist-400">
                    {current.label} threshold
                  </span>
                  <span className="text-lg font-bold text-white">
                    {current.format(threshold)}
                  </span>
                </div>
                <input
                  type="range"
                  min={current.min}
                  max={current.max}
                  step={current.step}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-mist-600 mt-3">
                  Employer will see only:{" "}
                  <span className="text-mist-400">Passed / Failed</span>
                </p>
              </div>

              <button
                disabled={!walletConnected || busy}
                className={`btn-primary w-full ${
                  !walletConnected || busy ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={startGeneration}
              >
                {walletConnected
                  ? "Generate Proof →"
                  : "Connect wallet first"}
              </button>
            </div>
          )}

          {stage === "generating" && (
            <GenerateProgress
              stepCount={STEPS.length}
              onFinished={() => stage === "generating" && result && setStage("result")}
            />
          )}

          {stage === "result" && result && (
            <ResultView
              result={result}
              thresholdLabel={formatThreshold(type, threshold)}
              onReset={reset}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function GenerateProgress({
  stepCount,
  onFinished,
}: {
  stepCount: number;
  onFinished: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStepIndex((i) => i + 1), 550);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stepIndex >= stepCount && onFinished) onFinished();
  }, [stepIndex, stepCount, onFinished]);

  const completed = Math.min(stepIndex, stepCount);

  return (
    <div className="py-6">
      <div className="flex justify-center mb-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-night-700">
            <div className="absolute inset-0 border-[3px] border-transparent border-t-rate-500 rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            🛡
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: stepCount }).map((_, i) => {
          const isDone = i < completed;
          const isActive = i === completed;
          return (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] ${
                  isDone
                    ? "bg-rate-500 text-black"
                    : isActive
                    ? "border-2 border-rate-500 animate-pulse"
                    : "border border-night-700"
                }`}
              >
                {isDone ? "✓" : ""}
              </span>
              <span
                className={`text-sm ${
                  isActive
                    ? "text-white"
                    : isDone
                    ? "text-mist-400"
                    : "text-mist-700"
                }`}
              >
                {STEPS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({
  result,
  thresholdLabel,
  onReset,
  onClose,
}: {
  result: ProofResult;
  thresholdLabel: string;
  onReset: () => void;
  onClose: () => void;
}) {
  const passed = result.passed;
  return (
    <div className="py-4 text-center">
      <div
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
          passed ? "bg-rate-900" : "bg-red-950/60"
        }`}
      >
        {passed ? "✅" : "❌"}
      </div>
      <h3
        className={`text-2xl font-bold mt-6 ${
          passed ? "text-rate-500" : "text-red-500"
        }`}
      >
        {passed ? "Proof Verified" : "Threshold Not Met"}
      </h3>
      <p className="text-sm text-mist-500 mt-2 max-w-sm mx-auto">
        {passed
          ? `On-chain proof returned a verified boolean. "${thresholdLabel}" confirmed — no raw income data disclosed.`
          : `The witness data did not satisfy "${thresholdLabel}". Only a boolean was published — nothing else was revealed.`}
      </p>

      <div className="bg-night-800/60 border border-night-700 rounded-xl mt-6 p-4 text-left max-w-sm mx-auto">
        <Row label="Result" value={passed ? "passed" : "failed"} mono />
        <Row label="User hash" value={result.userHash} mono />
        <Row label="Proof ID" value={result.proofId} mono />
        <Row label="Ledger" value="preprod · confirmed" />
      </div>

      <div className="flex gap-3 justify-center mt-6">
        <button className="btn-secondary" onClick={onReset}>
          New Proof
        </button>
        <button className="btn-primary" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 text-sm">
      <span className="text-mist-600">{label}</span>
      <span className={`text-mist-300 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}