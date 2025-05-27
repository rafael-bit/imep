import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { getCurrentUser } from '@/lib/auth-utils';
import { Role } from '@/lib/types';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser || !(currentUser.isAdmin ||
			currentUser.role === Role.MASTER ||
			currentUser.role === Role.DEVELOPER ||
			currentUser.role === Role.MEDIA_CHURCH ||
			currentUser.role === Role.WORSHIP_CHURCH ||
			currentUser.role === Role.WORKERS)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const church = await prisma.church.findUnique({
			where: { id: params.id },
			include: {
				users: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		});

		if (!church) {
			return NextResponse.json(
				{ error: 'Igreja não encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ church });
	} catch (error) {
		console.error('Error fetching church:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar igreja' },
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
		const { name, address } = body;

		if (!name || name.trim() === '') {
			return NextResponse.json(
				{ error: 'Nome da igreja é obrigatório' },
				{ status: 400 }
			);
		}

		const church = await prisma.church.findUnique({
			where: { id: params.id },
		});

		if (!church) {
			return NextResponse.json(
				{ error: 'Igreja não encontrada' },
				{ status: 404 }
			);
		}

		const updatedChurch = await prisma.church.update({
			where: { id: params.id },
			data: {
				name,
				address: address || null,
			},
		});

		return NextResponse.json({ church: updatedChurch });
	} catch (error) {
		console.error('Error updating church:', error);
		return NextResponse.json(
			{ error: 'Erro ao atualizar igreja' },
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

		const church = await prisma.church.findUnique({
			where: { id: params.id },
			include: {
				users: true,
			},
		});

		if (!church) {
			return NextResponse.json(
				{ error: 'Igreja não encontrada' },
				{ status: 404 }
			);
		}

		if (church.users.length > 0) {
			await prisma.user.updateMany({
				where: { churchId: params.id },
				data: { churchId: null },
			});
		}

		await prisma.church.delete({
			where: { id: params.id },
		});

		return NextResponse.json(
			{ message: 'Igreja excluída com sucesso' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting church:', error);
		return NextResponse.json(
			{ error: 'Erro ao excluir igreja' },
			{ status: 500 }
		);
	}
}
