import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/deposit")}
          className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold"
        >
          💰 Deposit
        </button>

        <button
          onClick={() => navigate("/withdraw")}
          className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold"
        >
          💸 Withdraw
        </button>

        <button
          onClick={() => navigate("/transactions")}
          className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-semibold"
        >
          📜 Transactions
        </button>

        <button
          onClick={() => navigate("/referrals")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold"
        >
          👥 Invite Friends
        </button>
      </div>
    </div>
  );
}

export default QuickActions;