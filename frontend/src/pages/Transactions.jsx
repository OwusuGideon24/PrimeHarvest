import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/wallet/transactions",
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

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Transactions
      </h1>

      <div className="bg-white rounded-3xl shadow-sm p-6">

        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4">

            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>

                  <p className="font-semibold capitalize">
                    {tx.type}
                  </p>

                  <p className="text-sm text-slate-500">
                    {tx.description}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-green-600">
                    ${Number(tx.amount).toFixed(2)}
                  </p>

                  <p className="text-sm text-slate-500 capitalize">
                    {tx.status}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Transactions;