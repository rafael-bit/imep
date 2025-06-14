import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Gallery from '@/lib/models/Gallery';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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

		const { images } = await request.json();

		if (!images || !Array.isArray(images)) {
			return NextResponse.json({ error: 'Formato de imagens inválido' }, { status: 400 });
		}

		const gallery = await (Gallery as any).findById(params.id);

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		const updatedGallery = await (Gallery as any).findByIdAndUpdate(
			params.id,
			{ $push: { images: { $each: images } } },
			{ new: true, runValidators: true }
		);

		return NextResponse.json(updatedGallery);
	} catch (error) {
		console.error('Erro ao adicionar imagens à galeria:', error);
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

		const { imageIds } = await request.json();

		if (!imageIds || !Array.isArray(imageIds)) {
			return NextResponse.json({ error: 'IDs de imagens inválidos' }, { status: 400 });
		}

		const gallery = await (Gallery as any).findById(params.id);

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		const updatedGallery = await (Gallery as any).findByIdAndUpdate(
			params.id,
			{ $pull: { images: { _id: { $in: imageIds } } } },
			{ new: true }
		);

		return NextResponse.json(updatedGallery);
	} catch (error) {
		console.error('Erro ao remover imagens da galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 