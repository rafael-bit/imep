import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

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

		const song = await prisma.song.findUnique({
			where: { id: params.id }
		});

		if (!song) {
			return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
		}

		return NextResponse.json(song);
	} catch (error) {
		console.error('Erro ao buscar música:', error);
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

		const song = await prisma.song.update({
			where: { id: params.id },
			data: {
				title: data.title,
				artist: data.artist,
				key: data.key,
				bpm: data.bpm || 0,
				category: data.category,
				lyrics: data.lyrics || '',
				chords: data.chords || '',
				youtubeLink: data.youtubeLink || ''
			}
		});

		return NextResponse.json(song);
	} catch (error) {
		console.error('Erro ao atualizar música:', error);

		if (error.code === 'P2002') {
			return NextResponse.json({
				error: 'Música com esse título e artista já existe'
			}, { status: 409 });
		}

		if (error.code === 'P2025') {
			return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
		}

		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		await prisma.song.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ message: 'Música excluída com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir música:', error);

		if (error.code === 'P2025') {
			return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
		}

		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 