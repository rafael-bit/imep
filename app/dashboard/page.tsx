'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Music, Calendar, Image, Users, HardDrive, Video } from 'lucide-react'
import { usePermission } from '@/lib/hooks/usePermission'

export default function DashboardPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { hasPermission } = usePermission()

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status, router])

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center min-h-[80vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		)
	}

	const cards = [
		{
			title: 'Galeria',
			description: 'Gerenciar imagens e álbuns',
			icon: <Image className="h-8 w-8 text-primary" />,
			href: '/dashboard/galeria',
			permission: 'GALLERY_VIEW'
		},
		{
			title: 'Escala de Mídia',
			description: 'Organizar equipe de transmissão e fotos',
			icon: <Video className="h-8 w-8 text-primary" />,
			href: '/dashboard/escala-midia',
			permission: 'MEDIA_SCHEDULE_VIEW'
		},
		{
			title: 'Repertório',
			description: 'Gerenciar músicas e cifras',
			icon: <Music className="h-8 w-8 text-primary" />,
			href: '/dashboard/repertorio',
			permission: 'SONG_VIEW'
		},
		{
			title: 'Escala de Louvor',
			description: 'Organizar músicos e vocais',
			icon: <Calendar className="h-8 w-8 text-primary" />,
			href: '/dashboard/escala-louvor',
			permission: 'WORSHIP_SCHEDULE_VIEW'
		},
		{
			title: 'Escala de Obreiros',
			description: 'Gerenciar equipe de apoio',
			icon: <Users className="h-8 w-8 text-primary" />,
			href: '/dashboard/escala-obreiros',
			permission: 'WORKER_SCHEDULE_VIEW'
		},
		{
			title: 'Equipamentos',
			description: 'Controlar inventário técnico',
			icon: <HardDrive className="h-8 w-8 text-primary" />,
			href: '/dashboard/equipamentos',
			permission: 'EQUIPMENT_VIEW'
		},
	]

	const filteredCards = cards.filter(card =>
		hasPermission(card.permission as any)
	)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-white mb-2">Bem-vindo, {session?.user?.name}!</h1>
				<p className="text-gray-400">Acesse os módulos do sistema abaixo</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredCards.map((card, index) => (
					<Card
						key={index}
						className="bg-gray-900 border-gray-800 hover:border-primary transition-all cursor-pointer"
						onClick={() => router.push(card.href)}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-xl font-bold text-white">{card.title}</CardTitle>
							{card.icon}
						</CardHeader>
						<CardContent>
							<p className="text-gray-400">{card.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
} 