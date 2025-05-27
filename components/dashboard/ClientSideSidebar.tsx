'use client';

import React from 'react';
import Sidebar from '../layout/Sidebar';
import { AuthProvider } from '@/lib/contexts/auth-context';

export function ClientSideSidebar() {
	return (
		<AuthProvider>
			<Sidebar />
		</AuthProvider>
	);
} 