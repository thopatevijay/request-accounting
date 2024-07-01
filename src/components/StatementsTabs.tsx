import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StatementsTabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['Income Statement', 'Balance Sheet', 'Cash Flow Statement'];

  return (
    <div className="flex border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-2 px-4 ${
            activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : ''
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default StatementsTabs;
