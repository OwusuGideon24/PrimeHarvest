import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "If an account exists for that email, a password reset link has been sent.",
      });
    } catch (error) {
      console.error(
        "Forgot-password request failed:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "The password reset request could not be completed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
              Account Recovery
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight">
              Recover access to your PrimeHarvest account.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Enter the email address connected to your account.
              We will send a secure, one-time password reset link
              that expires after 30 minutes.
            </p>

            <div className="mt-10 space-y-4">
              <RecoveryPoint
                title="Private request"
                description="The response does not reveal whether an email is registered."
              />

              <RecoveryPoint
                title="Time-limited link"
                description="Reset links expire after 30 minutes for better account protection."
              />

              <RecoveryPoint
                title="Single use"
                description="A reset token becomes invalid immediately after the password is changed."
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
                to="/login"
                className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
              >
                Back to login
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                ✉
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Forgot Password
              </p>

              <h1 className="mt-3 text-3xl font-black text-slate-950">
                Reset your password
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Enter your email address and we will send you a
                secure password-reset link.
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
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (message.text) {
                        setMessage({
                          type: "",
                          text: "",
                        });
                      }
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Sending Reset Link..."
                    : "Send Password Reset Link"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Remembered it?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/login"
                className="block w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Return to Login
              </Link>

              <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                Check your inbox, spam, promotions, and all-mail
                folders after submitting the request.
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

function RecoveryPoint({ title, description }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-300 font-black text-emerald-950">
        ✓
      </div>

      <div>
        <p className="font-bold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;