'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Role, SafeUser } from '@/lib/types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Building, Calendar, Wrench, Music, UserSquare2 } from 'lucide-react';

export default function MasterDashboard() {
	const [user, setUser] = useState<SafeUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		users: 0,
		churches: 0,
		agendas: 0,
	});

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

		async function loadStats() {
			try {
				const response = await fetch('/api/admin/stats');
				const data = await response.json();
				setStats(data);
			} catch (error) {
				console.error('Error loading stats:', error);
			}
		}

		loadUser();
		loadStats();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<h1 className="text-3xl font-bold mb-6 text-white">Dashboard Master</h1>

			{/* Stats cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center text-lg">
							<Users className="mr-2 h-5 w-5" />
							Usuários
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{stats.users}</p>
						<p className="text-sm text-muted-foreground">Total de usuários no sistema</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center text-lg">
							<Building className="mr-2 h-5 w-5" />
							Igrejas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{stats.churches}</p>
						<p className="text-sm text-muted-foreground">Total de igrejas no sistema</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center text-lg">
							<Calendar className="mr-2 h-5 w-5" />
							Agendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{stats.agendas}</p>
						<p className="text-sm text-muted-foreground">Total de eventos agendados</p>
					</CardContent>
				</Card>
			</div>

			<h2 className="text-2xl font-bold mb-4 text-white">Ferramentas de Administração</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				<Link href="/admin-tools/users">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Users className="mr-2 h-5 w-5" />
								Gerenciar Usuários
							</CardTitle>
							<CardDescription>
								Adicione, edite e remova usuários
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Configure as permissões dos usuários do sistema, incluindo as funções de Mídia, Louvor e Obreiros.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/admin-tools/churches">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Building className="mr-2 h-5 w-5" />
								Gerenciar Igrejas
							</CardTitle>
							<CardDescription>
								Adicione, edite e remova igrejas
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Cadastre as igrejas no sistema para associação com usuários e organização das equipes.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/admin-tools">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Wrench className="mr-2 h-5 w-5" />
								Outras Ferramentas
							</CardTitle>
							<CardDescription>
								Acesse ferramentas adicionais
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Promover usuários a administradores e outras configurações avançadas do sistema.
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			<h2 className="text-2xl font-bold mb-4 text-white">Acesso às Áreas</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Link href="/dashboard">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Calendar className="mr-2 h-5 w-5" />
								Dashboard Geral
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Acesse o dashboard geral com visão de todas as funções.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/dashboard/agendas">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Calendar className="mr-2 h-5 w-5" />
								Área de Mídia
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Acesse as ferramentas de gerenciamento de mídia, agendas e galerias.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/dashboard/playlists">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Music className="mr-2 h-5 w-5" />
								Área de Louvor
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Acesse as ferramentas de gerenciamento de playlists e equipes de louvor.
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>
		</div>
	);
} 