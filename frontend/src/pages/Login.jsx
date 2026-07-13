import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Please enter your password.";
    }

    return "";
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (rememberMe) {
        localStorage.setItem("remember_email", form.email.trim());
      } else {
        localStorage.removeItem("remember_email");
      }

      const userRole = String(
        response.data.user?.role || "user"
      ).toLowerCase();

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

          <Link
            to="/"
            className="relative flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-emerald-900 shadow-xl">
              P
            </div>

            <div>
              <p className="text-xl font-black">
                PrimeHarvest
              </p>

              <p className="text-xs text-emerald-200">
                Invest. Grow. Prosper.
              </p>
            </div>
          </Link>

          <div className="relative max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Welcome Back
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight">
              Continue building your financial journey.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Access your wallet, review investments, monitor
              transactions, manage referrals, and request withdrawals
              from one organized dashboard.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <LoginFeature
                value="24/7"
                label="Account access"
              />

              <LoginFeature
                value="1"
                label="Unified dashboard"
              />

              <LoginFeature
                value="100%"
                label="Responsive"
              />
            </div>
          </div>

          <p className="relative text-sm text-slate-300">
            © {new Date().getFullYear()} PrimeHarvest. All rights
            reserved.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-700 font-black text-white">
                  P
                </div>

                <p className="text-xl font-black text-slate-950">
                  PrimeHarvest
                </p>
              </Link>

              <Link
                to="/"
                className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
              >
                Back home
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Account Login
                </p>

                <h1 className="mt-3 text-3xl font-black text-slate-950">
                  Welcome back
                </h1>

                <p className="mt-3 leading-7 text-slate-500">
                  Enter your account details to continue to your
                  PrimeHarvest dashboard.
                </p>
              </div>

              {error && (
                <div
                  className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="mt-7 space-y-5"
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
  to="/forgot-password"
  className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
>
  Forgot password?
</Link>
                  </div>

                  <div className="relative mt-2">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={submitting}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-20 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={submitting}
                      className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    disabled={submitting}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  />

                  <span className="text-sm text-slate-600">
                    Remember my email address
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Signing You In..."
                    : "Login to Your Account"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  New to PrimeHarvest?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/register"
                className="block w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Create a New Account
              </Link>

              <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                By logging in, you confirm that you are accessing your
                own account and agree to follow the platform’s terms.
              </p>
            </div>

            <Link
              to="/"
              className="mx-auto mt-6 hidden w-fit text-sm font-semibold text-slate-500 transition hover:text-emerald-700 lg:block"
            >
              ← Return to homepage
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function LoginFeature({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-300">
        {label}
      </p>
    </div>
  );
}

export default Login;