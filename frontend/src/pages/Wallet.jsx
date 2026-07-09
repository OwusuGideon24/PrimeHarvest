import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Wallet() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Loading Wallet...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Wallet
      </h1>

      <div className="bg-white rounded-3xl shadow-sm p-8">

        <p className="text-slate-500 mb-2">
          Available Balance
        </p>

        <h2 className="text-5xl font-bold text-green-600 mb-6">
          ${user.balance}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-slate-100 rounded-2xl p-5">
            <p className="text-slate-500 mb-2">
              Account Holder
            </p>

            <h3 className="text-xl font-bold">
              {user.full_name}
            </h3>
          </div>

          <div className="bg-slate-100 rounded-2xl p-5">
            <p className="text-slate-500 mb-2">
              Referral Code
            </p>

            <h3 className="text-xl font-bold text-blue-600">
              {user.referral_code}
            </h3>
          </div>

        </div>

        <div className="flex flex-wrap gap-4">

         <button
  onClick={() => navigate("/deposit")}
  className="bg-slate-900 text-white px-6 py-3 rounded-xl"
>
  Deposit
</button>

        <button
  onClick={() => navigate("/withdraw")}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
>
  Withdraw
</button>
        </div>

      </div>

    </div>
  );
}

export default Wallet;