import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		const agenda = await prisma.agenda.findUnique({
			where: {
				id: id
			}
		});

		if (!agenda) {
			return NextResponse.json({ error: 'Agenda não encontrada' }, { status: 404 });
		}

		return NextResponse.json(agenda);
	} catch (error) {
		console.error('Erro ao buscar agenda:', error);
		return NextResponse.json({
			error: 'Erro ao buscar agenda',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const { title, description, date } = await request.json();
		console.log('Updating agenda:', { id, title, description, date });

		const existingAgenda = await prisma.agenda.findUnique({
			where: {
				id: id
			}
		});

		if (!existingAgenda) {
			return NextResponse.json({ error: 'Agenda não encontrada' }, { status: 404 });
		}

		const updatedAgenda = await prisma.agenda.update({
			where: {
				id: id
			},
			data: {
				title: title ?? existingAgenda.title,
				description: description !== undefined ? description : existingAgenda.description,
				date: date ? new Date(date) : existingAgenda.date
			}
		});

		return NextResponse.json(updatedAgenda);
	} catch (error) {
		console.error('Erro ao atualizar agenda - full error:', error);
		return NextResponse.json({
			error: 'Erro ao atualizar agenda',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		console.log('Deleting agenda with ID:', id);

		const existingAgenda = await prisma.agenda.findUnique({
			where: {
				id: id
			}
		});

		if (!existingAgenda) {
			return NextResponse.json({ error: 'Agenda não encontrada' }, { status: 404 });
		}

		await prisma.agenda.delete({
			where: {
				id: id
			}
		});

		return NextResponse.json({ message: 'Agenda excluída com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir agenda - full error:', error);
		return NextResponse.json({
			error: 'Erro ao excluir agenda',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
} 