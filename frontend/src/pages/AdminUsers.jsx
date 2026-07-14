import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

import UserTable from "../components/admin/UserTable";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(
    async ({ showRefreshLoader = false } = {}) => {
      if (!token) {
        setLoading(false);
        setErrorMessage("Your login session has expired.");
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        }

        setErrorMessage("");

        const response = await api.get(
          "/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = Array.isArray(response.data)
          ? response.data
          : response.data.users || [];

        setUsers(userData);
      } catch (error) {
        console.error(
          "Unable to load users:",
          error.response?.data?.message || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load registered users."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = String(
        user.full_name || user.name || ""
      ).toLowerCase();

      const email = String(user.email || "").toLowerCase();

      const referralCode = String(
        user.referral_code || ""
      ).toLowerCase();

      const userStatus = String(
        user.status || "active"
      ).toLowerCase();

      const userRole = String(
        user.role || "user"
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        referralCode.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        userStatus === statusFilter;

      const matchesRole =
        roleFilter === "all" ||
        userRole === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const activeUsers = users.filter(
    (user) =>
      String(user.status || "active").toLowerCase() === "active"
  ).length;

  const suspendedUsers = users.filter(
    (user) =>
      String(user.status || "").toLowerCase() === "suspended"
  ).length;

  const adminUsers = users.filter(
    (user) =>
      String(user.role || "user").toLowerCase() === "admin"
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  const filtersActive =
    searchTerm.trim() ||
    statusFilter !== "all" ||
    roleFilter !== "all";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              User Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Search registered users, review account details, manage
              balances, change roles, and control account status.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void fetchUsers({
                showRefreshLoader: true,
              })
            }
            disabled={refreshing}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {refreshing ? "Refreshing..." : "Refresh Users"}
          </button>
        </div>
      </section>

      {errorMessage && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {users.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              👥
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Users
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeUsers}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              ✅
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Suspended Users
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {suspendedUsers}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
              🚫
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Administrators
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {adminUsers}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
              🛡️
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[280px_170px_150px_auto]">
            <div>
              <label
                htmlFor="user-search"
                className="sr-only"
              >
                Search users
              </label>

              <input
                id="user-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search name, email or code..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="sr-only"
              >
                Filter by status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="role-filter"
                className="sr-only"
              >
                Filter by role
              </label>

              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {filteredUsers.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center sm:rounded-3xl">
          <div className="text-4xl">🔍</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-700">
            No users found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search term or selected filters.
          </p>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear All Filters
            </button>
          )}
        </section>
      ) : (
        <UserTable
          users={filteredUsers}
          refresh={() =>
            fetchUsers({
              showRefreshLoader: true,
            })
          }
        />
      )}
    </div>
  );
}

export default AdminUsers;