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
import { BrandMark } from "./components/BrandMark";

export default function App() {
  const { wallet, connect, disconnect } = useWallet();
  const { busy, lastResult, generateProof } = useContract();
  const live = executionMode() === "midnight-live";

  const [view, setView] = useState<View>("landing");
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [proofModalOpen, setProofModalOpen] = useState(false);

  const generatedReceipt: Verification[] = lastResult?.passed && lastResult.receipt
    ? [{
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
      }]
    : [];

  const stats = computeStats([...generatedReceipt, ...SHIELD_VERIFICATIONS]);
  const handleGenerate = (req: ProofRequest) => void generateProof(req, wallet.address ?? "demo-holder");

  return (
    <div className="app-shell security-field">
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
        <div className="min-h-screen lg:flex">
          <Sidebar
            active={section}
            onNavigate={(key) => {
              setSection(key);
              if (key === "post") setProofModalOpen(true);
            }}
          />

          <main className="min-w-0 flex-1 px-3 py-4 md:px-6 md:py-6 xl:px-9 xl:py-8">
            <div className="document-frame mx-auto max-w-[1320px] p-4 md:p-6 xl:p-8">
              <div className="mb-5 flex items-center justify-between border-b border-[var(--ink)] pb-4 lg:hidden">
                <button onClick={() => setView("landing")} className="flex items-center gap-2 text-left">
                  <BrandMark compact />
                  <span className="trust-wordmark text-[16px] text-[var(--ink)]">SHIELDRATE</span>
                </button>
                <button className="btn-primary" onClick={() => setProofModalOpen(true)}>New proof</button>
              </div>

              <Header wallet={wallet} pendingCount={stats.pending} onDisconnect={disconnect} onGenerateProof={() => setProofModalOpen(true)} />

              {section === "settings" && live ? (
                <LiveSetupPanel />
              ) : section === "settings" ? (
                <DemoRuntimePanel onGenerate={() => setProofModalOpen(true)} />
              ) : (
                <>
                  <TrustBoundary live={live} walletConnected={wallet.connected} network={wallet.network} />
                  <KPICards activeVerifications={stats.active} reviewTime={live ? "network" : "local"} failedProofs={stats.failed} />

                  <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_330px]">
                    <PrivacyBoundary />
                    <IntegrityRail live={live} />
                  </div>

                  <VerificationTable verifications={stats.listed} onEmptyAction={() => setProofModalOpen(true)} />

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ink)] pt-5">
                    <div className="evidence-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">SR / VERIFICATION BUREAU / EVIDENCE FIRST / TRACE MAX V2</div>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary" onClick={() => setView("landing")}>Landing</button>
                      <button className="btn-secondary" onClick={() => setView("freelancer")}>Holder dossier</button>
                      <button className="btn-secondary" onClick={() => setView("mobile")}>Mobile pass</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {view === "freelancer" && <FreelancerView wallet={wallet} onGenerateProof={() => setProofModalOpen(true)} onBack={() => setView("dashboard")} />}
      {view === "mobile" && <MobileView onBack={() => setView("landing")} />}

      {proofModalOpen && (
        <ProofModal walletConnected={wallet.connected} busy={busy} result={lastResult} onGenerate={handleGenerate} onClose={() => setProofModalOpen(false)} />
      )}
    </div>
  );
}

function TrustBoundary({ live, walletConnected, network }: { live: boolean; walletConnected: boolean; network: string | null }) {
  return (
    <section className={`mb-6 grid border-y border-[var(--ink)] md:grid-cols-[165px_1fr] ${live ? "bg-[var(--verify-bg)]" : "bg-[var(--amber-bg)]"}`}>
      <div className="flex items-center border-b border-[rgba(16,44,49,.20)] px-5 py-4 md:border-b-0 md:border-r">
        <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Live boundary" : "Demo boundary"}</span>
      </div>
      <div className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
        <p className="text-[10px] leading-5 text-[var(--ink-soft)]">
          {live
            ? `MIDNIGHT_LIVE · ${walletConnected ? `${network ?? "wallet"} connected` : "connect Lace before proving"}. Verified means finalized transaction + indexed receipt lookup.`
            : "DEMO_ATTESTED · Integrity semantics are real; Midnight transaction, block and network confirmation are not simulated."}
        </p>
        <span className="evidence-mono text-[8px] font-bold uppercase tracking-[.13em] text-[var(--ink)]">TRUST STATE / EXPLICIT</span>
      </div>
    </section>
  );
}

function PrivacyBoundary() {
  return (
    <section className="proof-instrument-v2 p-5 md:p-6">
      <div className="relative z-10">
        <div className="flex flex-col gap-2 border-b border-[var(--ink)] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="micro-label">Canonical disclosure boundary</div>
            <h2 className="display-serif mt-2 max-w-[650px] text-[30px] leading-[.98] text-[var(--ink)]">One employer question. One public answer. Everything else stays private.</h2>
          </div>
          <span className="evidence-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--verify)]">minimal disclosure / enforced</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3">
          <BoundaryCell tone="requested" code="A" label="Requested" value="Income ≥ $50,000" note="Approved policy band" />
          <BoundaryCell tone="proven" code="B" label="Proven" value="Policy satisfied" note="Shareable positive receipt" />
          <BoundaryCell tone="hidden" code="C" label="Hidden" value="Raw income" note="Never written to receipt" />
        </div>
      </div>
    </section>
  );
}

function BoundaryCell({ tone, code, label, value, note }: { tone: "requested" | "proven" | "hidden"; code: string; label: string; value: string; note: string }) {
  const toneClass = tone === "requested" ? "privacy-requested" : tone === "proven" ? "privacy-proven" : "privacy-hidden";
  return (
    <div className={`border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between">
        <span className="evidence-mono text-[8px] font-black">{code}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      <div className="micro-label mt-6 !text-current">{label}</div>
      <div className="mt-2 text-[14px] font-black">{value}</div>
      <div className="mt-1 text-[9px] opacity-70">{note}</div>
    </div>
  );
}

function IntegrityRail({ live }: { live: boolean }) {
  const steps = ["Issuer attested", "Context scoped", "Replay protected", "Pass-only publication", live ? "Indexed receipt required" : "No fake network state"];
  return (
    <aside className="document-frame p-5 md:p-6">
      <div className="micro-label">Integrity sequence</div>
      <h3 className="display-serif mt-2 text-[25px] leading-none text-[var(--ink)]">Every public receipt crosses five gates.</h3>
      <div className="status-rail mt-6 space-y-0">
        {steps.map((step, index) => (
          <div key={step} className="grid grid-cols-[16px_32px_1fr] items-center gap-3 py-3">
            <span className="status-dot" />
            <span className="evidence-mono text-[8px] font-black text-[var(--verify)]">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-[10px] font-bold text-[var(--ink-soft)]">{step}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function DemoRuntimePanel({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="proof-instrument-v2 max-w-[880px] p-6 md:p-8">
      <div className="relative z-10">
        <span className="mode-badge mode-demo">Demo attested</span>
        <h2 className="display-serif mt-5 text-[39px] leading-[.96] text-[var(--ink)]">Runtime activation is deliberately closed in demo mode.</h2>
        <p className="mt-4 max-w-[690px] text-[12px] leading-6 text-[var(--muted)]">This deployment demonstrates the integrity model without pretending to be connected to Midnight. The live candidate with Lace is reserved for contract deployment, issuer registration and indexed receipt verification.</p>
        <button className="btn-primary mt-7" onClick={onGenerate}>Inspect proof procedure <span aria-hidden>→</span></button>
      </div>
    </section>
  );
}
