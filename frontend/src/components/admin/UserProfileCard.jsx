function UserProfileCard({ user }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            {user.full_name}
          </h1>

          <p className="text-slate-500 mt-2">
            {user.email}
          </p>

        </div>

        <div className="flex gap-3 mt-6 lg:mt-0">

          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              user.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {user.role.toUpperCase()}
          </span>

          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              user.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status.toUpperCase()}
          </span>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-slate-50 rounded-2xl p-5">

          <p className="text-slate-500 text-sm">
            Wallet Balance
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ${Number(user.balance).toFixed(2)}
          </h2>

        </div>

        <div className="bg-slate-50 rounded-2xl p-5">

          <p className="text-slate-500 text-sm">
            Referral Code
          </p>

          <h2 className="text-xl font-bold text-blue-600 mt-2 break-all">
            {user.referral_code}
          </h2>

        </div>

        <div className="bg-slate-50 rounded-2xl p-5">

          <p className="text-slate-500 text-sm">
            User ID
          </p>

          <h2 className="text-3xl font-bold mt-2">
            #{user.id}
          </h2>

        </div>

      </div>

    </div>
  );
}

export default UserProfileCard;