import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const baseUrl = new URL('/', request.url).origin

	// CORS handling for API routes
	if (pathname.startsWith('/api/')) {
		const response = NextResponse.next()

		response.headers.set('Access-Control-Allow-Credentials', 'true')
		response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
		response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
		response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

		if (request.method === 'OPTIONS') {
			return new NextResponse(null, { status: 200, headers: response.headers })
		}

		return response
	}

	// Public routes - always allowed
	if (pathname.includes('/favicon.ico') ||
		pathname.startsWith('/_next') ||
		pathname === '/' ||
		pathname.startsWith('/auth') ||
		pathname === '/voluntarios' ||
		pathname === '/access-denied'
	) {
		return NextResponse.next()
	}

	// Check for auth token
	const token = request.cookies.get('auth-token')?.value
	let user = null

	if (token) {
		try {
			const secretKey = process.env.JWT_SECRET || 'sua-chave-secreta-aqui'
			const key = new TextEncoder().encode(secretKey)
			const { payload } = await jwtVerify(token, key)
			user = payload
		} catch (error) {
			console.error('Token verification error:', error)
		}
	}

	// Already logged in trying to access auth page
	if (pathname === '/auth' && user) {
		if (user.isAdmin) {
			return NextResponse.redirect(new URL('/app', baseUrl))
		} else {
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}
	}

	// Protected admin routes
	if (pathname.startsWith('/app') || pathname.startsWith('/admin-tools')) {
		if (!user) {
			console.log('Usuário não autenticado tentando acessar área restrita')
			return NextResponse.redirect(new URL('/auth', baseUrl))
		}

		if (!user.isAdmin) {
			console.log('Usuário sem privilégios de admin tentando acessar área restrita')
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}

		console.log('Acesso permitido para usuário admin:', user.email)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}