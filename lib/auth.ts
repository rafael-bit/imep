import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { compare } from "bcrypt";

// Create a global Prisma client with error handling
let prisma: PrismaClient;

try {
	prisma = new PrismaClient();
	console.log("Prisma client initialized successfully");
} catch (error) {
	console.error("Failed to initialize Prisma client:", error);
	throw new Error("Database connection failed");
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Senha", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					console.log("Credentials missing", { email: !!credentials?.email, password: !!credentials?.password });
					return null;
				}

				try {
					console.log("Attempting to authenticate user:", credentials.email);

					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email
						},
						include: {
							church: true
						}
					});

					if (!user) {
						console.log("User not found:", credentials.email);
						return null;
					}

					console.log("User found, comparing passwords");

					// Debug log to check password format (without revealing actual password)
					console.log("Password from DB format check:", {
						length: user.password?.length,
						startsWithDollar: user.password?.startsWith('$'),
						containsHashFormat: user.password?.includes('$2b$') || user.password?.includes('$2a$')
					});

					try {
						// Make sure password exists and is in proper format
						if (!user.password || typeof user.password !== 'string') {
							console.error("Invalid password format in database");
							return null;
						}

						const isValid = await compare(credentials.password, user.password);
						console.log("Password validation result:", isValid);

						if (!isValid) {
							console.log("Invalid password for user:", credentials.email);
							return null;
						}
					} catch (e) {
						console.error("Error during password comparison:", e);
						return null;
					}

					console.log("Authentication successful for:", credentials.email);

					return {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						churchId: user.churchId,
						image: user.image || null,
					};
				} catch (error) {
					console.error("Erro ao autenticar:", error);
					return null;
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.churchId = user.churchId;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.churchId = token.churchId as string;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Handle redirects properly
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allow callbacks to external URLs if they are allowed origins
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		}
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 dias
	},
	secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-key-change-in-production",
	debug: process.env.NODE_ENV === "development",
};

// Declare tipos para next-auth
declare module "next-auth" {
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

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
		churchId: string | null;
	}
} 