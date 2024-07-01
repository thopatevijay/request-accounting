import React from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';

interface TransactionListProps {
  transactions: IRequestDataWithEvents[];
  isLoading: boolean;
  handleRowClick: (transaction: IRequestDataWithEvents | undefined) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading, handleRowClick }) => {

  const getStatus = (state: string, expectedAmount: BigInt, balance: BigInt) => {
    if (balance >= expectedAmount) {
      return { status: 'Paid', icon: <span className="text-green-500">✔</span> };
    }
    switch (state) {
      case 'accepted':
        return { status: 'Accepted', icon: <span className="text-blue-500">✔</span> };
      case 'canceled':
        return { status: 'Canceled', icon: <span className="text-red-500">✖</span> };
      case 'created':
        return { status: 'Created', icon: <span className="text-yellow-500">⌛</span> };
      case 'pending':
        return { status: 'Pending', icon: <span className="text-yellow-500">⌛</span> };
      default:
        return { status: 'Unknown', icon: null };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
            {transactions.map((transaction) => {
              const { status, icon } = getStatus(
                transaction.state as string,
                BigInt(transaction.expectedAmount as string ?? '0'),
                BigInt(transaction.balance?.balance ?? 0)
              );
              return (
                <tr key={transaction.requestId} onClick={() => handleRowClick(transaction)}>
                  <td className="px-4 py-2 border">{transaction.payee?.value}</td>
                  <td className="px-4 py-2 border">{transaction.payer?.value}</td>
                  <td className="px-4 py-2 border">
                    {Number(formatUnits(
                      BigInt(transaction?.expectedAmount),
                      getDecimals(transaction.currencyInfo.network!, transaction.currencyInfo.value) ?? 18
                    ))}
                  </td>
                  <td className="px-4 py-2 border flex items-center">
                    {icon}
                    <span className="ml-2">{status}</span>
                  </td>
                  <td className="px-4 py-2 border">{new Date(transaction.timestamp * 1000).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;
