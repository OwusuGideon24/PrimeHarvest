function UserWithdrawals({ withdrawals }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        Withdrawals
      </h2>

      {withdrawals.length === 0 ? (
        <p className="text-slate-500">
          No withdrawals found.
        </p>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="border rounded-2xl p-4"
            >
              <p>
                <strong>Amount:</strong> ${withdrawal.amount}
              </p>

              <p>
                <strong>Method:</strong> {withdrawal.method}
              </p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                {withdrawal.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserWithdrawals;