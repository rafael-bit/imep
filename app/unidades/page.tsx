import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const locations = [
	{
		id: 1,
		name: 'IMEP Sede',
		address: 'Av. Principal, 123 - Centro',
		city: 'São Paulo - SP',
		phone: '(11) 1234-5678',
		email: 'contato@imep.org',
		schedule: 'Domingo: 10h e 18h',
		image: '/locations/sede.jpg'
	},
	{
		id: 2,
		name: 'IMEP Zona Norte',
		address: 'Rua das Flores, 456 - Zona Norte',
		city: 'São Paulo - SP',
		phone: '(11) 8765-4321',
		email: 'zonanorte@imep.org',
		schedule: 'Domingo: 9h e 17h',
		image: '/locations/zona-norte.jpg'
	},
	{
		id: 3,
		name: 'IMEP Zona Sul',
		address: 'Av. dos Ipês, 789 - Zona Sul',
		city: 'São Paulo - SP',
		phone: '(11) 2345-6789',
		email: 'zonasul@imep.org',
		schedule: 'Domingo: 10h e 18h30',
		image: '/locations/zona-sul.jpg'
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