import { FREELANCER_CREDENTIALS } from "../data";
import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";

interface FreelancerViewProps {
  wallet: WalletState;
  onGenerateProof: () => void;
  onBack: () => void;
}

export function FreelancerView({ wallet, onGenerateProof, onBack }: FreelancerViewProps) {
  const live = executionMode() === "midnight-live";

  return (
    <div className="app-shell px-4 py-5 md:px-7 md:py-7">
      <div className="paper-panel mx-auto max-w-[1180px] overflow-hidden rounded-[6px]">
        <header className="flex flex-col gap-5 border-b border-[#171b1d] px-6 py-6 md:flex-row md:items-end md:justify-between md:px-9 md:py-8">
          <div>
            <div className="micro-label">Holder dossier / private state</div>
            <h1 className="display-serif mt-2 text-[38px] leading-none text-[#171b1d] md:text-[46px]">My private credentials</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
              <span className="evidence-mono text-[9px] text-[#8a8f8b]">{wallet.connected ? wallet.displayAddress : "NO WALLET CONNECTED"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={onBack}>Back to desk</button>
            <button className="btn-primary" onClick={onGenerateProof}>Create proof request <span aria-hidden>→</span></button>
          </div>
        </header>

        <section className="grid grid-cols-1 border-b border-[#c8cac2] md:grid-cols-3">
          {FREELANCER_CREDENTIALS.map((cred, index) => (
            <article key={cred.id} className={`min-h-[300px] p-6 md:p-7 ${index < FREELANCER_CREDENTIALS.length - 1 ? "border-b border-[#c8cac2] md:border-b-0 md:border-r" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="evidence-mono text-[10px] font-black text-[#1f6b4d]">C-{String(index + 1).padStart(2, "0")}</span>
                <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Issuer loaded" : "Demo issuer"}</span>
              </div>
              <div className="mt-12 micro-label">Private field</div>
              <h2 className="display-serif mt-2 text-[30px] leading-none text-[#171b1d]">{cred.label}</h2>
              <div className="mt-5 text-[34px] font-black tracking-[-0.045em] text-[#171b1d]">{cred.value}</div>
              <p className="mt-1 text-[10px] text-[#8a8f8b]">{cred.detail}</p>

              <div className="mt-8 border-t border-[#c8cac2] pt-4">
                <div className="micro-label">Shareable form</div>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-[#6b706e]">Policy example</span>
                  <span className="text-[11px] font-black text-[#1f6b4d]">{cred.threshold}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 bg-[#ecece4]/60 md:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-[#c8cac2] px-6 py-7 md:border-b-0 md:border-r md:px-9">
            <div className="micro-label">Privacy rule</div>
            <h3 className="display-serif mt-2 text-[26px] leading-none text-[#171b1d]">The holder sees the value. The employer sees the policy result.</h3>
            <p className="mt-3 max-w-[620px] text-[11px] leading-5 text-[#6b706e]">Raw values stay in the holder-side private state. Shared receipts use a job-scoped pseudonym and disclose only a successful standardized policy.</p>
          </div>
          <div className="px-6 py-7 md:px-9">
            <div className="micro-label">Publication behavior</div>
            <div className="mt-4 space-y-3">
              <DossierRule code="01" value="Pass → receipt may be shared" />
              <DossierRule code="02" value="Fail → no public receipt" />
              <DossierRule code="03" value="Raw credential → never disclosed" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DossierRule({ code, value }: { code: string; value: string }) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3 border-t border-[#c8cac2] pt-3 first:border-t-[#171b1d]">
      <span className="evidence-mono text-[9px] font-black text-[#1f6b4d]">{code}</span>
      <span className="text-[11px] font-bold text-[#343a3d]">{value}</span>
    </div>
  );
}
