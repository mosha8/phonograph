import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'phonograph',
  description:
    'phonograph is a media player  application that plays audio. built experimentally and for fun.',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
