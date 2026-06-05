import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = { title: 'TShop' };

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}