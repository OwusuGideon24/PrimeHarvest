/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

function Withdraw() {
  const [user, setUser] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MTN MOMO");
  const [walletAddress, setWalletAddress] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [userResponse, withdrawalsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        axios.get("http://localhost:5000/api/withdrawals/my-withdrawals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setUser(userResponse.data);
      setWithdrawals(withdrawalsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitWithdrawal = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/withdrawals",
        {
          amount,
          method,
          wallet_address: walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setAmount("");
      setWalletAddress("");

      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Withdrawal failed.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold">
            Withdraw Funds
          </h1>

          <p className="text-slate-500 mt-2">
            Request a withdrawal from your wallet balance.
          </p>

          <div className="mt-6 bg-green-50 rounded-2xl p-6">
            <p className="text-slate-500">
              Available Balance
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              ${Number(user.balance).toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Withdrawal Request
          </h2>

          <label className="font-semibold">
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter withdrawal amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-xl p-3 mt-2 mb-6"
          />

          <label className="font-semibold">
            Withdrawal Method
          </label>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded-xl p-3 mt-2 mb-6"
          >
            <option>MTN MOMO</option>
            <option>USDT TRC20</option>
            <option>USDT BEP20</option>
            <option>BTC</option>
            <option>ETH</option>
          </select>

          <label className="font-semibold">
            Account Details / Wallet Address
          </label>

          <textarea
            placeholder="Example: 0549022138 - Owusu Gideon"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full border rounded-xl p-3 mt-2 mb-8"
            rows="4"
          />

          <button
            onClick={submitWithdrawal}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold"
          >
            Submit Withdrawal Request
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">
            My Withdrawal History
          </h2>

          {withdrawals.length === 0 ? (
            <p className="text-slate-500">
              You have not made any withdrawal requests yet.
            </p>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-bold">
                      ${Number(withdrawal.amount).toFixed(2)}
                    </p>

                    <p className="text-slate-500">
                      {withdrawal.method}
                    </p>

                    <p className="text-sm text-slate-400 break-all">
                      {withdrawal.wallet_address}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        withdrawal.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : withdrawal.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {withdrawal.status}
                    </span>

                    <p className="text-sm text-slate-400 mt-2">
                      {new Date(withdrawal.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Withdraw;