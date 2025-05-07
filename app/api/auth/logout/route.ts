import { NextResponse } from 'next/server';

export async function POST() {
	const response = NextResponse.json({ message: 'Logout realizado com sucesso' });

	response.cookies.set({
		name: 'auth-token',
		value: '',
		expires: new Date(0),
		path: '/',
	});

	return response;
} 