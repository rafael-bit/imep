import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { Role } from '@/lib/types'

// Função para verificar se o usuário tem permissão para acessar uma rota específica
const canAccessRoute = (user: any, pathname: string) => {
	// Administradores, Masters e Developers têm acesso a tudo
	if (user.isAdmin || user.role === Role.MASTER || user.role === Role.DEVELOPER) {
		return true;
	}

	// Permissões para líderes de departamento
	if (user.isLeader) {
		// Líderes de mídia podem editar recursos de mídia
		if (user.role === Role.MEDIA_CHURCH &&
			(pathname.includes('/dashboard/galeria') ||
				pathname.includes('/dashboard/agenda') ||
				pathname.includes('/dashboard/equipamentos'))) {
			return true;
		}

		// Líderes de louvor podem editar recursos de louvor
		if (user.role === Role.WORSHIP_CHURCH &&
			(pathname.includes('/dashboard/escala-louvor') ||
				pathname.includes('/dashboard/musicas'))) {
			return true;
		}

		// Líderes de obreiros podem editar recursos de obreiros
		if (user.role === Role.WORKERS &&
			pathname.includes('/dashboard/escala-obreiros')) {
			return true;
		}
	}

	// Acesso básico ao dashboard para todos os usuários com papéis válidos
	if (['MEDIA_CHURCH', 'WORSHIP_CHURCH', 'WORKERS'].includes(user.role) &&
		(pathname === '/dashboard' || pathname.startsWith('/dashboard/perfil'))) {
		return true;
	}

	// Se não passou por nenhuma verificação acima, não tem permissão
	return false;
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const baseUrl = new URL('/', request.url).origin

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

	if (pathname.includes('/favicon.ico') ||
		pathname.startsWith('/_next') ||
		pathname === '/' ||
		pathname.startsWith('/auth') ||
		pathname === '/voluntarios' ||
		pathname === '/access-denied'
	) {
		return NextResponse.next()
	}

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

	if (pathname === '/auth' && user) {
		if (user.role === Role.DEVELOPER || user.role === Role.MASTER || user.isAdmin) {
			return NextResponse.redirect(new URL('/app', baseUrl))
		} else if (['MEDIA_CHURCH', 'WORSHIP_CHURCH', 'WORKERS'].includes(user.role)) {
			return NextResponse.redirect(new URL('/dashboard', baseUrl))
		} else {
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}
	}

	if (pathname === '/app' || pathname.startsWith('/app/')) {
		if (!user) {
			console.log('Usuário não autenticado tentando acessar área restrita')
			return NextResponse.redirect(new URL('/auth', baseUrl))
		}

		if (!(user.role === Role.DEVELOPER || user.role === Role.MASTER)) {
			console.log('Usuário sem privilégios de master tentando acessar área restrita')
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}

		console.log('Acesso permitido para usuário master:', user.email)
	}

	if (pathname.startsWith('/admin-tools')) {
		if (!user) {
			console.log('Usuário não autenticado tentando acessar área restrita')
			return NextResponse.redirect(new URL('/auth', baseUrl))
		}

		if (!(user.role === Role.DEVELOPER || user.role === Role.MASTER || user.isAdmin)) {
			console.log('Usuário sem privilégios de admin tentando acessar área restrita')
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}

		console.log('Acesso permitido para usuário admin:', user.email)
	}

	if (pathname.startsWith('/dashboard')) {
		if (!user) {
			console.log('Usuário não autenticado tentando acessar área restrita')
			return NextResponse.redirect(new URL('/auth', baseUrl))
		}

		if (!(['MEDIA_CHURCH', 'WORSHIP_CHURCH', 'WORKERS', 'MASTER', 'DEVELOPER'].includes(user.role) || user.isAdmin)) {
			console.log('Usuário sem privilégios tentando acessar dashboard')
			return NextResponse.redirect(new URL('/access-denied', baseUrl))
		}

		// Verificação adicional para rotas específicas de departamento
		if (pathname !== '/dashboard' && !canAccessRoute(user, pathname)) {
			console.log('Usuário sem permissão para acessar recurso específico:', pathname)
			return NextResponse.redirect(new URL('/dashboard', baseUrl))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}