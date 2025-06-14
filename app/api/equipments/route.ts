import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Equipment from '@/lib/models/Equipment';
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
		const type = searchParams.get('type');
		const status = searchParams.get('status');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		const query: any = { churchId };

		if (type) {
			query.type = type;
		}

		if (status) {
			query.status = status;
		}

		const equipments = await Equipment.find(query)
			.sort({ name: 1 });

		return NextResponse.json(equipments);
	} catch (error) {
		console.error('Erro ao buscar equipamentos:', error);
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

		if (!data.name || !data.type || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		const equipment = await Equipment.create(data);

		return NextResponse.json(equipment, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar equipamento:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 