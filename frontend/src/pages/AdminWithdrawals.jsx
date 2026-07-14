import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

import WithdrawalTable from "../components/admin/WithdrawalTable";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchWithdrawals = useCallback(
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

        const response = await api.get(
          "/admin/withdrawals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const withdrawalData = Array.isArray(response.data)
          ? response.data
          : response.data.withdrawals || [];

        setWithdrawals(withdrawalData);
      } catch (error) {
        console.error(
          "Unable to load withdrawals:",
          error.response?.data?.message || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load withdrawal requests."
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
      void fetchWithdrawals();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchWithdrawals]);

  const normalizeStatus = (status) =>
    String(status || "pending").toLowerCase();

  const filteredWithdrawals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return withdrawals.filter((withdrawal) => {
      const searchableValues = [
        withdrawal.full_name,
        withdrawal.email,
        withdrawal.method,
        withdrawal.wallet_address,
        withdrawal.account_details,
        withdrawal.id,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(withdrawal.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, searchTerm, statusFilter]);

  const pendingWithdrawals = withdrawals.filter(
    (withdrawal) =>
      normalizeStatus(withdrawal.status) === "pending"
  );

  const approvedWithdrawals = withdrawals.filter(
    (withdrawal) =>
      normalizeStatus(withdrawal.status) === "approved"
  );

  const rejectedWithdrawals = withdrawals.filter(
    (withdrawal) =>
      normalizeStatus(withdrawal.status) === "rejected"
  );

  const pendingValue = pendingWithdrawals.reduce(
    (total, withdrawal) =>
      total + Number(withdrawal.amount || 0),
    0
  );

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading withdrawal requests...
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
              Withdrawal Requests
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Review customer withdrawal details and approve or reject
              pending payout requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void fetchWithdrawals({
                showRefreshLoader: true,
              })
            }
            disabled={refreshing}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Withdrawals"}
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
                Total Requests
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {withdrawals.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              💸
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
                {pendingWithdrawals.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
              ⏳
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Pending Value
              </p>

              <p className="mt-2 break-all text-2xl font-bold text-red-600 sm:text-3xl">
                ${formatMoney(pendingValue)}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
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
                {approvedWithdrawals.length +
                  rejectedWithdrawals.length}
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
              Withdrawal Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredWithdrawals.length} of{" "}
              {withdrawals.length} requests.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[300px_180px_auto]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search user, method or account..."
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

      {filteredWithdrawals.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:rounded-3xl">
          <div className="text-4xl">📭</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-700">
            No withdrawal requests found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            No withdrawals match your current search or filter.
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
        <WithdrawalTable
          withdrawals={filteredWithdrawals}
          refresh={() =>
            fetchWithdrawals({
              showRefreshLoader: true,
            })
          }
        />
      )}
    </div>
  );
}

export default AdminWithdrawals;