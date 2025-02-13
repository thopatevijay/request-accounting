import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';
import { useRequestContext } from '@/Providers/RequestProvider';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Reports = () => {
  const { requests, isLoading } = useRequestContext();
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(new Array(12).fill(0));
  const [outstandingPayments, setOutstandingPayments] = useState<number[]>(new Array(12).fill(0));

  const monthlyRevenueRef = useRef<HTMLDivElement>(null);
  const outstandingPaymentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requests.length) {
      calculateReports(requests);
    }
  }, [requests]);

  const calculateReports = (requests: IRequestDataWithEvents[]) => {
    const revenue = new Array(12).fill(0);
    const outstanding = new Array(12).fill(0);

    requests.forEach((request) => {
      const date = new Date(request.timestamp * 1000);
      const month = date.getMonth();
      const amount = formatUnits(
        BigInt(request?.balance?.balance ?? 0),
        getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
      );
      const expectedAmount = formatUnits(
        BigInt(request?.expectedAmount),
        getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
      );

      revenue[month] += parseFloat(amount);
      outstanding[month] += parseFloat(expectedAmount) - parseFloat(amount);
    });

    setMonthlyRevenue(revenue);
    setOutstandingPayments(outstanding);
  };

  const downloadPDF = (chartRef: React.RefObject<HTMLDivElement>, title: string) => {
    const input = chartRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title}.pdf`);
      });
    }
  };

  const monthlyRevenueData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  const outstandingPaymentsData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Outstanding Payments',
        data: outstandingPayments,
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Reports and Analytics</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div ref={monthlyRevenueRef} className="relative">
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <Line data={monthlyRevenueData} />
            <FaDownload
              className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-blue-500"
              onClick={() => downloadPDF(monthlyRevenueRef, 'Monthly Revenue')}
            />
          </div>
          <div ref={outstandingPaymentsRef} className="relative">
            <h3 className="text-lg font-semibold mb-2">Outstanding Payments</h3>
            <Line data={outstandingPaymentsData} />
            <FaDownload
              className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-blue-500"
              onClick={() => downloadPDF(outstandingPaymentsRef, 'Outstanding Payments')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
