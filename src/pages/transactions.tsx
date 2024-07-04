import type { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import TransactionList from '../components/TransactionList';
import Tabs from '../components/Tabs';
import { useState, useRef } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { useRequestContext } from '@/Providers/RequestProvider';
import { useRequestNetwork } from '@/hooks';
import { FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Transactions: NextPage = () => {
  const { requests, isLoading } = useRequestContext();
  const { wallets } = useRequestNetwork();
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const transactionListRef = useRef<HTMLDivElement>(null);

  const walletAddress = wallets?.accounts[0]?.address.toLowerCase();

  const allTransactions = requests;
  const payRequests = requests.filter((request) => request.payer?.value.toLowerCase() === walletAddress);
  const getPaidRequests = requests.filter((request) => request.payee?.value.toLowerCase() === walletAddress);

  const filteredTransactions =
    activeTab === 'All' ? allTransactions : activeTab === 'Paid' ? payRequests : getPaidRequests;

  const searchedTransactions = filteredTransactions.filter((transaction) =>
    transaction.payee?.value.toLowerCase().includes(filter.toLowerCase()) ||
    transaction.payer?.value.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRowClick = (transaction: IRequestDataWithEvents | undefined) => {
    console.log('Transaction clicked:', transaction);
  };

  const downloadPDF = () => {
    const input = transactionListRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Transactions-${activeTab}.pdf`);
      });
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Transactions</title>
        <meta name="description" content="Transactions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="p-6">
        <input
          type="text"
          placeholder="Search by Payee or Payer"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
        <div className="flex justify-between items-center mb-4">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <FaDownload className="cursor-pointer text-blue-500" onClick={downloadPDF} />
        </div>
        <div ref={transactionListRef}>
          <TransactionList
            transactions={searchedTransactions}
            isLoading={isLoading}
            handleRowClick={handleRowClick}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
