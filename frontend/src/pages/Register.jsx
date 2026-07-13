import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  const passwordStrength = useMemo(() => {
    const passedChecks = Object.values(passwordChecks).filter(
      Boolean
    ).length;

    if (!form.password) {
      return {
        label: "",
        width: "0%",
        className: "bg-slate-200",
      };
    }

    if (passedChecks <= 1) {
      return {
        label: "Weak",
        width: "25%",
        className: "bg-red-500",
      };
    }

    if (passedChecks === 2) {
      return {
        label: "Fair",
        width: "50%",
        className: "bg-amber-500",
      };
    }

    if (passedChecks === 3) {
      return {
        label: "Good",
        width: "75%",
        className: "bg-blue-500",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      className: "bg-emerald-500",
    };
  }, [form.password, passwordChecks]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        name === "referralCode"
          ? value.toUpperCase().replace(/\s/g, "")
          : value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (form.fullName.trim().length < 2) {
      return "Please enter a valid full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Please create a password.";
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      return "Your password must meet all the listed requirements.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!acceptTerms) {
      return "Please accept the terms and privacy policy.";
    }

    return "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (submitting) {
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

      const requestData = {
        full_name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        referral_code: form.referralCode.trim() || undefined,
      };

      const response = await api.post(
        "/auth/register",
        requestData
      );

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "Your account was created successfully.",
      });

      window.setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: form.email.trim(),
          },
        });
      }, 1000);
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response?.data?.message || err.message
      );

      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
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
              Join PrimeHarvest
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight">
              Start managing your investment journey today.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Create your account, fund your wallet, choose an
              investment plan, track transactions, and manage your
              activity from one convenient dashboard.
            </p>

            <div className="mt-10 space-y-4">
              <RegistrationBenefit
                title="Simple onboarding"
                description="Create an account and access your dashboard in a few steps."
              />

              <RegistrationBenefit
                title="Clear financial activity"
                description="Review wallet transactions, investments, and withdrawals."
              />

              <RegistrationBenefit
                title="Referral rewards"
                description="Use a valid referral code when one has been shared with you."
              />
            </div>
          </div>

          <p className="relative text-sm text-slate-300">
            © {new Date().getFullYear()} PrimeHarvest. All rights
            reserved.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
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
                  Account Registration
                </p>

                <h1 className="mt-3 text-3xl font-black text-slate-950">
                  Create your account
                </h1>

                <p className="mt-3 leading-7 text-slate-500">
                  Enter your information below to join
                  PrimeHarvest.
                </p>
              </div>

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
                onSubmit={handleRegister}
                className="mt-7 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={submitting}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Referral Code"
                      name="referralCode"
                      value={form.referralCode}
                      onChange={handleChange}
                      placeholder="Enter referral code"
                      disabled={submitting}
                      helpText="Optional. Leave this blank if nobody referred you."
                      inputClassName="uppercase tracking-wider"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="register-password"
                        type={
                          showPassword ? "text" : "password"
                        }
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={submitting}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-20 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        disabled={submitting}
                        className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 disabled:opacity-50"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Confirm Password
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="register-confirm-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={submitting}
                        className={`w-full rounded-xl border px-4 py-3.5 pr-20 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-100 ${
                          form.confirmPassword &&
                          form.password !==
                            form.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        disabled={submitting}
                        className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 disabled:opacity-50"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {form.password && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-700">
                        Password strength
                      </p>

                      <p className="text-sm font-bold text-slate-600">
                        {passwordStrength.label}
                      </p>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${passwordStrength.className}`}
                        style={{
                          width: passwordStrength.width,
                        }}
                      />
                    </div>

                    <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                      <PasswordRequirement
                        passed={
                          passwordChecks.minimumLength
                        }
                        text="At least 8 characters"
                      />

                      <PasswordRequirement
                        passed={passwordChecks.uppercase}
                        text="One uppercase letter"
                      />

                      <PasswordRequirement
                        passed={passwordChecks.lowercase}
                        text="One lowercase letter"
                      />

                      <PasswordRequirement
                        passed={passwordChecks.number}
                        text="One number"
                      />
                    </div>
                  </div>
                )}

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) =>
                      setAcceptTerms(event.target.checked)
                    }
                    disabled={submitting}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    I agree to the{" "}
                    <Link
  to="/terms"
  target="_blank"
  rel="noreferrer"
  className="font-semibold text-emerald-700 hover:text-emerald-800"
>
  Terms of Service
</Link>
                    and{" "}
                   <Link
  to="/privacy"
  target="_blank"
  rel="noreferrer"
  className="font-semibold text-emerald-700 hover:text-emerald-800"
>
  Privacy Policy
</Link>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Creating Your Account..."
                    : "Create Your Account"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Already registered?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/login"
                className="block w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Login to Your Account
              </Link>

              <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                Never share your password, authentication token, or
                account access details with anyone.
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

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  helpText = "",
  inputClassName = "",
}) {
  return (
    <div>
      <label
        htmlFor={`register-${name}`}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={`register-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 ${inputClassName}`}
      />

      {helpText && (
        <p className="mt-2 text-xs text-slate-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

function PasswordRequirement({ passed, text }) {
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

function RegistrationBenefit({ title, description }) {
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

export default Register;