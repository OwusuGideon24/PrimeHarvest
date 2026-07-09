function DashboardHeader({ user }) {
  const initials = user.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="bg-gradient-to-r from-slate-900 to-green-700 rounded-3xl shadow-sm p-8 mb-8 text-white">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>
          <p className="text-green-100 font-semibold mb-2">
            Welcome back,
          </p>

          <h1 className="text-4xl font-bold">
            {user.full_name}
          </h1>

          <p className="text-green-100 mt-3">
            Manage your investments, deposits, withdrawals and referrals from one place.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">

          <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>

          <div>
            <p className="font-semibold">
              {user.email}
            </p>

            <p className="text-green-100 text-sm">
              Referral: {user.referral_code}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;