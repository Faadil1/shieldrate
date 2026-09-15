import type { Verification } from "../types";

interface EnterpriseOverviewProps {
  verifications: Verification[];
  live: boolean;
  walletConnected: boolean;
  onNewRequest: () => void;
  onOpenRuntime: () => void;
}

export function EnterpriseOverview({ verifications, live, walletConnected, onNewRequest, onOpenRuntime }: EnterpriseOverviewProps) {
  const subjects = new Set(verifications.map((item) => item.userHash)).size;
  const claimFamilies = new Set(verifications.map((item) => item.type)).size;
  const recent = verifications.slice(0, 4);

  return (
    <section className="mb-7 grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <div className="module-surface p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-[var(--rule)] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="micro-label">Operations command center</div>
            <h2 className="display-serif mt-2 text-[30px] leading-none text-[var(--ink)]">One workspace, four operating lanes.</h2>
          </div>
          <button className="btn-primary" onClick={onNewRequest}>Issue request <span aria-hidden>→</span></button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <OpsMetric code="RQ" label="Request model" value="Bound" note="Employer + job + challenge" tone="mineral" />
          <OpsMetric code="RC" label="Receipts" value={String(verifications.length).padStart(2, "0")} note="Successful claims only" tone="verify" />
          <OpsMetric code="SB" label="Scoped subjects" value={String(subjects).padStart(2, "0")} note="No stable public identity" tone="iris" />
          <OpsMetric code="PL" label="Policy families" value={String(Math.max(claimFamilies, 3)).padStart(2, "0")} note="Income · reputation · jobs" tone="copper" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--ink)] pb-3">
              <span className="micro-label">Recent evidence</span>
              <span className="evidence-mono text-[7px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">latest receipts</span>
            </div>
            <div>
              {recent.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-[var(--rule)] py-3 last:border-b-0">
                  <span className="evidence-mono text-[8px] font-black text-[var(--verify)]">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="truncate text-[10px] font-black text-[var(--ink-soft)]">{item.thresholdLabel}</div>
                    <div className="evidence-mono mt-1 truncate text-[7px] text-[var(--muted)]">{item.userHash}</div>
                  </div>
                  <span className="status-badge verified">passed</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-[var(--ink)] pb-3">
              <span className="micro-label">Trust posture</span>
              <span className="evidence-mono text-[7px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">proof integrity v1</span>
            </div>
            <div className="status-rail mt-1">
              <TrustRow label="Issuer attestation" value="Enforced" />
              <TrustRow label="Context scoping" value="Enforced" />
              <TrustRow label="Replay protection" value="Enforced" />
              <TrustRow label="Pass-only publication" value="Enforced" />
              <TrustRow label="Ledger confirmation" value={live ? "Required in live mode" : "Not claimed in demo"} caution={!live} />
            </div>
          </div>
        </div>
      </div>

      <aside className="module-surface p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--ink)] pb-4">
          <div>
            <div className="micro-label">Environment posture</div>
            <h3 className="display-serif mt-2 text-[27px] leading-none text-[var(--ink)]">Runtime readiness</h3>
          </div>
          <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Live path" : "Demo path"}</span>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <EnvironmentCell label="Execution mode" value={live ? "MIDNIGHT_LIVE" : "DEMO_ATTESTED"} tone={live ? "verify" : "amber"} />
          <EnvironmentCell label="Wallet" value={walletConnected ? "Connected" : live ? "Required" : "Demo holder"} tone={walletConnected ? "verify" : "mineral"} />
          <EnvironmentCell label="Public failure receipts" value="0 by design" tone="iris" />
          <EnvironmentCell label="Proof disclosure" value="Policy result only" tone="copper" />
        </div>

        <div className="mt-6 border-t border-[var(--rule)] pt-5">
          <div className="micro-label">Operator note</div>
          <p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">
            {live
              ? "The live path is fail-closed: transaction submission alone is insufficient. The expected receipt must be found again in indexed contract state."
              : "This public preview demonstrates product and integrity semantics without inventing a Midnight transaction, block or confirmation."}
          </p>
          <button className="btn-secondary mt-4 w-full" onClick={onOpenRuntime}>Open runtime control</button>
        </div>
      </aside>
    </section>
  );
}

function OpsMetric({ code, label, value, note, tone }: { code: string; label: string; value: string; note: string; tone: "mineral" | "verify" | "iris" | "copper" }) {
  const toneClass = tone === "mineral" ? "text-[var(--mineral)]" : tone === "verify" ? "text-[var(--verify)]" : tone === "iris" ? "text-[var(--iris)]" : "text-[var(--copper)]";
  return (
    <article className="enterprise-stat">
      <div className="flex items-center justify-between gap-2">
        <span className="micro-label">{label}</span>
        <span className={`evidence-mono text-[8px] font-black ${toneClass}`}>{code}</span>
      </div>
      <div className={`mt-5 text-[28px] font-black tracking-[-.045em] ${toneClass}`}>{value}</div>
      <p className="mt-1 text-[8px] leading-4 text-[var(--muted)]">{note}</p>
    </article>
  );
}

function TrustRow({ label, value, caution = false }: { label: string; value: string; caution?: boolean }) {
  return (
    <div className="grid grid-cols-[16px_1fr_auto] items-center gap-3 border-b border-[var(--rule)] py-3 last:border-b-0">
      <span className={`status-dot ${caution ? "!border-[var(--amber)]" : ""}`} />
      <span className="text-[9px] font-bold text-[var(--ink-soft)]">{label}</span>
      <span className={`evidence-mono text-[7px] font-bold uppercase tracking-[.1em] ${caution ? "text-[var(--amber)]" : "text-[var(--verify)]"}`}>{value}</span>
    </div>
  );
}

function EnvironmentCell({ label, value, tone }: { label: string; value: string; tone: "verify" | "amber" | "mineral" | "iris" | "copper" }) {
  const toneClass = tone === "verify" ? "text-[var(--verify)]" : tone === "amber" ? "text-[var(--amber)]" : tone === "mineral" ? "text-[var(--mineral)]" : tone === "iris" ? "text-[var(--iris)]" : "text-[var(--copper)]";
  return (
    <div className="border border-[var(--rule)] bg-[rgba(255,248,232,.54)] p-4">
      <div className="micro-label">{label}</div>
      <div className={`mt-3 text-[11px] font-black ${toneClass}`}>{value}</div>
    </div>
  );
}
