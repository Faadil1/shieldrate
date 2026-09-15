import { useState } from "react";
import type { ProofRequest, Verification, View } from "./types";
import { useContract } from "./hooks/useContract";
import { useWallet } from "./hooks/useWallet";
import { SHIELD_VERIFICATIONS, computeStats } from "./data";
import { executionMode } from "./security/integrity";
import { Landing } from "./components/Landing";
import { Sidebar, type SectionKey } from "./components/Sidebar";
import { Header } from "./components/Header";
import { KPICards } from "./components/KPICards";
import { VerificationTable } from "./components/VerificationTable";
import { FreelancerView } from "./components/FreelancerView";
import { MobileView } from "./components/MobileView";
import { ProofModal } from "./components/ProofModal";
import { LiveSetupPanel } from "./components/LiveSetupPanel";

export default function App() {
  const { wallet, connect, disconnect } = useWallet();
  const { busy, lastResult, generateProof } = useContract();
  const live = executionMode() === "midnight-live";

  const [view, setView] = useState<View>("landing");
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [proofModalOpen, setProofModalOpen] = useState(false);

  const generatedReceipt: Verification[] = lastResult?.passed && lastResult.receipt
    ? [
        {
          id: lastResult.receipt.verificationId,
          candidateId: lastResult.receipt.scopedSubject,
          candidateLabel: lastResult.receipt.scopedSubject,
          userHash: `${lastResult.receipt.scopedSubject.slice(0, 10)}…${lastResult.receipt.scopedSubject.slice(-8)}`,
          type: lastResult.receipt.claim,
          thresholdLabel: lastResult.receipt.thresholdLabel,
          threshold: lastResult.receipt.thresholdLabel,
          result: "passed",
          status: "verified",
          timestamp: "just now",
          evidenceMode: lastResult.receipt.mode,
          requestHash: lastResult.receipt.requestHash,
          freshUntil: lastResult.receipt.credentialExpiresAt,
        },
      ]
    : [];

  const stats = computeStats([...generatedReceipt, ...SHIELD_VERIFICATIONS]);

  const handleGenerate = (req: ProofRequest) => {
    void generateProof(req, wallet.address ?? "demo-holder");
  };

  return (
    <div className="app-shell">
      {view === "landing" && (
        <Landing
          wallet={wallet}
          onConnect={() => {
            if (!wallet.connected) void connect();
            setView("dashboard");
            setSection("dashboard");
          }}
          onEnter={() => {
            setView("dashboard");
            setSection("dashboard");
          }}
          onMobile={() => setView("mobile")}
        />
      )}

      {view === "dashboard" && (
        <div className="min-h-screen bg-[#ecece4]/85 lg:flex">
          <Sidebar
            active={section}
            onNavigate={(key) => {
              setSection(key);
              if (key === "post") setProofModalOpen(true);
            }}
          />

          <main className="min-w-0 flex-1 px-4 py-5 md:px-7 md:py-7 xl:px-10 xl:py-9">
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-5 flex items-center justify-between border-b border-[#c8cac2] pb-4 lg:hidden">
                <button onClick={() => setView("landing")} className="text-[16px] font-black tracking-[-0.045em] text-[#171b1d]">SHIELDRATE</button>
                <button className="btn-primary" onClick={() => setProofModalOpen(true)}>New proof</button>
              </div>

              <Header
                wallet={wallet}
                pendingCount={stats.pending}
                onDisconnect={disconnect}
                onGenerateProof={() => setProofModalOpen(true)}
              />

              {section === "settings" && live ? (
                <LiveSetupPanel />
              ) : section === "settings" ? (
                <DemoRuntimePanel onGenerate={() => setProofModalOpen(true)} />
              ) : (
                <>
                  <section className={`mb-6 grid gap-4 border-y px-4 py-4 md:grid-cols-[145px_1fr] md:px-0 md:py-0 ${live ? "border-[#1f6b4d] bg-[#dbece2]/65" : "border-[#9a5b1e] bg-[#f0e3c9]/65"}`}>
                    <div className="flex items-center md:border-r md:border-current/20 md:px-5 md:py-4">
                      <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Live boundary" : "Demo boundary"}</span>
                    </div>
                    <p className="text-[11px] leading-5 text-[#565d5a] md:py-4 md:pr-5">
                      {live
                        ? `MIDNIGHT_LIVE · ${wallet.connected ? `${wallet.network} wallet connected` : "connect Lace before proving"}. A receipt becomes verified only after transaction finalization and an independent indexed-ledger lookup.`
                        : "DEMO_ATTESTED · The integrity model is real, but this mode does not claim a Midnight transaction, block or network confirmation. Demo evidence is labelled everywhere it appears."}
                    </p>
                  </section>

                  <KPICards activeVerifications={stats.active} reviewTime={live ? "network" : "local"} failedProofs={stats.failed} />

                  <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_310px]">
                    <PrivacyBoundary />
                    <IntegrityRail live={live} />
                  </div>

                  <VerificationTable verifications={stats.listed} onEmptyAction={() => setProofModalOpen(true)} />

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#c8cac2] pt-5">
                    <div className="evidence-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8f8b]">ShieldRate / proof integrity v1 / evidence-first interface</div>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary" onClick={() => setView("landing")}>Landing</button>
                      <button className="btn-secondary" onClick={() => setView("freelancer")}>Holder dossier</button>
                      <button className="btn-secondary" onClick={() => setView("mobile")}>Mobile concept</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {view === "freelancer" && (
        <FreelancerView wallet={wallet} onGenerateProof={() => setProofModalOpen(true)} onBack={() => setView("dashboard")} />
      )}

      {view === "mobile" && <MobileView onBack={() => setView("landing")} />}

      {proofModalOpen && (
        <ProofModal
          walletConnected={wallet.connected}
          busy={busy}
          result={lastResult}
          onGenerate={handleGenerate}
          onClose={() => setProofModalOpen(false)}
        />
      )}
    </div>
  );
}

function PrivacyBoundary() {
  return (
    <section className="border border-[#171b1d] bg-[#f8f7f0]/80 p-5 md:p-6">
      <div className="flex flex-col gap-2 border-b border-[#c8cac2] pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="micro-label">Privacy boundary / canonical request</div>
          <h2 className="display-serif mt-2 text-[27px] leading-none text-[#171b1d]">What the employer learns — and what they do not.</h2>
        </div>
        <span className="evidence-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#1f6b4d]">minimal disclosure</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <BoundaryCell code="A" label="Requested" value="Income ≥ $50,000" note="Standardized policy band" />
        <BoundaryCell code="B" label="Proven" value="Policy satisfied" note="Shareable positive receipt" />
        <BoundaryCell code="C" label="Hidden" value="Raw income" note="Never written to receipt" last />
      </div>
    </section>
  );
}

function BoundaryCell({ code, label, value, note, last = false }: { code: string; label: string; value: string; note: string; last?: boolean }) {
  return (
    <div className={`py-5 md:px-5 md:py-6 ${last ? "" : "border-b border-[#c8cac2] md:border-b-0 md:border-r"} first:md:pl-0`}>
      <div className="evidence-mono text-[9px] font-bold text-[#9da39d]">{code}</div>
      <div className="micro-label mt-5">{label}</div>
      <div className={`mt-2 text-[15px] font-black ${label === "Hidden" ? "text-[#1f6b4d]" : "text-[#171b1d]"}`}>{value}</div>
      <div className="mt-1 text-[10px] text-[#8a8f8b]">{note}</div>
    </div>
  );
}

function IntegrityRail({ live }: { live: boolean }) {
  const steps = [
    "Issuer attested",
    "Context scoped",
    "Replay protected",
    "Pass-only publication",
    live ? "Indexed receipt required" : "No fake network state",
  ];

  return (
    <aside className="border border-[#c8cac2] bg-[#f2f1e9]/90 p-5 md:p-6">
      <div className="micro-label">Integrity rail</div>
      <div className="mt-5 space-y-0">
        {steps.map((step, index) => (
          <div key={step} className="grid grid-cols-[28px_1fr] items-center gap-3 border-t border-[#c8cac2] py-3 first:border-t-[#171b1d]">
            <span className="evidence-mono text-[9px] font-bold text-[#1f6b4d]">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-[11px] font-bold text-[#343a3d]">{step}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function DemoRuntimePanel({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="instrument max-w-[850px] p-6 md:p-8">
      <div className="relative z-10">
        <span className="mode-badge mode-demo">Demo attested</span>
        <h2 className="display-serif mt-5 text-[36px] leading-none text-[#171b1d]">Runtime setup is intentionally closed in demo mode.</h2>
        <p className="mt-4 max-w-[680px] text-[13px] leading-6 text-[#6b706e]">
          This deployment demonstrates the integrity model without pretending to be connected to Midnight. Switch to the live candidate build with Lace for contract deployment, issuer registration and indexed receipt verification.
        </p>
        <button className="btn-primary mt-7" onClick={onGenerate}>Inspect demo proof flow <span aria-hidden>→</span></button>
      </div>
    </section>
  );
}
