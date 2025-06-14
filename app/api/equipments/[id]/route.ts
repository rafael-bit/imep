import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Equipment from '@/lib/models/Equipment';
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

		const equipment = await Equipment.findById(params.id);

		if (!equipment) {
			return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
		}

		return NextResponse.json(equipment);
	} catch (error) {
		console.error('Erro ao buscar equipamento:', error);
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

		if (data.status === 'in_use' && !data.assignedTo) {
			return NextResponse.json({
				error: 'É necessário informar quem está usando o equipamento'
			}, { status: 400 });
		}

		if (data.status && data.status !== 'in_use') {
			data.assignedTo = undefined;
		}

		const equipment = await Equipment.findByIdAndUpdate(
			params.id,
			{ $set: data },
			{ new: true, runValidators: true }
		);

		if (!equipment) {
			return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
		}

		return NextResponse.json(equipment);
	} catch (error) {
		console.error('Erro ao atualizar equipamento:', error);
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

		const equipment = await Equipment.findByIdAndDelete(params.id);

		if (!equipment) {
			return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Equipamento excluído com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir equipamento:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 