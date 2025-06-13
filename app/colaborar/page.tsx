import Image from "next/image"

export default function Colaborar() {
	return (
		<section className='text-white container mx-auto px-4'>
			<h1 className='text-2xl font-semibold text-center my-10'>Colabore conosco</h1>
			<div className="flex flex-col md:flex-row items-center">
				<div className="w-full md:w-1/2 flex flex-col items-center">
					<Image src="/logo.png" alt="Regenere logo" width={50} height={50} className="mb-5" />
					<h2 className="text-2xl mb-8"><b>Você pode ofertar</b> por:</h2>

					<div className="relative my-1 w-full max-w-md mb-7">
						<div className="absolute inset-0 flex items-center">
							<span className="w-3/4 border-t border-gray-500"></span>
							<span className="w-1/4 ml-auto border-t border-gray-500"></span>
						</div>
						<div className="relative flex justify-center">
							<span className="bg-[#121212] px-4 text-3xl font-bold tracking-wider">
								<span className="py-1 rounded">PIX</span>
							</span>
						</div>
					</div>

					<div className="text-center">
						<p className="text-xl mb-2">CNPJ</p>
						<p className="text-2xl font-semibold mb-4">05.745.949/0001-34</p>

						<p className="text-xl mb-5">Ou aponte a câmera para o QR Code</p>
						<div className="bg-white p-2 rounded-lg inline-block mb-10">
							<Image src="/qrcode.png" alt="QR Code" width={200} height={200} />
						</div>
					</div>
				</div>

				<div className="w-full md:w-1/2 mt-10 md:mt-0 flex flex-col items-center mb-10">
					<h2 className="text-2xl mb-8"><b>Informações bancárias:</b></h2>

					<div className="bg-black/30 rounded-lg p-6 w-full max-w-md">
						<p className="mb-4"><span className="font-bold">Banco:</span> Caixa Econômica Federal</p>
						<p className="mb-4"><span className="font-bold">Agência:</span> 0947</p>
						<p className="mb-4"><span className="font-bold">Conta:</span> 578331085-5</p>
						<p className="mb-4"><span className="font-bold">CNPJ:</span> 05.745.949/0001-34</p>
						<p><span className="font-bold">Favorecido:</span> Igreja Batista Regenere</p>
					</div>
				</div>
			</div>
		</section>
	)
}
