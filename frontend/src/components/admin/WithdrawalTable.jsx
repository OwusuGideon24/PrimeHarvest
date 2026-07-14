import { useState } from "react";
import api from "../../services/api";

function WithdrawalTable({ withdrawals = [], refresh }) {
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString();
  };

  const normalizeStatus = (status) =>
    String(status || "pending").toLowerCase();

  const getStatusStyle = (status) => {
    switch (normalizeStatus(status)) {
      case "approved":
      case "completed":
      case "successful":
        return "bg-emerald-100 text-emerald-700";

      case "rejected":
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const updateStatus = async (withdrawal, status) => {
    if (!token || processingId) {
      return;
    }

    const action =
      status.toLowerCase() === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} the $${formatMoney(
        withdrawal.amount
      )} withdrawal request from ${
        withdrawal.full_name ||
        withdrawal.email ||
        "this user"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(withdrawal.id);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.put(
        `/admin/withdrawals/${withdrawal.id}`,
        {
          status,
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
          `The withdrawal was ${status.toLowerCase()} successfully.`,
      });

      await refresh?.();
    } catch (error) {
      console.error(
        "Unable to update withdrawal:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "The withdrawal action could not be completed.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="space-y-4">
      {message.text && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  User
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Method
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Payment Details
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {withdrawals.map((withdrawal) => {
                const isPending =
                  normalizeStatus(withdrawal.status) === "pending";

                const isProcessing =
                  processingId === withdrawal.id;

                return (
                  <tr
                    key={withdrawal.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {withdrawal.full_name ||
                          "PrimeHarvest User"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {withdrawal.email ||
                          "No email available"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(withdrawal.created_at)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                        {withdrawal.method ||
                          "Not available"}
                      </span>
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="break-all text-sm font-medium text-slate-600">
                        {withdrawal.wallet_address ||
                          withdrawal.account_details ||
                          "Not available"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-red-600">
                        ${formatMoney(withdrawal.amount)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status || "pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {isPending ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void updateStatus(
                                withdrawal,
                                "Approved"
                              )
                            }
                            disabled={Boolean(processingId)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void updateStatus(
                                withdrawal,
                                "Rejected"
                              )
                            }
                            disabled={Boolean(processingId)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-400">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile and tablet cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {withdrawals.map((withdrawal) => {
            const isPending =
              normalizeStatus(withdrawal.status) === "pending";

            const isProcessing =
              processingId === withdrawal.id;

            return (
              <article
                key={withdrawal.id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-bold text-slate-900">
                      {withdrawal.full_name ||
                        "PrimeHarvest User"}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {withdrawal.email ||
                        "No email available"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      withdrawal.status
                    )}`}
                  >
                    {withdrawal.status || "pending"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Amount
                    </p>

                    <p className="mt-1 break-all font-bold text-red-600">
                      ${formatMoney(withdrawal.amount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Method
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {withdrawal.method || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Account Details / Wallet Address
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {withdrawal.wallet_address ||
                      withdrawal.account_details ||
                      "Not available"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-xs text-slate-400">
                  <span>Request #{withdrawal.id}</span>

                  <span className="text-right">
                    {formatDate(withdrawal.created_at)}
                  </span>
                </div>

                {isPending ? (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        void updateStatus(
                          withdrawal,
                          "Approved"
                        )
                      }
                      disabled={Boolean(processingId)}
                      className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void updateStatus(
                          withdrawal,
                          "Rejected"
                        )
                      }
                      disabled={Boolean(processingId)}
                      className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                    Request processed
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WithdrawalTable;