import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

interface Params {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, { params }: Params) {
	try {
		const id = params.id;

		// If the ID is "all", return all agendas
		if (id === 'all') {
			const agendas = await prisma.agenda.findMany({
				orderBy: { date: 'asc' }
			});
			return NextResponse.json(agendas);
		}

		// Otherwise, return a specific agenda
		const agenda = await prisma.agenda.findUnique({
			where: { id }
		});

		if (!agenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json(agenda);
	} catch (error) {
		console.error('Erro ao buscar agenda:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar agenda' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { title, description, date, image } = await request.json();

		if (!title || !date) {
			return NextResponse.json(
				{ error: 'Título e data são obrigatórios' },
				{ status: 400 }
			);
		}

		let defaultUser = await prisma.user.findFirst();
		if (!defaultUser) {
			defaultUser = await prisma.user.create({
				data: { name: 'Default User', email: 'default@example.com' }
			});
		}

		const agenda = await prisma.agenda.create({
			data: {
				title,
				description: description ?? null,
				date: new Date(date),
				image: image || null,
				userId: defaultUser.id
			} as any
		});

		return NextResponse.json(agenda, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar agenda:', error);
		return NextResponse.json(
			{
				error: 'Erro ao criar agenda',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}

export async function PATCH(request: NextRequest, { params }: Params) {
	try {
		const id = params.id;
		const { title, description, date, image } = await request.json();

		if (!title || !date) {
			return NextResponse.json(
				{ error: 'Título e data são obrigatórios' },
				{ status: 400 }
			);
		}

		// Check if agenda exists
		const existingAgenda = await prisma.agenda.findUnique({
			where: { id }
		});

		if (!existingAgenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		// Update the agenda
		const updatedAgenda = await prisma.agenda.update({
			where: { id },
			data: {
				title,
				description: description ?? null,
				date: new Date(date),
				image: image || null,
			} as any
		});

		return NextResponse.json(updatedAgenda);
	} catch (error) {
		console.error('Erro ao atualizar agenda:', error);
		return NextResponse.json(
			{
				error: 'Erro ao atualizar agenda',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const id = params.id;

		// Check if agenda exists
		const existingAgenda = await prisma.agenda.findUnique({
			where: { id }
		});

		if (!existingAgenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		// Delete the agenda
		await prisma.agenda.delete({
			where: { id }
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Erro ao excluir agenda:', error);
		return NextResponse.json(
			{
				error: 'Erro ao excluir agenda',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}