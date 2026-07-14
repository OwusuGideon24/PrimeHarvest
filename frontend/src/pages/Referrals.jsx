import { useEffect, useState } from "react";
import api from "../services/api";

function Referrals() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const fetchReferrals = async () => {
      try {
        const response = await api.get(
          "/referrals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setData(response.data);
          setErrorMessage("");
        }
      } catch (error) {
        console.error(
          "Unable to load referrals:",
          error.response?.data?.message || error.message
        );

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              "Unable to load your referral information."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchReferrals();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [token]);

  const referralCode = data?.referral_code || "";

  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy referral link:", error);
      alert("Unable to copy referral link.");
    }
  };

  const shareReferralLink = async () => {
    if (!referralLink) return;

    const shareData = {
      title: "Join PrimeHarvest",
      text: "Join PrimeHarvest using my referral link.",
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to share referral link:", error);
        }
      }

      return;
    }

    await copyReferralLink();
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const referrals = Array.isArray(data?.referrals)
    ? data.referrals
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading referrals...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !data) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-3xl">⚠️</div>

        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Unable to load referrals
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {errorMessage || "Referral information is unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Referrals
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Invite friends and earn rewards when they join PrimeHarvest.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-50">
              Referral Program
            </span>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Earn ${formatMoney(data.reward_per_referral)} per referral
            </h2>

            <p className="mt-3 text-sm leading-6 text-emerald-50 sm:text-base">
              Share your referral link with friends. Your referral reward
              will be credited when they meet the required conditions.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
              Your referral code
            </p>

            <p className="mt-2 break-all text-2xl font-bold">
              {referralCode || "Not available"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Share Your Referral Link
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Copy or share your unique registration link.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="break-all text-sm text-slate-700">
              {referralLink || "Referral link unavailable"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void copyReferralLink()}
              disabled={!referralLink}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <button
              type="button"
              onClick={() => void shareReferralLink()}
              disabled={!referralLink}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Share Link
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Referrals
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {Number(data.total_referrals || 0)}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              👥
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Reward Per Referral
              </p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                ${formatMoney(data.reward_per_referral)}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🎁
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Earned
              </p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                ${formatMoney(data.referral_earnings)}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
              💰
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            My Referrals
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            People who registered using your referral link.
          </p>
        </div>

        {referrals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
            <div className="text-4xl">👥</div>

            <h3 className="mt-3 font-semibold text-slate-700">
              No referrals yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Share your referral link to start earning rewards.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <article
                key={referral.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {(referral.full_name || "User")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((name) => name.charAt(0).toUpperCase())
                      .join("")}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {referral.full_name || "PrimeHarvest User"}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {referral.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                    referral.referral_rewarded
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {referral.referral_rewarded
                    ? "Rewarded"
                    : "Pending Reward"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Referrals;