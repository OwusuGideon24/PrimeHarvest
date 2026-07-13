function UserWithdrawals({ withdrawals = [] }) {
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
    switch (String(status || "pending").toLowerCase()) {
      case "approved":
      case "completed":
      case "successful":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "rejected":
      case "failed":
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
            Withdrawals
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {withdrawals.length} withdrawal request
            {withdrawals.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
          💸
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
          <div className="text-4xl">📭</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No withdrawals found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            This user has not submitted any withdrawal requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <article
              key={withdrawal.id}
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    ${formatMoney(withdrawal.amount)}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {withdrawal.method || "Payment method unavailable"}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                    withdrawal.status
                  )}`}
                >
                  {withdrawal.status || "pending"}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Account Details / Wallet Address
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {withdrawal.wallet_address ||
                      withdrawal.account_details ||
                      "Not available"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Request ID
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      #{withdrawal.id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Requested
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDate(withdrawal.created_at)}
                    </p>
                  </div>
                </div>

                {withdrawal.admin_note && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-700">
                      Admin Note
                    </p>

                    <p className="mt-1 break-words text-sm text-amber-900">
                      {withdrawal.admin_note}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserWithdrawals;