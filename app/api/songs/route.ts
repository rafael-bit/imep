import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const churchId = searchParams.get('churchId');
		const search = searchParams.get('search');
		const category = searchParams.get('category');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		// Construir query
		const query: any = {
			where: {
				churchId: churchId,
				...(category && { category }),
				...(search && {
					OR: [
						{ title: { contains: search, mode: 'insensitive' } },
						{ artist: { contains: search, mode: 'insensitive' } }
					]
				})
			},
			orderBy: {
				title: 'asc'
			}
		};

		const songs = await prisma.song.findMany(query);

		return NextResponse.json(songs);
	} catch (error) {
		console.error('Erro ao buscar músicas:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		if (!data.title || !data.artist || !data.key || !data.category || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		// Criar nova música
		const song = await prisma.song.create({
			data: {
				title: data.title,
				artist: data.artist,
				key: data.key,
				bpm: data.bpm || 0,
				category: data.category,
				lyrics: data.lyrics || '',
				chords: data.chords || '',
				youtubeLink: data.youtubeLink || '',
				churchId: data.churchId
			}
		});

		return NextResponse.json(song, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar música:', error);

		if (error.code === 'P2002') {
			return NextResponse.json({
				error: 'Música já existe no repertório'
			}, { status: 409 });
		}

		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 