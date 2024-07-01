import React, { useState, useEffect } from 'react';
import { useRequestNetwork } from '../hooks/useRequestNetwork';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { formatUnits } from 'viem';

const InvoiceManagement = () => {
  const { fetchAllRequests, isLoading } = useRequestNetwork();
  const [invoices, setInvoices] = useState<IRequestDataWithEvents[]>([]);
  const [newInvoice, setNewInvoice] = useState({ payee: '', amount: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      const requests = await fetchAllRequests();
      if (requests) {
        setInvoices(requests);
      }
    };

    fetchData();
  }, [fetchAllRequests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const handleCreateInvoice = async () => {
    console.log('Creating invoice:', newInvoice);
    setNewInvoice({ payee: '', amount: '', description: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Invoice Management</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New Invoice</h3>
        <div className="mb-4">
          <input
            type="text"
            name="payee"
            placeholder="Payee Address"
            value={newInvoice.payee}
            onChange={handleInputChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <input
            type="text"
            name="amount"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={handleInputChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newInvoice.description}
            onChange={handleInputChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <button
            onClick={handleCreateInvoice}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create Invoice
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Invoices</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Payee</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.requestId}>
                  <td className="px-4 py-2 border">{invoice.payee?.value}</td>
                  <td className="px-4 py-2 border">
                    {formatUnits(
                      BigInt(invoice.expectedAmount),
                      18
                    )}
                  </td>
                  <td className="px-4 py-2 border">{invoice.extensions?.['content-data']?.values?.content?.description ?? 'N/A'}</td>
                  <td className="px-4 py-2 border">{invoice.state}</td>
                  <td className="px-4 py-2 border">{new Date(invoice.timestamp * 1000).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
