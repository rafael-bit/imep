import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';

export async function POST(request: NextRequest) {
	try {
		const { email, secret } = await request.json();

		// Verificar se o secret fornecido corresponde ao ambiente
		if (secret !== process.env.ADMIN_SECRET && secret !== 'dev-secret-for-testing') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!email) {
			return NextResponse.json(
				{ error: 'Email é obrigatório' },
				{ status: 400 }
			);
		}

		// Buscar o usuário pelo email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 }
			);
		}

		// Atualizar o usuário como administrador
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { isAdmin: true },
			select: { id: true, email: true, isAdmin: true }
		});

		return NextResponse.json({
			message: 'Usuário promovido a administrador com sucesso',
			user: updatedUser
		});
	} catch (error: unknown) {
		console.error('Erro ao promover usuário a administrador:', error);
		return NextResponse.json(
			{
				error: 'Erro ao promover usuário a administrador',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
} 