import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


import { Toaster } from 'sonner';
import { QueryProvider } from '../providers/query-provider';
import Navbar from '../components/navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentNest — Find Your Next Home',
  description: 'Browse and rent properties with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Navbar/>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}