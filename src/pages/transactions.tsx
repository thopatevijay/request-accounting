import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import TransactionList from '../components/TransactionList';
import Tabs from '../components/Tabs';
import { useState } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { useRequestContext } from '@/Providers/RequestProvider';
import { useRequestNetwork } from '@/hooks';

const Transactions: NextPage = () => {
  const { requests, isLoading } = useRequestContext();
  const { wallets } = useRequestNetwork();
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const walletAddress = wallets?.accounts[0]?.address.toLowerCase();

  const allTransactions = requests;
  const payRequests = requests.filter((request) => request.payer?.value.toLowerCase() === walletAddress);
  const getPaidRequests = requests.filter((request) => request.payee?.value.toLowerCase() === walletAddress);

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
