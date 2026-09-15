import { useEffect, useMemo, useState } from "react";
import type { ProofRequest, ProofResult, ProofType } from "../types";
import { CLAIM_POLICIES, DEMO_EMPLOYER_ID, DEMO_JOB_ID, executionMode } from "../security/integrity";
import { formatThreshold } from "../utils/contractHelpers";
import { BrandMark } from "./BrandMark";

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
    onGenerate({ type, threshold, thresholdLabel: formatThreshold(type, threshold), employerId: DEMO_EMPLOYER_ID, jobId: DEMO_JOB_ID });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,44,49,.56)] p-3 backdrop-blur-[3px] md:p-6">
      <div className="paper-panel max-h-[94vh] w-full max-w-[820px] overflow-y-auto rounded-[2px] border-[var(--ink)]">
        <div className="sticky top-0 z-20 grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--ink)] bg-[rgba(255,248,232,.95)] px-5 py-5 backdrop-blur md:px-7">
          <div className="flex items-start gap-3">
            <BrandMark compact />
            <div>
              <div className="micro-label">Private evaluation procedure / SR-PROOF</div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="display-serif text-[31px] leading-none text-[var(--ink)]">Issue a verification receipt</h2>
                <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
              </div>
              <p className="mt-2 text-[10px] text-[var(--muted)]">Issuer-attested · context-scoped · replay-protected · pass-only publication</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--rule)] text-[18px] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]" aria-label="Close">×</button>
        </div>

        <div className="p-5 md:p-7">
          {stage === "select" && (
            <div>
              <section className="grid gap-3 border-y border-[var(--ink)] bg-[var(--field-cool)]/45 px-4 py-4 text-[10px] sm:grid-cols-2">
                <ScopeRow label="Employer scope" value={DEMO_EMPLOYER_ID} />
                <ScopeRow label="Job scope" value={DEMO_JOB_ID} />
                <p className="sm:col-span-2 text-[9px] leading-4 text-[var(--muted)]">A fresh challenge and expiry are bound into the same request. The receipt cannot be replayed into another employer or job context.</p>
              </section>

              <section className="mt-7">
                <StepLabel number="01" title="Select the private claim" />
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {TYPES.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => { setType(item.key); setThreshold(CLAIM_POLICIES[item.key][0]); }}
                      className={`receipt-hover min-h-[126px] border p-4 text-left ${type === item.key ? "border-[var(--ink)] bg-[var(--paper-white)] shadow-[4px_4px_0_rgba(16,44,49,.08)]" : "border-[var(--rule)] bg-[rgba(239,228,207,.54)] hover:border-[var(--ink)]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`evidence-mono text-[8px] font-black ${type === item.key ? "text-[var(--verify)]" : "text-[var(--rule-strong)]"}`}>{item.code}</span>
                        {type === item.key ? <span className="h-2 w-2 rounded-full bg-[var(--copper)]" /> : null}
                      </div>
                      <div className="display-serif mt-6 text-[21px] leading-none text-[var(--ink)]">{item.label}</div>
                      <div className="mt-2 text-[8px] leading-4 text-[var(--muted)]">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <StepLabel number="02" title="Select an approved policy band" />
                <div className="mt-3 document-frame p-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {options.map((value) => (
                      <button
                        key={value}
                        onClick={() => setThreshold(value)}
                        className={`flex items-center justify-between border px-4 py-3 text-left transition-colors ${threshold === value ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper-white)]" : "border-[var(--rule)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--ink)]"}`}
                      >
                        <span className="text-[11px] font-black">{formatThreshold(type, value)}</span>
                        <span className={`evidence-mono text-[8px] ${threshold === value ? "text-[#9fcab8]" : "text-[var(--rule-strong)]"}`}>POLICY</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[9px] leading-4 text-[var(--muted)]">Free-form probing is disabled. Employers request only coarse, predefined bands.</p>
                </div>
              </section>

              <section className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Boundary tone="requested" label="Requested" value={formatThreshold(type, threshold)} />
                <Boundary tone="proven" label="Published on pass" value="Policy result" />
                <Boundary tone="hidden" label="Never disclosed" value="Raw credential" />
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
    ? ["Private witness loaded", "Proof constructed", "Transaction submitted", "Indexed receipt required"]
    : ["Issuer registration checked", "Credential freshness checked", "Context bound", "Anti-replay nullifier checked"];

  return (
    <div className="py-8 md:py-11">
      <div className="mx-auto max-w-[570px]">
        <div className="micro-label">Evidence processing / ordered gates</div>
        <h3 className="display-serif mt-3 text-[39px] leading-[.96] text-[var(--ink)]">{live ? "Proving on Midnight." : "Evaluating without disclosure."}</h3>
        <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">{live ? "Lace may request approval. A submitted transaction is still not enough: the expected receipt must be found independently in indexed contract state." : "The demo executes the integrity checks locally and never invents a transaction, block height or network receipt."}</p>
        <div className="status-rail mt-7 border-y border-[var(--ink)] py-1">
          {steps.map((step, index) => (
            <div key={step} className="grid grid-cols-[16px_34px_1fr_auto] items-center gap-3 border-b border-[var(--rule)] py-3 last:border-b-0">
              <span className="status-dot" />
              <span className="evidence-mono text-[8px] font-black text-[var(--verify)]">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-[10px] font-black text-[var(--ink-soft)]">{step}</span>
              <span className="evidence-mono text-[7px] uppercase tracking-[.12em] text-[var(--copper)]">checking</span>
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
        <div className="mx-auto max-w-[590px] border border-[var(--danger)] bg-[var(--danger-bg)]/70 p-6 md:p-8">
          <div className="evidence-mono text-[9px] font-black uppercase tracking-[0.16em] text-[var(--danger)]">PRIVATE RESULT / NOT PUBLISHED</div>
          <h3 className="display-serif mt-4 text-[42px] leading-[.94] text-[var(--ink)]">No public receipt was created.</h3>
          <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">{result.failureReason ?? "The requested policy was not satisfied. The negative result remains local."}</p>
          <div className="redacted-field mt-6 p-4 evidence-mono text-[8px] font-black uppercase tracking-[.14em] text-[var(--iris)]">FAILED CLAIM → PRIVATE STATE ONLY</div>
          <div className="mt-6 flex flex-wrap gap-2"><button className="btn-secondary" onClick={onReset}>New request</button><button className="btn-primary" onClick={onClose}>Close</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="proof-instrument-v2 cut-corner mx-auto max-w-[650px]">
        <div className="grid grid-cols-[14px_1fr]">
          <div className="security-band" />
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-start justify-between gap-5 border-b border-[var(--ink)] pb-5">
              <div className="flex items-center gap-3"><BrandMark compact /><div><div className="micro-label">Verified proof receipt</div><div className="evidence-mono mt-1.5 text-[9px] text-[var(--muted)]">{short(receipt.verificationId)}</div></div></div>
              <div className="verify-seal">Passed</div>
            </div>

            <h3 className="display-serif mt-7 text-[41px] leading-[.94] text-[var(--ink)]">{live ? "Verified on Midnight." : "Attested receipt ready."}</h3>
            <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">{live ? "Transaction finalized and the expected verification receipt was independently found in indexed contract state." : "The private credential satisfied the requested policy. This is local demo evidence and does not claim a Midnight transaction."}</p>

            <div className="mt-7 border-t border-[var(--ink)]">
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

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Boundary tone="requested" label="Requested" value={receipt.thresholdLabel} />
              <Boundary tone="proven" label="Published" value="Passed" />
              <Boundary tone="hidden" label="Hidden" value="Raw value" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2"><button className="btn-secondary" onClick={onReset}>New request</button><button className="btn-primary" onClick={onClose}>Close receipt</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ number, title }: { number: string; title: string }) {
  return <div className="flex items-center gap-3"><span className="evidence-mono text-[8px] font-black text-[var(--copper)]">{number}</span><span className="micro-label text-[var(--ink-soft)]">{title}</span></div>;
}
function ScopeRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-[var(--muted)]">{label}</span><span className="evidence-mono text-right text-[8px] font-bold text-[var(--ink-soft)]">{value}</span></div>;
}
function Boundary({ tone, label, value }: { tone: "requested" | "proven" | "hidden"; label: string; value: string }) {
  const toneClass = tone === "requested" ? "privacy-requested" : tone === "proven" ? "privacy-proven" : "privacy-hidden";
  return <div className={`border p-3 ${toneClass}`}><div className="micro-label !text-current">{label}</div><div className="mt-1.5 truncate text-[9px] font-black">{value}</div></div>;
}
function ReceiptLine({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="grid grid-cols-[126px_1fr] gap-4 border-b border-[var(--rule)] py-3 text-[10px] last:border-b-0"><span className="text-[var(--muted)]">{label}</span><span className={`text-right font-black text-[var(--ink-soft)] ${mono ? "evidence-mono text-[8px]" : ""}`}>{value}</span></div>;
}
function short(value: string): string { return value.length <= 22 ? value : `${value.slice(0, 10)}…${value.slice(-8)}`; }
