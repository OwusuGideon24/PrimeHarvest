import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove saved login data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Send user back to login page
    navigate("/login");
  };

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10">
        PrimeHarvest
      </h1>

      <div className="space-y-3">

        <Link
          to="/dashboard"
          className="block p-3 rounded-xl hover:bg-slate-800"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/wallet"
          className="block p-3 rounded-xl hover:bg-slate-800"
        >
          💳 Wallet
        </Link>

        <Link
          to="/transactions"
          className="block p-3 rounded-xl hover:bg-slate-800"
        >
          📜 Transactions
        </Link>

        <Link
          to="/referrals"
          className="block p-3 rounded-xl hover:bg-slate-800"
        >
          👥 Referrals
        </Link>

        <Link
          to="/settings"
          className="block p-3 rounded-xl hover:bg-slate-800"
        >
          ⚙ Settings
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-xl hover:bg-red-700 mt-10 transition"
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;