import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import TransactionList from '../components/TransactionList';
import Tabs from '../components/Tabs';
import { useRequestNetwork } from '../hooks/useRequestNetwork';
import { useEffect, useState } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';

const Transactions: NextPage = () => {
  const { fetchAllRequests, isLoading, wallets } = useRequestNetwork();
  const [transactions, setTransactions] = useState<IRequestDataWithEvents[]>([]);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const requests = await fetchAllRequests();
      if (requests) {
        setTransactions(requests);
      }
    };

    fetchData();
  }, [fetchAllRequests]);

  const walletAddress = wallets?.accounts[0]?.address.toLowerCase();

  const allTransactions = transactions;
  const payRequests = transactions.filter((request) => request.payer?.value.toLowerCase() === walletAddress);
  const getPaidRequests = transactions.filter((request) => request.payee?.value.toLowerCase() === walletAddress);

  const filteredTransactions =
    activeTab === 'All' ? allTransactions : activeTab === 'Paid' ? payRequests : getPaidRequests;

  const searchedTransactions = filteredTransactions.filter((transaction) =>
    transaction.payee?.value.toLowerCase().includes(filter.toLowerCase()) ||
    transaction.payer?.value.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRowClick = (transaction: IRequestDataWithEvents | undefined) => {
    console.log('Transaction clicked:', transaction);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Transactions</title>
        <meta name="description" content="Transactions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="p-6">
        <input
          type="text"
          placeholder="Search by Payee or Payer"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <TransactionList
          transactions={searchedTransactions}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
