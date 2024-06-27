import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import { Types } from '@requestnetwork/request-client.js';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { useRequestNetwork } from '@/hooks';
import { LoadingModal, RequestsTable } from '@/components';

const Dashboard: NextPage = () => {
  const [allRequests, setAllRequests] = useState<IRequestDataWithEvents[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Types.IRequestDataWithEvents | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { wallets, fetchAllRequests, isLoading } = useRequestNetwork();

  useEffect(() => {
    const fetchAll = async () => {
      const allRequests = await fetchAllRequests();
      setAllRequests(allRequests ?? []);
    }
    if (wallets?.accounts[0].address) {
      fetchAll();
    }
  }, [fetchAllRequests, wallets?.accounts]);

  const handleRowClick = async (request: IRequestDataWithEvents | undefined) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const walletAddress = wallets?.accounts[0].address.toLowerCase();

  const payRequests = allRequests.filter((request) => {
    return request?.payer?.value.toLowerCase() === walletAddress;
  });

  const getPaidRequests = allRequests.filter((request) => {
    return request?.payee?.value.toLowerCase() === walletAddress;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Dashboard</h2>
      <LoadingModal isLoading={isLoading} />
      <Tabs
        labels={['All', 'Pay', 'Get Paid']}
        onTabClick={(tab) => setActiveTab(tab)}
      >
        <div>
          <RequestsTable
            requests={allRequests}
            excludeColumn={undefined}
            handleRowClick={handleRowClick}
          />
        </div>
        <div>
          <RequestsTable
            requests={payRequests}
            excludeColumn={'PAYER'}
            handleRowClick={handleRowClick}
          />
        </div>
        <div>
          <RequestsTable
            requests={getPaidRequests}
            excludeColumn={'PAYEE'}
            handleRowClick={handleRowClick}
          />
        </div>
      </Tabs>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
      />
    </div>
  );
};

export default Dashboard;
