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

		const worshipSchedules = await prisma.worshipSchedule.findMany({
			where: {
				churchId: churchId
			},
			orderBy: {
				date: 'desc'
			}
		});

		return NextResponse.json(worshipSchedules);
	} catch (error) {
		console.error('Erro ao buscar cronogramas de adoração:', error);
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

		if (!data.title || !data.date || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		const worshipSchedule = await prisma.worshipSchedule.create({
			data: {
				title: data.title,
				date: new Date(data.date),
				description: data.description,
				churchId: data.churchId,
			}
		});

		return NextResponse.json(worshipSchedule, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar cronograma de adoração:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 