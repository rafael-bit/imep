'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

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
		<div className="container max-w-md mx-auto py-12">
			<Card>
				<CardHeader>
					<CardTitle>Ferramentas de Administração</CardTitle>
					<CardDescription>
						Use esta página para gerenciar permissões de usuários.
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
								'Promover a Administrador'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
} 