'use client';
import type { ReactNode } from 'react';

import Footer from '@features/Footer';
import Header from '@features/Header';
import ClientProvider from '@lib/client/react-query-provider';
import '@styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isPathnameAuthPages = pathname === '/signin' || pathname === '/signup';

  return (
    <html lang="en" title="phonograph">
      <head>
        <meta
          name="description"
          content={`Phonograph is a web application developed primarily for practicing purposes.
            It's an app to explore songs, albums and artists.`}
        />
      </head>
      <body>
        <SessionProvider>
          {!isPathnameAuthPages && <Header />}
          <main>
            <ClientProvider>
              <ToastContainer />
              {children}
            </ClientProvider>
          </main>
          <div className="relative">{!isPathnameAuthPages && <Footer />}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
