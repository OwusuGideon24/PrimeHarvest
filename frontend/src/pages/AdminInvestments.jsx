import { useEffect, useState } from "react";
import api from "../services/api";

function AdminInvestments() {

  const [investments, setInvestments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchInvestments = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await api.get(
          "/admin/investments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInvestments(response.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchInvestments();

  }, []);
  const filteredInvestments = investments.filter(
  (investment) =>
    investment.full_name.toLowerCase().includes(search.toLowerCase()) ||
    investment.email.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">

        <h1 className="text-4xl font-bold">
          Investments
        </h1>

        <p className="text-slate-500 mt-2">
          All platform investments.
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

           {filteredInvestments.map((investment) => (

              <tr
                key={investment.id}
                className="border-b"
              >

                <td className="p-4">
                  {investment.full_name}
                </td>

                <td className="p-4">
                  {investment.email}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ${Number(investment.amount).toFixed(2)}
                </td>

              <td className="p-4">

  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
      investment.status === "Active"
        ? "bg-green-100 text-green-700"
        : investment.status === "Completed"
        ? "bg-blue-100 text-blue-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {investment.status}
  </span>

</td>

              </tr>

            ))}

          </tbody>
<div className="grid md:grid-cols-3 gap-6 mb-8">

  <div className="bg-green-50 rounded-2xl p-6">
    <p className="text-slate-500">
      Total Investments
    </p>

    <h2 className="text-3xl font-bold text-green-600">
      {investments.length}
    </h2>
  </div>

  <div className="bg-blue-50 rounded-2xl p-6">
    <p className="text-slate-500">
      Active
    </p>

    <h2 className="text-3xl font-bold text-blue-600">
      {
        investments.filter(
          (i) => i.status === "Active"
        ).length
      }
    </h2>
  </div>

  <div className="bg-red-50 rounded-2xl p-6">
    <p className="text-slate-500">
      Completed
    </p>

    <h2 className="text-3xl font-bold text-red-600">
      {
        investments.filter(
          (i) => i.status === "Completed"
        ).length
      }
    </h2>
  </div>

</div>

          <input
  type="text"
  placeholder="Search by name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full mb-6 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
/>

        </table>

      </div>

    </div>
  );
}

export default AdminInvestments;