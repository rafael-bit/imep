'use client';

import React from 'react';
import Sidebar from '../layout/Sidebar';

interface DashboardContentProps {
	children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
	return (
		<>
			<Sidebar />
			<main className="flex-1 p-6 md:p-8 overflow-auto">
				{/* Spacer for mobile to avoid content being hidden under the menu button */}
				<div className="h-10 md:h-0 mb-4 md:mb-0"></div>
				{children}
			</main>
		</>
	);
} 