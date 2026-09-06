interface KPICardsProps {
  activeVerifications: number;
  reviewTime: string;
  failedProofs: number;
}

export function KPICards({ activeVerifications, reviewTime, failedProofs }: KPICardsProps) {
  const cards = [
    {
      label: "Active Verifications",
      value: activeVerifications,
      change: "+12 this week",
      color: "text-white",
    },
    {
      label: "Avg. Verify Time",
      value: reviewTime,
      change: "Instant on-chain",
      color: "text-white",
    },
    {
      label: "Failed Proofs",
      value: failedProofs,
      change: failedProofs === 0 ? "100% pass rate" : "Review needed",
      color: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className="card p-6">
          <div className="text-xs text-mist-600 uppercase tracking-wide mb-2">
            {c.label}
          </div>
          <div className={`text-[28px] font-bold ${c.color}`}>{c.value}</div>
          <div className="text-[13px] text-rate-500 mt-1">{c.change}</div>
        </div>
      ))}
    </div>
  );
}