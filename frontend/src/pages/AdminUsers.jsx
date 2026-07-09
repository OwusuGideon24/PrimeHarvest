import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../components/admin/UserTable";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">

          <h1 className="text-4xl font-bold">
            User Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all registered PrimeHarvest users.
          </p>

        </div>

        <UserTable
          users={users}
          refresh={fetchUsers}
        />

      </div>

    </div>
  );
}

export default AdminUsers;