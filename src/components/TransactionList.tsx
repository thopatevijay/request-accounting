import React from 'react';

const transactions = [
  {
    id: 1,
    payee: '0x519145B771a6e450461af89980e5C17Ff6Fd8A92',
    payer: '0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567',
    amount: '$500',
    status: 'Paid',
    date: '2024-07-01',
  },
  {
    id: 2,
    payee: '0x519145B771a6e450461af89980e5C17Ff6Fd8A92',
    payer: '0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567',
    amount: '$300',
    status: 'Pending',
    date: '2024-06-30',
  },
];

const TransactionList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Payee</th>
            <th className="px-4 py-2 border">Payer</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-2 border">{transaction.payee}</td>
              <td className="px-4 py-2 border">{transaction.payer}</td>
              <td className="px-4 py-2 border">{transaction.amount}</td>
              <td className={`px-4 py-2 border ${transaction.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                {transaction.status}
              </td>
              <td className="px-4 py-2 border">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
