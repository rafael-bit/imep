'use client';

import React, { ReactNode } from 'react';
import Sidebar from '../layout/Sidebar';
import { AuthProvider } from '@/lib/contexts/auth-context';

interface ClientWrapperProps {
	children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
	return (
		<AuthProvider>
			{/* Sidebar */}
			<Sidebar />

			{/* Main content */}
			<main className="flex-1 p-6 md:p-8 overflow-auto">
				{/* Spacer for mobile to avoid content being hidden under the menu button */}
				<div className="h-10 md:h-0 mb-4 md:mb-0"></div>
				{children}
			</main>
		</AuthProvider>
	);
} 