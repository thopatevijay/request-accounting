import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import InvoiceManagement from '../components/InvoiceManagement';

const Invoices: NextPage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Invoices</title>
        <meta name="description" content="Invoices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InvoiceManagement />
    </DashboardLayout>
  );
};

export default Invoices;
