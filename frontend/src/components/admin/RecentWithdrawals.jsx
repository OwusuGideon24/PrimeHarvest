import { Link } from "react-router-dom";

function RecentWithdrawals({ withdrawals = [] }) {
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) {
      return "Recently submitted";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently submitted";
    }

    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const normalizeStatus = (status) =>
    String(status || "pending").toLowerCase();

  const getStatusStyle = (status) => {
    switch (normalizeStatus(status)) {
      case "approved":
      case "completed":
      case "successful":
        return "bg-emerald-100 text-emerald-700";

      case "rejected":
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getMethodLabel = (withdrawal) =>
    withdrawal.method ||
    withdrawal.payment_method ||
    "Withdrawal";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Recent Withdrawals
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest payout requests submitted by users.
          </p>
        </div>

        <Link
          to="/admin/withdrawals"
          className="shrink-0 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          View All
        </Link>
      </div>

      {withdrawals.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="text-4xl">💸</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No recent withdrawals
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            New withdrawal requests will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {withdrawals.map((withdrawal) => (
            <article
              key={withdrawal.id}
              className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-lg font-bold text-red-700">
                  ↑
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {withdrawal.full_name ||
                      "PrimeHarvest User"}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {withdrawal.email ||
                      getMethodLabel(withdrawal)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(withdrawal.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pl-14 sm:block sm:pl-0 sm:text-right">
                <div>
                  <p className="font-bold text-red-600">
                    ${formatMoney(withdrawal.amount)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Request #{withdrawal.id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize sm:mt-2 sm:inline-flex ${getStatusStyle(
                    withdrawal.status
                  )}`}
                >
                  {withdrawal.status || "pending"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentWithdrawals;