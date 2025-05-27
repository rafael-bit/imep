'use client';

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "../constants/header";

const Footer = () => {
	return (
		<footer className="w-full flex justify-center items-center p-5 py-10 border-t border-neutral-700">
			<div className="sm:flex justify-around container mx-auto text-white">
				<ul className="p-5 sm:w-1/3">
					<li className="flex justify-center sm:justify-start items-center gap-2">
						<Image src={'/logo.png'} alt="Logo Imep" className="w-12 h-10" width={70} height={70} />
						<h1 className="text-3xl font-bold">IMEP</h1>
					</li>
					<li className="mt-5 hidden sm:inline-block text-sm"><p>A IMEP é uma comunidade cristã comprometida em viver e anunciar o amor de Jesus. Cremos na Palavra de Deus como verdade e buscamos diariamente uma vida guiada pelo Espírito Santo.</p></li>
					<li className="mt-5 sm:mt-10 text-center sm:text-left">
						<p>&copy; {new Date().getFullYear()} Igreja Missões do Evangelho Pleno.</p>
					</li>
				</ul>
				<ul className="w-full flex flex-col items-center justify-center sm:inline-block pt-7 sm:w-1/4">
					<li className="w-full"><h3 className="text-xl font-bold text-center sm:text-left">Nossas Sedes</h3></li>
					<ul className="my-5 text-sm">
						<li><p>Sede: Avenida Coronel Tiberio Meira, 447</p></li>
						<li><p>Sub-Sede: Rua Antônio Franscisco da Silva, 989</p></li>
						<li><p>Telefone: (77) 9 9965-0202</p></li>
					</ul>
					<Link href="/unidades" className="px-4 py-1 pb-1.5 text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">Nossas Unidades</Link>
				</ul>
				<ul className="hidden sm:flex flex-col items-end sm:w-1/3">
					<li><h3 className="mt-5 mb-3 text-xl font-bold">Navegue pelas páginas</h3></li>
					{navLinks.map((link, index) => (
						<li key={index}>
							<Link href={link.href} className="text-white rounded-full transition duration-300 cursor-pointer hover:scale-110 flex items-center gap-3 p-1 text-sm">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</footer>
	)
}

export default function FooterWrapper() {
	const pathname = usePathname();

	if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/app') || pathname?.startsWith('/auth') || pathname?.startsWith('/login')) {
		return null;
	}

	return <Footer />;
}