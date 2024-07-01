import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Notifications from '../components/Notifications';

const NotificationsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Notifications</title>
        <meta name="description" content="Notifications" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Notifications />
    </DashboardLayout>
  );
};

export default NotificationsPage;
