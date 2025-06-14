import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
	params: {
		id: string;
	};
}

export async function POST(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { songId, order, key, notes } = await request.json();

		if (!songId) {
			return NextResponse.json({ error: 'ID da música é obrigatório' }, { status: 400 });
		}

		const playlist = await prisma.playlist.findUnique({
			where: { id: params.id }
		});

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		// Verificar se a música existe
		const song = await prisma.song.findUnique({
			where: { id: songId }
		});

		if (!song) {
			return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
		}

		// Verificar se a música já está na playlist
		const existingPlaylistSong = await prisma.playlistSong.findUnique({
			where: {
				playlistId_songId: {
					playlistId: params.id,
					songId: songId
				}
			}
		});

		if (existingPlaylistSong) {
			return NextResponse.json({ error: 'Música já está na playlist' }, { status: 409 });
		}

		// Adicionar música à playlist
		const playlistSong = await prisma.playlistSong.create({
			data: {
				playlistId: params.id,
				songId: songId,
				order: order || 0,
				key: key,
				notes: notes
			},
			include: {
				song: true
			}
		});

		return NextResponse.json(playlistSong, { status: 201 });
	} catch (error) {
		console.error('Erro ao adicionar música à playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { songId } = await request.json();

		if (!songId) {
			return NextResponse.json({ error: 'ID da música é obrigatório' }, { status: 400 });
		}

		const playlist = await prisma.playlist.findUnique({
			where: { id: params.id }
		});

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		// Remover música da playlist
		const deletedPlaylistSong = await prisma.playlistSong.deleteMany({
			where: {
				playlistId: params.id,
				songId: songId
			}
		});

		if (deletedPlaylistSong.count === 0) {
			return NextResponse.json({ error: 'Música não encontrada na playlist' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Música removida da playlist com sucesso' });
	} catch (error) {
		console.error('Erro ao remover música da playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 