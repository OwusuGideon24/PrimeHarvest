import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-12">
        PrimeHarvest
      </h1>

      <div className="space-y-3">

        <Link
          to="/admin"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/users"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          👥 Users
        </Link>

        <Link
          to="/admin/plans"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          📈 Investments Plans
        </Link>
         <Link
  to="/admin/deposits"
  className="block p-4 rounded-xl hover:bg-slate-800"
>
  💰 Deposits
</Link>

        <Link
          to="/admin/withdrawals"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          💸 Withdrawals
        </Link>

        <Link
          to="/admin/transactions"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          📜 Transactions
        </Link>

        <Link
          to="/admin/settings"
          className="block p-4 rounded-xl hover:bg-slate-800"
        >
          ⚙ Settings
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="w-full text-left mt-10 bg-red-600 hover:bg-red-700 rounded-xl p-4"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default AdminSidebar;