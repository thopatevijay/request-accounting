import { copyToClipboard, getDecimals, truncateString } from '@/utils';
import { Types } from '@requestnetwork/request-client.js';
import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaHourglassStart, FaHourglassHalf, FaCopy } from 'react-icons/fa';
import { formatUnits } from "viem";

interface RequestTableProps {
    requests: (Types.IRequestDataWithEvents | undefined)[];
    excludeColumn?: string;
    handleRowClick: (id: string | undefined) => void;
}
interface StatusResult {
    status: string;
    icon: JSX.Element | null;
}

export const RequestsTable = ({ requests, excludeColumn, handleRowClick }: RequestTableProps): JSX.Element => {
    const getStatus = (state: string, expectedAmount: BigInt, balance: BigInt): StatusResult => {
        if (balance >= expectedAmount) {
            return { status: "Paid", icon: <FaCheckCircle className="text-green-500" /> };
        }
        switch (state) {
            case Types.RequestLogic.STATE.ACCEPTED:
                return { status: "Accepted", icon: <FaCheckCircle className="text-blue-500" /> };
            case Types.RequestLogic.STATE.CANCELED:
                return { status: "Canceled", icon: <FaTimesCircle className="text-red-500" /> };
            case Types.RequestLogic.STATE.CREATED:
                return { status: "Created", icon: <FaHourglassStart className="text-yellow-500" /> };
            case Types.RequestLogic.STATE.PENDING:
                return { status: "Pending", icon: <FaHourglassHalf className="text-yellow-500" /> };
            default:
                return { status: "Unknown", icon: null };
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b border-gray-200 text-left">CREATED</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">INVOICE NO</th>
                        {excludeColumn !== 'PAYEE' && <th className="py-2 px-4 border-b border-gray-200 text-left">PAYEE</th>}
                        {excludeColumn !== 'PAYER' && <th className="py-2 px-4 border-b border-gray-200 text-left">PAYER</th>}
                        <th className="py-2 px-4 border-b border-gray-200 text-left">EXPECTED AMOUNT</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, index) => {
                        const { status, icon } = getStatus(
                            request?.state as string,
                            BigInt(request?.expectedAmount as string),
                            BigInt(request?.balance?.balance ?? 0)
                        );
                        return (
                            <tr
                                key={index}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleRowClick(request?.requestId)}
                            >
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {request?.timestamp ? new Date(request.timestamp * 1000).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {truncateString(request?.requestId ?? '', 10)}
                                    <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.requestId ?? '') }} />
                                </td>
                                {excludeColumn !== 'PAYEE' && (
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {truncateString(request?.payee?.value ?? '', 10)}
                                        <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.payee?.value ?? '') }} />
                                    </td>
                                )}
                                {excludeColumn !== 'PAYER' && (
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {truncateString(request?.payer?.value ?? '', 10)}
                                        <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.payer?.value ?? '') }} />
                                    </td>
                                )}
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {formatUnits(
                                        BigInt(request?.expectedAmount as string),
                                        getDecimals(
                                            request!.currencyInfo.network!,
                                            request!.currencyInfo.value,
                                        ) ?? 18,
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 flex items-center">
                                    {icon}
                                    <span className="ml-2">{status}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};