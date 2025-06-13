'use client';

import { useState, useEffect } from 'react';
import { Role, SafeUser } from '@/lib/types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Building, Wrench, LogOut, Home, Settings } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<SafeUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			try {
				const response = await fetch('/api/auth/check-status');
				const data = await response.json();

				if (data.user) {
					if (data.user.role !== Role.MASTER && data.user.role !== Role.DEVELOPER) {
						redirect('/access-denied');
					}
					setUser(data.user);
				} else {
					redirect('/auth');
				}
			} catch (error) {
				console.error('Error loading user:', error);
				redirect('/auth');
			} finally {
				setLoading(false);
			}
		}

		loadUser();
	}, []);

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			window.location.href = '/auth';
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Top navigation bar */}
			<header className="bg-gray-800 px-6 py-4">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<Settings className="h-6 w-6" />
						<h1 className="text-xl font-bold">Regenere Admin</h1>
					</div>

					<div className="flex items-center space-x-6">
						<nav>
							<ul className="flex space-x-6">
								<li>
									<Link href="/app" className="hover:text-primary transition-colors">
										Dashboard
									</Link>
								</li>
								<li>
									<Link href="/admin-tools/users" className="hover:text-primary transition-colors">
										Usuários
									</Link>
								</li>
								<li>
									<Link href="/admin-tools/churches" className="hover:text-primary transition-colors">
										Igrejas
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="hover:text-primary transition-colors">
										Dashboard Geral
									</Link>
								</li>
							</ul>
						</nav>

						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
								{user.image ? (
									<Image
										src={user.image}
										alt={user.name || 'User'}
										className="w-full h-full rounded-full object-cover"
										width={32}
										height={32}
									/>
								) : (
									<span className="text-primary-foreground">
										{user.name?.charAt(0) || 'U'}
									</span>
								)}
							</div>

							<Button
								variant="ghost"
								size="sm"
								onClick={handleLogout}
								className="text-white hover:text-primary"
							>
								<LogOut className="h-4 w-4 mr-2" />
								Sair
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto py-6">
				{children}
			</main>
		</div>
	);
} 