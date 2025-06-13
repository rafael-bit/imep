import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { getCurrentUser, hashPassword } from '@/lib/auth-utils';
import { Role } from '@/lib/types';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser || !(currentUser.isAdmin || currentUser.role === Role.MASTER || currentUser.role === Role.DEVELOPER)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: params.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				isAdmin: true,
				isLeader: true,
				role: true,
				churchId: true,
				church: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar usuário' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser || !(currentUser.isAdmin || currentUser.role === Role.MASTER || currentUser.role === Role.DEVELOPER)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { name, email, password, role, churchId, isLeader } = body;

		if (email) {
			const existingUser = await prisma.user.findFirst({
				where: {
					email,
					id: { not: params.id },
				},
			});

			if (existingUser) {
				return NextResponse.json(
					{ error: 'Email já está em uso por outro usuário' },
					{ status: 400 }
				);
			}
		}

		const updateData: any = {
			name,
			email,
			role,
			churchId: churchId || null,
			isAdmin: role === Role.MASTER || role === Role.DEVELOPER,
			isLeader: isLeader || false,
		};

		if (password) {
			updateData.password = await hashPassword(password);
		}

		const updatedUser = await prisma.user.update({
			where: { id: params.id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				churchId: true,
				isAdmin: true,
				isLeader: true,
			},
		});

		return NextResponse.json({ user: updatedUser });
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json(
			{ error: 'Erro ao atualizar usuário' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser || !(currentUser.isAdmin || currentUser.role === Role.MASTER || currentUser.role === Role.DEVELOPER)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		if (currentUser.id === params.id) {
			return NextResponse.json(
				{ error: 'Você não pode excluir sua própria conta' },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: params.id },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 }
			);
		}

		await prisma.user.delete({
			where: { id: params.id },
		});

		return NextResponse.json(
			{ message: 'Usuário excluído com sucesso' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting user:', error);
		return NextResponse.json(
			{ error: 'Erro ao excluir usuário' },
			{ status: 500 }
		);
	}
} 