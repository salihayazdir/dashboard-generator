import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { Providers } from './providers';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Generator',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='tr'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
