import React from 'react';
import Link from 'next/link';
import { FaWallet } from 'react-icons/fa';
import { FiHome, FiFilePlus } from 'react-icons/fi';

const NavBar = (): JSX.Element => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-blue-600">InvoiceApp</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center">
            <FiHome className="mr-1 text-gray-600 hover:text-blue-600 flex items-center" />
            Dashboard
          </Link>
          <Link href="/create-invoice" className="text-gray-600 hover:text-blue-600 flex items-center">
            <FiFilePlus className="mr-1" />
            Create Invoice
          </Link>
        </div>
      </div>
      <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        <FaWallet />
        <span>Connect Wallet</span>
      </button>
    </nav>
  );
};

export default NavBar;
