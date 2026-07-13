function UserTransactions({ transactions = [] }) {
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

  const getTransactionIcon = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "deposit":
        return "↓";

      case "withdrawal":
      case "withdraw":
        return "↑";

      case "investment":
        return "📈";

      case "profit":
      case "earning":
        return "💰";

      case "referral":
        return "🎁";

      default:
        return "↔";
    }
  };

  const getIconStyle = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "deposit":
      case "profit":
      case "earning":
      case "referral":
        return "bg-emerald-100 text-emerald-700";

      case "withdrawal":
      case "withdraw":
        return "bg-red-100 text-red-700";

      case "investment":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getAmountStyle = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "deposit":
      case "profit":
      case "earning":
      case "referral":
        return "text-emerald-600";

      case "withdrawal":
      case "withdraw":
      case "investment":
        return "text-red-600";

      default:
        return "text-slate-900";
    }
  };

  const getAmountPrefix = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "deposit":
      case "profit":
      case "earning":
      case "referral":
        return "+";

      case "withdrawal":
      case "withdraw":
      case "investment":
        return "-";

      default:
        return "";
    }
  };

  const getStatusStyle = (status) => {
    switch (String(status || "completed").toLowerCase()) {
      case "completed":
      case "successful":
      case "approved":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "failed":
      case "rejected":
      case "cancelled":
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
            Wallet Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {transactions.length} transaction
            {transactions.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
          📜
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
          <div className="text-4xl">📭</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No transactions found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            This user has no wallet transactions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <article
              key={transaction.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${getIconStyle(
                    transaction.type
                  )}`}
                >
                  {getTransactionIcon(transaction.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold capitalize text-slate-900">
                      {transaction.type || "Transaction"}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        transaction.status
                      )}`}
                    >
                      {transaction.status || "completed"}
                    </span>
                  </div>

                  <p className="mt-1 break-words text-sm text-slate-500">
                    {transaction.description || "Wallet transaction"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                <span className="text-sm text-slate-500 sm:hidden">
                  Amount
                </span>

                <p
                  className={`text-lg font-bold ${getAmountStyle(
                    transaction.type
                  )}`}
                >
                  {getAmountPrefix(transaction.type)}$
                  {formatMoney(transaction.amount)}
                </p>

                <p className="mt-1 hidden text-xs text-slate-400 sm:block">
                  Transaction #{transaction.id}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserTransactions;