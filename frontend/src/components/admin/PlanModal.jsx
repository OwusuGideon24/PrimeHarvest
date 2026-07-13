import { useMemo, useState } from "react";
import axios from "axios";

function PlanModal({ plan, close, refresh }) {
  const [form, setForm] = useState({
    name: plan?.name || "",
    investment_amount: plan?.investment_amount || "",
    daily_return: plan?.daily_return || "",
    duration_days: plan?.duration_days || "",
    total_return: plan?.total_return || "",
    badge: plan?.badge || "",
    description: plan?.description || "",
    status: plan?.status || "Active",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");
  const isEditing = Boolean(plan);

  const calculatedTotalReturn = useMemo(() => {
    const dailyReturn = Number(form.daily_return || 0);
    const duration = Number(form.duration_days || 0);

    return dailyReturn * duration;
  }, [form.daily_return, form.duration_days]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const useCalculatedReturn = () => {
    setForm((currentForm) => ({
      ...currentForm,
      total_return: calculatedTotalReturn
        ? String(calculatedTotalReturn)
        : "",
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter a plan name.";
    }

    if (Number(form.investment_amount) <= 0) {
      return "Investment amount must be greater than zero.";
    }

    if (Number(form.daily_return) <= 0) {
      return "Daily return must be greater than zero.";
    }

    if (
      !Number.isInteger(Number(form.duration_days)) ||
      Number(form.duration_days) <= 0
    ) {
      return "Duration must be a whole number greater than zero.";
    }

    if (Number(form.total_return) <= 0) {
      return "Total return must be greater than zero.";
    }

    if (
      Number(form.total_return) <
      Number(form.investment_amount)
    ) {
      return "Total return cannot be lower than the investment amount.";
    }

    if (!["Active", "Hidden"].includes(form.status)) {
      return "Please select a valid plan status.";
    }

    return "";
  };

  const savePlan = async (event) => {
    event.preventDefault();

    if (!token || saving) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    const requestData = {
      name: form.name.trim(),
      investment_amount: Number(form.investment_amount),
      daily_return: Number(form.daily_return),
      duration_days: Number(form.duration_days),
      total_return: Number(form.total_return),
      badge: form.badge.trim(),
      description: form.description.trim(),
      status: form.status,
    };

    try {
      setSaving(true);
      setMessage({
        type: "",
        text: "",
      });

      let response;

      if (isEditing) {
        response = await axios.put(
          `http://localhost:5000/api/admin/plans/${plan.id}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/admin/plans",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setMessage({
        type: "success",
        text:
          response.data.message ||
          `Plan ${isEditing ? "updated" : "created"} successfully.`,
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to save investment plan:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "The investment plan could not be saved.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !saving) {
      close?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-modal-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Investment Administration
            </p>

            <h2
              id="plan-modal-title"
              className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              {isEditing
                ? "Edit Investment Plan"
                : "Add Investment Plan"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isEditing
                ? "Update this plan’s pricing, returns, duration, and visibility."
                : "Create a new investment opportunity for PrimeHarvest users."}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close plan modal"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={savePlan}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            {message.text && (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
                role="alert"
              >
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="plan-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Plan Name
                </label>

                <input
                  id="plan-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Growth Plan"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="investment-amount"
                  className="text-sm font-semibold text-slate-700"
                >
                  Investment Amount
                </label>

                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-500">
                    $
                  </span>

                  <input
                    id="investment-amount"
                    type="number"
                    name="investment_amount"
                    min="0.01"
                    step="0.01"
                    value={form.investment_amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="daily-return"
                  className="text-sm font-semibold text-slate-700"
                >
                  Daily Return
                </label>

                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-500">
                    $
                  </span>

                  <input
                    id="daily-return"
                    type="number"
                    name="daily_return"
                    min="0.01"
                    step="0.01"
                    value={form.daily_return}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration-days"
                  className="text-sm font-semibold text-slate-700"
                >
                  Duration
                </label>

                <div className="relative mt-2">
                  <input
                    id="duration-days"
                    type="number"
                    name="duration_days"
                    min="1"
                    step="1"
                    value={form.duration_days}
                    onChange={handleChange}
                    placeholder="30"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-slate-500">
                    days
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="total-return"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Total Return
                  </label>

                  <button
                    type="button"
                    onClick={useCalculatedReturn}
                    disabled={
                      saving ||
                      calculatedTotalReturn <= 0
                    }
                    className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Use calculated: $
                    {calculatedTotalReturn.toFixed(2)}
                  </button>
                </div>

                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-500">
                    $
                  </span>

                  <input
                    id="total-return"
                    type="number"
                    name="total_return"
                    min="0.01"
                    step="0.01"
                    value={form.total_return}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="plan-badge"
                  className="text-sm font-semibold text-slate-700"
                >
                  Badge
                </label>

                <input
                  id="plan-badge"
                  type="text"
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  placeholder="Example: Popular"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Optional label shown on the plan card.
                </p>
              </div>

              <div>
                <label
                  htmlFor="plan-status"
                  className="text-sm font-semibold text-slate-700"
                >
                  Plan Status
                </label>

                <select
                  id="plan-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                >
                  <option value="Active">
                    Active — visible to users
                  </option>

                  <option value="Hidden">
                    Hidden — unavailable to users
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="plan-description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="plan-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this investment plan..."
                  rows="4"
                  disabled={saving}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="font-bold text-emerald-900">
                Plan Preview
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-emerald-700">
                    Investment
                  </p>

                  <p className="mt-1 font-bold text-emerald-950">
                    $
                    {Number(
                      form.investment_amount || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-emerald-700">
                    Daily Return
                  </p>

                  <p className="mt-1 font-bold text-emerald-950">
                    $
                    {Number(
                      form.daily_return || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-emerald-700">
                    Duration
                  </p>

                  <p className="mt-1 font-bold text-emerald-950">
                    {Number(form.duration_days || 0)} days
                  </p>
                </div>

                <div>
                  <p className="text-xs text-emerald-700">
                    Total Return
                  </p>

                  <p className="mt-1 font-bold text-emerald-950">
                    $
                    {Number(
                      form.total_return || 0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={close}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-7 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? isEditing
                  ? "Updating Plan..."
                  : "Creating Plan..."
                : isEditing
                  ? "Update Plan"
                  : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanModal;