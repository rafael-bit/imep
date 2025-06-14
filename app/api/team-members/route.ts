import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const churchId = searchParams.get('churchId');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		const teamMembers = await prisma.teamMember.findMany({
			where: {
				churchId: churchId
			},
			orderBy: {
				name: 'asc'
			}
		});

		return NextResponse.json(teamMembers);
	} catch (error) {
		console.error('Erro ao buscar membros da equipe:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		if (!data.name || !data.role || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		const teamMember = await prisma.teamMember.create({
			data: {
				name: data.name,
				role: data.role,
				email: data.email,
				phone: data.phone,
				churchId: data.churchId,
			}
		});

		return NextResponse.json(teamMember, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar membro da equipe:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 