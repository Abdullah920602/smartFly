import React from 'react';
import MainNavbar from './MainNavbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <MainNavbar />
      <main style={{ paddingTop: '0' }}>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
