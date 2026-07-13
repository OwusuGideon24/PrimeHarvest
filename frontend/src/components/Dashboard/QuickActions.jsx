import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Deposit",
      icon: "💰",
      path: "/deposit",
    },
    {
      label: "Withdraw",
      icon: "💸",
      path: "/withdraw",
    },
    {
      label: "Transactions",
      icon: "📜",
      path: "/transactions",
    },
    {
      label: "Invite Friends",
      icon: "👥",
      path: "/referrals",
    },
  ];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Quick Actions
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.path}
            type="button"
            onClick={() => navigate(action.path)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-5 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;