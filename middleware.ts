import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const getUrl = (path: string) => {
	const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
	return `${baseUrl}${path}`;
};

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('next-auth.session-token')
	const pathname = request.nextUrl.pathname

	if (pathname.startsWith('/api/')) {
		return NextResponse.next()
	}

	if (pathname.includes('/favicon.ico') ||
		pathname.startsWith('/_next') ||
		pathname === '/' ||
		pathname.startsWith('/auth')
	) {
		return NextResponse.next()
	}

	if (pathname === '/auth' && token) {
		return NextResponse.redirect(new URL('/app', request.url))
	}

	if (pathname.startsWith('/app')) {
		if (!token) {
			return NextResponse.redirect(new URL('/auth', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}