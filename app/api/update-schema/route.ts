import { NextResponse } from 'next/server';
import { prisma } from '@/services/database';

export async function GET() {
	try {
		const columns = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'password'
    `;

		const passwordColumnExists = Array.isArray(columns) && columns.length > 0;

		if (!passwordColumnExists) {
			await prisma.$executeRaw`
        ALTER TABLE users
        ADD COLUMN password TEXT
      `;

			return NextResponse.json({
				success: true,
				message: 'Coluna password adicionada com sucesso'
			});
		} else {
			return NextResponse.json({
				success: true,
				message: 'Coluna password já existe na tabela users'
			});
		}
	} catch (error) {
		console.error('Erro ao atualizar esquema:', error);

		return NextResponse.json({
			success: false,
			error: 'Erro ao atualizar esquema',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
} 