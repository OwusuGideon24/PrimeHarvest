function UserInvestments({ investments = [] }) {
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString();
  };

  const getStatusStyle = (status) => {
    switch (String(status || "active").toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Investments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {investments.length} investment
            {investments.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl">
          📈
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
          <div className="text-4xl">📭</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No investments found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            This user has not purchased an investment plan yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <article
              key={investment.id}
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-lg font-bold text-slate-900">
                    {investment.plan_name || "Investment Plan"}
                  </h3>

                  {investment.created_at && (
                    <p className="mt-1 text-xs text-slate-400">
                      Purchased {formatDate(investment.created_at)}
                    </p>
                  )}
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                    investment.status
                  )}`}
                >
                  {investment.status || "active"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Invested
                  </p>

                  <p className="mt-1 break-all font-bold text-slate-900">
                    ${formatMoney(investment.amount)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Daily Profit
                  </p>

                  <p className="mt-1 break-all font-bold text-emerald-600">
                    ${formatMoney(investment.daily_return)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Duration
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {investment.duration_days || 0} days
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Total Return
                  </p>

                  <p className="mt-1 break-all font-bold text-emerald-600">
                    ${formatMoney(investment.total_return)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserInvestments;