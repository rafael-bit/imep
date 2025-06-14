import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
	if (process.env.NODE_ENV !== 'development') {
		return NextResponse.json({ error: 'Debug route only available in development' }, { status: 403 });
	}

	try {
		const prisma = new PrismaClient();
		await prisma.$connect();

		const envInfo = {
			NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
			NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (value hidden)' : 'Not set',
			POSTGRESQL_DB_URL: process.env.POSTGRESQL_DB_URL ? 'Set (connection string hidden)' : 'Not set',
			DATABASE_URL: process.env.DATABASE_URL ? 'Set (connection string hidden)' : 'Not set',
			NODE_ENV: process.env.NODE_ENV || 'Not set',
		};

		const userCount = await prisma.user.count();

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				name: true,
			}
		});

		return NextResponse.json({
			status: 'Database connection successful',
			databaseInfo: {
				userCount,
				users,
			},
			environmentVariables: envInfo
		});
	} catch (error: any) {
		console.error('Debug API error:', error);
		return NextResponse.json({
			status: 'Database connection failed',
			error: error.message
		}, { status: 500 });
	}
} 