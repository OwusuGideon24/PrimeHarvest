import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import UserMenu from "../components/UserMenu";

function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loadingUser, setLoadingUser] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setUser(response.data.user || response.data);
        }
      } catch (error) {
        console.error(
          "Unable to load user:",
          error.response?.data?.message || error.message
        );
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-700 transition hover:bg-slate-200 lg:hidden"
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-800">
                PrimeHarvest
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Investment Management Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <UserMenu user={user} loading={loadingUser} />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;