import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-6 ml-64 transition-all duration-300">
        {/* <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-semibold">Accounting Dashboard</h1>
        </header> */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
