import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Overview from '../components/Overview';
import Notifications from '../components/Notifications';

const Home: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Accounting Dashboard</title>
        <meta name="description" content="Accounting Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Overview />
      <Notifications />
    </DashboardLayout>
  );
};

export default Home;
