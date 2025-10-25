import { HeaderWidget as Header } from '../Header/Header';
import { FooterWidget as Footer } from '../Footer/Footer';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
