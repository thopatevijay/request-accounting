import React, { ReactNode } from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <NavBar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
