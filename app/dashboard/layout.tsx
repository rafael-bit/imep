import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Inter } from 'next/font/google';
import { metadata } from './metadata';
import ClientWrapper from '@/components/dashboard/ClientWrapper';

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
	const session = await getServerSession(authOptions);

	// Se não estiver autenticado, redirecionar para o login
	if (!session) {
		redirect('/login');
	}

	return (
		<div className={`${inter.className} flex min-h-screen bg-gray-950`}>
			<ClientWrapper>{children}</ClientWrapper>
		</div>
	);
} 