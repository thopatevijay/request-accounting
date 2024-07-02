import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Overview from '../components/Overview';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';
import Reports from '@/components/Reports';
import { useRequestContext } from '@/Providers/RequestProvider';

const Home: NextPage = () => {
  const { requests, isLoading } = useRequestContext();
  const [totalExpected, setTotalExpected] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (requests.length) {
      setRequestCount(requests.length);
      const totalExpectedAmount = requests.reduce((acc, request) => {
        const decimals = getDecimals(request.currencyInfo.network!, request.currencyInfo.value);
        const formattedAmount = parseFloat(formatUnits(BigInt(request.expectedAmount), decimals!));
        return acc + formattedAmount;
      }, 0);
      const totalReceivedAmount = requests.reduce(
        (acc, request) => acc + parseFloat(request.balance?.balance || '0'),
        0
      );
      setTotalExpected(totalExpectedAmount);
      setTotalReceived(totalReceivedAmount);
    }
  }, [requests]);

  return (
    <DashboardLayout>
      <Head>
        <title>Accounting Dashboard</title>
        <meta name="description" content="Accounting Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Overview
        totalExpected={totalExpected}
        totalReceived={totalReceived}
        requestCount={requestCount}
        isLoading={isLoading}
      />
      <Reports />
    </DashboardLayout>
  );
};

export default Home;
