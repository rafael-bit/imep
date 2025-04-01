import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

export async function GET(request: NextRequest) {
	try {
		const agendas = await prisma.agenda.findMany({
			orderBy: {
				date: 'asc'
			}
		});

		return NextResponse.json(agendas);
	} catch (error) {
		console.error('Erro ao buscar agendas:', error);
		return NextResponse.json({ error: 'Erro ao buscar agendas' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { title, description, date } = await request.json();
		console.log('Received agenda data:', { title, description, date });

		if (!title || !date) {
			return NextResponse.json({ error: 'Título e data são obrigatórios' }, { status: 400 });
		}

		let defaultUser = await prisma.user.findFirst();

		if (!defaultUser) {
			defaultUser = await prisma.user.create({
				data: {
					name: 'Default User',
					email: 'default@example.com',
				}
			});
			console.log('Created default user:', defaultUser);
		}

		const agenda = await prisma.agenda.create({
			data: {
				title,
				description,
				date: new Date(date),
				userId: defaultUser.id
			}
		});

		return NextResponse.json(agenda, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar agenda - full error:', error);
		return NextResponse.json({
			error: 'Erro ao criar agenda',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
}