import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// Validação básica
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Nome, email e senha são obrigatórios' },
				{ status: 400 }
			);
		}

		// Verificar se o email já existe
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Este email já está em uso' },
				{ status: 409 }
			);
		}

		// Hash da senha
		const hashedPassword = await hash(password, 10);

		// Criar usuário
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'USER', // Papel padrão
			},
		});

		// Remover senha da resposta
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json(
			{
				message: 'Usuário criado com sucesso',
				user: userWithoutPassword
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Erro ao registrar usuário:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
} 