'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validações básicas
		if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
			setError('Por favor, preencha todos os campos');
			return;
		}

		if (formData.password.length < 6) {
			setError('A senha deve ter pelo menos 6 caracteres');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('As senhas não coincidem');
			return;
		}

		try {
			setLoading(true);
			setError('');
			setSuccess('');

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao criar conta');
			}

			setSuccess('Conta criada com sucesso! Você pode fazer login agora.');

			// Limpar o formulário
			setFormData({
				name: '',
				email: '',
				password: '',
				confirmPassword: '',
			});

			setTimeout(() => {
				router.push('/login');
			}, 2000);

		} catch (error) {
			console.error('Erro no registro:', error);
			setError(error instanceof Error ? error.message : 'Ocorreu um erro ao criar a conta');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-white">Criar Conta</h1>
					<p className="mt-2 text-gray-400">Sistema de Gerenciamento Regenere</p>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert className="bg-green-900 border-green-800">
						<CheckCircle className="h-4 w-4 text-green-400" />
						<AlertDescription className="text-green-400">{success}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="name" className="text-white">Nome completo</Label>
							<Input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								required
								value={formData.name}
								onChange={handleChange}
								className="bg-gray-800 border-gray-700 text-white"
								placeholder="Seu nome completo"
							/>
						</div>

						<div>
							<Label htmlFor="email" className="text-white">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="bg-gray-800 border-gray-700 text-white"
								placeholder="seu@email.com"
							/>
						</div>

						<div>
							<Label htmlFor="password" className="text-white">Senha</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleChange}
								className="bg-gray-800 border-gray-700 text-white"
								placeholder="********"
							/>
						</div>

						<div>
							<Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="bg-gray-800 border-gray-700 text-white"
								placeholder="********"
							/>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? 'Criando conta...' : 'Criar conta'}
						</Button>
					</div>

					<div className="text-center text-sm">
						<span className="text-gray-400">Já tem uma conta? </span>
						<Link href="/login" className="text-primary hover:underline">
							Fazer login
						</Link>
					</div>
				</form>

				<div className="text-center text-sm">
					<Link href="/" className="text-gray-400 hover:text-white">
						Voltar para o site
					</Link>
				</div>
			</div>
		</div>
	);
} 