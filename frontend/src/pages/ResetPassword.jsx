import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const passwordChecks = useMemo(
    () => ({
      minimumLength: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /\d/.test(form.password),
    }),
    [form.password]
  );

  const verifyToken = useCallback(async () => {
    if (!token) {
      setCheckingToken(false);
      setTokenValid(false);
      setMessage({
        type: "error",
        text: "The password reset token is missing.",
      });
      return;
    }

    try {
      const response = await api.get(
        `/auth/reset-password/${encodeURIComponent(token)}`
      );

      setTokenValid(Boolean(response.data?.valid));

      setMessage({
        type: "",
        text: "",
      });
    } catch (error) {
      console.error(
        "Reset token verification failed:",
        error.response?.data?.message || error.message
      );

      setTokenValid(false);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "This password reset link is invalid or has expired.",
      });
    } finally {
      setCheckingToken(false);
    }
  }, [token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void verifyToken();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [verifyToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const validateForm = () => {
    if (!Object.values(passwordChecks).every(Boolean)) {
      return "Your password must meet all the listed requirements.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tokenValid || submitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.post("/auth/reset-password", {
        token,
        password: form.password,
      });

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "Your password has been reset successfully.",
      });

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);
    } catch (error) {
      console.error(
        "Password reset failed:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Your password could not be reset.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Verifying your reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-700">
            ✕
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-950">
            Reset link unavailable
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            {message.text ||
              "This password reset link is invalid or has expired."}
          </p>

          <Link
            to="/forgot-password"
            className="mt-7 block w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-6 py-4 font-bold text-white shadow-lg"
          >
            Request a New Reset Link
          </Link>

          <Link
            to="/login"
            className="mt-3 block w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
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
              Secure Password Update
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight">
              Create a stronger password for your account.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Your new password should be unique, difficult to guess,
              and different from passwords used on other websites.
            </p>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="font-bold text-white">
                Security reminder
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                PrimeHarvest support should never ask you to send
                your password, reset token, or authentication token
                through email, chat, or phone.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-slate-300">
            © {new Date().getFullYear()} PrimeHarvest. All rights
            reserved.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                🔒
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Reset Password
              </p>

              <h1 className="mt-3 text-3xl font-black text-slate-950">
                Create a new password
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Enter and confirm the new password you want to use
                for your PrimeHarvest account.
              </p>

              {message.text && (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <PasswordField
                  id="new-password"
                  label="New Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  togglePassword={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={submitting}
                />

                <PasswordField
                  id="confirm-new-password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  showPassword={showConfirmPassword}
                  togglePassword={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  disabled={submitting}
                />

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Password requirements
                  </p>

                  <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                    <Requirement
                      passed={passwordChecks.minimumLength}
                      text="At least 8 characters"
                    />

                    <Requirement
                      passed={passwordChecks.uppercase}
                      text="One uppercase letter"
                    />

                    <Requirement
                      passed={passwordChecks.lowercase}
                      text="One lowercase letter"
                    />

                    <Requirement
                      passed={passwordChecks.number}
                      text="One number"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-4 block text-center text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
              >
                Return to login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  showPassword,
  togglePassword,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
          autoComplete="new-password"
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-20 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
        />

        <button
          type="button"
          onClick={togglePassword}
          disabled={disabled}
          className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 disabled:opacity-50"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function Requirement({ passed, text }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        passed ? "text-emerald-700" : "text-slate-500"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
          passed
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {passed ? "✓" : "•"}
      </span>

      <span>{text}</span>
    </div>
  );
}

export default ResetPassword;