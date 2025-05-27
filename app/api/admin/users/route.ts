import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { getCurrentUser } from '@/lib/auth-utils';
import { hashPassword } from '@/lib/auth-utils';
import { Role } from '@/lib/types';

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || !(user.isAdmin || user.role === Role.MASTER || user.role === Role.DEVELOPER)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				isAdmin: true,
				role: true,
				churchId: true,
				church: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				name: 'asc',
			},
		});

		return NextResponse.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar usuários' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser || !(currentUser.isAdmin || currentUser.role === Role.MASTER || currentUser.role === Role.DEVELOPER)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { name, email, password, role, churchId } = body;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email já está em uso' },
				{ status: 400 }
			);
		}

		const hashedPassword = await hashPassword(password);

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: role as Role,
				churchId: churchId || null,
				isAdmin: role === Role.MASTER || role === Role.DEVELOPER,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				churchId: true,
				isAdmin: true,
			},
		});

		return NextResponse.json({ user: newUser }, { status: 201 });
	} catch (error) {
		console.error('Error creating user:', error);
		return NextResponse.json(
			{ error: 'Erro ao criar usuário' },
			{ status: 500 }
		);
	}
} 