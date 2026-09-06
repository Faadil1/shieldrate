export type SectionKey = "dashboard" | "candidates" | "verifications" | "post" | "settings" | "billing";

interface SidebarProps {
  active: SectionKey;
  onNavigate: (key: SectionKey) => void;
}

const CORE: { key: SectionKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "candidates", label: "Candidates" },
  { key: "verifications", label: "Verifications" },
  { key: "post", label: "Post Job" },
];

const ACCOUNT: { key: SectionKey; label: string }[] = [
  { key: "settings", label: "Settings" },
  { key: "billing", label: "Billing" },
];

function Item({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-all ${
        active
          ? "bg-rate-900 text-rate-500"
          : "text-mist-500 hover:bg-night-800 hover:text-neutral-200"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-[4px] bg-current flex-shrink-0 ${
          active ? "opacity-60" : "opacity-30"
        }`}
      />
      {label}
    </button>
  );
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 bg-night-850 border-r border-night-800 p-4 flex flex-col gap-1 flex-shrink-0">
      <button
        onClick={() => onNavigate("dashboard")}
        className="text-lg font-extrabold tracking-tight text-white text-left px-3 pb-5 border-b border-night-800 mb-3"
      >
        shield<span className="text-rate-500">rate</span>
      </button>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-mist-700 px-3 pt-4 pb-1.5">
        Core
      </div>
      {CORE.map((item) => (
        <Item
          key={item.key}
          active={active === item.key}
          label={item.label}
          onClick={() => onNavigate(item.key)}
        />
      ))}
      <div className="text-[10px] font-semibold uppercase tracking-wider text-mist-700 px-3 pt-4 pb-1.5">
        Account
      </div>
      {ACCOUNT.map((item) => (
        <Item
          key={item.key}
          active={active === item.key}
          label={item.label}
          onClick={() => onNavigate(item.key)}
        />
      ))}
    </aside>
  );
}