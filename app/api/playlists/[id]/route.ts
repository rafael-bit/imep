import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Playlist from '@/lib/models/Playlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, { params }: Params) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const playlist = await Playlist.findById(params.id)
			.populate('songs.songId', 'title artist key');

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
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		const playlist = await Playlist.findByIdAndUpdate(
			params.id,
			{ $set: data },
			{ new: true, runValidators: true }
		).populate('songs.songId', 'title artist key');

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		return NextResponse.json(playlist);
	} catch (error) {
		console.error('Erro ao atualizar playlist:', error);
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

		const playlist = await Playlist.findByIdAndDelete(params.id);

		if (!playlist) {
			return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Playlist excluída com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 