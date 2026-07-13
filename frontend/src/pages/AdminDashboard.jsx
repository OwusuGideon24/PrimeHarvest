import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStatCard from "../components/admin/AdminStatCard";
import RecentUsers from "../components/admin/RecentUsers";
import RecentWithdrawals from "../components/admin/RecentWithdrawals";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setErrorMessage("Your login session has expired.");
      return;
    }

    try {
      setErrorMessage("");

      const [
        dashboardResponse,
        usersResponse,
        withdrawalsResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          "http://localhost:5000/api/admin/recent-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          "http://localhost:5000/api/admin/recent-withdrawals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      setStats(
        dashboardResponse.data.stats ||
          dashboardResponse.data
      );

      setRecentUsers(
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.users || []
      );

      setRecentWithdrawals(
        Array.isArray(withdrawalsResponse.data)
          ? withdrawalsResponse.data
          : withdrawalsResponse.data.withdrawals || []
      );
    } catch (error) {
      console.error(
        "Unable to load admin dashboard:",
        error.response?.data?.message || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load the admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchDashboard]);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-3 text-xl font-bold text-red-700">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {errorMessage ||
              "The dashboard information is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchDashboard();
            }}
            className="mt-5 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: Number(stats.totalUsers || 0),
      color: "text-blue-600",
      icon: "👥",
      description: "Registered accounts",
    },
    {
      title: "Wallet Balance",
      value: `$${formatMoney(stats.totalWalletBalance)}`,
      color: "text-emerald-600",
      icon: "💰",
      description: "Combined user balances",
    },
    {
      title: "Active Investments",
      value: Number(stats.activeInvestments || 0),
      color: "text-purple-600",
      icon: "📈",
      description: "Currently active plans",
    },
    {
      title: "Pending Withdrawals",
      value: Number(stats.pendingWithdrawals || 0),
      color: "text-red-600",
      icon: "💸",
      description: "Awaiting admin review",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-screen-2xl space-y-6">
            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-200">
                    Administration
                  </p>

                  <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                    PrimeHarvest Admin Dashboard
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                    Monitor users, wallet balances, investments,
                    deposits, and withdrawal requests from one place.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    void fetchDashboard();
                  }}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 lg:w-auto"
                >
                  Refresh Dashboard
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-4">
              {statCards.map((card) => (
                <AdminStatCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                  icon={card.icon}
                  description={card.description}
                />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <RecentWithdrawals
                withdrawals={recentWithdrawals}
              />

              <RecentUsers users={recentUsers} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;