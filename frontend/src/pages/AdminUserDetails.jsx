import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

import UserProfileCard from "../components/admin/UserProfileCard";
import UserInvestments from "../components/admin/UserInvestments";
import UserTransactions from "../components/admin/UserTransactions";
import UserWithdrawals from "../components/admin/UserWithdrawals";
import UserActions from "../components/admin/UserActions";

function AdminUserDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchUser = useCallback(
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
          `/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error(
          "Unable to load user details:",
          error.response?.data?.message || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load this user's details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, token]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUser();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !data?.user) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <span>←</span>
          <span>Back to Users</span>
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-3 text-xl font-bold text-red-700">
            Unable to load user
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {errorMessage || "The requested user could not be found."}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchUser();
            }}
            className="mt-5 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = data.user;

  const investments = Array.isArray(data.investments)
    ? data.investments
    : [];

  const withdrawals = Array.isArray(data.withdrawals)
    ? data.withdrawals
    : [];

  const transactions = Array.isArray(data.transactions)
    ? data.transactions
    : [];

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/users"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span>←</span>
          <span>Back to Users</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            void fetchUser({
              showRefreshLoader: true,
            })
          }
          disabled={refreshing}
          className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {refreshing ? "Refreshing..." : "Refresh User"}
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              User Administration
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
              {user.full_name || user.name || "PrimeHarvest User"}
            </h1>

            <p className="mt-2 break-all text-sm text-slate-200">
              {user.email || "No email available"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold capitalize">
              {user.role || "user"}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                String(user.status || "active").toLowerCase() === "active"
                  ? "bg-emerald-400/20 text-emerald-100"
                  : "bg-red-400/20 text-red-100"
              }`}
            >
              {user.status || "active"}
            </span>
          </div>
        </div>
      </section>

      <UserProfileCard user={user} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserInvestments investments={investments} />

        <UserWithdrawals withdrawals={withdrawals} />
      </section>

      <UserTransactions transactions={transactions} />

      <UserActions
        user={user}
        refresh={() =>
          fetchUser({
            showRefreshLoader: true,
          })
        }
      />
    </div>
  );
}

export default AdminUserDetails;