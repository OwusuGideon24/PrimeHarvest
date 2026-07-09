import { Link } from "react-router-dom";

function RecentWithdrawals({ withdrawals }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Withdrawals
        </h2>

        <Link
          to="/admin/withdrawals"
          className="text-green-600 font-semibold hover:underline"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4">

        {withdrawals.length === 0 ? (

          <p className="text-slate-500">
            No withdrawals yet.
          </p>

        ) : (

          withdrawals.map((withdrawal) => (

            <div
              key={withdrawal.id}
              className="flex justify-between items-center border-b pb-3"
            >

              <div>

                <p className="font-semibold">
                  {withdrawal.full_name}
                </p>

                <p className="text-sm text-slate-500">
                  ${Number(withdrawal.amount).toFixed(2)}
                </p>

              </div>

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

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default RecentWithdrawals;