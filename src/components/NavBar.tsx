import React from 'react';
import Link from 'next/link';
import { FaWallet } from 'react-icons/fa';
import { FiHome, FiFilePlus } from 'react-icons/fi';
import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
interface Account {
  address: string,
}


const NavBar = (): JSX.Element => {
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
      <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        disabled={!!connecting || !!wallet?.provider}
        onClick={handleConnectClick}
      >
        <FaWallet />
        <span>{account?.address ?? "Connect Wallet"}</span>
      </button>
    </nav>
  );
};

export default NavBar;
