import Link from "next/link";

export default function Hero() {
	return (
		<section
			className="w-full h-[101vh] bg-fixed bg-cover bg-center -mt-[4.3rem]"
			style={{ backgroundImage: "url('/hero-image.svg')" }}
		>

			<div className="relative z-10 w-full container mx-auto flex flex-col md:flex-row items-center md:items-end md:justify-between justify-end h-[80vh] text-white px-5 gap-10 md:gap-0">
				<h1 className="w-full md:w-3/5 lg:w-2/5 leading-[1.1] text-5xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg">
					Igreja Batista <span className="text-8xl">Regenere</span>
				</h1>
				<div className="w-full md:w-1/3 flex flex-col gap-4 pb-3">
					<Link href="/agenda" className="bg-white text-black border border-white px-6 py-2 rounded-md hover:bg-transparent hover:text-white transition-all duration-300 text-center">Nossas Agendas</Link>
					<Link href="/nossos-valores" className="border border-white px-6 py-2 rounded-md hover:bg-white bg-transparent hover:text-black text-white transition-all duration-300 text-center">Nossos Valores</Link>
				</div>
			</div>
		</section>
	);
};