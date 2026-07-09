import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserTable({ users }) {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.referral_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Balance</th>
              <th className="text-left p-4">Referral</th>
              <th className="text-left p-4">Role</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-semibold">
                  {user.full_name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ${Number(user.balance).toFixed(2)}
                </td>

                <td className="p-4">
                  {user.referral_code}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
  onClick={() => navigate(`/admin/users/${user.id}`)}
  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg"
>
  View
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;