import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Playlist from '@/lib/models/Playlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

interface Params {
	params: {
		id: string;
	};
}

export async function POST(request: NextRequest, { params }: Params) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { songId, key, notes } = await request.json();

		if (!songId) {
			return NextResponse.json({ error: 'ID da música não fornecido' }, { status: 400 });
		}

		const playlist = await Playlist.findById(params.id);

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		// Verificar se a música já está na playlist
		const songExists = playlist.songs.some(
			song => song.songId.toString() === songId
		);

		if (songExists) {
			return NextResponse.json({
				error: 'Música já existe na playlist'
			}, { status: 409 });
		}

		// Determinar a próxima ordem
		const nextOrder = playlist.songs.length > 0
			? Math.max(...playlist.songs.map(s => s.order)) + 1
			: 0;

		// Adicionar música à playlist
		const updatedPlaylist = await Playlist.findByIdAndUpdate(
			params.id,
			{
				$push: {
					songs: {
						songId: new mongoose.Types.ObjectId(songId),
						order: nextOrder,
						key,
						notes
					}
				}
			},
			{ new: true, runValidators: true }
		).populate('songs.songId', 'title artist key');

		return NextResponse.json(updatedPlaylist);
	} catch (error) {
		console.error('Erro ao adicionar música à playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Params) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { songs } = await request.json();

		if (!Array.isArray(songs)) {
			return NextResponse.json({ error: 'Formato inválido de músicas' }, { status: 400 });
		}

		const playlist = await Playlist.findById(params.id);

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		// Atualizar ordem das músicas
		const updatedPlaylist = await Playlist.findByIdAndUpdate(
			params.id,
			{ $set: { songs } },
			{ new: true, runValidators: true }
		).populate('songs.songId', 'title artist key');

		return NextResponse.json(updatedPlaylist);
	} catch (error) {
		console.error('Erro ao atualizar músicas da playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { songId } = await request.json();

		if (!songId) {
			return NextResponse.json({ error: 'ID da música não fornecido' }, { status: 400 });
		}

		const playlist = await Playlist.findById(params.id);

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		// Remover música da playlist
		const updatedPlaylist = await Playlist.findByIdAndUpdate(
			params.id,
			{ $pull: { songs: { songId } } },
			{ new: true }
		).populate('songs.songId', 'title artist key');

		// Reordenar músicas restantes
		if (updatedPlaylist) {
			updatedPlaylist.songs = updatedPlaylist.songs
				.sort((a, b) => a.order - b.order)
				.map((song, index) => ({ ...song, order: index }));

			await updatedPlaylist.save();
		}

		return NextResponse.json(updatedPlaylist);
	} catch (error) {
		console.error('Erro ao remover música da playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 