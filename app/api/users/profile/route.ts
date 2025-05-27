import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const userId = session.user.id;
		const { name, email, currentPassword, newPassword, image } = await request.json();

		// Buscar o usuário atual
		const user = await prisma.user.findUnique({
			where: { id: userId }
		});

		if (!user) {
			return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
		}

		// Verificar se o email está sendo alterado
		if (email !== user.email) {
			// Verificar se o email já está em uso
			const existingUser = await prisma.user.findFirst({
				where: {
					email,
					id: { not: userId }
				}
			});

			if (existingUser) {
				return NextResponse.json({ error: 'Este email já está em uso' }, { status: 400 });
			}
		}

		// Verificar se está alterando a senha
		let hashedPassword = undefined;
		if (newPassword) {
			// Verificar a senha atual
			const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

			if (!isPasswordValid) {
				return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
			}

			// Hash da nova senha
			const salt = await bcrypt.genSalt(10);
			hashedPassword = await bcrypt.hash(newPassword, salt);
		}

		// Atualizar o usuário
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				name,
				email,
				...(hashedPassword && { password: hashedPassword }),
				...(image && { image })
			}
		});

		return NextResponse.json({
			message: 'Perfil atualizado com sucesso',
			user: {
				id: updatedUser.id,
				name: updatedUser.name,
				email: updatedUser.email,
				image: updatedUser.image,
			}
		});
	} catch (error) {
		console.error('Erro ao atualizar perfil:', error);
		return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
	}
} 