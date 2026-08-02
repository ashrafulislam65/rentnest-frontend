import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/query-provider';
import { Navbar } from '../components/shared/Navbar';
import { Toaster } from 'sonner';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'RentNest — Find Your Next Home',
  description: 'Browse and rent properties with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}