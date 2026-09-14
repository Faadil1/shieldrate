interface KPICardsProps {
  activeVerifications: number;
  reviewTime: string;
  failedProofs: number;
}

export function KPICards({ activeVerifications, reviewTime, failedProofs }: KPICardsProps) {
  const cards = [
    {
      label: "Shareable receipts",
      value: activeVerifications,
      change: "Successful claims only",
      color: "text-white",
    },
    {
      label: "Execution path",
      value: reviewTime,
      change: "No simulated network state",
      color: "text-white",
    },
    {
      label: "Failed claims published",
      value: failedProofs,
      change: "Failures stay local",
      color: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="card p-6">
          <div className="text-xs text-mist-600 uppercase tracking-wide mb-2">{card.label}</div>
          <div className={`text-[28px] font-bold ${card.color}`}>{card.value}</div>
          <div className="text-[13px] text-rate-500 mt-1">{card.change}</div>
        </div>
      ))}
    </div>
  );
}
