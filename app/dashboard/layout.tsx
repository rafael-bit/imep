import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Inter } from 'next/font/google';
import { metadata } from './metadata';
import { getCurrentUser } from '@/lib/auth-utils';
import DashboardNav from './components/DashboardNav';
import { AuthProvider } from '@/lib/contexts/auth-context';

// Re-export the metadata
export { metadata };

const inter = Inter({ subsets: ['latin'] });

// This is a server component that handles authentication and redirection
export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Verificar se o usuário está autenticado no servidor
	const user = await getCurrentUser();

	// Se não estiver autenticado, redirecionar para o login
	if (!user) {
		redirect('/auth');
	}

	return (
		<AuthProvider>
			<div className={`${inter.className} flex min-h-screen bg-gray-950`}>
				<DashboardNav user={user} />
				<main className="flex-1 ml-0 md:ml-64 p-6">
					{children}
				</main>
			</div>
		</AuthProvider>
	);
} 