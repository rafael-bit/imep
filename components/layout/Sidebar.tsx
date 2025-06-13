'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePermission } from '@/lib/hooks/usePermission';
import {
	LayoutDashboard,
	Image,
	Video,
	Music,
	Calendar,
	Users,
	Settings,
	LogOut,
	HardDrive,
	ListMusic,
	MenuIcon,
	X
} from 'lucide-react';

const Sidebar = () => {
	const pathname = usePathname();
	const { data: session } = useSession();
	const { hasPermission } = usePermission();
	const [isOpen, setIsOpen] = useState(false);

	// Fechar o menu em telas menores ao navegar
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	// Close sidebar when clicking outside on mobile
	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (isOpen && window.innerWidth < 768) {
				const sidebarElement = document.getElementById('sidebar');
				const menuButton = document.getElementById('menu-button');
				if (sidebarElement &&
					!sidebarElement.contains(e.target as Node) &&
					menuButton &&
					!menuButton.contains(e.target as Node)) {
					setIsOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const navItems = [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: <LayoutDashboard className="w-5 h-5" />,
			permission: null // Disponível para todos os usuários autenticados
		},
		{
			label: 'Galeria',
			href: '/dashboard/galeria',
			icon: <Image className="w-5 h-5" />,
			permission: 'GALLERY_VIEW'
		},
		{
			label: 'Escala de Mídia',
			href: '/dashboard/escala-midia',
			icon: <Video className="w-5 h-5" />,
			permission: 'MEDIA_SCHEDULE_VIEW'
		},
		{
			label: 'Repertório',
			href: '/dashboard/repertorio',
			icon: <Music className="w-5 h-5" />,
			permission: 'SONG_VIEW'
		},
		{
			label: 'Escala de Louvor',
			href: '/dashboard/escala-louvor',
			icon: <Calendar className="w-5 h-5" />,
			permission: 'WORSHIP_SCHEDULE_VIEW'
		},
		{
			label: 'Playlists',
			href: '/dashboard/playlists',
			icon: <ListMusic className="w-5 h-5" />,
			permission: 'PLAYLIST_VIEW'
		},
		{
			label: 'Escala de Obreiros',
			href: '/dashboard/escala-obreiros',
			icon: <Users className="w-5 h-5" />,
			permission: 'WORKER_SCHEDULE_VIEW'
		},
		{
			label: 'Equipamentos',
			href: '/dashboard/equipamentos',
			icon: <HardDrive className="w-5 h-5" />,
			permission: 'EQUIPMENT_VIEW'
		},
		{
			label: 'Configurações',
			href: '/dashboard/settings',
			icon: <Settings className="w-5 h-5" />,
			permission: null
		}
	];

	return (
		<>
			{/* Botão de menu para mobile */}
			<button
				id="menu-button"
				className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-md"
				onClick={() => setIsOpen(!isOpen)}
				aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
			>
				{isOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
			</button>

			{/* Overlay para fechar o menu em dispositivos móveis */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
					onClick={() => setIsOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				id="sidebar"
				className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
					} md:translate-x-0 md:relative md:w-64 md:shrink-0 bg-gray-900 text-white`}
			>
				<div className="h-full px-3 py-4 flex flex-col">
					<div className="mb-8 mt-2 text-center">
						<h2 className="text-2xl font-bold">Regenere</h2>
						<p className="text-gray-400 text-sm">Sistema de Gerenciamento</p>
					</div>

					<div className="space-y-1 flex-1">
						{navItems.map((item) =>
							// Exibir o item somente se o usuário tiver a permissão necessária
							!item.permission || hasPermission(item.permission as any) ? (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-800 transition-colors ${pathname === item.href ? 'bg-gray-800 text-primary font-medium' : 'text-gray-300'
										}`}
								>
									{item.icon}
									<span className="ml-3">{item.label}</span>
								</Link>
							) : null
						)}
					</div>

					<div className="pt-4 mt-auto border-t border-gray-800">
						<div className="px-4 py-2 mb-2">
							<p className="text-sm text-gray-400">Logado como:</p>
							<p className="font-medium truncate">{session?.user?.name || 'Usuário'}</p>
						</div>
						<Link
							href="/api/auth/signout"
							className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
						>
							<LogOut className="w-5 h-5" />
							<span className="ml-3">Sair</span>
						</Link>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar; 