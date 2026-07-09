import axios from "axios";

function PlanTable({ plans, refresh, editPlan }) {
  const deletePlan = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plan?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/admin/plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Plan deleted successfully");
      refresh();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-4 text-left">Plan</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Daily Return</th>
            <th className="p-4 text-left">Duration</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b hover:bg-slate-50">
              <td className="p-4 font-semibold">{plan.name}</td>

              <td className="p-4">
                ${Number(plan.investment_amount).toFixed(2)}
              </td>

              <td className="p-4 text-green-600 font-bold">
                ${Number(plan.daily_return).toFixed(2)}
              </td>

              <td className="p-4">{plan.duration_days} Days</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    plan.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {plan.status}
                </span>
              </td>

              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => editPlan(plan)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePlan(plan.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {plans.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-8 text-slate-500">
                No investment plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlanTable;