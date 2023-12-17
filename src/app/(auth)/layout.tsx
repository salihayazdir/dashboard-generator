import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '../global.css';
import { Providers } from '../providers';
import { cn } from '@/lib/utils';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
