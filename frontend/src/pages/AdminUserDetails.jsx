/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import UserProfileCard from "../components/admin/UserProfileCard";
import UserInvestments from "../components/admin/UserInvestments";
import UserTransactions from "../components/admin/UserTransactions";
import UserWithdrawals from "../components/admin/UserWithdrawals";
import UserActions from "../components/admin/UserActions";

function AdminUserDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/admin/users/${id}`,
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
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <Link
          to="/admin/users"
          className="inline-block mb-6 text-blue-600 font-semibold hover:underline"
        >
          ← Back to Users
        </Link>

        <UserProfileCard user={data.user} />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

          <UserInvestments
            investments={data.investments}
          />

          <UserWithdrawals
            withdrawals={data.withdrawals}
          />

        </div>

        <div className="mt-8">

          <UserTransactions
            transactions={data.transactions}
          />

        </div>

        <div className="mt-8">

          <UserActions
            user={data.user}
            refresh={fetchUser}
          />

        </div>

      </div>

    </div>
  );
}

export default AdminUserDetails;