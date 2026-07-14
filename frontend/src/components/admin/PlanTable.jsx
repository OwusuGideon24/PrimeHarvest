import { useState } from "react";
import api from "../../services/api";

function PlanTable({ plans = [], refresh, editPlan }) {
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const normalizeStatus = (status) =>
    String(status || "active").toLowerCase();

  const getStatusStyle = (status) => {
    switch (normalizeStatus(status)) {
      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "inactive":
      case "disabled":
        return "bg-red-100 text-red-700";

      case "draft":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const deletePlan = async (plan) => {
    if (!token || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the "${plan.name}" investment plan? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(plan.id);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.delete(
        `/admin/plans/${plan.id}`,
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
          "The investment plan was deleted successfully.",
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to delete plan:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "The investment plan could not be deleted.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Plan
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Investment
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Daily Return
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Total Return
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Duration
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {plans.map((plan) => {
                const isDeleting = deletingId === plan.id;

                return (
                  <tr
                    key={plan.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {plan.name || "Investment Plan"}
                          </p>

                          {plan.badge && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Plan #{plan.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        ${formatMoney(plan.investment_amount)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-emerald-600">
                        ${formatMoney(plan.daily_return)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-emerald-600">
                        ${formatMoney(plan.total_return)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {Number(plan.duration_days || 0)} days
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          plan.status
                        )}`}
                      >
                        {plan.status || "active"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editPlan?.(plan)}
                          disabled={Boolean(deletingId)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void deletePlan(plan)}
                          disabled={Boolean(deletingId)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile and tablet cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {plans.map((plan) => {
            const isDeleting = deletingId === plan.id;

            return (
              <article
                key={plan.id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold text-slate-900">
                      {plan.name || "Investment Plan"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Plan #{plan.id}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      plan.status
                    )}`}
                  >
                    {plan.status || "active"}
                  </span>
                </div>

                {plan.badge && (
                  <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {plan.badge}
                  </span>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Investment
                    </p>

                    <p className="mt-1 break-all font-bold text-slate-900">
                      ${formatMoney(plan.investment_amount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Daily Return
                    </p>

                    <p className="mt-1 break-all font-bold text-emerald-600">
                      ${formatMoney(plan.daily_return)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {Number(plan.duration_days || 0)} days
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Total Return
                    </p>

                    <p className="mt-1 break-all font-bold text-emerald-600">
                      ${formatMoney(plan.total_return)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => editPlan?.(plan)}
                    disabled={Boolean(deletingId)}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    Edit Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => void deletePlan(plan)}
                    disabled={Boolean(deletingId)}
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                  >
                    {isDeleting ? "Deleting..." : "Delete Plan"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PlanTable;