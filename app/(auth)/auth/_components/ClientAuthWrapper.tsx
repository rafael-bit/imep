'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/auth-context';

interface ClientAuthWrapperProps {
	children: ReactNode;
}

export default function ClientAuthWrapper({ children }: ClientAuthWrapperProps) {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	);
} 