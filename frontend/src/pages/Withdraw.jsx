import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Withdraw() {
  const [user, setUser] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MTN MOMO");
  const [walletAddress, setWalletAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [userResponse, withdrawalsResponse] = await Promise.all([
        api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        api.get(
          "/withdrawals/my-withdrawals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      setUser(userResponse.data.user || userResponse.data);

      setWithdrawals(
        Array.isArray(withdrawalsResponse.data)
          ? withdrawalsResponse.data
          : withdrawalsResponse.data.withdrawals || []
      );

      setMessage({
        type: "",
        text: "",
      });
    } catch (error) {
      console.error(
        "Unable to load withdrawal information:",
        error.response?.data?.message || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to load withdrawal information.",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchData]);

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const numericAmount = Number(amount || 0);
  const availableBalance = Number(user?.balance || 0);

  const presetAmounts = [20, 50, 100, 250];

  const getAddressLabel = () => {
    switch (method) {
      case "MTN MOMO":
        return "Mobile Money Account Details";

      case "BTC":
        return "Bitcoin Wallet Address";

      case "ETH":
        return "Ethereum Wallet Address";

      default:
        return "USDT Wallet Address";
    }
  };

  const getAddressPlaceholder = () => {
    switch (method) {
      case "MTN MOMO":
        return "Example: 0549022138 - Owusu Gideon";

      case "BTC":
        return "Enter your Bitcoin wallet address";

      case "ETH":
        return "Enter your Ethereum wallet address";

      default:
        return "Enter your USDT wallet address";
    }
  };

  const clearMessage = () => {
    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const validateWithdrawal = () => {
    if (!amount || numericAmount <= 0) {
      return "Please enter a valid withdrawal amount.";
    }

    if (numericAmount > availableBalance) {
      return "Your withdrawal amount exceeds your available balance.";
    }

    if (!walletAddress.trim()) {
      return `Please enter your ${getAddressLabel().toLowerCase()}.`;
    }

    return "";
  };

  const submitWithdrawal = async (event) => {
    event.preventDefault();

    if (!token || submitting) {
      return;
    }

    const validationError = validateWithdrawal();

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

      const response = await api.post(
        "/withdrawals",
        {
          amount: numericAmount,
          method,
          wallet_address: walletAddress.trim(),
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
          "Your withdrawal request was submitted successfully.",
      });

      setAmount("");
      setWalletAddress("");

      await fetchData();
    } catch (error) {
      console.error(
        "Withdrawal request failed:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Withdrawal request failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
      case "successful":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "rejected":
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading withdrawal information...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-3xl">⚠️</div>

        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Withdrawal information unavailable
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {message.text || "Unable to load your wallet information."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/wallet")}
          className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Withdraw Funds
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Submit a withdrawal request using one of your supported payment
          methods.
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

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Available Balance
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              ${formatMoney(availableBalance)}
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              You cannot request more than your available balance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/wallet")}
            className="w-full rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
          >
            Back to Wallet
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={submitWithdrawal}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
        >
          <div>
            <label
              htmlFor="withdrawal-amount"
              className="text-sm font-semibold text-slate-700"
            >
              Withdrawal Amount
            </label>

            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-semibold text-slate-500">
                $
              </span>

              <input
                id="withdrawal-amount"
                type="number"
                min="0.01"
                max={availableBalance}
                step="0.01"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  clearMessage();
                }}
                placeholder="Enter withdrawal amount"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {presetAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => {
                    setAmount(String(presetAmount));
                    clearMessage();
                  }}
                  disabled={presetAmount > availableBalance}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    Number(amount) === presetAmount
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  ${presetAmount}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setAmount(String(availableBalance));
                  clearMessage();
                }}
                disabled={availableBalance <= 0}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Maximum
              </button>
            </div>

            <div className="mt-3 flex justify-between gap-4 text-xs text-slate-500">
              <span>Available balance</span>

              <span className="font-semibold">
                ${formatMoney(availableBalance)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="withdrawal-method"
              className="text-sm font-semibold text-slate-700"
            >
              Withdrawal Method
            </label>

            <select
              id="withdrawal-method"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value);
                setWalletAddress("");
                clearMessage();
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
            >
              <option value="MTN MOMO">MTN Mobile Money</option>
              <option value="USDT TRC20">USDT TRC20</option>
              <option value="USDT BEP20">USDT BEP20</option>
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
            </select>
          </div>

          <div className="mt-6">
            <label
              htmlFor="wallet-address"
              className="text-sm font-semibold text-slate-700"
            >
              {getAddressLabel()}
            </label>

            <textarea
              id="wallet-address"
              value={walletAddress}
              onChange={(event) => {
                setWalletAddress(event.target.value);
                clearMessage();
              }}
              placeholder={getAddressPlaceholder()}
              rows="4"
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            <p className="mt-2 text-xs text-amber-700">
              Carefully confirm these details. Incorrect payment information
              may cause delays or loss of funds.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || availableBalance <= 0}
            className="mt-8 w-full rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {submitting
              ? "Submitting Request..."
              : "Submit Withdrawal Request"}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="text-2xl">💸</div>

            <h2 className="mt-3 font-bold text-red-900">
              Withdrawal Summary
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-red-700">
                  Amount
                </span>

                <span className="font-semibold text-red-900">
                  ${formatMoney(numericAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-red-700">
                  Method
                </span>

                <span className="text-right font-semibold text-red-900">
                  {method}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-red-200 pt-3 text-sm">
                <span className="text-red-700">
                  Remaining Balance
                </span>

                <span className="font-semibold text-red-900">
                  $
                  {formatMoney(
                    Math.max(availableBalance - numericAmount, 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Important Information
            </h2>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </span>

                <p>Withdrawal requests require administrative approval.</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  2
                </span>

                <p>Use payment details that belong to you.</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </span>

                <p>Pending requests may temporarily affect your balance.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            My Withdrawal History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track the status of your previous withdrawal requests.
          </p>
        </div>

        {withdrawals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
            <div className="text-4xl">📭</div>

            <h3 className="mt-3 font-semibold text-slate-700">
              No withdrawal requests yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your submitted withdrawal requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <article
                key={withdrawal.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-lg font-bold text-slate-900">
                    ${formatMoney(withdrawal.amount)}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {withdrawal.method}
                  </p>

                  <p className="mt-2 break-all text-sm text-slate-400">
                    {withdrawal.wallet_address}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      withdrawal.status
                    )}`}
                  >
                    {withdrawal.status || "pending"}
                  </span>

                  <p className="text-xs text-slate-400 sm:mt-3">
                    {withdrawal.created_at
                      ? new Date(
                          withdrawal.created_at
                        ).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Withdraw;