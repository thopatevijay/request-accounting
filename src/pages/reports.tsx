import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Reports from '../components/Reports';

const ReportsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Reports</title>
        <meta name="description" content="Reports" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Reports />
    </DashboardLayout>
  );
};

export default ReportsPage;
