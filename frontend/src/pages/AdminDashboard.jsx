
import { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStatCard from "../components/admin/AdminStatCard";
import RecentUsers from "../components/admin/RecentUsers";
import RecentWithdrawals from "../components/admin/RecentWithdrawals";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);

  useEffect(() => {

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const dashboard = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recent = await axios.get(
        "http://localhost:5000/api/admin/recent-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(dashboard.data);
      setRecentUsers(recent.data);

      const withdrawals = await axios.get(
  "http://localhost:5000/api/admin/recent-withdrawals",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setRecentWithdrawals(withdrawals.data);

    } catch (error) {
      console.error(error);
    }

  };

  fetchDashboard();

}, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar />

      <div className="flex-1 p-8">

        <AdminHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <AdminStatCard
            title="Total Users"
            value={stats.totalUsers}
            color="text-blue-600"
          />

          <AdminStatCard
            title="Wallet Balance"
            value={`$${Number(stats.totalWalletBalance).toFixed(2)}`}
            color="text-green-600"
          />

          <AdminStatCard
            title="Active Investments"
            value={stats.activeInvestments}
            color="text-purple-600"
          />

          <AdminStatCard
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals}
            color="text-red-600"
          />

        </div>

        {/* Coming Soon Sections */}

      <RecentWithdrawals withdrawals={recentWithdrawals} />
          
          <RecentUsers users={recentUsers} />

        </div>

      </div>

  );
}

export default AdminDashboard;