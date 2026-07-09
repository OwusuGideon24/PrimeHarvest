/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/deposits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeposits(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const updateDeposit = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this deposit?`
    );

    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/deposits/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      fetchDeposits();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
        <h1 className="text-4xl font-bold">Deposit Requests</h1>
        <p className="text-slate-500 mt-2">
          Approve or reject user deposit requests.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Network</th>
              <th className="p-4 text-left">Transaction Reference</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {deposits.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No deposit requests found.
                </td>
              </tr>
            ) : (
              deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-semibold">{deposit.full_name}</p>
                    <p className="text-sm text-slate-500">{deposit.email}</p>
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    ${Number(deposit.amount).toFixed(2)}
                  </td>

                  <td className="p-4">{deposit.network}</td>

                  <td className="p-4 max-w-xs break-all text-sm">
                    {deposit.transaction_reference || "No reference provided"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        deposit.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : deposit.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {deposit.status === "Pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => updateDeposit(deposit.id, "Approved")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateDeposit(deposit.id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDeposits;