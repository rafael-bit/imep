import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

interface AgendaData {
	title: string;
	description?: string;
	date: string;
	image?: string | null;
}

export async function GET() {
	try {
		const agendas = await prisma.agenda.findMany({
			orderBy: {
				date: 'asc'
			}
		});

		return NextResponse.json(agendas);
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Erro ao buscar agendas' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { title, description, date, image } = await request.json() as Partial<AgendaData>;

		if (!title || !date) {
			return NextResponse.json(
				{ error: 'Título e data são obrigatórios' },
				{ status: 400 }
			);
		}

		let defaultUser = await prisma.user.findFirst();

		if (!defaultUser) {
			defaultUser = await prisma.user.create({
				data: {
					name: 'Default User',
					email: 'default@example.com',
				}
			});
		}

		const agenda = await prisma.agenda.create({
			data: {
				title,
				description: description || '',
				date: new Date(date),
				image: image || null,
				userId: defaultUser.id
			}
		});

		return NextResponse.json(agenda, { status: 201 });
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json(
			{
				error: 'Erro ao criar agenda',
				details: error instanceof Error ? error.message : 'Erro desconhecido'
			},
			{ status: 500 }
		);
	}
}