import { Link } from "react-router-dom";

function RecentUsers({ users = [] }) {
  const formatDate = (date) => {
    if (!date) {
      return "Recently joined";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently joined";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) {
      return "PH";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const normalizeRole = (role) =>
    String(role || "user").toLowerCase();

  const normalizeStatus = (status) =>
    String(status || "active").toLowerCase();

  const getRoleStyle = (role) => {
    switch (normalizeRole(role)) {
      case "admin":
        return "bg-blue-100 text-blue-700";

      case "manager":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusStyle = (status) => {
    switch (normalizeStatus(status)) {
      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "suspended":
      case "inactive":
      case "blocked":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Recent Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest accounts registered on the platform.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="shrink-0 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          View All
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="text-4xl">👤</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No recent users
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Newly registered users will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {users.map((user) => (
            <article
              key={user.id}
              className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-emerald-700 text-sm font-bold text-white">
                  {getInitials(user.full_name)}
                </div>

                <div className="min-w-0">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="block truncate font-semibold text-slate-900 transition hover:text-emerald-700"
                  >
                    {user.full_name || "PrimeHarvest User"}
                  </Link>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {user.email || `User #${user.id}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Joined {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-14 sm:justify-end sm:pl-0">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(
                    user.role
                  )}`}
                >
                  {user.role || "user"}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                    user.status
                  )}`}
                >
                  {user.status || "active"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentUsers;