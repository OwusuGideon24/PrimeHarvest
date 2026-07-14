import { useState } from "react";
import api from "../../services/api";

function UserActions({ user, refresh }) {
  const [amount, setAmount] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");
  const numericAmount = Number(amount || 0);

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const clearMessage = () => {
    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const updateBalance = async (action) => {
    if (!token || processingAction) {
      return;
    }

    if (!amount || numericAmount <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid amount greater than zero.",
      });

      return;
    }

    if (
      action === "deduct" &&
      numericAmount > Number(user?.balance || 0)
    ) {
      setMessage({
        type: "error",
        text: "The deduction amount exceeds the user's wallet balance.",
      });

      return;
    }

    const actionLabel =
      action === "add" ? "add" : "deduct";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} $${formatMoney(
        numericAmount
      )} ${
        action === "add" ? "to" : "from"
      } this user's balance?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingAction(action);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.put(
        `/admin/users/${user.id}/balance`,
        {
          amount: numericAmount,
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAmount("");

      setMessage({
        type: "success",
        text:
          response.data.message ||
          "The user's balance was updated successfully.",
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to update balance:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to update the user's balance.",
      });
    } finally {
      setProcessingAction("");
    }
  };

  const changeStatus = async () => {
    if (!token || processingAction) {
      return;
    }

    const currentStatus = String(
      user?.status || "active"
    ).toLowerCase();

    const newStatus =
      currentStatus === "active" ? "suspended" : "active";

    const confirmed = window.confirm(
      newStatus === "suspended"
        ? "Are you sure you want to suspend this user?"
        : "Are you sure you want to activate this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingAction("status");
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.put(
        `/admin/users/${user.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text:
          response.data.message ||
          `The user was ${newStatus} successfully.`,
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to change user status:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to change the user's status.",
      });
    } finally {
      setProcessingAction("");
    }
  };

  const changeRole = async (role) => {
    if (!token || processingAction) {
      return;
    }

    const currentRole = String(
      user?.role || "user"
    ).toLowerCase();

    if (currentRole === role) {
      setMessage({
        type: "error",
        text: `This account is already assigned the ${role} role.`,
      });

      return;
    }

    const confirmed = window.confirm(
      role === "admin"
        ? "Are you sure you want to grant this user administrator access?"
        : "Are you sure you want to remove administrator access from this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingAction(`role-${role}`);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.put(
        `/admin/users/${user.id}/role`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text:
          response.data.message ||
          `The user's role was changed to ${role}.`,
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to change user role:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to change the user's role.",
      });
    } finally {
      setProcessingAction("");
    }
  };

  const currentStatus = String(
    user?.status || "active"
  ).toLowerCase();

  const currentRole = String(
    user?.role || "user"
  ).toLowerCase();

  const isProcessing = Boolean(processingAction);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Admin Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage this user’s wallet balance, account status, and role.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
          🛠️
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 p-5 xl:col-span-1">
          <div>
            <h3 className="font-bold text-slate-900">
              Wallet Balance
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Current balance:{" "}
              <span className="font-semibold text-emerald-600">
                ${formatMoney(user?.balance)}
              </span>
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="balance-amount"
              className="text-sm font-semibold text-slate-700"
            >
              Amount
            </label>

            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-500">
                $
              </span>

              <input
                id="balance-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  clearMessage();
                }}
                placeholder="Enter amount"
                disabled={isProcessing}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              onClick={() => void updateBalance("add")}
              disabled={isProcessing}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {processingAction === "add"
                ? "Adding..."
                : "Add Balance"}
            </button>

            <button
              type="button"
              onClick={() => void updateBalance("deduct")}
              disabled={isProcessing}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {processingAction === "deduct"
                ? "Deducting..."
                : "Deduct Balance"}
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <div>
            <h3 className="font-bold text-slate-900">
              Account Status
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Control whether this user can access their account.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Current Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                currentStatus === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentStatus}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void changeStatus()}
            disabled={isProcessing}
            className={`mt-5 w-full rounded-xl px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              currentStatus === "active"
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {processingAction === "status"
              ? "Updating Status..."
              : currentStatus === "active"
                ? "Suspend User"
                : "Activate User"}
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <div>
            <h3 className="font-bold text-slate-900">
              Account Role
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Grant or remove administrator permissions.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Current Role
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                currentRole === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {currentRole}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              onClick={() => void changeRole("admin")}
              disabled={isProcessing || currentRole === "admin"}
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {processingAction === "role-admin"
                ? "Updating..."
                : "Make Administrator"}
            </button>

            <button
              type="button"
              onClick={() => void changeRole("user")}
              disabled={isProcessing || currentRole === "user"}
              className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {processingAction === "role-user"
                ? "Updating..."
                : "Make Standard User"}
            </button>
          </div>
        </article>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <span className="text-xl">⚠️</span>

          <div>
            <p className="font-semibold text-amber-900">
              Administrative changes
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Balance, status, and role changes affect the user immediately.
              Confirm all details carefully before continuing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserActions;