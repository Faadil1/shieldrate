interface KPICardsProps {
  activeVerifications: number;
  reviewTime: string;
  failedProofs: number;
}

export function KPICards({ activeVerifications, reviewTime, failedProofs }: KPICardsProps) {
  const items = [
    { code: "R-01", label: "Shareable receipts", value: String(activeVerifications).padStart(2, "0"), note: "Successful claims only", tone: "mineral" },
    { code: "X-02", label: "Execution path", value: reviewTime.toUpperCase(), note: "No simulated network state", tone: "iris" },
    { code: "P-03", label: "Failed claims published", value: String(failedProofs).padStart(2, "0"), note: "Failures remain private", tone: "verify" },
  ];

  return (
    <section className="mb-7 grid grid-cols-1 border-y border-[var(--ink)] bg-[rgba(255,248,232,.56)] md:grid-cols-3">
      {items.map((item, index) => (
        <article key={item.label} className={`relative min-h-[154px] overflow-hidden px-5 py-5 md:px-6 ${index < items.length - 1 ? "border-b border-[var(--rule)] md:border-b-0 md:border-r" : ""}`}>
          <div className={`absolute left-0 top-0 h-full w-[4px] ${item.tone === "mineral" ? "bg-[var(--mineral)]" : item.tone === "iris" ? "bg-[var(--iris)]" : "bg-[var(--verify)]"}`} />
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label">{item.label}</span>
            <span className="evidence-mono text-[8px] font-black text-[var(--rule-strong)]">{item.code}</span>
          </div>
          <div className={`mt-7 text-[36px] font-black tracking-[-0.055em] ${item.tone === "mineral" ? "text-[var(--mineral)]" : item.tone === "iris" ? "text-[var(--iris)]" : "text-[var(--verify)]"}`}>{item.value}</div>
          <div className="mt-1 text-[10px] text-[var(--muted)]">{item.note}</div>
          <div className="absolute bottom-0 right-0 h-8 w-8 border-l border-t border-[var(--rule)] bg-[rgba(16,44,49,.025)]" />
        </article>
      ))}
    </section>
  );
}
