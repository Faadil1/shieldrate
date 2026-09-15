import { executionMode } from "../security/integrity";
import { BrandMark } from "./BrandMark";

export type SectionKey = "dashboard" | "candidates" | "verifications" | "post" | "settings" | "billing";

interface SidebarProps {
  active: SectionKey;
  onNavigate: (key: SectionKey) => void;
}

const CORE: { key: SectionKey; code: string; label: string; note: string }[] = [
  { key: "dashboard", code: "01", label: "Verification bureau", note: "Evidence overview" },
  { key: "candidates", code: "02", label: "Scoped subjects", note: "Context identities" },
  { key: "verifications", code: "03", label: "Receipt register", note: "Shareable proofs" },
  { key: "post", code: "04", label: "Issue request", note: "Private evaluation" },
];

const SYSTEM: { key: SectionKey; code: string; label: string }[] = [
  { key: "settings", code: "A1", label: "Runtime dossier" },
  { key: "billing", code: "A2", label: "Account" },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const live = executionMode() === "midnight-live";

  return (
    <aside className="hidden w-[252px] flex-shrink-0 border-r border-[var(--ink)] bg-[rgba(239,228,207,.84)] backdrop-blur lg:flex lg:flex-col">
      <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-3 border-b border-[var(--ink)] px-5 py-6 text-left">
        <BrandMark compact />
        <span>
          <span className="trust-wordmark block text-[17px] text-[var(--ink)]">SHIELDRATE</span>
          <span className="evidence-mono mt-1 block text-[7px] uppercase tracking-[0.2em] text-[var(--muted)]">verification bureau</span>
        </span>
      </button>

      <div className="topographic-rule" />

      <div className="flex-1 px-3 py-5">
        <div className="micro-label px-3 pb-2">Evidence workspace</div>
        <div className="space-y-1">
          {CORE.map((item) => (
            <NavItem key={item.key} code={item.code} label={item.label} note={item.note} active={active === item.key} onClick={() => onNavigate(item.key)} />
          ))}
        </div>

        <div className="micro-label px-3 pb-2 pt-7">System</div>
        <div className="space-y-1">
          {SYSTEM.map((item) => (
            <NavItem key={item.key} code={item.code} label={item.label} active={active === item.key} onClick={() => onNavigate(item.key)} />
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--ink)] p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
          <span className="evidence-mono text-[7px] font-bold text-[var(--copper)]">SR/V2</span>
        </div>
        <p className="mt-3 text-[9px] leading-4 text-[var(--muted)]">Failed predicates stay private. A public receipt exists only after a successful, context-bound policy evaluation.</p>
        <div className="mt-4 h-[3px] bg-gradient-to-r from-[var(--mineral)] via-[var(--verify)] to-[var(--copper)]" />
      </div>
    </aside>
  );
}

function NavItem({ code, label, note, active, onClick }: { code: string; label: string; note?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group grid w-full grid-cols-[34px_1fr_auto] items-start gap-2 border px-3 py-3 text-left transition-all ${
        active
          ? "border-[var(--ink)] bg-[var(--paper-white)] shadow-[3px_3px_0_rgba(16,44,49,.06)]"
          : "border-transparent text-[var(--muted)] hover:border-[var(--rule)] hover:bg-[rgba(255,248,232,.56)]"
      }`}
    >
      <span className={`evidence-mono pt-[2px] text-[8px] font-black ${active ? "text-[var(--verify)]" : "text-[var(--rule-strong)]"}`}>{code}</span>
      <span>
        <span className={`block text-[11px] font-black ${active ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>{label}</span>
        {note ? <span className="mt-0.5 block text-[8px] text-[var(--muted)]">{note}</span> : null}
      </span>
      {active ? <span className="mt-1 h-2 w-2 rounded-full bg-[var(--copper)]" /> : null}
    </button>
  );
}
