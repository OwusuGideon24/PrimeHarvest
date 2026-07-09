import { useEffect, useState } from "react";
import axios from "axios";

function Deposit() {
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("USDT TRC20");
  const [transactionReference, setTransactionReference] = useState("");

  useEffect(() => {
    const fetchDepositSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/deposits/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSettings(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepositSettings();
  }, []);

  const getWalletAddress = () => {
    if (!settings) return "";

    if (network === "USDT TRC20") return settings.usdt_trc20_wallet;
    if (network === "MTN MOMO") return settings.usdt_bep20_wallet;
    if (network === "BTC") return settings.bitcoin_wallet;
    if (network === "ETH") return settings.ethereum_wallet;

    return "";
  };

  const submitDeposit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/deposits",
        {
          amount,
          network,
          transaction_reference: transactionReference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setAmount("");
      setTransactionReference("");
    } catch (error) {
      alert(error.response?.data?.message || "Deposit failed.");
    }
  };

  if (!settings) {
    return (
      <div className="p-8 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8">

        <h1 className="text-4xl font-bold mb-2">
          Deposit Funds
        </h1>

        <p className="text-slate-500 mb-8">
          Submit a deposit request for admin approval.
        </p>

        <label className="font-semibold">
          Amount
        </label>

        <input
          type="number"
          placeholder={`Minimum deposit is $${settings.minimum_deposit}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-6"
        />

        <label className="font-semibold">
          Network
        </label>

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-6"
        >
          <option>USDT TRC20</option>
          <option>MTN MOMO</option>
          <option>BTC</option>
          <option>ETH</option>
        </select>

        <label className="font-semibold">
          Send Funds To This Wallet
        </label>

        <div className="bg-slate-100 rounded-xl p-4 mt-2 mb-6 break-all">
          {getWalletAddress() || "Wallet address not configured."}
        </div>

        <label className="font-semibold">
          Transaction Reference
        </label>

        <input
          placeholder="Paste transaction reference..."
          value={transactionReference}
          onChange={(e) => setTransactionReference(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-8"
        />

        <button
          onClick={submitDeposit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
        >
          Submit Deposit Request
        </button>

      </div>
    </div>
  );
}

export default Deposit;