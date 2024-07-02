import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Statements from '../components/Statements';
import { useRequestContext } from '@/Providers/RequestProvider';

const StatementsPage: NextPage = () => {
  const { requests, isLoading } = useRequestContext();
  return (
    <DashboardLayout>
      <Head>
        <title>Statements</title>
        <meta name="description" content="Financial Statements" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Statements transactions={requests} isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default StatementsPage;
