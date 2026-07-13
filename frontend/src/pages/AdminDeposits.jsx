import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");

  const fetchDeposits = useCallback(
    async ({ showRefreshLoader = false } = {}) => {
      if (!token) {
        setLoading(false);

        setMessage({
          type: "error",
          text: "Your login session has expired.",
        });

        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/deposits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const depositData = Array.isArray(response.data)
          ? response.data
          : response.data.deposits || [];

        setDeposits(depositData);

        setMessage({
          type: "",
          text: "",
        });
      } catch (error) {
        console.error(
          "Unable to load deposits:",
          error.response?.data?.message || error.message
        );

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Unable to load deposit requests.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDeposits();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchDeposits]);

  const updateDeposit = async (deposit, status) => {
    if (!token || processingId) {
      return;
    }

    const actionName =
      status.toLowerCase() === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionName} the $${formatMoney(
        deposit.amount
      )} deposit from ${
        deposit.full_name || deposit.email || "this user"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(deposit.id);

      setMessage({
        type: "",
        text: "",
      });

      const response = await axios.put(
        `http://localhost:5000/api/admin/deposits/${deposit.id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text:
          response.data.message ||
          `The deposit was ${status.toLowerCase()} successfully.`,
      });

      await fetchDeposits();
    } catch (error) {
      console.error(
        "Unable to update deposit:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "The deposit action could not be completed.",
      });
    } finally {
      setProcessingId(null);
    }
  };

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
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const filteredDeposits = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return deposits.filter((deposit) => {
      const status = normalizeStatus(deposit.status);

      const searchableValues = [
        deposit.full_name,
        deposit.email,
        deposit.network,
        deposit.transaction_reference,
        deposit.id,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deposits, searchTerm, statusFilter]);

  const pendingDeposits = deposits.filter(
    (deposit) => normalizeStatus(deposit.status) === "pending"
  );

  const approvedDeposits = deposits.filter(
    (deposit) => normalizeStatus(deposit.status) === "approved"
  );

  const rejectedDeposits = deposits.filter(
    (deposit) => normalizeStatus(deposit.status) === "rejected"
  );

  const pendingValue = pendingDeposits.reduce(
    (total, deposit) => total + Number(deposit.amount || 0),
    0
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const filtersActive =
    searchTerm.trim() || statusFilter !== "all";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading deposit requests...
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
              Payment Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Deposit Requests
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Review submitted payment references and approve or reject
              user deposit requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void fetchDeposits({
                showRefreshLoader: true,
              })
            }
            disabled={refreshing}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {refreshing ? "Refreshing..." : "Refresh Deposits"}
          </button>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Requests
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {deposits.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              💳
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Requests
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingDeposits.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
              ⏳
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Value
              </p>

              <p className="mt-2 break-all text-2xl font-bold text-emerald-600 sm:text-3xl">
                ${formatMoney(pendingValue)}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              💰
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Processed
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {approvedDeposits.length + rejectedDeposits.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
              ✅
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Deposit Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredDeposits.length} of {deposits.length} requests.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[300px_180px_auto]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search user, email or reference..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
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

      {filteredDeposits.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:rounded-3xl">
          <div className="text-4xl">📭</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-700">
            No deposit requests found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            No deposits match your current search or filter.
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
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Payment Method
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Transaction Reference
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDeposits.map((deposit) => {
                  const isPending =
                    normalizeStatus(deposit.status) === "pending";

                  const isProcessing =
                    processingId === deposit.id;

                  return (
                    <tr
                      key={deposit.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {deposit.full_name ||
                            "PrimeHarvest User"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {deposit.email || "No email available"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(deposit.created_at)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-emerald-600">
                          ${formatMoney(deposit.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {deposit.network ||
                          deposit.payment_method ||
                          "Not available"}
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="break-all font-mono text-sm text-slate-600">
                          {deposit.transaction_reference ||
                            "No reference provided"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                            deposit.status
                          )}`}
                        >
                          {deposit.status || "pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                void updateDeposit(
                                  deposit,
                                  "Approved"
                                )
                              }
                              disabled={Boolean(processingId)}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void updateDeposit(
                                  deposit,
                                  "Rejected"
                                )
                              }
                              disabled={Boolean(processingId)}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 p-4 lg:hidden">
            {filteredDeposits.map((deposit) => {
              const isPending =
                normalizeStatus(deposit.status) === "pending";

              const isProcessing =
                processingId === deposit.id;

              return (
                <article
                  key={deposit.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-bold text-slate-900">
                        {deposit.full_name ||
                          "PrimeHarvest User"}
                      </p>

                      <p className="mt-1 break-all text-sm text-slate-500">
                        {deposit.email || "No email available"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        deposit.status
                      )}`}
                    >
                      {deposit.status || "pending"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Amount
                      </p>

                      <p className="mt-1 break-all font-bold text-emerald-600">
                        ${formatMoney(deposit.amount)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Method
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {deposit.network ||
                          deposit.payment_method ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Transaction Reference
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                      {deposit.transaction_reference ||
                        "No reference provided"}
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(deposit.created_at)}
                  </p>

                  {isPending ? (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          void updateDeposit(
                            deposit,
                            "Approved"
                          )
                        }
                        disabled={Boolean(processingId)}
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {isProcessing
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void updateDeposit(
                            deposit,
                            "Rejected"
                          )
                        }
                        disabled={Boolean(processingId)}
                        className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                      Request processed
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDeposits;