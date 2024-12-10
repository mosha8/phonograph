import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import ClientProvider from '@lib/client/react-query-provider';
import '@styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'phonograph',
  description: `
  Phonograph is a web application developed primarily for practicing purposes.
  It serves as a platform to explore audio playback functionalities.
  `,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <main>
          <ClientProvider>
            <ToastContainer />
            {children}
          </ClientProvider>
        </main>
      </body>
    </html>
  );
}
