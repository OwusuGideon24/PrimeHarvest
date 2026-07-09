import { Link } from "react-router-dom";

function RecentUsers({ users }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Users
        </h2>

        <Link
          to="/admin/users"
          className="text-green-600 font-semibold hover:underline"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {user.full_name}
              </p>

              <p className="text-sm text-slate-500">
                #{user.id}
              </p>

            </div>

            <div className="flex gap-2">

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentUsers;