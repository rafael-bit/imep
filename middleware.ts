import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const getUrl = (path: string) => {
	const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
	return `${baseUrl}${path}`;
};

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
	const pathname = request.nextUrl.pathname

	if (pathname.startsWith('/api/')) {
		const response = NextResponse.next()

		// Add CORS headers
		response.headers.set('Access-Control-Allow-Credentials', 'true')
		response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
		response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
		response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

		// Handle preflight OPTIONS requests
		if (request.method === 'OPTIONS') {
			return new NextResponse(null, { status: 200, headers: response.headers })
		}

		return response
	}

	if (pathname.includes('/favicon.ico') ||
		pathname.startsWith('/_next') ||
		pathname === '/' ||
		pathname.startsWith('/auth')
	) {
		return NextResponse.next()
	}

	if (pathname === '/auth' && token) {
		if (token.isAdmin) {
			return NextResponse.redirect(new URL('/app', request.url))
		} else {
			return NextResponse.redirect(new URL('/access-denied', request.url))
		}
	}

	if (pathname.startsWith('/app')) {
		if (!token) {
			return NextResponse.redirect(new URL('/auth', request.url))
		}

		if (!token.isAdmin) {
			return NextResponse.redirect(new URL('/access-denied', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}