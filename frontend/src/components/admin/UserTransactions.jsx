function UserTransactions({ transactions }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        Wallet Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-slate-500">
          No transactions found.
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border rounded-xl p-4"
            >
              <p className="font-semibold">
                {transaction.type}
              </p>

              <p>${transaction.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserTransactions;