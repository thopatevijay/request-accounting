import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import TransactionList from '../components/TransactionList';

const Transactions: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Transactions</title>
        <meta name="description" content="Transactions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TransactionList />
    </DashboardLayout>
  );
};

export default Transactions;
