import { useEffect, useMemo, useState } from "react";
import type { ProofRequest, ProofResult, ProofType } from "../types";
import { CLAIM_POLICIES, DEMO_EMPLOYER_ID, DEMO_JOB_ID, executionMode } from "../security/integrity";
import { formatThreshold } from "../utils/contractHelpers";

type Stage = "select" | "generating" | "result";

const TYPES: { key: ProofType; code: string; label: string; hint: string }[] = [
  { key: "income", code: "INC", label: "Income", hint: "Approved income policy bands" },
  { key: "reputation", code: "REP", label: "Reputation", hint: "Approved rating policy bands" },
  { key: "skills", code: "JOB", label: "Completed jobs", hint: "Approved work-count bands" },
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
  const live = executionMode() === "midnight-live";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171b1d]/45 p-3 backdrop-blur-[2px] md:p-6">
      <div className="paper-panel max-h-[94vh] w-full max-w-[760px] overflow-y-auto rounded-[5px] border-[#171b1d]">
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-[#171b1d] bg-[#f8f7f0]/95 px-5 py-5 backdrop-blur md:px-7">
          <div>
            <div className="micro-label">Proof request / private evaluation</div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="display-serif text-[30px] leading-none text-[#171b1d]">Generate a private proof</h2>
              <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
            </div>
            <p className="mt-2 text-[11px] text-[#6b706e]">Issuer-attested · context-scoped · replay-protected · pass-only publication</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[#c8cac2] text-[18px] text-[#6b706e] hover:border-[#171b1d] hover:text-[#171b1d]" aria-label="Close">×</button>
        </div>

        <div className="p-5 md:p-7">
          {stage === "select" && (
            <div>
              <section className="border-y border-[#c8cac2] bg-[#ecece4]/65 py-4">
                <div className="grid gap-3 text-[11px] sm:grid-cols-2">
                  <ScopeRow label="Employer scope" value={DEMO_EMPLOYER_ID} />
                  <ScopeRow label="Job scope" value={DEMO_JOB_ID} />
                </div>
                <p className="mt-3 text-[10px] leading-4 text-[#6b706e]">The request is also bound to a fresh challenge and expiry window. It cannot be replayed in another employer/job context.</p>
              </section>

              <section className="mt-7">
                <StepLabel number="01" title="Choose the claim" />
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {TYPES.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setType(item.key);
                        setThreshold(CLAIM_POLICIES[item.key][0]);
                      }}
                      className={`receipt-hover min-h-[116px] rounded-[4px] border p-4 text-left ${
                        type === item.key
                          ? "border-[#171b1d] bg-[#f8f7f0] shadow-[3px_3px_0_rgba(23,27,29,0.08)]"
                          : "border-[#c8cac2] bg-[#f2f1e9]/70 hover:border-[#171b1d]"
                      }`}
                    >
                      <div className={`evidence-mono text-[9px] font-black ${type === item.key ? "text-[#1f6b4d]" : "text-[#9da39d]"}`}>{item.code}</div>
                      <div className="mt-5 text-[13px] font-black text-[#171b1d]">{item.label}</div>
                      <div className="mt-1 text-[9px] leading-4 text-[#8a8f8b]">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <StepLabel number="02" title="Choose a standardized policy band" />
                <div className="mt-3 border border-[#c8cac2] bg-[#f8f7f0]/75 p-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {options.map((value) => (
                      <button
                        key={value}
                        onClick={() => setThreshold(value)}
                        className={`flex items-center justify-between rounded-[3px] border px-4 py-3 text-left transition-colors ${
                          threshold === value
                            ? "border-[#171b1d] bg-[#171b1d] text-[#f8f7f0]"
                            : "border-[#c8cac2] bg-transparent text-[#343a3d] hover:border-[#171b1d]"
                        }`}
                      >
                        <span className="text-[12px] font-bold">{formatThreshold(type, value)}</span>
                        <span className={`evidence-mono text-[9px] ${threshold === value ? "text-[#b9dac8]" : "text-[#9da39d]"}`}>POLICY</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-4 text-[#6b706e]">Free-form probing is intentionally disabled. Employers can request only approved coarse bands.</p>
                </div>
              </section>

              <section className="mt-7 grid grid-cols-3 border-y border-[#171b1d]">
                <Boundary label="Requested" value={formatThreshold(type, threshold)} />
                <Boundary label="Published if pass" value="Policy result" />
                <Boundary label="Never disclosed" value="Raw credential" last />
              </section>

              <button disabled={!walletConnected || busy} className={`btn-primary mt-7 w-full ${!walletConnected || busy ? "cursor-not-allowed opacity-40" : ""}`} onClick={startGeneration}>
                {walletConnected ? `${live ? "Submit" : "Evaluate"} ${current.label} request` : live ? "Connect Midnight Lace first" : "Enter demo wallet first"}
                <span aria-hidden>→</span>
              </button>
            </div>
          )}

          {stage === "generating" && <Generating live={live} />}

          {stage === "result" && result && <ResultView result={result} onReset={() => setStage("select")} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function Generating({ live }: { live: boolean }) {
  const steps = live
    ? ["Private witness loaded", "Proof constructed", "Transaction submitted", "Receipt lookup required"]
    : ["Issuer registration checked", "Credential freshness checked", "Context bound", "Anti-replay nullifier checked"];

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-[530px]">
        <div className="micro-label">Evidence processing</div>
        <h3 className="display-serif mt-3 text-[36px] leading-none text-[#171b1d]">{live ? "Proving on Midnight" : "Validating the private claim"}</h3>
        <p className="mt-4 text-[12px] leading-5 text-[#6b706e]">
          {live
            ? "Lace may request approval. ShieldRate will not show a verified receipt until the transaction finalizes and the expected verification ID is independently found in indexed contract state."
            : "The demo checks the same integrity boundaries locally and never invents a network transaction or block confirmation."}
        </p>
        <div className="mt-7 border-y border-[#171b1d]">
          {steps.map((step, index) => (
            <div key={step} className="grid grid-cols-[38px_1fr_auto] items-center gap-3 border-b border-[#c8cac2] py-3 last:border-b-0">
              <span className="evidence-mono text-[9px] font-bold text-[#1f6b4d]">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-[11px] font-bold text-[#343a3d]">{step}</span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#1f6b4d]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultView({ result, onReset, onClose }: { result: ProofResult; onReset: () => void; onClose: () => void }) {
  const receipt = result.receipt;
  const live = result.mode === "midnight-live";

  if (!result.passed || !receipt) {
    return (
      <div className="py-5">
        <div className="mx-auto max-w-[560px] border border-[#9a3f38] bg-[#f2dfdc]/65 p-6 md:p-8">
          <div className="evidence-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a3f38]">Private result / not published</div>
          <h3 className="display-serif mt-4 text-[38px] leading-none text-[#171b1d]">No public receipt was created.</h3>
          <p className="mt-4 text-[12px] leading-5 text-[#6b706e]">{result.failureReason ?? "The requested policy was not satisfied. The negative result remains local."}</p>
          <div className="mt-6 border-y border-[#9a3f38]/35 py-4 text-[11px] font-bold text-[#9a3f38]">FAILED CLAIM → PRIVATE STATE ONLY</div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={onReset}>New request</button>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="instrument mx-auto max-w-[610px] p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-5 border-b border-[#171b1d] pb-5">
            <div>
              <div className="micro-label">ShieldRate / verified proof receipt</div>
              <div className="evidence-mono mt-2 text-[10px] text-[#6b706e]">{short(receipt.verificationId)}</div>
            </div>
            <div className="verify-seal">Passed</div>
          </div>

          <h3 className="display-serif mt-7 text-[38px] leading-none text-[#171b1d]">
            {live ? "Receipt verified on Midnight." : "Attested proof receipt ready."}
          </h3>
          <p className="mt-4 text-[12px] leading-5 text-[#6b706e]">
            {live
              ? "The transaction finalized and the expected verification receipt was independently found in indexed contract state."
              : "The private credential satisfied the requested policy. This receipt is local demo evidence and does not claim a Midnight transaction."}
          </p>

          <div className="mt-7 border-t border-[#171b1d]">
            <ReceiptLine label="Mode" value={live ? "MIDNIGHT_LIVE" : "DEMO_ATTESTED"} />
            <ReceiptLine label="Ledger" value={live ? `${receipt.network.toUpperCase()} · CONFIRMED` : "LOCAL ONLY · NOT SUBMITTED"} />
            {live && receipt.contractAddress && <ReceiptLine label="Contract" value={short(receipt.contractAddress)} mono />}
            {live && receipt.txHash && <ReceiptLine label="Transaction" value={short(receipt.txHash)} mono />}
            {live && receipt.blockHeight && <ReceiptLine label="Block" value={receipt.blockHeight} mono />}
            <ReceiptLine label="Issuer" value={receipt.issuerId} />
            <ReceiptLine label="Request" value={short(receipt.requestHash)} mono />
            <ReceiptLine label="Scoped subject" value={short(receipt.scopedSubject)} mono />
            <ReceiptLine label="Nullifier" value={short(receipt.nullifier)} mono />
            <ReceiptLine label="Credential valid until" value={new Date(receipt.credentialExpiresAt).toLocaleString()} />
            <ReceiptLine label="Request expires" value={new Date(receipt.requestExpiresAt).toLocaleString()} />
          </div>

          <div className="mt-6 grid grid-cols-3 border-y border-[#171b1d]">
            <Boundary label="Requested" value={receipt.thresholdLabel} />
            <Boundary label="Published" value="Passed" />
            <Boundary label="Hidden" value="Raw value" last />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={onReset}>New request</button>
            <button className="btn-primary" onClick={onClose}>Close receipt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="evidence-mono text-[9px] font-black text-[#1f6b4d]">{number}</span>
      <span className="micro-label text-[#343a3d]">{title}</span>
    </div>
  );
}

function ScopeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#6b706e]">{label}</span>
      <span className="evidence-mono text-right text-[9px] font-bold text-[#343a3d]">{value}</span>
    </div>
  );
}

function Boundary({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`min-w-0 px-3 py-4 ${last ? "" : "border-r border-[#c8cac2]"}`}>
      <div className="micro-label truncate">{label}</div>
      <div className={`mt-1.5 truncate text-[10px] font-bold ${label === "Hidden" ? "text-[#1f6b4d]" : "text-[#343a3d]"}`}>{value}</div>
    </div>
  );
}

function ReceiptLine({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[124px_1fr] gap-4 border-b border-[#c8cac2] py-3 text-[11px] last:border-b-0">
      <span className="text-[#6b706e]">{label}</span>
      <span className={`text-right font-bold text-[#343a3d] ${mono ? "evidence-mono text-[9px]" : ""}`}>{value}</span>
    </div>
  );
}

function short(value: string): string {
  return value.length <= 22 ? value : `${value.slice(0, 10)}…${value.slice(-8)}`;
}
