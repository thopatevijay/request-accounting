import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTachometerAlt, FaExchangeAlt, FaFileInvoiceDollar, FaChartBar, FaBell, FaPlug, FaFileAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';

interface Account {
  address: string,
}

const Sidebar = () => {
  const router = useRouter();

  const [{ wallet, connecting }, connect] = useConnectWallet()
  const [ethersProvider, setProvider] = useState<ethers.providers.Web3Provider | null>()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (wallet?.provider) {
      setAccount({
        address: wallet.accounts[0].address,
      })
    }
  }, [wallet])

  useEffect(() => {
    if (wallet?.provider) {
      console.log("wallet", wallet)
      setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'))
    }
  }, [connect, connecting, wallet])

  const handleConnectClick = async () => {
    try {
      const walletStates = await connect();
      console.log('Connected wallets:', walletStates);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FaTachometerAlt /> },
    { name: 'Transactions', path: '/transactions', icon: <FaExchangeAlt /> },
    { name: 'Invoices', path: '/invoices', icon: <FaFileInvoiceDollar /> },
    { name: 'Statements', path: '/statements', icon: <FaFileAlt /> },
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-all duration-300"
        disabled={!!connecting || !!wallet?.provider}
        onClick={handleConnectClick}
        >
          {account?.address ? "Connected" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
