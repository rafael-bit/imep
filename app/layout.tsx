import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";

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
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}