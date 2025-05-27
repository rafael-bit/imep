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

export async function GET(request: NextRequest, { params }: Params) {
	try {
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const gallery = await Gallery.findById(params.id);

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
		await dbConnect();
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		const gallery = await Gallery.findByIdAndUpdate(
			params.id,
			{ $set: data },
			{ new: true, runValidators: true }
		);

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		return NextResponse.json(gallery);
	} catch (error) {
		console.error('Erro ao atualizar galeria:', error);
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

		const gallery = await Gallery.findByIdAndDelete(params.id);

		if (!gallery) {
			return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Galeria excluída com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir galeria:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 