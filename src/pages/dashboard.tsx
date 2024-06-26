import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { FaCheckCircle, FaTimesCircle, FaHourglassStart, FaHourglassHalf, FaCopy } from 'react-icons/fa';
import { currencies } from "../utils/currency";
import { formatUnits } from "viem";

const userAddress = "0xb9558F27C1484d7CD4E75f61D3174b6db39E23Cd";

const Dashboard: NextPage = () => {
  const [requests, setRequests] = useState<(Types.IRequestDataWithEvents | undefined)[]>([]);

  const fetchRequests = async () => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://gnosis.gateway.request.network",
      },
    });

    try {
      const fetchedRequests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: userAddress,
      });

      const requestData = await Promise.all(
        fetchedRequests.map(async (request) => await request.getData())
      );

      setRequests(requestData);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  interface StatusResult {
    status: string;
    icon: JSX.Element | null;
  }

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
  const truncateString = (str: string, length: number): string => {
    return str.length > length ? `${str.slice(0, length / 2)}...${str.slice(-length / 2)}` : str;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const getDecimals = (network: string, value: string) => {
    return currencies.get(network.concat("_", value))?.decimals;
  };

  const renderTable = (requests: (Types.IRequestDataWithEvents | undefined)[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-200 text-left">CREATED</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">INVOICE NO</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">PAYEE</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">PAYER</th>
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
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">
                  {request?.timestamp ? new Date(request.timestamp * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.requestId ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(request?.requestId ?? '')} />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.payee?.value ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(request?.payee?.value ?? '')} />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.payer?.value ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(request?.payer?.value ?? '')} />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {formatUnits(
                    BigInt(request?.expectedAmount as number),
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

  const payRequests = requests.filter(request => request?.payer?.value === userAddress);
  const getPaidRequests = requests.filter(request => request?.payee?.value === userAddress);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Dashboard</h2>
      <Tabs labels={['All', 'Pay', 'Get Paid']}>
        <div>{renderTable(requests)}</div>
        <div>{renderTable(payRequests)}</div>
        <div>{renderTable(getPaidRequests)}</div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
