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
  const [activeTab, setActiveTab] = useState('All');

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

  const renderTable = (requests: (Types.IRequestDataWithEvents | undefined)[], excludeColumn?: string) => (
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
                onClick={() => handleRowClick(request)}
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

  const payRequests = requests.filter(request => request?.payer?.value === userAddress);
  const getPaidRequests = requests.filter(request => request?.payee?.value === userAddress);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Dashboard</h2>
      <Tabs
        labels={['All', 'Pay', 'Get Paid']}
        onTabClick={(tab) => setActiveTab(tab)}
      >
        <div>{renderTable(requests)}</div>
        <div>{renderTable(payRequests, 'PAYER')}</div>
        <div>{renderTable(getPaidRequests, 'PAYEE')}</div>
      </Tabs>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRequest && (
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Invoice #{selectedRequest.requestId.slice(0, 8)}</h2>
              <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full">
                {getStatus(selectedRequest.state, BigInt(selectedRequest.expectedAmount), BigInt(selectedRequest.balance?.balance ?? 0)).status}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p><strong>Issued on:</strong> {new Date(selectedRequest.timestamp * 1000).toLocaleDateString()}</p>
                <p><strong>Due by:</strong> {new Date(selectedRequest.timestamp * 1000 + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between">
                <div className="w-1/2 pr-4">
                  <h3 className="text-lg font-bold mb-2">From:</h3>
                  <p className="mb-1 flex items-center"><strong>Address:</strong> {truncateString(selectedRequest?.payee?.value ?? '', 20)}
                    <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(selectedRequest?.payee?.value ?? '')} />
                  </p>
                  <p className="mb-1"><strong>Email:</strong> abc@gmail.com</p>
                  <p className="mb-1"><strong>Name:</strong> Vijay</p>
                  <p className="mb-1"><strong>Company:</strong> ABC</p>
                  <p className="mb-1"><strong>City:</strong> IND</p>
                  <p className="mb-1"><strong>Region:</strong> P</p>
                  <p className="mb-1"><strong>Postal Code:</strong> 412103</p>
                </div>
                <div className="w-1/2 pl-4">
                  <h3 className="text-lg font-bold mb-2">Billed to:</h3>
                  <p className="mb-1 flex items-center"><strong>Address:</strong> {truncateString(selectedRequest?.payer?.value ?? '', 20)}
                    <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(selectedRequest?.payer?.value ?? '')} />
                  </p>
                  <p className="mb-1"><strong>Email:</strong> xyz@gmail.com</p>
                  <p className="mb-1"><strong>Name:</strong> XYZ</p>
                  <p className="mb-1"><strong>Company:</strong> XYZ</p>
                  <p className="mb-1"><strong>City:</strong> IND</p>
                  <p className="mb-1"><strong>Region:</strong> P</p>
                  <p className="mb-1"><strong>Postal Code:</strong> 412105</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 py-4">
              <h3 className="text-lg font-bold mb-2">Payment Details:</h3>
              <p className="mb-1"><strong>Payment Chain:</strong> Sepolia</p>
              <p className="mb-1"><strong>Invoice Currency:</strong> USDC</p>
            </div>
            <div className="border-t border-gray-200 py-4">
              <h3 className="text-lg font-bold mb-2">Item Details:</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">DESCRIPTION</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">QTY</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">UNIT PRICE</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">DISCOUNT</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">TAX</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">Development</td>
                    <td className="py-2 px-4 border-b border-gray-200">1</td>
                    <td className="py-2 px-4 border-b border-gray-200">0.01</td>
                    <td className="py-2 px-4 border-b border-gray-200">0</td>
                    <td className="py-2 px-4 border-b border-gray-200">0</td>
                    <td className="py-2 px-4 border-b border-gray-200">0.01</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-200 py-4">
              <h3 className="text-lg font-bold mb-2">Memo:</h3>
              <p className="mb-1">Testing invoice</p>
            </div>
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
