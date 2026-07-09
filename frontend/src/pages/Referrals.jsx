import { useEffect, useState } from "react";
import axios from "axios";

function Referrals() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/referrals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReferrals();
  }, []);

  const copyLink = () => {
    const link = `${window.location.origin}/register?ref=${data.referral_code}`;
    navigator.clipboard.writeText(link);
    alert("Referral link copied.");
  };

  if (!data) {
    return (
      <div className="text-2xl font-bold">
        Loading...
      </div>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${data.referral_code}`;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Referrals
      </h1>

      <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
        <p className="text-slate-500 mb-3">
          Your Referral Link
        </p>

        <div className="flex gap-3">
          <input
            readOnly
            value={referralLink}
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={copyLink}
            className="bg-slate-900 text-white px-6 rounded-xl"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <p className="text-slate-500">Total Referrals</p>
          <h2 className="text-3xl font-bold">
            {data.total_referrals}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <p className="text-slate-500">Reward per Referral</p>
          <h2 className="text-3xl font-bold text-green-600">
            ${Number(data.reward_per_referral).toFixed(2)}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <p className="text-slate-500">Total Earned</p>
          <h2 className="text-3xl font-bold text-green-600">
            ${Number(data.referral_earnings).toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">
          My Referrals
        </h2>

        {data.referrals.length === 0 ? (
          <p className="text-slate-500">
            No referrals yet.
          </p>
        ) : (
          <div className="space-y-4">
            {data.referrals.map((user) => (
              <div
                key={user.id}
                className="border rounded-2xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-bold">{user.full_name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.referral_rewarded
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.referral_rewarded ? "Rewarded" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Referrals;