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
    <div className="min-h-screen bg-night-950 text-neutral-200">
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
        <div className="min-h-screen flex">
          <Sidebar
            active={section}
            onNavigate={(key) => {
              setSection(key);
              if (key === "post") setProofModalOpen(true);
            }}
          />
          <main className="flex-1 p-8">
            <Header
              wallet={wallet}
              pendingCount={stats.pending}
              onDisconnect={disconnect}
              onGenerateProof={() => setProofModalOpen(true)}
            />

            {section === "settings" && live ? (
              <LiveSetupPanel />
            ) : (
              <>
                <div className={`mb-5 rounded-xl border px-5 py-3 text-xs ${live ? "border-rate-500/20 bg-rate-500/5 text-rate-200/80" : "border-amber-500/20 bg-amber-500/5 text-amber-200/80"}`}>
                  {live
                    ? `MIDNIGHT_LIVE · ${wallet.connected ? `${wallet.network} wallet connected` : "connect Lace before proving"}. A proof is shown as verified only after transaction finalization and independent receipt lookup.`
                    : "Proof Integrity v1 · DEMO_ATTESTED mode. No transaction, block confirmation or Midnight network state is simulated."}
                </div>
                <KPICards activeVerifications={stats.active} reviewTime={live ? "network" : "local"} failedProofs={stats.failed} />
                <VerificationTable verifications={stats.listed} onEmptyAction={() => setProofModalOpen(true)} />
                <div className="mt-8 flex gap-3">
                  <button className="btn-secondary" onClick={() => setView("landing")}>← Landing</button>
                  <button className="btn-secondary" onClick={() => setView("freelancer")}>Freelancer View</button>
                  <button className="btn-secondary" onClick={() => setView("mobile")}>Mobile App</button>
                </div>
              </>
            )}
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
