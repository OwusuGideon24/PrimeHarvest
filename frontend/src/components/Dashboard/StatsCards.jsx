function StatsCards({ user, investments }) {
  const activeInvestments = investments.filter(
  (investment) =>
    investment.status?.toLowerCase() === "active" ||
    investment.completed === false
).length;
  const totalInvested = investments.reduce(
    (sum, investment) => sum + Number(investment.amount),
    0
  );

  const totalExpectedReturn = investments.reduce(
    (sum, investment) => sum + Number(investment.total_return),
    0
  );

  const cards = [
    {
      label: "Wallet Balance",
      value: `$${Number(user.balance).toFixed(2)}`,
      icon: "💰",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Active Plans",
      value: activeInvestments,
      icon: "📈",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Invested",
      value: `$${totalInvested.toFixed(2)}`,
      icon: "🏦",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Expected Returns",
      value: `$${totalExpectedReturn.toFixed(2)}`,
      icon: "🎯",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between mb-5">

            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>

          </div>

          <p className="text-slate-500">
            {card.label}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}

    </div>
  );
}

export default StatsCards;