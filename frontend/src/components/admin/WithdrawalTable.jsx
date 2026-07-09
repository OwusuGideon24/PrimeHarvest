import axios from "axios";

function WithdrawalTable({ withdrawals, refresh }) {

  const updateStatus = async (id, status) => {

    const confirmAction = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this withdrawal?`
    );

    if (!confirmAction) return;

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/withdrawals/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Withdrawal ${status}`);

      refresh();

    } catch (error) {

      console.error(error);

      alert("Action failed.");

    }

  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-900 text-white">

          <tr>

            <th className="text-left p-5">User</th>

            <th className="text-left p-5">Method</th>

            <th className="text-left p-5">Wallet</th>

            <th className="text-left p-5">Amount</th>

            <th className="text-left p-5">Status</th>

            <th className="text-center p-5">Action</th>

          </tr>

        </thead>

        <tbody>

          {withdrawals.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center py-10 text-slate-500"
              >
                No withdrawal requests.
              </td>

            </tr>

          ) : (

            withdrawals.map((withdrawal) => (

              <tr
                key={withdrawal.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-5">

                  <div className="font-semibold">
                    {withdrawal.full_name}
                  </div>

                  <div className="text-sm text-slate-500">
                    {withdrawal.email}
                  </div>

                </td>

                <td className="p-5">
                  {withdrawal.method}
                </td>

                <td className="p-5 break-all">
                  {withdrawal.wallet_address}
                </td>

                <td className="p-5 font-bold text-green-600">
                  ${withdrawal.amount}
                </td>

                <td className="p-5">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      withdrawal.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : withdrawal.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {withdrawal.status}
                  </span>

                </td>

                <td className="p-5 text-center">

                  {withdrawal.status === "Pending" ? (

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          updateStatus(withdrawal.id, "Approved")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(withdrawal.id, "Rejected")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>

                    </div>

                  ) : (

                    <span className="text-slate-400">
                      Completed
                    </span>

                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default WithdrawalTable;