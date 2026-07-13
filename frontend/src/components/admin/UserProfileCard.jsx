function UserProfileCard({ user }) {
  const fullName =
    user?.full_name || user?.name || "PrimeHarvest User";

  const email = user?.email || "No email available";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const role = String(user?.role || "user").toLowerCase();
  const status = String(user?.status || "active").toLowerCase();

  const roleStyle =
    role === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-slate-100 text-slate-700";

  const statusStyle =
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-700 text-xl font-bold text-white shadow-md">
            {initials || "PH"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              User Profile
            </p>

            <h2 className="mt-1 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              {fullName}
            </h2>

            <p className="mt-2 break-all text-sm text-slate-500">
              {email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${roleStyle}`}
          >
            {role}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${statusStyle}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Wallet Balance
              </p>

              <p className="mt-2 break-all text-2xl font-bold text-emerald-600 sm:text-3xl">
                ${formatMoney(user?.balance)}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              💰
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Referral Code
              </p>

              <p className="mt-2 break-all font-mono text-lg font-bold text-blue-600">
                {user?.referral_code || "Not available"}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
              🎁
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                User ID
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                #{user?.id ?? "N/A"}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xl">
              🪪
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Status
              </p>

              <p
                className={`mt-2 text-xl font-bold capitalize ${
                  status === "active"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {status}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
              {status === "active" ? "✅" : "🚫"}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default UserProfileCard;