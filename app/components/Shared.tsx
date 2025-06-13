import Link from "next/link";
import { FaYoutube, FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

export default function Shared() {
	return (
		<section className="text-white">
			<div className="bg-[#121212] bg-cover bg-center w-full p-10 flex flex-col items-center">
				<div className="py-16 px-5 border border-neutral-800 rounded-xl frosted-glass flex items-center justify-around gap-10 w-10/12">
					<div className="flex flex-col gap-3 w-1/3">
						<h5 className="font-bold">Conheça a Regenere</h5>
						<h1 className="text-3xl font-bold">Impactando vidas com amor e fé</h1>
						<p className="text-sm">A Regenere é uma comunidade cristã acolhedora, comprometida em transformar vidas por meio do amor, da fé e da Palavra de Deus. Nosso propósito é levar esperança, fortalecer famílias e construir uma jornada de fé autêntica. Acompanhe nossos cultos, eventos especiais, mensagens edificantes e tudo que Deus tem feito em nossa igreja através das redes sociais. Juntos, seguimos firmes na missão de impactar vidas e espalhar o amor de Cristo.</p>
					</div>
					<div className="w-1/3">
						<div className="flex flex-col gap-5">
							<Link href="https://www.youtube.com/@imeptv/videos" className="border border-white px-6 py-2 rounded-md hover:bg-white bg-transparent hover:text-black text-white transition-all duration-300 text-center" target="_blank">Assista nossos vídeos</Link>
							<Link href="" className="bg-white text-black border border-white px-6 py-2 rounded-md hover:bg-transparent hover:text-white transition-all duration-300 text-center">Ouça uma mensagem </Link>
							<div className="border-b border-neutral-500"></div>
							<span className="text-sm"><b>Nunca esqueca a palavra de Deus.</b> Siga-nos nas redes sociais para ficar por dentro de tudo o que acontece na igreja.</span>
							<div className="flex justify-center items-center gap-5">
								<Link href="https://www.youtube.com/@imeptv"><FaYoutube className="size-9" /></Link>
								<Link href="https://www.instagram.com/regenere.central"><AiFillInstagram className="size-8" /></Link>
								<Link href="https://www.facebook.com/imeptv/"><FaFacebookSquare className="size-8" /></Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
