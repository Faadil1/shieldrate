import type { Verification } from "../types";
import { CLAIM_POLICIES } from "../security/integrity";
import { formatThreshold } from "../utils/contractHelpers";
import type { SectionKey } from "./Sidebar";

interface EnterpriseModuleProps {
  section: SectionKey;
  verifications: Verification[];
  live: boolean;
  onNewRequest: () => void;
  onOpenRuntime: () => void;
}

export function EnterpriseModule({ section, verifications, live, onNewRequest, onOpenRuntime }: EnterpriseModuleProps) {
  if (section === "requests" || section === "post") {
    return <RequestOperations onNewRequest={onNewRequest} />;
  }
  if (section === "candidates") {
    return <SubjectDirectory verifications={verifications} />;
  }
  if (section === "policies") {
    return <PolicyCatalog />;
  }
  if (section === "providers") {
    return <ProviderRegistry live={live} onOpenRuntime={onOpenRuntime} />;
  }
  if (section === "audit") {
    return <AuditTrail verifications={verifications} />;
  }
  if (section === "integrations") {
    return <Integrations live={live} />;
  }
  if (section === "team") {
    return <TeamAccess />;
  }
  if (section === "usage") {
    return <UsageSurface verifications={verifications} />;
  }
  return null;
}

function RequestOperations({ onNewRequest }: { onNewRequest: () => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <section className="module-surface p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-[var(--ink)] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="micro-label">Request control plane</div>
            <h2 className="display-serif mt-2 text-[31px] leading-none text-[var(--ink)]">Standardized requests, not arbitrary probing.</h2>
          </div>
          <button className="btn-primary" onClick={onNewRequest}>Issue request <span aria-hidden>→</span></button>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-3">
          <LifecycleCard code="01" title="Scope" body="Bind one employer, one job, one claim and one challenge." />
          <LifecycleCard code="02" title="Evaluate" body="Evaluate only an approved coarse policy band against private attested data." />
          <LifecycleCard code="03" title="Publish" body="Create a shareable receipt only if the requested policy passes." />
        </div>

        <div className="mt-6 border-t border-[var(--rule)] pt-5">
          <div className="micro-label">Queue semantics</div>
          <div className="mt-3 border border-[var(--rule)] bg-[rgba(255,248,232,.48)] p-4">
            <div className="text-[11px] font-black text-[var(--ink)]">No persistent multi-user request queue is claimed in this build.</div>
            <p className="mt-2 text-[9px] leading-4 text-[var(--muted)]">The current product surface models the request lifecycle and executes one private evaluation at a time. A server-backed enterprise queue remains a separate future workstream.</p>
          </div>
        </div>
      </section>

      <aside className="module-surface p-5 md:p-6">
        <div className="micro-label">Supported claim families</div>
        <h3 className="display-serif mt-2 text-[27px] leading-none text-[var(--ink)]">Three governed policy surfaces.</h3>
        <div className="mt-5 space-y-2">
          <ClaimFamily code="INC" title="Income" note="Approved annual-income bands" tone="mineral" />
          <ClaimFamily code="REP" title="Reputation" note="Approved rating bands" tone="verify" />
          <ClaimFamily code="JOB" title="Completed jobs" note="Approved work-count bands" tone="iris" />
        </div>
      </aside>
    </div>
  );
}

function SubjectDirectory({ verifications }: { verifications: Verification[] }) {
  const subjects = Array.from(new Map(verifications.map((item) => [item.userHash, item])).values());
  return (
    <section className="module-surface overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--ink)] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <div className="micro-label">Scoped subject directory</div>
          <h2 className="display-serif mt-2 text-[30px] leading-none text-[var(--ink)]">Context identity without a global public profile.</h2>
        </div>
        <span className="mode-badge">{subjects.length} subject{subjects.length === 1 ? "" : "s"}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="enterprise-table min-w-[780px]">
          <thead>
            <tr>{["Scoped subject", "Latest policy", "Evidence mode", "Freshness"].map((heading) => <th key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr key={item.userHash}>
                <td><span className="evidence-mono text-[9px] font-bold">{item.userHash}</span><span className="block text-[8px] text-[var(--muted)]">job-scoped pseudonym</span></td>
                <td><span className="text-[10px] font-black">{item.thresholdLabel}</span><span className="block text-[8px] uppercase tracking-[.1em] text-[var(--muted)]">{item.type}</span></td>
                <td><span className={`mode-badge ${item.evidenceMode === "midnight-live" ? "mode-live" : "mode-demo"}`}>{item.evidenceMode === "midnight-live" ? "Midnight live" : "Demo attested"}</span></td>
                <td className="text-[9px] text-[var(--muted)]">{item.freshUntil ? new Date(item.freshUntil).toLocaleDateString() : item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--ink)] bg-[var(--iris-bg)] px-5 py-4 text-[9px] leading-4 text-[var(--iris)] md:px-6">These identifiers are context-scoped. This surface does not claim a stable cross-employer identity directory.</div>
    </section>
  );
}

function PolicyCatalog() {
  const groups = [
    { key: "income" as const, code: "INC", title: "Income", tone: "mineral" },
    { key: "reputation" as const, code: "REP", title: "Reputation", tone: "verify" },
    { key: "skills" as const, code: "JOB", title: "Completed jobs", tone: "iris" },
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {groups.map((group) => (
        <section key={group.key} className="module-surface p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--ink)] pb-4">
            <div>
              <span className="evidence-mono text-[8px] font-black text-[var(--copper)]">{group.code}</span>
              <h2 className="display-serif mt-2 text-[27px] leading-none text-[var(--ink)]">{group.title}</h2>
            </div>
            <span className="preview-pill">Enforced</span>
          </div>
          <div className="mt-5 space-y-2">
            {CLAIM_POLICIES[group.key].map((value, index) => (
              <div key={value} className="flex items-center justify-between gap-4 border border-[var(--rule)] bg-[rgba(255,248,232,.52)] px-4 py-3">
                <span className="text-[10px] font-black text-[var(--ink-soft)]">{formatThreshold(group.key, value)}</span>
                <span className="evidence-mono text-[7px] font-bold text-[var(--muted)]">BAND {String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[9px] leading-4 text-[var(--muted)]">Free-form thresholds are rejected. Employers choose only from the approved bands shown here.</p>
        </section>
      ))}
    </div>
  );
}

function ProviderRegistry({ live, onOpenRuntime }: { live: boolean; onOpenRuntime: () => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <section className="module-surface p-5 md:p-6">
        <div className="border-b border-[var(--ink)] pb-4">
          <div className="micro-label">Credential authority model</div>
          <h2 className="display-serif mt-2 text-[31px] leading-none text-[var(--ink)]">Registered public keys, rotating epochs, no issuer secret in the app.</h2>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          <LifecycleCard code="A" title="Register" body="Provider ID and public signing key enter the contract registry." />
          <LifecycleCard code="B" title="Rotate" body="Provider epochs give the verifier a coarse freshness and revocation boundary." />
          <LifecycleCard code="C" title="Verify" body="The Compact circuit checks the attestation signature against registered provider state." />
        </div>
      </section>
      <aside className="module-surface p-5 md:p-6">
        <div className="micro-label">Current environment</div>
        <div className={`mt-3 text-[17px] font-black ${live ? "text-[var(--verify)]" : "text-[var(--amber)]"}`}>{live ? "Live provider path available" : "Demo provider semantics"}</div>
        <p className="mt-3 text-[9px] leading-4 text-[var(--muted)]">{live ? "Use Runtime to register a provider on-chain and import a signed credential payload." : "The demo uses issuer-attested fixture data and does not claim an on-chain provider registration."}</p>
        <button className="btn-secondary mt-5 w-full" onClick={onOpenRuntime}>Open runtime</button>
      </aside>
    </div>
  );
}

function AuditTrail({ verifications }: { verifications: Verification[] }) {
  return (
    <section className="module-surface overflow-hidden">
      <div className="border-b border-[var(--ink)] px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-center gap-3"><span className="micro-label">Evidence history</span><span className="preview-pill">Product preview</span></div>
        <h2 className="display-serif mt-2 text-[30px] leading-none text-[var(--ink)]">Receipt-level history today. Full event audit next.</h2>
        <p className="mt-3 max-w-[760px] text-[9px] leading-4 text-[var(--muted)]">This surface only renders evidence that actually exists in the current build. It does not fabricate actor logs, approvals or server-side events.</p>
      </div>
      <div className="divide-y divide-[var(--rule)]">
        {verifications.map((item, index) => (
          <div key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[46px_1fr_170px_160px] md:items-center md:px-6">
            <span className="evidence-mono text-[8px] font-black text-[var(--verify)]">{String(index + 1).padStart(2, "0")}</span>
            <div><div className="text-[10px] font-black text-[var(--ink-soft)]">Receipt available · {item.thresholdLabel}</div><div className="evidence-mono mt-1 text-[7px] text-[var(--muted)]">{item.id} / {item.userHash}</div></div>
            <span className={`mode-badge ${item.evidenceMode === "midnight-live" ? "mode-live" : "mode-demo"}`}>{item.evidenceMode === "midnight-live" ? "Midnight live" : "Demo attested"}</span>
            <span className="text-[8px] text-[var(--muted)]">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Integrations({ live }: { live: boolean }) {
  const items = [
    { name: "Midnight DApp Connector", status: live ? "Available in live candidate" : "Live candidate only", detail: "Lace connection and wallet-derived network configuration.", tone: live ? "verify" : "amber" },
    { name: "Compact contract", status: "Compiled", detail: "Compact 0.31.1 contract artifacts are generated in CI.", tone: "verify" },
    { name: "Issuer credential feed", status: "Manual payload import", detail: "Signed credential payload can be imported; automated issuer transport is not claimed.", tone: "mineral" },
    { name: "Enterprise webhooks", status: "Planned", detail: "No webhook delivery or external event bus is implemented in this build.", tone: "iris" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => <IntegrationCard key={item.name} {...item} />)}
    </div>
  );
}

function TeamAccess() {
  return (
    <section className="module-surface p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-3"><span className="micro-label">Access architecture</span><span className="preview-pill">Planned / not wired</span></div>
      <h2 className="display-serif mt-2 max-w-[760px] text-[31px] leading-none text-[var(--ink)]">A multi-user SaaS needs role boundaries as strong as its proof boundaries.</h2>
      <div className="mt-6 grid gap-2 md:grid-cols-3">
        <LifecycleCard code="ADM" title="Administrator" body="Runtime, provider and organization controls. Role model only; no RBAC is implemented yet." />
        <LifecycleCard code="VER" title="Verifier" body="Create governed requests and review positive receipts. Role model only." />
        <LifecycleCard code="REV" title="Reviewer" body="Read receipt and audit surfaces without provider administration. Role model only." />
      </div>
      <div className="mt-5 border-l-2 border-[var(--iris)] bg-[var(--iris-bg)] px-4 py-3 text-[9px] leading-4 text-[var(--iris)]">This is intentionally presented as product architecture, not as an active authentication or authorization system.</div>
    </section>
  );
}

function UsageSurface({ verifications }: { verifications: Verification[] }) {
  const subjects = new Set(verifications.map((item) => item.userHash)).size;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <UsageCard label="Receipts in current evidence set" value={String(verifications.length)} note="Fixture + generated pass receipts" />
      <UsageCard label="Scoped subjects represented" value={String(subjects)} note="No stable global subject count" />
      <UsageCard label="Policy families supported" value="3" note="Income · reputation · completed jobs" />
      <UsageCard label="Billing meters" value="0" note="No billing or quota metering is claimed" />
    </div>
  );
}

function LifecycleCard({ code, title, body }: { code: string; title: string; body: string }) {
  return (
    <article className="border border-[var(--rule)] bg-[rgba(255,248,232,.52)] p-4">
      <span className="evidence-mono text-[8px] font-black text-[var(--copper)]">{code}</span>
      <h3 className="mt-5 text-[11px] font-black text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-[9px] leading-4 text-[var(--muted)]">{body}</p>
    </article>
  );
}

function ClaimFamily({ code, title, note, tone }: { code: string; title: string; note: string; tone: "mineral" | "verify" | "iris" }) {
  const toneClass = tone === "mineral" ? "text-[var(--mineral)]" : tone === "verify" ? "text-[var(--verify)]" : "text-[var(--iris)]";
  return (
    <div className="grid grid-cols-[42px_1fr] gap-3 border border-[var(--rule)] bg-[rgba(255,248,232,.52)] p-4">
      <span className={`evidence-mono text-[8px] font-black ${toneClass}`}>{code}</span>
      <div><div className="text-[10px] font-black text-[var(--ink-soft)]">{title}</div><div className="mt-1 text-[8px] text-[var(--muted)]">{note}</div></div>
    </div>
  );
}

function IntegrationCard({ name, status, detail, tone }: { name: string; status: string; detail: string; tone: string }) {
  const toneClass = tone === "verify" ? "text-[var(--verify)]" : tone === "amber" ? "text-[var(--amber)]" : tone === "mineral" ? "text-[var(--mineral)]" : "text-[var(--iris)]";
  return (
    <article className="module-surface p-5 md:p-6">
      <div className="micro-label">Integration</div>
      <h2 className="mt-4 text-[14px] font-black text-[var(--ink)]">{name}</h2>
      <div className={`mt-2 text-[9px] font-black uppercase tracking-[.1em] ${toneClass}`}>{status}</div>
      <p className="mt-4 text-[9px] leading-4 text-[var(--muted)]">{detail}</p>
    </article>
  );
}

function UsageCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="module-surface p-5">
      <div className="micro-label">{label}</div>
      <div className="mt-6 text-[34px] font-black tracking-[-.05em] text-[var(--mineral)]">{value}</div>
      <p className="mt-2 text-[8px] leading-4 text-[var(--muted)]">{note}</p>
    </article>
  );
}
