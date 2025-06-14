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

		const equipment = await prisma.equipment.findUnique({
			where: { id: params.id }
		});

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
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const data = await request.json();

		const equipment = await prisma.equipment.findUnique({
			where: { id: params.id }
		});

		if (!equipment) {
			return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
		}

		const updatedEquipment = await prisma.equipment.update({
			where: { id: params.id },
			data: {
				name: data.name,
				type: data.type?.toUpperCase(),
				status: data.status?.toUpperCase(),
				assignedTo: data.assignedTo,
				notes: data.notes,
				serialNumber: data.serialNumber,
				purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
			}
		});

		return NextResponse.json(updatedEquipment);
	} catch (error) {
		console.error('Erro ao atualizar equipamento:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const equipment = await prisma.equipment.findUnique({
			where: { id: params.id }
		});

		if (!equipment) {
			return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
		}

		await prisma.equipment.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ message: 'Equipamento removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover equipamento:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 