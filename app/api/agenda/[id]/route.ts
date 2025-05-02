import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const agenda = await prisma.agenda.findUnique({
			where: {
				id: params.id
			}
		});

		if (!agenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		return NextResponse.json(agenda);
	} catch (error: unknown) {
		console.error('Erro ao buscar agenda:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar agenda' },
			{ status: 500 }
		);
	}
}

interface AgendaInput {
	title: string;
	description?: string | null;
	date: string;
	image?: string | null;
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { title, description, date, image }: AgendaInput = await request.json();

		if (!title || !date) {
			return NextResponse.json(
				{ error: 'Título e data são obrigatórios' },
				{ status: 400 }
			);
		}

		// Check if agenda exists
		const existingAgenda = await prisma.agenda.findUnique({
			where: {
				id: params.id
			}
		});

		if (!existingAgenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		// Update agenda
		const updatedAgenda = await prisma.agenda.update({
			where: {
				id: params.id
			},
			data: {
				title,
				description: description ?? null,
				date: new Date(date),
				image: image || null
			}
		});

		return NextResponse.json(updatedAgenda);
	} catch (error: unknown) {
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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Check if agenda exists
		const existingAgenda = await prisma.agenda.findUnique({
			where: {
				id: params.id
			}
		});

		if (!existingAgenda) {
			return NextResponse.json(
				{ error: 'Agenda não encontrada' },
				{ status: 404 }
			);
		}

		// Delete agenda
		await prisma.agenda.delete({
			where: {
				id: params.id
			}
		});

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
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

export async function POST(request: NextRequest, { }: { params: { id: string } }) {
	try {
		const { title, description, date, image }: AgendaInput = await request.json();

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
				description: description ?? null,
				date: new Date(date),
				image: image || null,
				userId: defaultUser.id
			}
		});

		return NextResponse.json(agenda, { status: 201 });
	} catch (error: unknown) {
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