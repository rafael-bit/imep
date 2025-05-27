import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WorkerSchedule from '@/lib/models/WorkerSchedule';
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
		const role = searchParams.get('role');
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');

		if (!churchId) {
			return NextResponse.json({ error: 'ID da igreja não fornecido' }, { status: 400 });
		}

		// Construir query
		const query: any = { churchId };

		if (role) {
			query.role = role;
		}

		if (startDate || endDate) {
			query.date = {};
			if (startDate) {
				query.date.$gte = new Date(startDate);
			}
			if (endDate) {
				query.date.$lte = new Date(endDate);
			}
		}

		const schedules = await WorkerSchedule.find(query)
			.populate('memberId', 'name')
			.sort({ date: 1 });

		return NextResponse.json(schedules);
	} catch (error) {
		console.error('Erro ao buscar escalas de obreiros:', error);
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

		if (!data.date || !data.role || !data.memberId || !data.churchId) {
			return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
		}

		// Criar nova escala de obreiros
		const schedule = await WorkerSchedule.create(data);

		return NextResponse.json(schedule, { status: 201 });
	} catch (error) {
		console.error('Erro ao criar escala de obreiros:', error);

		if (error.code === 11000) {
			return NextResponse.json({
				error: 'Conflito: Já existe um obreiro escalado para esta função e posição'
			}, { status: 409 });
		}

		return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
} 