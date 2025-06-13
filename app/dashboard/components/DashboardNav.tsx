'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Role, SafeUser } from '@/lib/types';
import {
	HomeIcon,
	Calendar,
	Image,
	Music,
	UserSquare2,
	Settings,
	Wrench,
	Menu,
	X,
	LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';

type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	roles: Role[];
	department: 'general' | 'media' | 'worship' | 'workers' | 'admin';
	requiresEditPermission?: boolean;
};

const navItems: NavItem[] = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: <HomeIcon className="h-5 w-5" />,
		roles: [Role.MEDIA_CHURCH, Role.WORSHIP_CHURCH, Role.WORKERS, Role.MASTER, Role.DEVELOPER],
		department: 'general'
	},

	// Mídia
	{
		label: 'Agendas',
		href: '/dashboard/agendas',
		icon: <Calendar className="h-5 w-5" />,
		roles: [Role.MEDIA_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'media',
		requiresEditPermission: true
	},
	{
		label: 'Galeria',
		href: '/dashboard/galeria',
		icon: <Image className="h-5 w-5" />,
		roles: [Role.MEDIA_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'media',
		requiresEditPermission: true
	},
	{
		label: 'Escala de Mídia',
		href: '/dashboard/escala-midia',
		icon: <UserSquare2 className="h-5 w-5" />,
		roles: [Role.MEDIA_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'media',
		requiresEditPermission: true
	},

	// Louvor
	{
		label: 'Playlists',
		href: '/dashboard/playlists',
		icon: <Music className="h-5 w-5" />,
		roles: [Role.WORSHIP_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'worship',
		requiresEditPermission: true
	},
	{
		label: 'Repertório',
		href: '/dashboard/repertorio',
		icon: <Music className="h-5 w-5" />,
		roles: [Role.WORSHIP_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'worship',
		requiresEditPermission: true
	},
	{
		label: 'Escala de Louvor',
		href: '/dashboard/escala-louvor',
		icon: <UserSquare2 className="h-5 w-5" />,
		roles: [Role.WORSHIP_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'worship',
		requiresEditPermission: true
	},

	// Obreiros
	{
		label: 'Escala de Obreiros',
		href: '/dashboard/escala-obreiros',
		icon: <UserSquare2 className="h-5 w-5" />,
		roles: [Role.WORKERS, Role.MASTER, Role.DEVELOPER],
		department: 'workers',
		requiresEditPermission: true
	},

	// Equipamentos - agora específico para mídia
	{
		label: 'Equipamentos',
		href: '/dashboard/equipamentos',
		icon: <Wrench className="h-5 w-5" />,
		roles: [Role.MEDIA_CHURCH, Role.MASTER, Role.DEVELOPER],
		department: 'media',
		requiresEditPermission: true
	},

	// Acesso Master
	{
		label: 'Admin',
		href: '/app',
		icon: <Settings className="h-5 w-5" />,
		roles: [Role.MASTER, Role.DEVELOPER],
		department: 'admin'
	},
];

export default function DashboardNav({ user }: { user: SafeUser }) {
	const { canEdit } = useAuth();
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Verifica se o usuário é admin/master/developer
	const isAdmin = user.isAdmin || user.role === Role.MASTER || user.role === Role.DEVELOPER;

	// Filtra os itens de navegação com base no papel do usuário
	const filteredNavItems = navItems.filter(item => {
		// Verifica se o usuário tem o papel necessário
		const hasRole = item.roles.includes(user.role);

		// Verifica se o usuário tem permissão para editar, se necessário
		const hasEditPermission = !item.requiresEditPermission || canEdit(item.href.split('/').pop() || '');

		// Admins podem ver todos os itens
		if (isAdmin) return true;

		return hasRole && hasEditPermission;
	});

	// Agrupa os itens por departamento
	const generalItems = filteredNavItems.filter(item => item.department === 'general');

	// Obtem apenas os itens do departamento do usuário para usuários não admin
	let departmentItems: NavItem[] = [];
	let departmentTitle = '';

	if (!isAdmin) {
		switch (user.role) {
			case Role.MEDIA_CHURCH:
				departmentItems = filteredNavItems.filter(item => item.department === 'media');
				departmentTitle = 'Mídia';
				break;
			case Role.WORSHIP_CHURCH:
				departmentItems = filteredNavItems.filter(item => item.department === 'worship');
				departmentTitle = 'Louvor';
				break;
			case Role.WORKERS:
				departmentItems = filteredNavItems.filter(item => item.department === 'workers');
				departmentTitle = 'Obreiros';
				break;
		}
	} else {
		// Para admins, mostra itens agrupados por departamento
		departmentTitle = 'Todos os Departamentos';
	}

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			window.location.href = '/auth';
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	const getDashboardTitle = () => {
		switch (user.role) {
			case Role.MEDIA_CHURCH:
				return 'Dashboard Mídia';
			case Role.WORSHIP_CHURCH:
				return 'Dashboard Louvor';
			case Role.WORKERS:
				return 'Dashboard Obreiros';
			case Role.MASTER:
			case Role.DEVELOPER:
				return 'Dashboard Admin';
			default:
				return 'Regenere Dashboard';
		}
	};

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	const renderNavItems = () => {
		if (isAdmin) {
			return (
				<>
					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Geral
						</h3>
						<ul className="space-y-1">
							{generalItems.map(renderNavItem)}
						</ul>
					</div>

					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Mídia
						</h3>
						<ul className="space-y-1">
							{navItems.filter(item => item.department === 'media').map(renderNavItem)}
						</ul>
					</div>

					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Louvor
						</h3>
						<ul className="space-y-1">
							{navItems.filter(item => item.department === 'worship').map(renderNavItem)}
						</ul>
					</div>

					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Obreiros
						</h3>
						<ul className="space-y-1">
							{navItems.filter(item => item.department === 'workers').map(renderNavItem)}
						</ul>
					</div>

					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Administração
						</h3>
						<ul className="space-y-1">
							{navItems.filter(item => item.department === 'admin').map(renderNavItem)}
						</ul>
					</div>
				</>
			);
		} else {
			// Para usuários comuns, mostra apenas itens gerais e do seu departamento
			return (
				<>
					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							Geral
						</h3>
						<ul className="space-y-1">
							{generalItems.map(renderNavItem)}
						</ul>
					</div>

					<div className="mb-4">
						<h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
							{departmentTitle}
						</h3>
						<ul className="space-y-1">
							{departmentItems.map(renderNavItem)}
						</ul>
					</div>
				</>
			);
		}
	};

	// Renderiza um item de navegação
	const renderNavItem = (item: NavItem) => (
		<li key={item.href}>
			<Link
				href={item.href}
				className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${pathname === item.href
						? 'bg-primary text-primary-foreground hover:bg-primary/90'
						: 'text-gray-700 dark:text-gray-300'
					}`}
			>
				{item.icon}
				<span className="ml-3">{item.label}</span>
				{item.requiresEditPermission && user.isLeader && (
					<span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
						Editar
					</span>
				)}
			</Link>
		</li>
	);

	return (
		<>
			<div className="md:hidden fixed top-4 right-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="bg-white dark:bg-gray-800"
				>
					{isMobileMenuOpen ? <X /> : <Menu />}
				</Button>
			</div>

			<div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white dark:bg-gray-900">
				<div className="p-4 border-b">
					<h2 className="text-xl font-bold">{getDashboardTitle()}</h2>
					<p className="text-sm text-gray-500 mt-1 truncate">{user.church?.name || 'Sem igreja'}</p>
				</div>

				<nav className="flex-1 overflow-y-auto p-4">
					{renderNavItems()}
				</nav>

				<div className="p-4 border-t">
					<div className="flex items-center mb-4">
						<div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
							{user.image ? (
								<img
									src={user.image}
									alt={user.name || 'User'}
									className="w-full h-full rounded-full object-cover"
								/>
							) : (
								<div className="w-full h-full rounded-full flex items-center justify-center bg-primary text-primary-foreground">
									{user.name?.charAt(0) || 'U'}
								</div>
							)}
						</div>
						<div className="ml-3 overflow-hidden">
							<p className="text-sm font-medium truncate">{user.name}</p>
							<p className="text-xs text-gray-500 truncate">{user.email}</p>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full flex items-center justify-center"
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4 mr-2" />
						Sair
					</Button>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
					<div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out">
						<div className="p-4 border-b">
							<h2 className="text-xl font-bold">{getDashboardTitle()}</h2>
							<p className="text-sm text-gray-500 mt-1 truncate">{user.church?.name || 'Sem igreja'}</p>
						</div>

						<nav className="flex-1 overflow-y-auto p-4">
							{renderNavItems()}
						</nav>

						<div className="p-4 border-t">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
									{user.image ? (
										<img
											src={user.image}
											alt={user.name || 'User'}
											className="w-full h-full rounded-full object-cover"
										/>
									) : (
										<div className="w-full h-full rounded-full flex items-center justify-center bg-primary text-primary-foreground">
											{user.name?.charAt(0) || 'U'}
										</div>
									)}
								</div>
								<div className="ml-3 overflow-hidden">
									<p className="text-sm font-medium truncate">{user.name}</p>
									<p className="text-xs text-gray-500 truncate">{user.email}</p>
								</div>
							</div>

							<Button
								variant="outline"
								className="w-full flex items-center justify-center"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4 mr-2" />
								Sair
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
} 