import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Sidebar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
