import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Integration from '../components/Integration';

const IntegrationPage: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Integration</title>
        <meta name="description" content="Integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Integration />
    </DashboardLayout>
  );
};

export default IntegrationPage;
