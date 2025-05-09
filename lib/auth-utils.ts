import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createHash, randomBytes } from 'crypto';

const secretKey = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';
const key = new TextEncoder().encode(secretKey);

// Password utils
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString('hex');
	const hash = createHash('sha256')
		.update(password + salt)
		.digest('hex');

	return salt + ':' + hash;
}

export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
	const [salt, storedHash] = storedPassword.split(':');
	const hash = createHash('sha256')
		.update(suppliedPassword + salt)
		.digest('hex');

	return storedHash === hash;
}

// JWT utils
export async function createToken(payload: Record<string, unknown>) {
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30d')
		.sign(key);

	return token;
}

export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, key);
		return payload;
	} catch (error) {
		console.error('Erro ao verificar token:', error);
		return null;
	}
}

// Session management
export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value;

	if (!token) return null;

	const payload = await verifyToken(token);
	return payload;
}

export async function getCurrentUser() {
	const session = await getSession();

	if (!session) return null;

	return {
		id: session.id,
		email: session.email,
		name: session.name,
		image: session.image,
		isAdmin: session.isAdmin || false
	};
}

export function extractTokenFromHeader(req: NextRequest) {
	const authHeader = req.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	return authHeader.split(' ')[1];
} 