import { executionMode } from "../security/integrity";

export type SectionKey = "dashboard" | "candidates" | "verifications" | "post" | "settings" | "billing";

interface SidebarProps {
  active: SectionKey;
  onNavigate: (key: SectionKey) => void;
}

const CORE: { key: SectionKey; code: string; label: string; note: string }[] = [
  { key: "dashboard", code: "01", label: "Verification desk", note: "Evidence overview" },
  { key: "candidates", code: "02", label: "Subjects", note: "Scoped holders" },
  { key: "verifications", code: "03", label: "Receipt ledger", note: "Shareable proofs" },
  { key: "post", code: "04", label: "New request", note: "Generate proof" },
];

const ACCOUNT: { key: SectionKey; code: string; label: string }[] = [
  { key: "settings", code: "A1", label: "Runtime setup" },
  { key: "billing", code: "A2", label: "Account" },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const live = executionMode() === "midnight-live";

  return (
    <aside className="hidden w-[238px] flex-shrink-0 border-r border-[#c8cac2] bg-[#f2f1e9]/95 lg:flex lg:flex-col">
      <button onClick={() => onNavigate("dashboard")} className="border-b border-[#c8cac2] px-6 py-7 text-left">
        <div className="text-[17px] font-black tracking-[-0.045em] text-[#171b1d]">SHIELDRATE</div>
        <div className="evidence-mono mt-1 text-[8px] uppercase tracking-[0.18em] text-[#6b706e]">verification desk</div>
      </button>

      <div className="flex-1 px-3 py-5">
        <div className="micro-label px-3 pb-2">Workspace</div>
        <div className="space-y-1">
          {CORE.map((item) => (
            <NavItem
              key={item.key}
              code={item.code}
              label={item.label}
              note={item.note}
              active={active === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </div>

        <div className="micro-label px-3 pb-2 pt-7">System</div>
        <div className="space-y-1">
          {ACCOUNT.map((item) => (
            <NavItem
              key={item.key}
              code={item.code}
              label={item.label}
              active={active === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#c8cac2] p-5">
        <div className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</div>
        <p className="mt-3 text-[10px] leading-4 text-[#6b706e]">
          Failed predicates stay private. No receipt is published unless the requested policy passes.
        </p>
      </div>
    </aside>
  );
}

function NavItem({ code, label, note, active, onClick }: { code: string; label: string; note?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group grid w-full grid-cols-[34px_1fr] items-start gap-1 rounded-[4px] border px-3 py-3 text-left transition-colors ${
        active
          ? "border-[#171b1d] bg-[#f8f7f0]"
          : "border-transparent text-[#6b706e] hover:border-[#c8cac2] hover:bg-[#f8f7f0]/70"
      }`}
    >
      <span className={`evidence-mono pt-[2px] text-[9px] font-bold ${active ? "text-[#1f6b4d]" : "text-[#9da39d]"}`}>{code}</span>
      <span>
        <span className={`block text-[12px] font-bold ${active ? "text-[#171b1d]" : "text-[#4d5451]"}`}>{label}</span>
        {note ? <span className="mt-0.5 block text-[9px] text-[#8a8f8b]">{note}</span> : null}
      </span>
    </button>
  );
}
