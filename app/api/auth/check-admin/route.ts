import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ authenticated: false },
				{ status: 401 }
			);
		}

		return NextResponse.json({
			authenticated: true,
			isAdmin: session.user.isAdmin || false
		});
	} catch (error) {
		console.error('Erro ao verificar status de administrador:', error);
		return NextResponse.json(
			{ error: 'Erro ao verificar status de administrador' },
			{ status: 500 }
		);
	}
} 