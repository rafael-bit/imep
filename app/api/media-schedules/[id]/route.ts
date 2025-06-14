import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const mediaSchedule = await prisma.mediaSchedule.findUnique({
			where: { id: params.id }
		});

		if (!mediaSchedule) {
			return NextResponse.json({ error: 'Cronograma de mídia não encontrado' }, { status: 404 });
		}

		return NextResponse.json(mediaSchedule);
	} catch (error) {
		console.error('Erro ao buscar cronograma de mídia:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		const mediaSchedule = await prisma.mediaSchedule.findUnique({
			where: { id: params.id }
		});

		if (!mediaSchedule) {
			return NextResponse.json({ error: 'Cronograma de mídia não encontrado' }, { status: 404 });
		}

		const updatedMediaSchedule = await prisma.mediaSchedule.update({
			where: { id: params.id },
			data: {
				title: data.title,
				date: data.date ? new Date(data.date) : undefined,
				description: data.description,
			}
		});

		return NextResponse.json(updatedMediaSchedule);
	} catch (error) {
		console.error('Erro ao atualizar cronograma de mídia:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const mediaSchedule = await prisma.mediaSchedule.findUnique({
			where: { id: params.id }
		});

		if (!mediaSchedule) {
			return NextResponse.json({ error: 'Cronograma de mídia não encontrado' }, { status: 404 });
		}

		await prisma.mediaSchedule.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ message: 'Cronograma de mídia removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover cronograma de mídia:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 