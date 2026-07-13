import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchTransactions = useCallback(
    async ({ showRefreshLoader = false } = {}) => {
      if (!token) {
        setLoading(false);
        setErrorMessage("Your login session has expired.");
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        }

        setErrorMessage("");

        const response = await axios.get(
          "http://localhost:5000/api/admin/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactionData = Array.isArray(response.data)
          ? response.data
          : response.data.transactions || [];

        setTransactions(transactionData);
      } catch (error) {
        console.error(
          "Unable to load transactions:",
          error.response?.data?.message || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load transaction history."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTransactions();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchTransactions]);

  const normalizeType = (type) =>
    String(type || "transaction").toLowerCase();

  const normalizeStatus = (status) =>
    String(status || "completed").toLowerCase();

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const searchableValues = [
        transaction.full_name,
        transaction.email,
        transaction.type,
        transaction.status,
        transaction.description,
        transaction.id,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" ||
        normalizeType(transaction.type) === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(transaction.status) === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

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

  const isIncomingTransaction = (type) => {
    const normalizedType = normalizeType(type);

    return [
      "deposit",
      "profit",
      "earning",
      "referral",
      "bonus",
    ].includes(normalizedType);
  };

  const isOutgoingTransaction = (type) => {
    const normalizedType = normalizeType(type);

    return [
      "withdrawal",
      "withdraw",
      "investment",
      "deduction",
    ].includes(normalizedType);
  };

  const getAmountPrefix = (type) => {
    if (isIncomingTransaction(type)) {
      return "+";
    }

    if (isOutgoingTransaction(type)) {
      return "-";
    }

    return "";
  };

  const getAmountStyle = (type) => {
    if (isIncomingTransaction(type)) {
      return "text-emerald-600";
    }

    if (isOutgoingTransaction(type)) {
      return "text-red-600";
    }

    return "text-slate-900";
  };

  const getTransactionIcon = (type) => {
    switch (normalizeType(type)) {
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
      case "bonus":
        return "🎁";

      case "deduction":
        return "➖";

      default:
        return "↔";
    }
  };

  const getIconStyle = (type) => {
    if (isIncomingTransaction(type)) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (isOutgoingTransaction(type)) {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getStatusStyle = (status) => {
    switch (normalizeStatus(status)) {
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

  const totalTransactionValue = transactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const totalDeposits = transactions
    .filter(
      (transaction) =>
        normalizeType(transaction.type) === "deposit"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalWithdrawals = transactions
    .filter((transaction) =>
      ["withdrawal", "withdraw"].includes(
        normalizeType(transaction.type)
      )
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const pendingTransactions = transactions.filter(
    (transaction) =>
      normalizeStatus(transaction.status) === "pending"
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const filtersActive =
    searchTerm.trim() ||
    typeFilter !== "all" ||
    statusFilter !== "all";

  const transactionTypes = Array.from(
    new Set(
      transactions
        .map((transaction) =>
          normalizeType(transaction.type)
        )
        .filter(Boolean)
    )
  ).sort();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              Financial Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Transactions
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Review deposits, withdrawals, investments, profits,
              referral rewards, and other wallet activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void fetchTransactions({
                showRefreshLoader: true,
              })
            }
            disabled={refreshing}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Transactions"}
          </button>
        </div>
      </section>

      {errorMessage && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Transactions
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {transactions.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              📜
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Total Deposits
              </p>

              <p className="mt-2 break-all text-2xl font-bold text-emerald-600 sm:text-3xl">
                ${formatMoney(totalDeposits)}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              ↓
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Total Withdrawals
              </p>

              <p className="mt-2 break-all text-2xl font-bold text-red-600 sm:text-3xl">
                ${formatMoney(totalWithdrawals)}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
              ↑
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Transactions
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingTransactions}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
              ⏳
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[280px_170px_170px_auto]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search user or description..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">All Types</option>

              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (character) =>
                      character.toUpperCase()
                    )}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {filteredTransactions.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:rounded-3xl">
          <div className="text-4xl">📭</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-700">
            No transactions found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            No transactions match your current filters.
          </p>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear Filters
            </button>
          )}
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Transaction
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold">
                    ID
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {transaction.full_name ||
                          "PrimeHarvest User"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {transaction.email ||
                          "No email available"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${getIconStyle(
                            transaction.type
                          )}`}
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>

                        <div>
                          <p className="font-semibold capitalize text-slate-900">
                            {String(
                              transaction.type || "transaction"
                            ).replaceAll("_", " ")}
                          </p>

                          <p className="mt-1 max-w-xs break-words text-sm text-slate-500">
                            {transaction.description ||
                              "Wallet transaction"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p
                        className={`font-bold ${getAmountStyle(
                          transaction.type
                        )}`}
                      >
                        {getAmountPrefix(transaction.type)}$
                        {formatMoney(transaction.amount)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status || "completed"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(transaction.created_at)}
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-sm text-slate-500">
                      #{transaction.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile and tablet cards */}
          <div className="space-y-4 p-4 lg:hidden">
            {filteredTransactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${getIconStyle(
                      transaction.type
                    )}`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold capitalize text-slate-900">
                        {String(
                          transaction.type || "transaction"
                        ).replaceAll("_", " ")}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status || "completed"}
                      </span>
                    </div>

                    <p className="mt-1 break-words text-sm text-slate-500">
                      {transaction.description ||
                        "Wallet transaction"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Amount
                    </p>

                    <p
                      className={`mt-1 break-all font-bold ${getAmountStyle(
                        transaction.type
                      )}`}
                    >
                      {getAmountPrefix(transaction.type)}$
                      {formatMoney(transaction.amount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Transaction ID
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                      #{transaction.id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">
                    {transaction.full_name ||
                      "PrimeHarvest User"}
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {transaction.email ||
                      "No email available"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-slate-400">
        Combined transaction value: ${formatMoney(totalTransactionValue)}
      </p>
    </div>
  );
}

export default AdminTransactions;