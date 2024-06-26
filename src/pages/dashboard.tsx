import { NextPage } from 'next';
import Tabs from '../components/Tabs';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { useEffect, useState } from 'react'

// TODO
const userAddress = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";

const data = [
  {
    created: '2023-06-01',
    invoiceNo: 'INV-001',
    payee: 'John Doe',
    payer: 'Jane Smith',
    amount: '100 USDT',
    status: 'Pending'
  },
];

const renderTable = (requests: typeof data) => (
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
        {requests.map((request, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b border-gray-200">{request.created}</td>
            <td className="py-2 px-4 border-b border-gray-200">{request.invoiceNo}</td>
            <td className="py-2 px-4 border-b border-gray-200">{request.payee}</td>
            <td className="py-2 px-4 border-b border-gray-200">{request.payer}</td>
            <td className="py-2 px-4 border-b border-gray-200">{request.amount}</td>
            <td className="py-2 px-4 border-b border-gray-200">{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
  console.log(requests)
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Dashboard</h2>
      <Tabs labels={['All', 'Pay', 'Get Paid']}>
        <div>{renderTable(data)}</div>
        <div>{renderTable(data.filter(request => request.status === 'Pending'))}</div>
        <div>{renderTable(data.filter(request => request.status === 'Paid'))}</div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
