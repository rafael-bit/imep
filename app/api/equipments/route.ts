import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const churchId = searchParams.get('churchId');
		const type = searchParams.get('type');
		const status = searchParams.get('status');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		// Construir query
		const where: any = { churchId };

		if (type) {
			where.type = type.toUpperCase();
		}

		if (status) {
			where.status = status.toUpperCase();
		}

		const equipments = await prisma.equipment.findMany({
			where,
			orderBy: { name: 'asc' }
		});

		return NextResponse.json(equipments);
	} catch (error) {
		console.error('Erro ao buscar equipamentos:', error);
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

		if (!data.name || !data.type || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		// Criar novo equipamento
		const equipment = await prisma.equipment.create({
			data: {
				name: data.name,
				type: data.type.toUpperCase(),
				status: data.status?.toUpperCase() || 'AVAILABLE',
				assignedTo: data.assignedTo,
				notes: data.notes,
				serialNumber: data.serialNumber,
				purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
				churchId: data.churchId,
			}
		});

		return NextResponse.json(equipment, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar equipamento:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 