import NextAuth, { AuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../database';
import { Resend } from 'resend';

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			isAdmin?: boolean;
		}
	}

	interface JWT {
		isAdmin?: boolean;
	}
}

export const authOptions: AuthOptions = {
	pages: {
		signIn: '/auth',
		signOut: '/auth',
		error: '/auth',
		verifyRequest: '/auth',
		newUser: '/app',
	},
	secret: process.env.NEXTAUTH_SECRET || 'sua-chave-secreta-aqui',
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 dias
	},
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
	providers: [
		EmailProvider({
			from: process.env.EMAIL_FROM,
			server: {
				host: 'smtp.resend.com',
				port: 465,
				auth: {
					user: 'resend',
					pass: process.env.RESEND_API_KEY
				}
			},
			sendVerificationRequest: async ({ identifier: email, url }) => {
				try {
					const resend = new Resend(process.env.RESEND_API_KEY!);
					await resend.emails.send({
						from: process.env.EMAIL_FROM!,
						to: email,
						subject: 'Login Link to your Account',
						html: `<p>Click the magic link below to sign in to your account:</p>
                   <p><a href="${url}"><b>Sign in</b></a></p>`,
					});
				} catch (error) {
					console.error('Error sending verification email:', error);
				}
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || '',
			clientSecret: process.env.GOOGLE_SECRET || '',
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				const dbUser = await prisma.user.findUnique({
					where: { id: user.id },
					select: { isAdmin: true }
				});
				token.isAdmin = dbUser?.isAdmin || false;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session?.user && token.sub) {
				session.user.id = token.sub;
				session.user.isAdmin = token.isAdmin as boolean || false;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };