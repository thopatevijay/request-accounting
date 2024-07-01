import React from 'react';

interface OverviewProps {
  totalExpected: number;
  totalReceived: number;
  requestCount: number;
  isLoading: boolean;
}

const Overview: React.FC<OverviewProps> = ({ totalExpected, totalReceived, requestCount, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-lg">Total Amount Expected</p>
            <p className="text-2xl font-bold">${totalExpected.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-lg">Total Amount Received</p>
            <p className="text-2xl font-bold">${totalReceived.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <p className="text-lg">Number of Requests</p>
            <p className="text-2xl font-bold">{requestCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
