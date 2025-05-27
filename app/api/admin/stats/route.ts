import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { getCurrentUser } from '@/lib/auth-utils';
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

		const usersCount = await prisma.user.count();

		const churchesCount = await prisma.church.count();

		const agendasCount = await prisma.agenda.count();

		const usersByRole = await prisma.user.groupBy({
			by: ['role'],
			_count: {
				id: true
			}
		});

		const stats = {
			users: usersCount,
			churches: churchesCount,
			agendas: agendasCount,
			usersByRole: usersByRole.map(item => ({
				role: item.role,
				count: item._count.id
			})),
		};

		return NextResponse.json(stats);
	} catch (error) {
		console.error('Error fetching stats:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar estatísticas' },
			{ status: 500 }
		);
	}
} 