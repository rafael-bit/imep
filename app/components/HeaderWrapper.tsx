'use client';

import { usePathname } from 'next/navigation';
import Image from "next/image"
import MainNav from "./MainNav"
import MobileNav from "./MobileNav"
import Link from "next/link"

const Header = () => {
	return (
		<header className="container mx-auto w-full flex items-center justify-between px-4 text-white font-roboto">
			<section className="flex gap-2 items-center p-4">
				<Link href="/">
					<Image src="/logo.png" alt="Logo Imep" className="w-10 h-10" width={60} height={60} />
				</Link>
			</section>
			<MainNav />
			<MobileNav />
		</header>
	)
}

export default function HeaderWrapper() {
	const pathname = usePathname();

	if (pathname?.startsWith('/app') || pathname?.startsWith('/auth')) {
		return null;
	}

	return <Header />;
}