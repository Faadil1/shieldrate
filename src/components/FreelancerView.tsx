import { FREELANCER_CREDENTIALS } from "../data";
import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";
import { BrandMark } from "./BrandMark";

interface FreelancerViewProps {
  wallet: WalletState;
  onGenerateProof: () => void;
  onBack: () => void;
}

export function FreelancerView({ wallet, onGenerateProof, onBack }: FreelancerViewProps) {
  const live = executionMode() === "midnight-live";

  return (
    <div className="app-shell security-field px-3 py-4 md:px-7 md:py-7">
      <div className="paper-panel mx-auto max-w-[1220px] overflow-hidden rounded-[2px]">
        <header className="grid gap-5 border-b border-[var(--ink)] px-6 py-6 md:grid-cols-[1fr_auto] md:items-end md:px-9 md:py-8">
          <div className="flex items-start gap-4">
            <BrandMark />
            <div>
              <div className="micro-label">Holder dossier / private state</div>
              <h1 className="display-serif mt-2 text-[40px] leading-[.95] text-[var(--ink)] md:text-[50px]">Private credential dossier</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
                <span className="evidence-mono text-[8px] text-[var(--muted)]">{wallet.connected ? wallet.displayAddress : "NO WALLET CONNECTED"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={onBack}>Back to bureau</button><button className="btn-primary" onClick={onGenerateProof}>Issue proof request <span aria-hidden>→</span></button></div>
        </header>

        <section className="grid border-b border-[var(--ink)] lg:grid-cols-[250px_1fr]">
          <aside className="security-band px-6 py-8 lg:border-r lg:border-[var(--ink)]">
            <div className="evidence-mono text-[8px] font-bold uppercase tracking-[.18em] text-[#c6d7d1]">Dossier index</div>
            <div className="display-serif mt-5 text-[34px] leading-[.95] text-[#fff8e8]">The holder sees the evidence.</div>
            <p className="mt-5 text-[10px] leading-5 text-[#d8e3de]">Employers never receive this full dossier. They receive a scoped policy result only after a successful proof.</p>
            <div className="mt-8 border-t border-[#8aa5a1]/45 pt-5 evidence-mono text-[8px] uppercase leading-6 tracking-[.12em] text-[#c6d7d1]">PRIVATE STATE<br />SESSION SCOPED<br />ISSUER ATTESTED</div>
          </aside>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {FREELANCER_CREDENTIALS.map((cred, index) => (
              <article key={cred.id} className={`relative min-h-[330px] p-6 md:p-7 ${index < FREELANCER_CREDENTIALS.length - 1 ? "border-b border-[var(--rule)] md:border-b-0 md:border-r" : ""}`}>
                <div className={`absolute left-0 top-0 h-[4px] w-full ${index === 0 ? "bg-[var(--mineral)]" : index === 1 ? "bg-[var(--iris)]" : "bg-[var(--verify)]"}`} />
                <div className="flex items-start justify-between gap-4">
                  <span className="evidence-mono text-[9px] font-black text-[var(--copper)]">C-{String(index + 1).padStart(2, "0")}</span>
                  <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Issuer loaded" : "Demo issuer"}</span>
                </div>
                <div className="mt-11 micro-label">Private credential field</div>
                <h2 className="display-serif mt-2 text-[29px] leading-none text-[var(--ink)]">{cred.label}</h2>
                <div className="mt-5 text-[36px] font-black tracking-[-0.055em] text-[var(--ink)]">{cred.value}</div>
                <p className="mt-1 text-[9px] text-[var(--muted)]">{cred.detail}</p>
                <div className="redacted-field mt-7 p-3">
                  <div className="micro-label !text-[var(--iris)]">Shareable transformation</div>
                  <div className="mt-2 flex items-center justify-between gap-4"><span className="text-[9px] text-[var(--iris)]">Policy band</span><span className="text-[10px] font-black text-[var(--iris)]">{cred.threshold}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-[1.12fr_.88fr]">
          <div className="border-b border-[var(--rule)] px-6 py-7 md:border-b-0 md:border-r md:px-9">
            <div className="micro-label">Disclosure rule</div>
            <h3 className="display-serif mt-2 max-w-[680px] text-[30px] leading-[.98] text-[var(--ink)]">The dossier contains values. The receipt contains only what the requester is entitled to learn.</h3>
            <p className="mt-4 max-w-[650px] text-[10px] leading-5 text-[var(--muted)]">Raw fields stay holder-side. Shared receipts use a job-scoped pseudonym and expose only a successful standardized policy result.</p>
          </div>
          <div className="px-6 py-7 md:px-9">
            <div className="micro-label">Publication behavior</div>
            <div className="status-rail mt-4">
              <DossierRule code="01" value="Pass → scoped receipt may be shared" />
              <DossierRule code="02" value="Fail → no public receipt exists" />
              <DossierRule code="03" value="Raw credential → never disclosed" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DossierRule({ code, value }: { code: string; value: string }) {
  return <div className="grid grid-cols-[16px_32px_1fr] items-center gap-3 py-3"><span className="status-dot" /><span className="evidence-mono text-[8px] font-black text-[var(--verify)]">{code}</span><span className="text-[10px] font-bold text-[var(--ink-soft)]">{value}</span></div>;
}
