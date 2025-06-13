'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserPlus, Building, Users, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminToolsPage() {
	const [email, setEmail] = useState('');
	const [secret, setSecret] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await fetch('/api/admin/make-admin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, secret }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao promover usuário');
			}

			setSuccess(`Usuário ${email} promovido a administrador com sucesso!`);
			setEmail('');
			setSecret('');
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Erro desconhecido');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-12 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-neutral-100">Ferramentas de Administração</h1>
				<Link href="/app">
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para Dashboard
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

				<Link href="/app/voluntarios">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Users className="mr-2 h-5 w-5" />
								Gerenciar Voluntários
							</CardTitle>
							<CardDescription>
								Visualize e gerencie os voluntários cadastrados
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Acesse a lista de voluntários que se cadastraram no site e gerencie suas informações.
							</p>
						</CardContent>
					</Card>
				</Link>

				<Link href="/dashboard">
					<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Settings className="mr-2 h-5 w-5" />
								Dashboard Geral
							</CardTitle>
							<CardDescription>
								Acessar o dashboard geral
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Acesse a visão geral com acesso a todos os recursos disponíveis no sistema.
							</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			<Card className="max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Promover Usuário a Admin</CardTitle>
					<CardDescription>
						Use esta ferramenta para promover um usuário a administrador.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert className="mb-4 bg-green-100 border-green-200">
							<AlertDescription className="text-green-800">{success}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email do Usuário</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="usuario@exemplo.com"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="secret">Chave Admin</Label>
							<Input
								id="secret"
								type="password"
								value={secret}
								onChange={(e) => setSecret(e.target.value)}
								required
								placeholder="Digite a chave de administrador"
							/>
							<p className="text-xs text-gray-500">
								Esta é a chave ADMIN_SECRET definida no arquivo .env
							</p>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processando...
								</>
							) : (
								<>
									<UserPlus className="mr-2 h-4 w-4" />
									Promover a Administrador
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
} 