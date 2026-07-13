import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserMenu({ user, loading }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const fullName =
    user?.full_name || user?.name || "PrimeHarvest User";

  const email = user?.email || "";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const handleSettings = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-extrabold text-slate-900 shadow">
  {loading ? "..." : initials || "PH"}
</div>

        <div className="hidden min-w-0 text-left md:block">
          <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
            {loading ? "Loading..." : fullName}
          </p>

          <p className="max-w-40 truncate text-xs text-slate-500">
            {loading ? "Please wait" : email}
          </p>
        </div>

        <span className="hidden text-xs text-slate-500 md:block">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-5 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow">
                {loading ? "..." : initials || "PH"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-semibold">
                  {loading ? "Loading..." : fullName}
                </p>

                <p className="mt-1 truncate text-sm text-emerald-100">
                  {loading ? "Please wait" : email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3">
            <button
              type="button"
              onClick={handleSettings}
              className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-slate-100"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl transition group-hover:bg-white">
                ⚙️
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Settings
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Manage your account preferences
                </p>
              </div>
            </button>

            <div className="my-2 border-t border-slate-100" />

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-red-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-xl transition group-hover:bg-white">
                🚪
              </span>

              <div>
                <p className="text-sm font-semibold text-red-600">
                  Logout
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;