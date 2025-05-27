import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json(
				{ authenticated: false, user: null },
				{ status: 401 }
			);
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				isAdmin: user.isAdmin,
				role: user.role,
				churchId: user.churchId,
				church: user.church
			}
		});
	} catch (error) {
		console.error('Error checking authentication status:', error);
		return NextResponse.json(
			{ error: 'Error checking authentication status' },
			{ status: 500 }
		);
	}
} 