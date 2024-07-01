import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTachometerAlt, FaExchangeAlt, FaFileInvoiceDollar, FaChartBar, FaBell, FaPlug } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FaTachometerAlt /> },
    { name: 'Transactions', path: '/transactions', icon: <FaExchangeAlt /> },
    { name: 'Invoices', path: '/invoices', icon: <FaFileInvoiceDollar /> },
    { name: 'Reports', path: '/reports', icon: <FaChartBar /> },
    { name: 'Notifications', path: '/notifications', icon: <FaBell /> },
    { name: 'Integration', path: '/integration', icon: <FaPlug /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed transition-all duration-300 md:w-1/4 lg:w-1/6 flex flex-col justify-between">
      <div>
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Menu</h2>
        </div>
        <ul className="mt-4">
          {menuItems.map((item) => (
            <li key={item.name} className={`flex items-center p-4 hover:bg-gray-700 ${router.pathname === item.path ? 'bg-gray-700' : ''}`}>
              <span className="mr-3">{item.icon}</span>
              <Link href={item.path} className="block transition-all duration-300">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-all duration-300">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
