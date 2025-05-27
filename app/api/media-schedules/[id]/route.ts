import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MediaSchedule from '@/lib/models/MediaSchedule';
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

		const schedule = await MediaSchedule.findById(params.id)
			.populate('memberId', 'name');

		if (!schedule) {
			return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
		}

		return NextResponse.json(schedule);
	} catch (error) {
		console.error('Erro ao buscar escala de mídia:', error);
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

		const schedule = await MediaSchedule.findByIdAndUpdate(
			params.id,
			{ $set: data },
			{ new: true, runValidators: true }
		).populate('memberId', 'name');

		if (!schedule) {
			return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
		}

		return NextResponse.json(schedule);
	} catch (error) {
		console.error('Erro ao atualizar escala de mídia:', error);

		if (error.code === 11000) {
			return NextResponse.json({
				error: 'Conflito: Já existe um membro escalado para este dia e função'
			}, { status: 409 });
		}

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

		const schedule = await MediaSchedule.findByIdAndDelete(params.id);

		if (!schedule) {
			return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Escala excluída com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir escala de mídia:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 