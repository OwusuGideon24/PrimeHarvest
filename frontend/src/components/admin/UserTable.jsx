import { useNavigate } from "react-router-dom";

function UserTable({ users }) {
  const navigate = useNavigate();

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getInitials = (fullName) =>
    String(fullName || "PrimeHarvest User")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");

  const getRoleStyle = (role) => {
    if (String(role).toLowerCase() === "admin") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getStatusStyle = (status) => {
    switch (String(status || "active").toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "suspended":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const openUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[950px]">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold">
                User
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Balance
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Referral Code
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-4 text-right text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {getInitials(user.full_name || user.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-64 truncate font-semibold text-slate-900">
                        {user.full_name ||
                          user.name ||
                          "PrimeHarvest User"}
                      </p>

                      <p className="mt-1 max-w-64 truncate text-sm text-slate-500">
                        {user.email || "No email available"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-emerald-600">
                    ${formatMoney(user.balance)}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                    {user.referral_code || "Not available"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(
                      user.role
                    )}`}
                  >
                    {user.role || "user"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      user.status
                    )}`}
                  >
                    {user.status || "active"}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => openUser(user.id)}
                    className="rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile and tablet cards */}
      <div className="space-y-4 p-4 lg:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {getInitials(user.full_name || user.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words font-bold text-slate-900">
                  {user.full_name ||
                    user.name ||
                    "PrimeHarvest User"}
                </p>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {user.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">
                  Balance
                </p>

                <p className="mt-1 break-all font-bold text-emerald-600">
                  ${formatMoney(user.balance)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">
                  Referral Code
                </p>

                <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                  {user.referral_code || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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

            <button
              type="button"
              onClick={() => openUser(user.id)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-5 py-3 font-semibold text-white transition hover:shadow-md"
            >
              View User Details
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UserTable;