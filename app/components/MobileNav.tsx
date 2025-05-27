"use client";

import { usePathname } from "next/navigation";
import { TableOfContents } from "lucide-react"
import Link from "next/link"
import { FaYoutube } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks } from "../constants/header";


const MobileNav = () => {
  const pathname = usePathname();
  const isAccessPage = pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/app') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger><TableOfContents /></SheetTrigger>
        <SheetContent className="bg-[#1E1E1E] text-white">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-white">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-3 p-3">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-white font-semibold px-6 rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://www.youtube.com/@imeptv"
              className="text-white font-semibold bg-red-500 px-6 rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-1"
              target="_blank"
            >
              <FaYoutube size={25} /> Ao vivo
            </Link>

            {!isAccessPage && (
              <>
                <div className="border-t border-gray-700 my-2 pt-2"></div>

                <Link
                  href="/dashboard"
                  className="text-white font-semibold bg-blue-600 px-6 rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-2"
                >
                  Acessar Sistema
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav