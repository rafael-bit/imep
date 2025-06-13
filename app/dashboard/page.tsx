'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Role } from '@/lib/types'
import { Calendar, Camera, Users, Music, FileText, Monitor, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
	const { user, canEdit } = useAuth()

	if (!user) {
		return <div className="text-center p-8 text-neutral-100">Carregando...</div>
	}

	// Configuração das ferramentas por papel
	const tools = [
		// Ferramentas de Mídia (MEDIA_CHURCH)
		{
			name: 'Agenda',
			description: 'Gerenciar eventos e compromissos',
			icon: <Calendar className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/agenda',
			roles: [Role.MEDIA_CHURCH],
			department: 'media',
			editPermission: 'agenda'
		},
		{
			name: 'Galeria',
			description: 'Gerenciar fotos e vídeos',
			icon: <Camera className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/galeria',
			roles: [Role.MEDIA_CHURCH],
			department: 'media',
			editPermission: 'galeria'
		},
		{
			name: 'Equipamentos',
			description: 'Gerenciar equipamentos da igreja',
			icon: <Monitor className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/equipamentos',
			roles: [Role.MEDIA_CHURCH],
			department: 'media',
			editPermission: 'equipamentos'
		},

		// Ferramentas de Louvor (WORSHIP_CHURCH)
		{
			name: 'Escala de Louvor',
			description: 'Gerenciar escala do ministério de louvor',
			icon: <Users className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/escala-louvor',
			roles: [Role.WORSHIP_CHURCH],
			department: 'worship',
			editPermission: 'escala-louvor'
		},
		{
			name: 'Músicas',
			description: 'Gerenciar repertório de músicas',
			icon: <Music className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/musicas',
			roles: [Role.WORSHIP_CHURCH],
			department: 'worship',
			editPermission: 'musicas'
		},

		// Ferramentas de Obreiros (WORKERS)
		{
			name: 'Escala de Obreiros',
			description: 'Gerenciar escala de obreiros',
			icon: <Users className="h-8 w-8 mb-2 text-primary" />,
			href: '/dashboard/escala-obreiros',
			roles: [Role.WORKERS],
			department: 'workers',
			editPermission: 'escala-obreiros'
		},

		// Acesso às ferramentas administrativas (apenas para admins)
		{
			name: 'Ferramentas de Administração',
			description: 'Acesso a todas as ferramentas administrativas',
			icon: <Settings className="h-8 w-8 mb-2 text-primary" />,
			href: '/admin-tools',
			roles: [Role.MASTER, Role.DEVELOPER],
			department: 'admin',
			adminOnly: true
		},
	]

	// Verifica se o usuário é admin, master ou developer
	const isAdmin = user.isAdmin || user.role === Role.MASTER || user.role === Role.DEVELOPER

	// Filtra as ferramentas com base no papel do usuário
	let filteredTools = []

	if (isAdmin) {
		// Administradores veem todas as ferramentas
		filteredTools = tools
	} else {
		// Usuários comuns veem apenas as ferramentas específicas do seu papel
		filteredTools = tools.filter(tool =>
			tool.roles.includes(user.role) &&
			(!tool.adminOnly) &&
			(!tool.editPermission || canEdit(tool.editPermission))
		)
	}

	// Determina qual é o departamento do usuário
	let userDepartment = ''
	let departmentTitle = ''

	switch (user.role) {
		case Role.MEDIA_CHURCH:
			userDepartment = 'media'
			departmentTitle = 'Mídia'
			break
		case Role.WORSHIP_CHURCH:
			userDepartment = 'worship'
			departmentTitle = 'Louvor'
			break
		case Role.WORKERS:
			userDepartment = 'workers'
			departmentTitle = 'Obreiros'
			break
		default:
			userDepartment = 'admin'
			departmentTitle = 'Administração'
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6 text-neutral-100">Dashboard</h1>

			<div className="mb-8">
				<Card className="bg-neutral-900 border-neutral-800">
					<CardHeader>
						<CardTitle className="text-xl text-neutral-100">
							Bem-vindo, {user.name || user.email}
						</CardTitle>
						<CardDescription>
							{user.isLeader ?
								`Você é líder do departamento de ${departmentTitle} com permissões para editar recursos.` :
								`Você tem acesso ao departamento de ${departmentTitle}.`
							}
						</CardDescription>
					</CardHeader>
				</Card>
			</div>

			{!isAdmin ? (
				// Para usuários comuns, mostra apenas as ferramentas do seu departamento
				<>
					<h2 className="text-2xl font-semibold mb-4 text-neutral-100">
						Ferramentas de {departmentTitle}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{filteredTools.map((tool, index) => (
							<Link key={index} href={tool.href}>
								<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-neutral-900 border-neutral-800">
									<CardHeader>
										<div className="flex flex-col items-center">
											{tool.icon}
											<CardTitle className="text-xl text-center text-neutral-100">{tool.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center">
											{tool.description}
										</CardDescription>
										{user.isLeader && canEdit(tool.editPermission) && (
											<div className="mt-3 text-center">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
													Permissão para editar
												</span>
											</div>
										)}
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</>
			) : (
				// Para administradores, mostra todas as ferramentas organizadas por departamento
				<>
					<h2 className="text-2xl font-semibold mb-4 text-neutral-100">Ferramentas de Mídia</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{tools.filter(tool => tool.department === 'media').map((tool, index) => (
							<Link key={index} href={tool.href}>
								<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-neutral-900 border-neutral-800">
									<CardHeader>
										<div className="flex flex-col items-center">
											{tool.icon}
											<CardTitle className="text-xl text-center text-neutral-100">{tool.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center">
											{tool.description}
										</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					<h2 className="text-2xl font-semibold mb-4 text-neutral-100">Ferramentas de Louvor</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{tools.filter(tool => tool.department === 'worship').map((tool, index) => (
							<Link key={index} href={tool.href}>
								<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-neutral-900 border-neutral-800">
									<CardHeader>
										<div className="flex flex-col items-center">
											{tool.icon}
											<CardTitle className="text-xl text-center text-neutral-100">{tool.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center">
											{tool.description}
										</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					<h2 className="text-2xl font-semibold mb-4 text-neutral-100">Ferramentas de Obreiros</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{tools.filter(tool => tool.department === 'workers').map((tool, index) => (
							<Link key={index} href={tool.href}>
								<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-neutral-900 border-neutral-800">
									<CardHeader>
										<div className="flex flex-col items-center">
											{tool.icon}
											<CardTitle className="text-xl text-center text-neutral-100">{tool.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center">
											{tool.description}
										</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					<h2 className="text-2xl font-semibold mb-4 text-neutral-100">Administração</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{tools.filter(tool => tool.department === 'admin').map((tool, index) => (
							<Link key={index} href={tool.href}>
								<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-neutral-900 border-neutral-800">
									<CardHeader>
										<div className="flex flex-col items-center">
											{tool.icon}
											<CardTitle className="text-xl text-center text-neutral-100">{tool.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-center">
											{tool.description}
										</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	)
} 