import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/services/database';
import { loginSchema } from '@/lib/validations/auth';
import { createToken, verifyPassword } from '@/lib/auth-utils';
import { ZodError } from 'zod';
import { SafeUser } from '@/lib/types';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const validatedData = loginSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { email: validatedData.email },
			select: {
				id: true,
				name: true,
				email: true,
				isAdmin: true,
				password: true,
				role: true,
				churchId: true,
				church: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});

		if (!user || !user.password) {
			return NextResponse.json(
				{ error: 'Credenciais inválidas' },
				{ status: 401 }
			);
		}

		const isValidPassword = await verifyPassword(
			user.password,
			validatedData.password
		);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Credenciais inválidas' },
				{ status: 401 }
			);
		}

		const userWithoutPassword = { ...user } as SafeUser;
		delete (userWithoutPassword as any).password;
		const token = await createToken(userWithoutPassword);

		const cookieStore = await cookies();
		cookieStore.set('auth-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: '/',
			sameSite: 'strict',
		});

		return NextResponse.json({
			user: userWithoutPassword
		});
	} catch (error) {
		console.error('Error logging in:', error);

		if (error instanceof ZodError) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: 'Erro ao fazer login' },
			{ status: 500 }
		);
	}
} 