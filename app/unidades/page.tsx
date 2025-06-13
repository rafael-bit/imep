import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const locations = [
	{
		id: 1,
		name: 'Igreja Batista Regenere Sede',
		address: 'Av. Coronel Tiberio Meira, 447 - Centro',
		city: 'Brumado - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 18h 30min, Terça - 19h 30min, Sábado - 18h 30min',
		image: '/locations/sede.jpg'
	},
	{
		id: 2,
		name: 'Igreja Batista Regenere Sub-Sede',
		address: 'Rua Antônio Francisco da Silva, 989 - Olhos D\'Água',
		city: 'Brumado - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 18h 30min, Terça - 19h 30min, Quarta - 19h 30min',
		image: '/locations/subsede.jpg'
	},
	{
		id: 3,
		name: 'Igreja Batista Regenere Das Flores',
		address: 'Rua João XXIII, 274 - Das Flores',
		city: 'Brumado - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 18h 30min, Terça - 19h 30min',
		image: '/locations/flores.jpg'
	},
	{
		id: 4,
		name: 'Igreja Batista Regenere Baraúnas',
		address: 'Av. Brasil, 52 - Baraúnas',
		city: 'Brumado - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 18h 30min, Terça - 19h 30min',
		image: '/locations/baraunas.jpg'
	},
	{
		id: 5,
		name: 'Igreja Batista Regenere São Felix',
		address: 'Rua Elías Barbosa, 26 - São Felix',
		city: 'Brumado - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 18h 30min, Terça - 19h 30min',
		image: '/locations/saofelix.jpg'
	},
	{
		id: 6,
		name: 'Igreja Batista Regenere Uberaba',
		address: 'Rua João Batista J. Gonçalves, 500 - Uberaba',
		city: 'Uberaba - MG',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 19h 30min, Terça - 19h 30min, Quarta - 19h 30min, Sexta - 19h 30min, Sábado - 19h 30min',
		image: '/locations/zona-sul.jpg'
	},
	{
		id: 7,
		name: 'Igreja Batista Regenere Suzano',
		address: 'Av. Senador Roberto Simonsen, 1351 - Suzano',
		city: 'Suzano - SP',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 19h, Terça - 19h 30min, Quarta - 19h 30min, Sábado - 19h 30min',
		image: '/locations/suzano.jpg'
	},
	{
		id: 8,
		name: 'Igreja Batista Regenere Caetite',
		address: 'Rua Paramirim, 283 - Caetite',
		city: 'Caetite - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 19h 30min, Quinta - 19h 30min',
		image: '/locations/zona-sul.jpg'
	},
	{
		id: 9,
		name: 'Igreja Batista Regenere Guanambi',
		address: 'Av. Santos Dumont, S/N - Guanambi',
		city: 'Guanambi - BA',
		phone: '(77) 9 9965-0202',
		email: 'imepsede@gmail.com',
		schedule: 'Domingo - 19h 30min, Quinta - 19h 30min',
		image: '/locations/guanambi.jpg'
	}
];

export default function Unidades() {
	return (
		<div className="min-h-screen bg-[#121212] text-white py-16 px-4">
			<div className="container mx-auto max-w-6xl">
				<h1 className="text-4xl font-bold text-center mb-16">Nossas Unidades</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{locations.map((location) => (
						<Card key={location.id} className="bg-neutral-900 border-neutral-800 text-white overflow-hidden hover:border-primary transition-all duration-300">
							<div className="relative h-48 w-full">
								<Image
									src={location.image}
									alt={location.name}
									fill
									className="object-cover"
								/>
							</div>
							<CardHeader>
								<CardTitle>{location.name}</CardTitle>
								<CardDescription className="text-gray-400">{location.city}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm">
									<p className="text-gray-300">{location.address}</p>
									<p className="text-gray-300">📱 {location.phone}</p>
									<p className="text-gray-300">✉️ {location.email}</p>
									<p className="text-gray-300 font-medium mt-4">Horários de Culto:</p>
									<p className="text-gray-300">{location.schedule}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mt-16 text-center">
					<h2 className="text-2xl font-semibold mb-4">Entre em Contato</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Para mais informações sobre nossas unidades, horários de funcionamento,
						ou como chegar, entre em contato conosco por telefone ou email.
					</p>
				</div>
			</div>
		</div>
	);
}