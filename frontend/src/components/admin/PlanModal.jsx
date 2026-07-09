import { useState } from "react";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const savePlan = async () => {
    try {
      const token = localStorage.getItem("token");

      if (plan) {
        await axios.put(
          `http://localhost:5000/api/admin/plans/${plan.id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Plan updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/admin/plans", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Plan created successfully");
      }

      refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">
          {plan ? "Edit Plan" : "Add New Plan"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Plan Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="investment_amount"
            placeholder="Investment Amount"
            value={form.investment_amount}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="daily_return"
            placeholder="Daily Return"
            value={form.daily_return}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="duration_days"
            placeholder="Duration Days"
            value={form.duration_days}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="total_return"
            placeholder="Total Return"
            value={form.total_return}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="badge"
            placeholder="Badge"
            value={form.badge}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-xl p-3 md:col-span-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={close}
            className="bg-slate-200 px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={savePlan}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanModal;