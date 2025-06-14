'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/auth-context'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import type { LoginInput, RegisterInput } from '@/lib/validations/auth'

export default function AuthForm() {
	const { login, register: registerUser, loading } = useAuth()
	const [isLogin, setIsLogin] = useState(true)
	const [error, setError] = useState('')

	const loginForm = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})

	const registerForm = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		}
	})

	const handleLogin = async (data: LoginInput) => {
		setError('')
		try {
			await login(data.email, data.password)
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Falha ao fazer login')
		}
	}

	const handleRegister = async (data: RegisterInput) => {
		setError('')
		try {
			await registerUser(data.name, data.email, data.password)
			setIsLogin(true)
			registerForm.reset()
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Falha ao criar conta')
		}
	}

	const toggleForm = () => {
		setIsLogin(!isLogin)
		setError('')
	}

	return (
		<main className='flex items-center justify-center h-screen p-4'>
			<Card className='border-neutral-500 p-6 md:p-8 lg:p-10 w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center justify-center bg-neutral-900'>
				<div className='flex flex-col items-center justify-center w-full'>
					<CardHeader className='w-full flex flex-col items-center'>
						<Image src={'/logo.png'} alt="" width={120} height={120} className='mb-6' />
						<CardTitle className='text-3xl text-center text-neutral-100'>
							<h2>Regenere</h2>
						</CardTitle>
						<CardDescription className='text-center mb-6'>
							Sistema de Gerenciamento
						</CardDescription>
						<CardTitle className='text-2xl text-center text-neutral-100 mt-2'>
							<h3>{isLogin ? 'Entre em sua conta' : 'Crie sua conta'}</h3>
						</CardTitle>
						<CardDescription className='text-center pb-6'>
							{isLogin ? (
								<>
									Novo por aqui? {' '}
									<button
										onClick={toggleForm}
										className='text-teal-900 hover:underline'
									>
										Crie uma Conta
									</button>
								</>
							) : (
								<>
									Já tem uma conta? {' '}
									<button
										onClick={toggleForm}
										className='text-teal-900 hover:underline'
									>
										Faça login
									</button>
								</>
							)}
						</CardDescription>
					</CardHeader>
					<CardContent className="w-full">
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{isLogin ? (
							<form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email" className='text-neutral-100'>Email</Label>
									<Input
										id="email"
										type="email"
										{...loginForm.register('email')}
									/>
									{loginForm.formState.errors.email && (
										<p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className='text-neutral-100'>Senha</Label>
									<Input
										id="password"
										type="password"
										{...loginForm.register('password')}
									/>
									{loginForm.formState.errors.password && (
										<p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
									)}
								</div>
								<Button
									type="submit"
									className="w-full bg-teal-800 hover:bg-teal-700"
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Carregando...
										</>
									) : (
										'Entrar'
									)}
								</Button>
							</form>
						) : (
							<form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name" className='text-neutral-100'>Nome</Label>
									<Input
										id="name"
										type="text"
										{...registerForm.register('name')}
									/>
									{registerForm.formState.errors.name && (
										<p className="text-red-500 text-sm">{registerForm.formState.errors.name.message}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="email" className='text-neutral-100'>Email</Label>
									<Input
										id="email"
										type="email"
										{...registerForm.register('email')}
									/>
									{registerForm.formState.errors.email && (
										<p className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className='text-neutral-100'>Senha</Label>
									<Input
										id="password"
										type="password"
										{...registerForm.register('password')}
									/>
									{registerForm.formState.errors.password && (
										<p className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword" className='text-neutral-100'>Confirmar Senha</Label>
									<Input
										id="confirmPassword"
										type="password"
										{...registerForm.register('confirmPassword')}
									/>
									{registerForm.formState.errors.confirmPassword && (
										<p className="text-red-500 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
									)}
								</div>
								<Button
									type="submit"
									className="w-full bg-teal-800 hover:bg-teal-700"
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Carregando...
										</>
									) : (
										'Criar Conta'
									)}
								</Button>
							</form>
						)}

						<div className="text-center text-sm mt-6">
							<Link href="/" className="text-neutral-400 hover:text-neutral-200">
								Voltar para a página inicial
							</Link>
						</div>
					</CardContent>
				</div>
			</Card>
		</main>
	)
} 