import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TeamMember from '@/lib/models/TeamMember';
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
		const instrument = searchParams.get('instrument');
		const isActive = searchParams.get('isActive');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		// Construir query
		let query: any = { churchId };

		if (instrument) {
			query.instruments = instrument;
		}

		if (isActive !== null && isActive !== undefined) {
			query.isActive = isActive === 'true';
		}

		const members = await TeamMember.find(query)
			.sort({ name: 1 });

		return NextResponse.json(members);
	} catch (error) {
		console.error('Erro ao buscar membros da equipe:', error);
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

		if (!data.name || !data.role || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		// Criar novo membro
		const member = await TeamMember.create(data);

		return NextResponse.json(member, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar membro da equipe:', error);
		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 