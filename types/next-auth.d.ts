import 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		role: string;
		churchId: string | null;
	}

	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role: string;
			churchId: string | null;
			image?: string | null;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: string;
		churchId: string | null;
	}
} 