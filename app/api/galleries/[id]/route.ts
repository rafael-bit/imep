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

		const gallery = await prisma.gallery.findUnique({
			where: { id: params.id },
			include: {
				images: {
					orderBy: { order: 'asc' }
				}
			}
		});

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		return NextResponse.json(gallery);
	} catch (error) {
		console.error('Erro ao buscar galeria:', error);
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

		const gallery = await prisma.gallery.findUnique({
			where: { id: params.id }
		});

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		const updatedGallery = await prisma.gallery.update({
			where: { id: params.id },
			data: {
				title: data.title,
				description: data.description,
				date: data.date ? new Date(data.date) : undefined,
			},
			include: {
				images: {
					orderBy: { order: 'asc' }
				}
			}
		});

		return NextResponse.json(updatedGallery);
	} catch (error) {
		console.error('Erro ao atualizar galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const gallery = await prisma.gallery.findUnique({
			where: { id: params.id }
		});

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		await prisma.gallery.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ message: 'Galeria removida com sucesso' });
	} catch (error) {
		console.error('Erro ao remover galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 