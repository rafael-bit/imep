"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="relative z-50 w-full">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-white font-roboto">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo Imep"
            className="w-10 h-9"
            width={60}
            height={60}
          />
        </Link>
        <MainNav />
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Acessar Sistema
            </Button>
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
};

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/app') || pathname?.startsWith('/auth') || pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null;
  }

  return <Header />;
}