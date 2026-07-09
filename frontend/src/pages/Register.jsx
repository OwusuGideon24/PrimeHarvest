import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
const [referralCode, setReferralCode] = useState("");
  const handleRegister = async () => {
    try {
      setError("");

      // Check passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        referral_code: referralCode,
      });

      alert(response.data.message);

      // Redirect to login page
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-4 mb-4"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-4 mb-4"
        />

        <div className="mt-4">
  <label className="block font-semibold mb-2">
    Referral Code (Optional)
  </label>

  <input
    type="text"
    value={referralCode}
    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
    placeholder="Enter referral code"
    className="w-full border rounded-xl p-3"
  />
</div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-4 mb-4"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-4 mb-6"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-slate-900 text-white p-4 rounded-xl font-semibold hover:bg-slate-800 transition"
        >
          Create Account
        </button>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="font-semibold text-slate-900 ml-1"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;