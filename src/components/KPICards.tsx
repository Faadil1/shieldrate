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
    { code: "G-04", label: "Governed claim families", value: "03", note: "Income · reputation · jobs", tone: "copper" },
  ];

  return (
    <section className="mb-5 grid grid-cols-1 border-y border-[var(--ink)] bg-[rgba(255,248,232,.56)] sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <article key={item.label} className={`relative min-h-[138px] overflow-hidden px-5 py-5 ${index < items.length - 1 ? "border-b border-[var(--rule)] sm:border-b-0 sm:border-r" : ""} ${index === 1 ? "sm:border-r-0 xl:border-r" : ""} ${index === 2 ? "sm:border-t xl:border-t-0" : ""}`}>
          <div className={`absolute left-0 top-0 h-full w-[4px] ${item.tone === "mineral" ? "bg-[var(--mineral)]" : item.tone === "iris" ? "bg-[var(--iris)]" : item.tone === "verify" ? "bg-[var(--verify)]" : "bg-[var(--copper)]"}`} />
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label">{item.label}</span>
            <span className="evidence-mono text-[8px] font-black text-[var(--rule-strong)]">{item.code}</span>
          </div>
          <div className={`mt-6 text-[32px] font-black tracking-[-0.055em] ${item.tone === "mineral" ? "text-[var(--mineral)]" : item.tone === "iris" ? "text-[var(--iris)]" : item.tone === "verify" ? "text-[var(--verify)]" : "text-[var(--copper)]"}`}>{item.value}</div>
          <div className="mt-1 text-[9px] text-[var(--muted)]">{item.note}</div>
          <div className="absolute bottom-0 right-0 h-7 w-7 border-l border-t border-[var(--rule)] bg-[rgba(16,44,49,.025)]" />
        </article>
      ))}
    </section>
  );
}
