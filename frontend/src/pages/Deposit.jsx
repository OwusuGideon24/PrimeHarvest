import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Deposit() {
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("USDT TRC20");
  const [transactionReference, setTransactionReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const fetchDepositSettings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/deposits/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setSettings(response.data.settings || response.data);
        }
      } catch (error) {
        console.error(
          "Unable to load deposit settings:",
          error.response?.data?.message || error.message
        );

        if (isMounted) {
          setMessage({
            type: "error",
            text:
              error.response?.data?.message ||
              "Unable to load deposit information.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchDepositSettings();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [token]);

  const paymentDestination = useMemo(() => {
    if (!settings) {
      return "";
    }

    switch (network) {
      case "USDT TRC20":
        return settings.usdt_trc20_wallet || "";

      case "MTN MOMO":
        return (
          settings.mtn_momo_number ||
          settings.momo_number ||
          settings.usdt_bep20_wallet ||
          ""
        );

      case "BTC":
        return settings.bitcoin_wallet || "";

      case "ETH":
        return settings.ethereum_wallet || "";

      default:
        return "";
    }
  }, [network, settings]);

  const minimumDeposit = Number(settings?.minimum_deposit || 0);
  const numericAmount = Number(amount || 0);

  const presetAmounts = [20, 50, 100, 250, 500];

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

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    clearMessage();
  };

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
    setCopied(false);
    clearMessage();
  };

  const copyPaymentDestination = async () => {
    if (!paymentDestination) {
      return;
    }

    try {
      await navigator.clipboard.writeText(paymentDestination);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy payment details:", error);

      setMessage({
        type: "error",
        text: "Unable to copy the payment details.",
      });
    }
  };

  const validateDeposit = () => {
    if (!amount || numericAmount <= 0) {
      return "Please enter a valid deposit amount.";
    }

    if (numericAmount < minimumDeposit) {
      return `The minimum deposit is $${formatMoney(minimumDeposit)}.`;
    }

    if (!paymentDestination) {
      return `Payment details for ${network} are not configured.`;
    }

    if (!transactionReference.trim()) {
      return "Please enter the transaction reference.";
    }

    return "";
  };

  const submitDeposit = async (event) => {
    event.preventDefault();

    if (!token || submitting) {
      return;
    }

    const validationError = validateDeposit();

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

      const response = await axios.post(
        "http://localhost:5000/api/deposits",
        {
          amount: numericAmount,
          network,
          transaction_reference: transactionReference.trim(),
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
          "Your deposit request was submitted successfully.",
      });

      setAmount("");
      setTransactionReference("");
    } catch (error) {
      console.error(
        "Deposit request failed:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Deposit request failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading deposit information...
          </p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-3xl">⚠️</div>

        <h2 className="mt-3 text-lg font-semibold text-red-700">
          Deposit information unavailable
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {message.text ||
            "The deposit settings could not be loaded."}
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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Deposit Funds
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Send funds using one of the available payment methods and submit
          the transaction reference for approval.
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={submitDeposit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
        >
          <div>
            <label
              htmlFor="amount"
              className="text-sm font-semibold text-slate-700"
            >
              Deposit Amount
            </label>

            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-semibold text-slate-500">
                $
              </span>

              <input
                id="amount"
                type="number"
                min={minimumDeposit}
                step="0.01"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`Minimum $${formatMoney(minimumDeposit)}`}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Minimum deposit: ${formatMoney(minimumDeposit)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {presetAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => {
                    setAmount(String(presetAmount));
                    clearMessage();
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    Number(amount) === presetAmount
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ${presetAmount}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="network"
              className="text-sm font-semibold text-slate-700"
            >
              Payment Method
            </label>

            <select
              id="network"
              value={network}
              onChange={handleNetworkChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="USDT TRC20">USDT TRC20</option>
              <option value="MTN MOMO">MTN Mobile Money</option>
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-slate-700">
              {network === "MTN MOMO"
                ? "Mobile Money Number"
                : "Wallet Address"}
            </label>

            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-all font-mono text-sm font-semibold text-slate-800">
                  {paymentDestination ||
                    "Payment details are not configured."}
                </p>

                <button
                  type="button"
                  onClick={() => void copyPaymentDestination()}
                  disabled={!paymentDestination}
                  className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-amber-700">
              Confirm that you selected the correct payment method before
              sending funds.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="transaction_reference"
              className="text-sm font-semibold text-slate-700"
            >
              Transaction Reference
            </label>

            <input
              id="transaction_reference"
              type="text"
              value={transactionReference}
              onChange={(event) => {
                setTransactionReference(event.target.value);
                clearMessage();
              }}
              placeholder="Enter or paste the transaction reference"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              This may be a transaction hash, mobile money ID, or payment
              reference.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {submitting
              ? "Submitting Request..."
              : "Submit Deposit Request"}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-2xl">💳</div>

            <h2 className="mt-3 font-bold text-emerald-900">
              Deposit Summary
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-emerald-700">
                  Amount
                </span>

                <span className="font-semibold text-emerald-900">
                  ${formatMoney(numericAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-emerald-700">
                  Method
                </span>

                <span className="text-right font-semibold text-emerald-900">
                  {network}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-emerald-200 pt-3 text-sm">
                <span className="text-emerald-700">
                  Status
                </span>

                <span className="font-semibold text-amber-700">
                  Pending approval
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              How deposits work
            </h2>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </span>

                <p>Select a payment method and enter the amount.</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  2
                </span>

                <p>Send the funds to the displayed payment destination.</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </span>

                <p>Submit the correct transaction reference.</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  4
                </span>

                <p>Your balance updates after the request is approved.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/wallet")}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Wallet
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Deposit;