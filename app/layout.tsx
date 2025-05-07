import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "./components/Header";
import { Providers } from "./components/Providers";
import FooterWrapper from "./components/Footer";
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/contexts/auth-context';
export const metadata: Metadata = {
  title: "IMEP - Igreja Missões do Evangelho Pleno",
  description: "Site oficial da Igreja Missões do Evangelho Pleno",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased font-sans bg-[#121212]">
        <AuthProvider>
          <Toaster richColors position="top-center" />
          <Providers>
            <HeaderWrapper />
            {children}
            <FooterWrapper />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}