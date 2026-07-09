/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/user/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        full_name: response.data.full_name,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/user/settings",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Settings updated successfully.");

      // Clear password field after saving
      setForm((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update settings."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-8">

          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Update your account information.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 mt-8">

          <div className="space-y-6">

            <div>
              <label className="font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <button
              onClick={saveSettings}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;