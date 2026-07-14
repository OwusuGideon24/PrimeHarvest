import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import PlanTable from "../components/admin/PlanTable";
import PlanModal from "../components/admin/PlanModal";

function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchPlans = useCallback(
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
          "/admin/plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const planData = Array.isArray(response.data)
          ? response.data
          : response.data.plans || [];

        setPlans(planData);
      } catch (error) {
        console.error(
          "Unable to load investment plans:",
          error.response?.data?.message || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load investment plans."
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
      void fetchPlans();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchPlans]);

  const filteredPlans = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return plans;
    }

    return plans.filter((plan) => {
      const searchableValues = [
        plan.name,
        plan.badge,
        plan.investment_amount,
        plan.daily_return,
        plan.duration_days,
        plan.total_return,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      return searchableValues.includes(normalizedSearch);
    });
  }, [plans, searchTerm]);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalInvestmentValue = plans.reduce(
    (total, plan) =>
      total + Number(plan.investment_amount || 0),
    0
  );

  const averageDuration =
    plans.length > 0
      ? plans.reduce(
          (total, plan) =>
            total + Number(plan.duration_days || 0),
          0
        ) / plans.length
      : 0;

  const highestReturn = plans.reduce(
    (highest, plan) =>
      Math.max(highest, Number(plan.total_return || 0)),
    0
  );

  const openCreateModal = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleModalSuccess = async () => {
    await fetchPlans({
      showRefreshLoader: true,
    });

    closeModal();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading investment plans...
          </p>
        </div>
      </div>
    );
  }

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
                    Investment Administration
                  </p>

                  <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Investment Plans
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                    Create and manage the investment opportunities available
                    to PrimeHarvest users.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      void fetchPlans({
                        showRefreshLoader: true,
                      })
                    }
                    disabled={refreshing}
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {refreshing ? "Refreshing..." : "Refresh Plans"}
                  </button>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    + Add Investment Plan
                  </button>
                </div>
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
                      Total Plans
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {plans.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    📈
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Combined Entry Value
                    </p>

                    <p className="mt-2 break-all text-2xl font-bold text-emerald-600 sm:text-3xl">
                      ${formatMoney(totalInvestmentValue)}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                    💰
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Average Duration
                    </p>

                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {Math.round(averageDuration)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      days
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                    📅
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Highest Total Return
                    </p>

                    <p className="mt-2 break-all text-2xl font-bold text-amber-600 sm:text-3xl">
                      ${formatMoney(highestReturn)}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                    🏆
                  </div>
                </div>
              </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Available Plans
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing {filteredPlans.length} of {plans.length} plans.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search investment plans..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-72"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {filteredPlans.length === 0 ? (
              <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:rounded-3xl">
                <div className="text-4xl">📭</div>

                <h2 className="mt-3 text-lg font-semibold text-slate-700">
                  No investment plans found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new plan or change your search term.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-md"
                >
                  Add Investment Plan
                </button>
              </section>
            ) : (
              <PlanTable
                plans={filteredPlans}
                refresh={() =>
                  fetchPlans({
                    showRefreshLoader: true,
                  })
                }
                editPlan={openEditModal}
              />
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <PlanModal
          plan={editingPlan}
          close={closeModal}
          refresh={handleModalSuccess}
        />
      )}
    </div>
  );
}

export default AdminPlans;