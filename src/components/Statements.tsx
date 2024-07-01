import React, { useState } from 'react';
import Tabs from './Tabs';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import StatementsTabs from './StatementsTabs';
import { formatUnits } from 'viem';
import { getDecimals } from '@/utils';

interface StatementsProps {
    transactions: IRequestDataWithEvents[];
    isLoading: boolean;
}

const Statements: React.FC<StatementsProps> = ({ transactions, isLoading }) => {
    const [activeTab, setActiveTab] = useState('Income Statement');

    //   const amount = formatUnits(
    //     BigInt(request?.balance?.balance ?? 0),
    //     getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
    //   );
    //   const expectedAmount = formatUnits(
    //     BigInt(request?.expectedAmount),
    //     getDecimals(request.currencyInfo.network!, request.currencyInfo.value) ?? 18
    //   );

    //   const totalIncome = transactions.reduce((acc, request) => acc + parseFloat(request.balance?.balance || '0'), 0);
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

    const renderIncomeStatement = () => (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Income Statement</h3>
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
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Balance Sheet</h3>
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
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Cash Flow Statement</h3>
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
