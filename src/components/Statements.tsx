import React, { useState, useRef } from 'react';
import { FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import StatementsTabs from './StatementsTabs';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';

interface StatementsProps {
  transactions: IRequestDataWithEvents[];
  isLoading: boolean;
}

const Statements: React.FC<StatementsProps> = ({ transactions, isLoading }) => {
  const [activeTab, setActiveTab] = useState('Income Statement');
  const statementRef = useRef<HTMLDivElement>(null);

  const totalIncome = transactions.reduce((acc, request) => {
    const balance = parseFloat(formatUnits(
      BigInt(request?.balance?.balance ?? 0),
      getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
    ));
    return acc + balance;
  }, 0);

  const totalOutstanding = transactions.reduce((acc, request) => {
    const balance = parseFloat(formatUnits(
      BigInt(request?.balance?.balance ?? 0),
      getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
    ));
    const expected = parseFloat(formatUnits(
      BigInt(request?.expectedAmount),
      getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
    ));
    return acc + (expected - balance);
  }, 0);

  const totalExpenses = totalOutstanding;
  const totalAssets = totalIncome;
  const totalLiabilities = totalOutstanding;
  const totalEquity = totalAssets - totalLiabilities;
  const netCashFlow = totalIncome - totalExpenses;

  const downloadPDF = () => {
    const input = statementRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${activeTab}.pdf`);
      });
    }
  };

  const renderIncomeStatement = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-4" ref={statementRef}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">Income Statement</h3>
        <FaDownload className="cursor-pointer" onClick={downloadPDF} />
      </div>
      <div className="flex justify-between mb-2">
        <span>Total Income:</span>
        <span>${totalIncome.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Total Expenses:</span>
        <span>${totalExpenses.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Net Income:</span>
        <span>${(totalIncome - totalExpenses).toFixed(2)}</span>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-4" ref={statementRef}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">Balance Sheet</h3>
        <FaDownload className="cursor-pointer" onClick={downloadPDF} />
      </div>
      <div className="flex justify-between mb-2">
        <span>Total Assets:</span>
        <span>${totalAssets.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Total Liabilities:</span>
        <span>${totalLiabilities.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total Equity:</span>
        <span>${totalEquity.toFixed(2)}</span>
      </div>
    </div>
  );

  const renderCashFlowStatement = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-4" ref={statementRef}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">Cash Flow Statement</h3>
        <FaDownload className="cursor-pointer" onClick={downloadPDF} />
      </div>
      <div className="flex justify-between mb-2">
        <span>Net Cash Flow:</span>
        <span>${netCashFlow.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Financial Statements</h2>
      <StatementsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {activeTab === 'Income Statement' && renderIncomeStatement()}
          {activeTab === 'Balance Sheet' && renderBalanceSheet()}
          {activeTab === 'Cash Flow Statement' && renderCashFlowStatement()}
        </>
      )}
    </div>
  );
};

export default Statements;
