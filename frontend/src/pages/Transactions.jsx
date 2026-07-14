import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        const response = await api.get(
          "/wallet/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactionData = Array.isArray(response.data)
          ? response.data
          : response.data.transactions || [];

        if (isMounted) {
          setTransactions(transactionData);
          setErrorMessage("");
        }
      } catch (error) {
        console.error(
          "Unable to load transactions:",
          error.response?.data?.message || error.message
        );

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              "Unable to load your transactions."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchTransactions();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [token]);

  const filteredTransactions = useMemo(() => {
    if (filter === "all") {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.type?.toLowerCase() === filter
    );
  }, [transactions, filter]);

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
    switch (type?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
        return "bg-slate-100 text-slate-600";
    }
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Deposits", value: "deposit" },
    { label: "Withdrawals", value: "withdrawal" },
    { label: "Investments", value: "investment" },
    { label: "Profits", value: "profit" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review your wallet activity, investments, and earnings.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredTransactions.length} transaction
              {filteredTransactions.length === 1 ? "" : "s"} shown
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Unable to load transactions
            </p>

            <p className="mt-1 text-sm text-red-600">
              {errorMessage}
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
            <div className="text-4xl">📭</div>

            <h3 className="mt-3 font-semibold text-slate-700">
              No transactions found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your wallet activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
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
                        {transaction.status || "pending"}
                      </span>
                    </div>

                    <p className="mt-1 break-words text-sm text-slate-500">
                      {transaction.description ||
                        "Wallet transaction"}
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
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Transactions;