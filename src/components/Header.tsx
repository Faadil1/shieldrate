import type { WalletState } from "../types";
import { executionMode } from "../security/integrity";
import type { SectionKey } from "./Sidebar";

interface HeaderProps {
  wallet: WalletState;
  pendingCount: number;
  section: SectionKey;
  onDisconnect: () => void;
  onGenerateProof: () => void;
}

const SECTION_COPY: Record<SectionKey, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: "Trust operations / overview",
    title: "Verification operations",
    description: "Operate requests, policies, issuers and shareable proof receipts from one evidence-first workspace.",
  },
  requests: {
    eyebrow: "Operate / request lifecycle",
    title: "Verification requests",
    description: "Control what can be asked, how a request is scoped, and what may become public after a successful proof.",
  },
  verifications: {
    eyebrow: "Operate / public evidence",
    title: "Receipt register",
    description: "Review successful, context-bound receipts. Failed predicates remain private and never enter this register.",
  },
  candidates: {
    eyebrow: "Operate / private identity boundaries",
    title: "Scoped subjects",
    description: "Inspect job-scoped pseudonyms without introducing a stable cross-employer identity into shared evidence.",
  },
  post: {
    eyebrow: "Operate / issue request",
    title: "New verification request",
    description: "Start a standardized, context-bound private evaluation using an approved policy band.",
  },
  policies: {
    eyebrow: "Govern / disclosure policy",
    title: "Policy catalog",
    description: "Manage the coarse policy bands that can be requested without enabling arbitrary threshold probing.",
  },
  providers: {
    eyebrow: "Govern / credential authorities",
    title: "Issuers & providers",
    description: "Understand which registered providers can attest credentials and how freshness and epochs constrain trust.",
  },
  audit: {
    eyebrow: "Govern / evidence history",
    title: "Audit trail",
    description: "Trace receipt-level evidence today; a fuller event history remains an explicit product-surface preview.",
  },
  settings: {
    eyebrow: "Platform / Midnight runtime",
    title: "Runtime control",
    description: "Deploy or join the contract, register providers, import signed credentials and enforce live receipt verification.",
  },
  integrations: {
    eyebrow: "Platform / connectors",
    title: "Integrations",
    description: "See what is wired, what is manual today, and which enterprise connectors are still planned.",
  },
  team: {
    eyebrow: "Platform / access model",
    title: "Team & access",
    description: "Preview the role model needed for multi-user operations without pretending RBAC is already implemented.",
  },
  usage: {
    eyebrow: "Platform / operational footprint",
    title: "Usage",
    description: "Review the evidence footprint available in this build; billing and metering remain intentionally unclaimed.",
  },
};

export function Header({ wallet, pendingCount, section, onDisconnect, onGenerateProof }: HeaderProps) {
  const live = executionMode() === "midnight-live";
  const copy = SECTION_COPY[section];

  return (
    <header className="mb-6 grid gap-5 border-b border-[var(--ink)] pb-5 xl:grid-cols-[1fr_auto] xl:items-end">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="micro-label">{copy.eyebrow}</span>
          <span className="h-px w-10 bg-[var(--copper)]" />
          <span className="evidence-mono text-[7px] font-bold uppercase tracking-[.17em] text-[var(--copper)]">Enterprise surface / V3</span>
        </div>
        <h1 className="display-serif mt-3 text-[38px] leading-[.96] text-[var(--ink)] md:text-[46px]">{copy.title}</h1>
        <p className="mt-3 max-w-[820px] text-[11px] leading-5 text-[var(--muted)]">{copy.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`mode-badge ${live ? "mode-live" : "mode-demo"}`}>{live ? "Midnight live" : "Demo attested"}</span>
        <span className="mode-badge">{pendingCount} pending fixture{pendingCount === 1 ? "" : "s"}</span>
        {wallet.connected ? (
          <div className="flex items-center gap-2 border border-[var(--rule-strong)] bg-[rgba(255,248,232,.72)] px-3 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[var(--verify)]" : "bg-[var(--amber)]"}`} />
            <span className="evidence-mono text-[9px] font-semibold text-[var(--ink-soft)]">{wallet.displayAddress}</span>
            <button onClick={onDisconnect} className="ml-1 text-[11px] font-bold text-[var(--muted)] hover:text-[var(--ink)]" aria-label="Disconnect wallet">×</button>
          </div>
        ) : null}
        <button onClick={onGenerateProof} className="btn-primary">New request <span aria-hidden>→</span></button>
      </div>
    </header>
  );
}
