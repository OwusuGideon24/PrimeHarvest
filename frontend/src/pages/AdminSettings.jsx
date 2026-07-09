import { useEffect, useState } from "react";
import axios from "axios";

function AdminSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/admin/settings",
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

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5000/api/admin/settings", settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Settings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-4xl font-bold">Platform Settings</h1>
          <p className="text-slate-500 mt-2">
            Configure your investment platform.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Company Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Company Name</label>
              <input
                name="company_name"
                value={settings.company_name || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Support Email</label>
              <input
                name="support_email"
                value={settings.support_email || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Support Phone</label>
              <input
                name="support_phone"
                value={settings.support_phone || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Investment Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label>Minimum Deposit</label>
              <input
                type="number"
                name="minimum_deposit"
                value={settings.minimum_deposit || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label>Minimum Withdrawal</label>
              <input
                type="number"
                name="minimum_withdrawal"
                value={settings.minimum_withdrawal || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label>Daily Profit (%)</label>
              <input
                type="number"
                step="0.1"
                name="daily_profit_rate"
                value={settings.daily_profit_rate || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label>Referral Reward ($)</label>
              <input
                type="number"
                step="0.1"
                name="referral_bonus"
                value={settings.referral_bonus || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Deposit Wallet Addresses
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label>USDT TRC20 Wallet</label>
              <input
                name="usdt_trc20_wallet"
                value={settings.usdt_trc20_wallet || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
                placeholder="Enter USDT TRC20 wallet address"
              />
            </div>

            <div>
              <label>MTN MOMO</label>
              <input
                name="usdt_bep20_wallet"
                value={settings.usdt_bep20_wallet || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
                placeholder="Enter MOMO NUMBER"
              />
            </div>

            <div>
              <label>Bitcoin Wallet</label>
              <input
                name="bitcoin_wallet"
                value={settings.bitcoin_wallet || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
                placeholder="Enter Bitcoin wallet address"
              />
            </div>

            <div>
              <label>Ethereum Wallet</label>
              <input
                name="ethereum_wallet"
                value={settings.ethereum_wallet || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
                placeholder="Enter Ethereum wallet address"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Platform Controls
          </h2>

          <div className="space-y-5">
            <label className="flex items-center justify-between">
              <span>Enable Deposits</span>
              <input
                type="checkbox"
                name="deposits_enabled"
                checked={settings.deposits_enabled}
                onChange={handleChange}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Enable Withdrawals</span>
              <input
                type="checkbox"
                name="withdrawals_enabled"
                checked={settings.withdrawals_enabled}
                onChange={handleChange}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                name="maintenance_mode"
                checked={settings.maintenance_mode}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            onClick={saveSettings}
            className="mt-10 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdminSettings;