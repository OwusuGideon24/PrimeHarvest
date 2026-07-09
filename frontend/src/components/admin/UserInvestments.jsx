function UserInvestments({ investments }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        Investments
      </h2>

      {investments.length === 0 ? (
        <p className="text-slate-500">
          No investments found.
        </p>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="border rounded-2xl p-4"
            >
              <h3 className="font-bold text-lg">
                {investment.plan_name}
              </h3>

              <p>Invested: ${investment.amount}</p>
              <p>Daily Profit: ${investment.daily_return}</p>
              <p>Duration: {investment.duration_days} days</p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                {investment.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInvestments;