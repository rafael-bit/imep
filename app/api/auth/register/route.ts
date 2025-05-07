import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/services/database';
import { registerSchema } from '@/lib/validations/auth';
import { hashPassword } from '@/lib/auth-utils';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		console.log('Corpo da requisição: ', JSON.stringify(body, null, 2));

		// Validação via Zod
		const validatedData = registerSchema.parse(body);

		// Verificar se usuário já existe
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Este email já está cadastrado' },
				{ status: 400 }
			);
		}

		// Hash da senha
		const hashedPassword = await hashPassword(validatedData.password);

		// Obter definição dos campos disponíveis no modelo User
		const userModelInfo = Reflect.ownKeys(prisma.user.fields);
		console.log('Campos disponíveis no modelo User:', userModelInfo);

		// Criar usuário
		try {
			const newUser = await prisma.user.create({
				data: {
					name: validatedData.name,
					email: validatedData.email,
					password: hashedPassword,
					isAdmin: false
				},
				select: {
					id: true,
					name: true,
					email: true,
					isAdmin: true
				}
			});

			return NextResponse.json(
				{ message: 'Usuário registrado com sucesso', user: newUser },
				{ status: 201 }
			);
		} catch (createError) {
			console.error('Erro específico na criação:', createError);
			throw createError;
		}
	} catch (error) {
		// Registrar o erro completo no console para debug
		console.error('Erro no registro:', error);

		if (error instanceof ZodError) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 }
			);
		}

		// Detalhes adicionais do erro para debug
		const errorDetails = {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			name: error instanceof Error ? error.name : undefined
		};

		console.error('Detalhes do erro:', errorDetails);

		return NextResponse.json(
			{
				error: 'Erro ao registrar usuário',
				details: errorDetails.message
			},
			{ status: 500 }
		);
	}
} 