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

		const playlist = await prisma.playlist.findUnique({
			where: { id: params.id },
			include: {
				songs: {
					include: {
						song: true
					},
					orderBy: { order: 'asc' }
				}
			}
		});

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		return NextResponse.json(playlist);
	} catch (error) {
		console.error('Erro ao buscar playlist:', error);
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

		const playlist = await prisma.playlist.findUnique({
			where: { id: params.id }
		});

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		const updatedPlaylist = await prisma.playlist.update({
			where: { id: params.id },
			data: {
				title: data.title,
				date: data.date ? new Date(data.date) : undefined,
				eventType: data.eventType,
			},
			include: {
				songs: {
					include: {
						song: true
					},
					orderBy: { order: 'asc' }
				}
			}
		});

		return NextResponse.json(updatedPlaylist);
	} catch (error) {
		console.error('Erro ao atualizar playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const playlist = await prisma.playlist.findUnique({
			where: { id: params.id }
		});

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		await prisma.playlist.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ message: 'Playlist removida com sucesso' });
	} catch (error) {
		console.error('Erro ao remover playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 