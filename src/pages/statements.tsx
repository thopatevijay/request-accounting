import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Statements from '../components/Statements';
import { useRequestNetwork } from '../hooks/useRequestNetwork';
import { useEffect, useState } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';

const StatementsPage: NextPage = () => {
  const { fetchAllRequests, isLoading } = useRequestNetwork();
  const [transactions, setTransactions] = useState<IRequestDataWithEvents[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const requests = await fetchAllRequests();
      if (requests) {
        setTransactions(requests);
      }
    };

    fetchData();
  }, [fetchAllRequests]);

  return (
    <DashboardLayout>
      <Head>
        <title>Statements</title>
        <meta name="description" content="Financial Statements" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Statements transactions={transactions} isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default StatementsPage;
