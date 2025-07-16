'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
} 