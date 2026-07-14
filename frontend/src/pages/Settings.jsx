import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";

function Settings() {
  const outletContext = useOutletContext();
  const updateLayoutUser = outletContext?.setUser;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await api.get(
          "/user/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.user || response.data;

        if (isMounted) {
          setForm({
            full_name: userData.full_name || "",
            email: userData.email || "",
            password: "",
            confirm_password: "",
          });
        }
      } catch (error) {
        console.error(
          "Unable to load settings:",
          error.response?.data?.message || error.message
        );

        if (isMounted) {
          setMessage({
            type: "error",
            text:
              error.response?.data?.message ||
              "Unable to load your account settings.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchSettings();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [token]);

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
    if (!form.full_name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (form.password && form.password.length < 6) {
      return "Your new password must contain at least 6 characters.";
    }

    if (form.password !== form.confirm_password) {
      return "The password confirmation does not match.";
    }

    return "";
  };

  const saveSettings = async (event) => {
    event.preventDefault();

    if (!token || saving) {
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
      setSaving(true);
      setMessage({
        type: "",
        text: "",
      });

      const requestData = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
      };

      if (form.password) {
        requestData.password = form.password;
      }

      const response = await api.put(
        "/user/settings",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user || {
        full_name: requestData.full_name,
        email: requestData.email,
      };

      setForm((currentForm) => ({
        ...currentForm,
        full_name: updatedUser.full_name || requestData.full_name,
        email: updatedUser.email || requestData.email,
        password: "",
        confirm_password: "",
      }));

      if (updateLayoutUser) {
        updateLayoutUser((currentUser) => ({
          ...currentUser,
          ...updatedUser,
          full_name: updatedUser.full_name || requestData.full_name,
          email: updatedUser.email || requestData.email,
        }));
      }

      setMessage({
        type: "success",
        text:
          response.data.message ||
          "Your account settings were updated successfully.",
      });
    } catch (error) {
      console.error(
        "Unable to update settings:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update your account settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and account password.
        </p>
      </div>

      {message.text && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
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
        onSubmit={saveSettings}
        className="space-y-6"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
              👤
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the name and email address associated with your account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="full_name"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="full_name"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter your email address"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
              🔐
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Leave both fields empty to keep your current password.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                New Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Enter a new password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((currentValue) => !currentValue)
                  }
                  className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="text-sm font-semibold text-slate-700"
              >
                Confirm New Password
              </label>

              <input
                id="confirm_password"
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Use at least 6 characters and avoid passwords you use on other
            websites.
          </p>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              setForm((currentForm) => ({
                ...currentForm,
                password: "",
                confirm_password: "",
              }))
            }
            disabled={saving}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear Password
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;