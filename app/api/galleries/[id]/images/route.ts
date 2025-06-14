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

		const { images } = await request.json();

		if (!images || !Array.isArray(images)) {
			return NextResponse.json({ error: 'Formato de imagens inválido' }, { status: 400 });
		}

		const gallery = await prisma.gallery.findUnique({
			where: { id: params.id }
		});

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		// Adicionar imagens à galeria
		const imagePromises = images.map((image: any, index: number) =>
			prisma.galleryImage.create({
				data: {
					url: image.url,
					caption: image.caption,
					order: image.order || index,
					galleryId: params.id
				}
			})
		);

		await Promise.all(imagePromises);

		const updatedGallery = await prisma.gallery.findUnique({
			where: { id: params.id },
			include: {
				images: {
					orderBy: { order: 'asc' }
				}
			}
		});

		return NextResponse.json(updatedGallery);
	} catch (error) {
		console.error('Erro ao adicionar imagens à galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { imageIds } = await request.json();

		if (!imageIds || !Array.isArray(imageIds)) {
			return NextResponse.json({ error: 'IDs de imagens inválidos' }, { status: 400 });
		}

		const gallery = await prisma.gallery.findUnique({
			where: { id: params.id }
		});

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		// Remover imagens da galeria
		await prisma.galleryImage.deleteMany({
			where: {
				id: { in: imageIds },
				galleryId: params.id
			}
		});

		const updatedGallery = await prisma.gallery.findUnique({
			where: { id: params.id },
			include: {
				images: {
					orderBy: { order: 'asc' }
				}
			}
		});

		return NextResponse.json(updatedGallery);
	} catch (error) {
		console.error('Erro ao remover imagens da galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 