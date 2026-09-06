import { useState } from "react";
import type { ProofRequest, View } from "./types";
import { useContract } from "./hooks/useContract";
import { useWallet } from "./hooks/useWallet";
import { SHIELD_VERIFICATIONS } from "./data";
import { computeStats } from "./data";
import { Landing } from "./components/Landing";
import { Sidebar, type SectionKey } from "./components/Sidebar";
import { Header } from "./components/Header";
import { KPICards } from "./components/KPICards";
import { VerificationTable } from "./components/VerificationTable";
import { FreelancerView } from "./components/FreelancerView";
import { MobileView } from "./components/MobileView";
import { ProofModal } from "./components/ProofModal";

export default function App() {
  const { wallet, connect, disconnect } = useWallet();
  const { busy, lastResult, generateProof } = useContract();

  const [view, setView] = useState<View>("landing");
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [proofModalOpen, setProofModalOpen] = useState(false);

  const stats = computeStats(SHIELD_VERIFICATIONS);

  const handleGenerate = (req: ProofRequest) => {
    void generateProof(req, wallet.address ?? "devnet-user");
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
            <KPICards
              activeVerifications={stats.active}
              reviewTime="1.2s"
              failedProofs={stats.failed}
            />
            <VerificationTable
              verifications={stats.listed}
              onEmptyAction={() => setProofModalOpen(true)}
            />
            <div className="mt-8 flex gap-3">
              <button
                className="btn-secondary"
                onClick={() => setView("landing")}
              >
                ← Landing
              </button>
              <button
                className="btn-secondary"
                onClick={() => setView("freelancer")}
              >
                Freelancer View
              </button>
              <button className="btn-secondary" onClick={() => setView("mobile")}>
                Mobile App
              </button>
            </div>
          </main>
        </div>
      )}

      {view === "freelancer" && (
        <FreelancerView
          wallet={wallet}
          onGenerateProof={() => setProofModalOpen(true)}
          onBack={() => setView("dashboard")}
        />
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