'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Get callback URL from query parameters
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

	useEffect(() => {
		// Check if there's an error in URL parameters
		const errorParam = searchParams.get('error');
		if (errorParam) {
			if (errorParam === 'CredentialsSignin') {
				setError('Email ou senha inválidos');
			} else {
				setError('Ocorreu um erro no login. Tente novamente.');
			}
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError('Por favor, preencha todos os campos');
			return;
		}

		try {
			setLoading(true);
			setError('');

			console.log('Attempting to sign in with:', { email, callbackUrl });

			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl,
			});

			console.log('Sign in result:', result);

			if (result?.error) {
				console.error('Login error:', result.error);
				setError('Email ou senha inválidos. Por favor, verifique suas credenciais.');
				return;
			}

			if (result?.url) {
				console.log('Redirecting to:', result.url);
				router.push(result.url);
			} else {
				console.log('Redirecting to dashboard');
				router.push('/dashboard');
			}

			router.refresh();
		} catch (error) {
			console.error('Erro no login:', error);
			setError('Ocorreu um erro ao realizar o login. Por favor, tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-white">IMEP</h1>
					<p className="mt-2 text-gray-400">Sistema de Gerenciamento</p>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="email" className="text-white">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
							{loading ? 'Entrando...' : 'Entrar'}
						</Button>
					</div>

					<div className="text-center text-sm">
						<span className="text-gray-400">Não tem uma conta? </span>
						<Link href="/register" className="text-primary hover:underline">
							Criar conta
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

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
				<div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-white">IMEP</h1>
						<p className="mt-2 text-gray-400">Carregando...</p>
					</div>
				</div>
			</div>
		}>
			<LoginForm />
		</Suspense>
	);
} 