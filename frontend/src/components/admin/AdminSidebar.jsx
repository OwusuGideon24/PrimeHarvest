import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      label: "Investment Plans",
      path: "/admin/plans",
      icon: "📈",
    },
    {
      label: "Deposits",
      path: "/admin/deposits",
      icon: "💰",
    },
    {
      label: "Withdrawals",
      path: "/admin/withdrawals",
      icon: "💸",
    },
    {
      label: "Transactions",
      path: "/admin/transactions",
      icon: "📜",
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();
    navigate("/login", { replace: true });
  };

  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close admin navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div>
            <h1 className="text-xl font-bold">
              PrimeHarvest
            </h1>

            <p className="text-xs text-slate-400">
              Admin Portal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Admin Menu
          </p>

          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={linkClassName}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-base">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
              🚪
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;