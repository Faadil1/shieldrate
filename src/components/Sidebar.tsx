import { executionMode } from "../security/integrity";
import { BrandMark } from "./BrandMark";

export type SectionKey =
  | "dashboard"
  | "requests"
  | "verifications"
  | "candidates"
  | "post"
  | "policies"
  | "providers"
  | "audit"
  | "settings"
  | "integrations"
  | "team"
  | "usage";

interface SidebarProps {
  active: SectionKey;
  onNavigate: (key: SectionKey) => void;
}

type NavItemConfig = {
  key: SectionKey;
  code: string;
  label: string;
  note: string;
  preview?: boolean;
};

const OPERATE: NavItemConfig[] = [
  { key: "dashboard", code: "01", label: "Overview", note: "Trust operations" },
  { key: "requests", code: "02", label: "Verification requests", note: "Request lifecycle" },
  { key: "verifications", code: "03", label: "Receipt register", note: "Shareable proofs" },
  { key: "candidates", code: "04", label: "Scoped subjects", note: "Context identities" },
  { key: "post", code: "+", label: "New request", note: "Private evaluation" },
];

const GOVERN: NavItemConfig[] = [
  { key: "policies", code: "G1", label: "Policy catalog", note: "Approved claim bands" },
  { key: "providers", code: "G2", label: "Issuers & providers", note: "Credential authorities" },
  { key: "audit", code: "G3", label: "Audit trail", note: "Evidence history", preview: true },
];

const PLATFORM: NavItemConfig[] = [
  { key: "settings", code: "P1", label: "Runtime", note: "Midnight environment" },
  { key: "integrations", code: "P2", label: "Integrations", note: "Connectors & feeds", preview: true },
  { key: "team", code: "P3", label: "Team & access", note: "Roles & permissions", preview: true },
  { key: "usage", code: "P4", label: "Usage", note: "Operational footprint", preview: true },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const live = executionMode() === "midnight-live";

  return (
    <aside className="enterprise-sidebar hidden flex-shrink-0 lg:flex lg:flex-col">
      <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-3 border-b border-[var(--ink)] px-5 py-5 text-left">
        <BrandMark compact />
        <span className="min-w-0">
          <span className="trust-wordmark block text-[17px] text-[var(--ink)]">SHIELDRATE</span>
          <span className="evidence-mono mt-1 block truncate text-[7px] uppercase tracking-[0.2em] text-[var(--muted)]">verification operations</span>
        </span>
      </button>

      <div className="px-4 py-4">
        <div className="workspace-identity">
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label">Workspace</span>
            <span className="preview-pill">V3</span>
          </div>
          <div className="mt-2 text-[12px] font-black text-[var(--ink)]">Employer operations</div>
          <div className="mt-1 text-[9px] leading-4 text-[var(--muted)]">Evidence, policy and runtime control plane.</div>
        </div>
      </div>

      <div className="topographic-rule" />

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavGroup label="Operate" items={OPERATE} active={active} onNavigate={onNavigate} />
        <NavGroup label="Govern" items={GOVERN} active={active} onNavigate={onNavigate} />
        <NavGroup label="Platform" items={PLATFORM} active={active} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-[var(--ink)] p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
          <span className="evidence-mono text-[7px] font-bold text-[var(--copper)]">SR/V3</span>
        </div>
        <p className="mt-3 text-[9px] leading-4 text-[var(--muted)]">Proof Integrity v1 is upstream. V3 expands the product surface without weakening privacy semantics.</p>
        <div className="mt-4 h-[3px] bg-gradient-to-r from-[var(--mineral)] via-[var(--verify)] to-[var(--copper)]" />
      </div>
    </aside>
  );
}

function NavGroup({ label, items, active, onNavigate }: { label: string; items: NavItemConfig[]; active: SectionKey; onNavigate: (key: SectionKey) => void }) {
  return (
    <section className="mb-6 last:mb-0">
      <div className="micro-label px-3 pb-2">{label}</div>
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.key}
            code={item.code}
            label={item.label}
            note={item.note}
            preview={item.preview}
            active={active === item.key}
            onClick={() => onNavigate(item.key)}
          />
        ))}
      </div>
    </section>
  );
}

function NavItem({ code, label, note, preview, active, onClick }: { code: string; label: string; note: string; preview?: boolean; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group grid w-full grid-cols-[34px_1fr_auto] items-start gap-2 border px-3 py-2.5 text-left transition-all ${
        active
          ? "border-[var(--ink)] bg-[var(--paper-white)] shadow-[3px_3px_0_rgba(16,44,49,.06)]"
          : "border-transparent text-[var(--muted)] hover:border-[var(--rule)] hover:bg-[rgba(255,248,232,.56)]"
      }`}
    >
      <span className={`evidence-mono pt-[2px] text-[8px] font-black ${active ? "text-[var(--verify)]" : "text-[var(--rule-strong)]"}`}>{code}</span>
      <span className="min-w-0">
        <span className={`block truncate text-[11px] font-black ${active ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>{label}</span>
        <span className="mt-0.5 block truncate text-[8px] text-[var(--muted)]">{note}</span>
      </span>
      {preview ? <span className="preview-pill mt-0.5">Preview</span> : active ? <span className="mt-1 h-2 w-2 rounded-full bg-[var(--copper)]" /> : null}
    </button>
  );
}
