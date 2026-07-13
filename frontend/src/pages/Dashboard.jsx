import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investingPlanId, setInvestingPlanId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setErrorMessage("Your login session is unavailable.");
      return;
    }

    try {
      setErrorMessage("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [userResponse, investmentResponse, plansResponse] =
        await Promise.all([
          api.get("/auth/me", config),
          api.get("/wallet/investments", config),
          api.get("/profit/plans"),
        ]);

      setUser(userResponse.data.user || userResponse.data);

      setInvestments(
        Array.isArray(investmentResponse.data)
          ? investmentResponse.data
          : investmentResponse.data.investments || []
      );

      setPlans(
        Array.isArray(plansResponse.data)
          ? plansResponse.data
          : plansResponse.data.plans || []
      );
    } catch (error) {
      console.error("Unable to load dashboard:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchDashboardData]);

  const invest = async (plan) => {
    if (!token || investingPlanId) {
      return;
    }

    try {
      setInvestingPlanId(plan.id);

      const response = await api.post(
        "/wallet/invest",
        {
          plan_name: plan.name,
          amount: Number(plan.investment_amount),
          daily_return: Number(plan.daily_return),
          duration_days: Number(plan.duration_days),
          total_return: Number(plan.total_return),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Investment successful.");

      await fetchDashboardData();
    } catch (error) {
      console.error("Investment failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      alert(
        error.response?.data?.message ||
          error.message ||
          "Investment failed. Please try again."
      );
    } finally {
      setInvestingPlanId(null);
    }
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toFixed(2);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

 if (!user) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-lg font-semibold text-red-700">
        Unable to load dashboard
      </h2>

      <p className="mt-2 text-sm text-red-600">
        {errorMessage ||
          "Please refresh the page or log in again."}
      </p>

      <button
        type="button"
        onClick={() => {
          setLoading(true);
          void fetchDashboardData();
        }}
        className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6">
      <DashboardHeader user={user} />

      <StatsCards
        user={user}
        investments={investments}
      />

      <QuickActions />

      {/* Investment plans */}
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Investment Opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a plan that matches your investment goals.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">
              No investment plans available
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New plans will appear here when they become available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => {
              const isInvesting =
                investingPlanId === plan.id;

              return (
                <article
                  key={plan.id}
                  className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-6"
                >
                  {plan.badge && (
                    <span className="mb-4 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {plan.name}
                  </h3>

                  <div className="mt-5 flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Investment
                      </span>

                      <span className="font-semibold text-slate-900">
                        ${formatMoney(plan.investment_amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Daily return
                      </span>

                      <span className="font-semibold text-emerald-600">
                        ${formatMoney(plan.daily_return)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Duration
                      </span>

                      <span className="font-semibold text-slate-900">
                        {plan.duration_days} days
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                      <span className="font-semibold text-slate-700">
                        Total return
                      </span>

                      <span className="text-lg font-bold text-emerald-600 sm:text-xl">
                        ${formatMoney(plan.total_return)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void invest(plan)}
                    disabled={isInvesting}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isInvesting
                      ? "Processing..."
                      : "Invest Now"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Active investments */}
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            My Active Investments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your purchased plans and expected returns.
          </p>
        </div>

        {investments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">
              You have no active investments
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Purchase an investment plan to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {investments.map((investment) => (
              <article
                key={investment.id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {investment.plan_name}
                  </h3>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {investment.status || "active"}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Invested
                    </span>

                    <span className="font-semibold">
                      ${formatMoney(investment.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Daily profit
                    </span>

                    <span className="font-semibold text-emerald-600">
                      ${formatMoney(investment.daily_return)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Duration
                    </span>

                    <span className="font-semibold">
                      {investment.duration_days} days
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-700">
                      Total return
                    </span>

                    <span className="font-bold text-emerald-600">
                      ${formatMoney(investment.total_return)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;