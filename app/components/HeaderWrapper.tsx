'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
	const pathname = usePathname();

	if (pathname?.startsWith('/app') || pathname?.startsWith('/auth')) {
		return null;
	}

	return <Header />;
} 