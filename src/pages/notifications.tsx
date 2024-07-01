import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import Notifications from '../components/Notifications';
import { useRequestNetwork } from '../hooks/useRequestNetwork';
import { useEffect, useState } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';

const NotificationsPage: NextPage = () => {
  const { fetchAllRequests, isLoading } = useRequestNetwork();
  const [notifications, setNotifications] = useState<{ message: string; type: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const requests = await fetchAllRequests();
      if (requests) {
        generateNotifications(requests);
      }
    };

    fetchData();
  }, [fetchAllRequests]);

  const generateNotifications = (requests: IRequestDataWithEvents[]) => {
    const newNotifications: { message: string; type: string }[] = [];
    const now = new Date().getTime() / 1000;

    requests.forEach((request) => {
      const dueDate = new Date(request.extensions['content-data']?.values?.content?.dueDate || 0).getTime() / 1000;
      const amountPaid = parseFloat(formatUnits(
        BigInt(request?.balance?.balance ?? 0),
        getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
      ));

      const amountExpected = parseFloat(formatUnits(
        BigInt(request?.expectedAmount),
        getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
      ));

      if (amountPaid >= amountExpected) {
        newNotifications.push({
          message: `Payment of ${amountPaid} received from ${request.payer?.value}`,
          type: 'success',
        });
      } else if (dueDate && dueDate < now) {
        newNotifications.push({
          message: `Payment of ${amountExpected - amountPaid} is overdue from ${request.payer?.value}`,
          type: 'warning',
        });
      } else if (dueDate && dueDate - now < 7 * 24 * 60 * 60) {
        newNotifications.push({
          message: `Payment of ${amountExpected - amountPaid} is due soon from ${request.payer?.value}`,
          type: 'info',
        });
      }
    });

    setNotifications(newNotifications);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Notifications</title>
        <meta name="description" content="Notifications and Alerts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Notifications notifications={notifications} isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default NotificationsPage;
