import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Wallet() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadWallet = async () => {
    if (!token) {
      setErrorMessage("Your login session has expired.");
      setLoading(false);
      return;
    }

    try {
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user || response.data);
    } catch (error) {
      console.error(
        "Unable to load wallet:",
        error.response?.data?.message || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load your wallet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadWallet();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const copyReferralCode = async () => {
    if (!user?.referral_code) return;

    try {
      await navigator.clipboard.writeText(user.referral_code);
      alert("Referral code copied.");
    } catch (error) {
      console.error("Unable to copy referral code:", error);
      alert("Unable to copy the referral code.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading your wallet...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-3xl">⚠️</div>

        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Unable to load wallet
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {errorMessage || "Wallet information is unavailable."}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadWallet();
          }}
          className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Wallet
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your balance, deposits, withdrawals, and account details.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Available Balance
            </p>

            <h2 className="mt-2 break-all text-4xl font-bold tracking-tight sm:text-5xl">
              ${formatMoney(user.balance)}
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Funds available for investments and withdrawals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/deposit")}
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
            >
              Deposit Funds
            </button>

            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Withdraw Funds
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
              👤
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Account Holder
              </p>

              <h3 className="mt-1 break-words text-lg font-bold text-slate-900 sm:text-xl">
                {user.full_name || user.name || "PrimeHarvest User"}
              </h3>

              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🎁
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-500">
                Referral Code
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="break-all text-lg font-bold text-emerald-700 sm:text-xl">
                  {user.referral_code || "Not available"}
                </h3>

                {user.referral_code && (
                  <button
                    type="button"
                    onClick={() => void copyReferralCode()}
                    className="w-fit rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Copy Code
                  </button>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Share this code to earn referral rewards.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Wallet Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review deposits, withdrawals, investments, and earnings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="w-full rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto"
          >
            View Transactions
          </button>
        </div>
      </section>
    </div>
  );
}

export default Wallet;