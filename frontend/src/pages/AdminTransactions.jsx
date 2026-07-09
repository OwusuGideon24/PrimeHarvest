import { useEffect, useState } from "react";
import axios from "axios";

function AdminTransactions() {

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchTransactions = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/admin/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(response.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchTransactions();

  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">

        <h1 className="text-4xl font-bold">
          Transactions
        </h1>

        <p className="text-slate-500 mt-2">
          Complete transaction history.
        </p>

      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 border rounded-xl px-4 py-3"
      />

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((transaction) => (

              <tr key={transaction.id} className="border-b">

                <td className="p-4">
                  {transaction.full_name}
                </td>

                <td className="p-4">
                  {transaction.type}
                </td>

                <td className="p-4 font-bold">
                  ${Number(transaction.amount).toFixed(2)}
                </td>

                <td className="p-4">
                  {new Date(transaction.created_at).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminTransactions;