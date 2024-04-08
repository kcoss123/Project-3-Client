import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="min-h-screen items-center justify-start px-4 sm:px-6 lg:px-8">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;