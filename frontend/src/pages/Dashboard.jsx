/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const [user, setUser] = useState(null);
const [investments, setInvestments] = useState([]);
const [plans, setPlans] = useState([]);

  // Fetch logged in user
 const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token");

   const [userResponse, investmentResponse, plansResponse] =
  await Promise.all([
    axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    axios.get("http://localhost:5000/api/wallet/investments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    axios.get("http://localhost:5000/api/profit/plans"),
  ]);

    setUser(userResponse.data);
    setInvestments(investmentResponse.data);
    setPlans(plansResponse.data);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  // Investment plans

  // Purchase investment
  const invest = async (plan) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/wallet/invest",
        {
          plan_name: plan.name,
          amount: plan.investment_amount,
          daily_return: plan.daily_return,
          duration_days: plan.duration_days,
          total_return: plan.total_return,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      // Refresh balance immediately
      await fetchUser();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Investment failed"
      );
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
    <div className="min-h-screen bg-slate-100 flex">
      <div className="flex-1 p-6">

        <div className="max-w-screen-2xl mx-auto px-4">
         <DashboardHeader user={user} />

<StatsCards
  user={user}
  investments={investments}
/>

<QuickActions />

          {/* Investment Plans */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
           <div className="bg-white rounded-3xl shadow-sm p-6 mt-8">

  
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Investment Opportunities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300 bg-white relative"
                >

                  {plan.badge && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      {plan.badge}
                    </div>
                    
                  )}

                  <h3 className="text-2xl font-bold mb-4">
                    {plan.name}
                  </h3>

                  <div className="space-y-3 mb-6">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Investment
                      </span>

                      <span className="font-semibold">
                        ${plan.investment_amount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Daily Return
                      </span>

                      <span className="font-semibold text-green-600">
                        ${plan.daily_return}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Duration
                      </span>

                      <span className="font-semibold">
                        {plan.duration_days} Days
                      </span>
                    </div>

                    <div className="flex justify-between border-t pt-3">
                      <span className="font-semibold">
                        Total Return
                      </span>

                      <span className="font-bold text-xl text-green-600">
                        ${plan.total_return}
                      </span>
                    </div>

                  </div>

                  <button
                    onClick={() => invest(plan)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition font-semibold"
                  >
                    Invest Now
                  </button>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
      <h2 className="text-2xl font-bold mb-6">
    My Active Investments
  </h2>
   

  {investments.length === 0 ? (

    <p className="text-slate-500">
      You have not purchased any investment plans yet.
    </p>

  ) : (

    <div className="grid md:grid-cols-2 gap-6">

      {investments.map((investment) => (

        <div
          key={investment.id}
          className="border rounded-2xl p-5"
        >

          <h3 className="text-xl font-bold">
            {investment.plan_name}
          </h3>

          <p className="mt-3">
            <strong>Invested:</strong> $
            {investment.amount}
          </p>

          <p>
            <strong>Daily Profit:</strong> $
            {investment.daily_return}
          </p>

          <p>
            <strong>Duration:</strong>
            {" "}
            {investment.duration_days} Days
          </p>

          <p>
            <strong>Total Return:</strong>
            {" "}
            ${investment.total_return}
          </p>

          <p className="mt-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {investment.status}
            </span>
          </p>

        </div>

      ))}

    </div>

  )}

</div>
</div>
  );
}

export default Dashboard;