import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { getCurrentUser } from '@/lib/auth-utils';
import { Role } from '@/lib/types';

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || !(user.isAdmin ||
			user.role === Role.MASTER ||
			user.role === Role.DEVELOPER ||
			user.role === Role.MEDIA_CHURCH ||
			user.role === Role.WORSHIP_CHURCH ||
			user.role === Role.WORKERS)) {
			return NextResponse.json(
				{ error: 'Acesso não autorizado' },
				{ status: 403 }
			);
		}

		const churches = await prisma.church.findMany({
			select: {
				id: true,
				name: true,
				address: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				name: 'asc',
			},
		});

		return NextResponse.json({ churches });
	} catch (error) {
		console.error('Error fetching churches:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar igrejas' },
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
		const { name, address } = body;

		if (!name || name.trim() === '') {
			return NextResponse.json(
				{ error: 'Nome da igreja é obrigatório' },
				{ status: 400 }
			);
		}

		const newChurch = await prisma.church.create({
			data: {
				name,
				address: address || null,
			},
		});

		return NextResponse.json({ church: newChurch }, { status: 201 });
	} catch (error) {
		console.error('Error creating church:', error);
		return NextResponse.json(
			{ error: 'Erro ao criar igreja' },
			{ status: 500 }
		);
	}
} 