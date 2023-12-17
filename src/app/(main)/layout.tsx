import type { Metadata } from 'next';
import '../global.css';
import { Providers } from '../providers';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { GeistSans } from 'geist/font/sans';

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
          GeistSans.variable
        )}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
