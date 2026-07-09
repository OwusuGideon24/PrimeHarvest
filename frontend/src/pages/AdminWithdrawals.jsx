import { useEffect, useState } from "react";
import axios from "axios";
import WithdrawalTable from "../components/admin/WithdrawalTable";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);

  // Used by the table after approving/rejecting
  const refreshWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/withdrawals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWithdrawals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/admin/withdrawals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWithdrawals(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadWithdrawals();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold">
            Withdrawal Requests
          </h1>

          <p className="text-slate-500 mt-2">
            Manage customer withdrawal requests.
          </p>
        </div>

        <WithdrawalTable
          withdrawals={withdrawals}
          refresh={refreshWithdrawals}
        />

      </div>
    </div>
  );
}

export default AdminWithdrawals;