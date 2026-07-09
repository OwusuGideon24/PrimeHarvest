import { useState } from "react";
import axios from "axios";

function UserActions({ user, refresh }) {
  const [amount, setAmount] = useState("");

  const updateBalance = async (action) => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${user.id}/balance`,
        {
          amount: Number(amount),
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setAmount("");

      refresh();

    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const changeStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const newStatus =
        user.status === "active"
          ? "suspended"
          : "active";

      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${user.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      refresh();

    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };
const changeRole = async (role) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/admin/users/${user.id}/role`,
      {
        role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(response.data.message);

    refresh();

  } catch (error) {
    alert(error.response?.data?.message || "Operation failed.");
  }
};

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-6">
        Admin Actions
      </h2>

      <div className="max-w-sm">

        <label className="block text-sm font-medium mb-2">
          Amount
        </label>

        <input
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="grid grid-cols-2 gap-4 mb-6">

          <button
            onClick={() => updateBalance("add")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
          >
            Add Balance
          </button>

          <button
            onClick={() => updateBalance("deduct")}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-semibold"
          >
            Deduct Balance
          </button>

        </div>

        <button
          onClick={changeStatus}
          className={`w-full py-3 rounded-xl font-semibold text-white ${
            user.status === "active"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {user.status === "active"
            ? "Suspend User"
            : "Activate User"}    
        </button>
<div className="grid grid-cols-2 gap-4 mt-5">

  <button
    onClick={() => changeRole("admin")}
    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
  >
    Make Admin
  </button>

  <button
    onClick={() => changeRole("user")}
    className="bg-slate-700 hover:bg-slate-800 text-white rounded-xl py-3 font-semibold"
  >
    Make User
  </button>

</div>

      </div>

    </div>
  );
}

export default UserActions;