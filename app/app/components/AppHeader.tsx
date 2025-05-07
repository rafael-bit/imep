'use client';

import { LogoutButton } from '@/app/components/LogoutButton';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export function AppHeader() {
	const { user } = useAuth();

	return (
		<div className="bg-[#121212] text-white">
			<header>
				<div className="bg-[#121212] shadow-sm">
					<div className="container mx-auto py-4 px-4 flex flex-col sm:flex-row  gap-3 justify-between items-center">
						<Link href="/" className="hover:underline">
							<h1 className="text-xl font-bold">IMEP</h1>
						</Link>
						<nav>
							<ul className="flex items-center gap-4">
								<li>
									<Link href="/" className="hover:underline">
										Inicial
									</Link>
								</li>
								<li>
									<Link href="/app/voluntarios" className="hover:underline">
										Voluntários
									</Link>
								</li>
								<li>
									<Link href="http://clearcash.vercel.app/" target="_blank" className="hover:underline">
										Financeiro
									</Link>
								</li>
								<li>
									<Link href="/admin-tools">
										<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1 text-neutral-900 hover:text-white hover:bg-neutral-900">
											<Shield className="w-4 h-4" />
											Ferramentas Admin
										</Button>
									</Link>
								</li>
							</ul>
						</nav>
						<div className="flex items-center space-x-4">
							{user ? (
								<div className="flex items-center">
									<div className="hidden md:flex items-center mr-2 text-gray-300">
										<span className="text-sm">Olá, {user.name || user.email}</span>
									</div>
									<LogoutButton />
								</div>
							) : (
								<Button variant="outline" asChild size="sm">
									<Link href="/auth">Entrar</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			</header>
		</div>
	);
} 