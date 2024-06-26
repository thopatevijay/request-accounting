import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { FaCheckCircle, FaTimesCircle, FaHourglassStart, FaHourglassHalf, FaCopy } from 'react-icons/fa';
import { currencies } from "../utils/currency";
import { formatUnits } from "viem";
import jsPDF from 'jspdf';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';

const userAddress = "0xb9558F27C1484d7CD4E75f61D3174b6db39E23Cd";

const Dashboard: NextPage = () => {
  const [requests, setRequests] = useState<(Types.IRequestDataWithEvents | undefined)[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Types.IRequestDataWithEvents | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRowClick = (request: IRequestDataWithEvents | undefined) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice Details', 10, 10);
    doc.text(`Invoice ID: ${selectedRequest?.requestId}`, 10, 20);
    doc.text(`Payee: ${selectedRequest?.payee?.value}`, 10, 30);
    doc.text(`Payer: ${selectedRequest?.payer?.value}`, 10, 40);
    doc.text(`Amount: ${formatUnits(
      BigInt(selectedRequest?.expectedAmount as string),
      getDecimals(
        selectedRequest!.currencyInfo.network!,
        selectedRequest!.currencyInfo.value,
      ) ?? 18,
    )}`, 10, 50);
    doc.save('invoice.pdf');
  };

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
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(request)}
              >
                <td className="py-2 px-4 border-b border-gray-200">
                  {request?.timestamp ? new Date(request.timestamp * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.requestId ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.requestId ?? '') }} />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.payee?.value ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.payee?.value ?? '') }} />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {truncateString(request?.payer?.value ?? '', 10)}
                  <FaCopy className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(request?.payer?.value ?? '') }} />
                </td>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRequest && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
            <p><strong>Invoice ID:</strong> {selectedRequest?.requestId}</p>
            <p><strong>Payee:</strong> {selectedRequest?.payee?.value}</p>
            <p><strong>Payer:</strong> {selectedRequest?.payer?.value}</p>
            <p><strong>Amount:</strong>
              {formatUnits(
                BigInt(selectedRequest?.expectedAmount as string),
                getDecimals(
                  selectedRequest.currencyInfo.network!,
                  selectedRequest.currencyInfo.value,
                ) ?? 18,
              )}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
