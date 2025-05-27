import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Playlist from '@/lib/models/Playlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const churchId = searchParams.get('churchId');
		const eventType = searchParams.get('eventType');
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		// Construir query
		const query: any = { churchId };

		if (eventType) {
			query.eventType = eventType;
		}

		if (startDate || endDate) {
			query.date = {};
			if (startDate) {
				query.date.$gte = new Date(startDate);
			}
			if (endDate) {
				query.date.$lte = new Date(endDate);
			}
		}

		const playlists = await Playlist.find(query)
			.sort({ date: -1 });

		return NextResponse.json(playlists);
	} catch (error) {
		console.error('Erro ao buscar playlists:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		if (!data.title || !data.date || !data.eventType || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		// Garantir que songs seja um array
		if (!data.songs) {
			data.songs = [];
		}

		// Criar nova playlist
		const playlist = await Playlist.create(data);

		return NextResponse.json(playlist, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar playlist:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 