interface KPICardsProps {
  activeVerifications: number;
  reviewTime: string;
  failedProofs: number;
}

export function KPICards({ activeVerifications, reviewTime, failedProofs }: KPICardsProps) {
  const items = [
    {
      code: "R01",
      label: "Shareable receipts",
      value: String(activeVerifications).padStart(2, "0"),
      note: "Successful claims only",
    },
    {
      code: "X02",
      label: "Execution path",
      value: reviewTime.toUpperCase(),
      note: "No simulated network state",
    },
    {
      code: "P03",
      label: "Failed claims published",
      value: String(failedProofs).padStart(2, "0"),
      note: "Failures stay local",
    },
  ];

  return (
    <section className="mb-7 grid grid-cols-1 border-y border-[#171b1d] bg-[#f8f7f0]/65 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.label} className={`min-h-[138px] px-5 py-5 md:px-6 ${index < items.length - 1 ? "border-b border-[#c8cac2] md:border-b-0 md:border-r" : ""}`}>
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label">{item.label}</span>
            <span className="evidence-mono text-[9px] font-bold text-[#9da39d]">{item.code}</span>
          </div>
          <div className={`mt-6 text-[32px] font-black tracking-[-0.045em] ${item.label === "Failed claims published" && failedProofs === 0 ? "text-[#1f6b4d]" : "text-[#171b1d]"}`}>{item.value}</div>
          <div className="mt-1 text-[11px] text-[#6b706e]">{item.note}</div>
        </div>
      ))}
    </section>
  );
}
