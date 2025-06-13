import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import HeaderWrapper from './components/Header';
import FooterWrapper from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Igreja Batista Regenere",
  description: "Site oficial da Igreja Batista Regenere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <HeaderWrapper />
          {children}
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}