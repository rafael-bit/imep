'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Role } from '@/lib/types';

interface User {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	isAdmin?: boolean;
	isLeader?: boolean;
	role: Role;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	canEdit: (area: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkSession = async () => {
			try {
				const res = await fetch('/api/auth/session');
				const data = await res.json();

				if (data.authenticated) {
					setUser(data.user);
				}
			} catch (error) {
				console.error('Failed to fetch session:', error);
			} finally {
				setLoading(false);
			}
		};

		checkSession();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Falha ao fazer login');
			}

			setUser(data.user);
			router.refresh();

			if (data.user.isAdmin) {
				router.push('/app');
			} else {
				router.push('/access-denied');
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Falha ao fazer login');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const register = async (name: string, email: string, password: string) => {
		try {
			setLoading(true);
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password, confirmPassword: password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Falha ao criar conta');
			}

			toast.success('Conta criada com sucesso! Faça login para continuar.');
			return;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Falha ao criar conta');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
			});

			if (!res.ok) {
				throw new Error('Falha ao fazer logout');
			}

			setUser(null);
			router.refresh();
			router.push('/auth');
		} catch (error) {
			toast.error('Falha ao fazer logout');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const canEdit = (area: string) => {
		if (!user) return false;

		if (user.isAdmin || user.role === Role.MASTER || user.role === Role.DEVELOPER) {
			return true;
		}

		if (user.isLeader) {
			if (user.role === Role.MEDIA_CHURCH &&
				['galeria', 'agenda', 'equipamentos'].includes(area)) {
				return true;
			}

			if (user.role === Role.WORSHIP_CHURCH &&
				['escala-louvor', 'musicas'].includes(area)) {
				return true;
			}

			if (user.role === Role.WORKERS &&
				['escala-obreiros'].includes(area)) {
				return true;
			}
		}

		return false;
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout, canEdit }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
} 