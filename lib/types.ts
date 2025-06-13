import { Prisma } from '@prisma/client';

export enum Role {
	USER = 'USER',
	MEDIA_CHURCH = 'MEDIA_CHURCH',
	WORSHIP_CHURCH = 'WORSHIP_CHURCH',
	WORKERS = 'WORKERS',
	MASTER = 'MASTER',
	DEVELOPER = 'DEVELOPER'
}

export interface Church {
	id: string;
	name: string;
	address?: string | null;
}

export interface UserWithChurch {
	id: string;
	name?: string | null;
	email?: string | null;
	emailVerified?: Date | null;
	image?: string | null;
	isAdmin: boolean;
	isLeader: boolean;
	role: Role;
	churchId?: string | null;
	church?: {
		id: string;
		name: string;
	} | null;
}

export type SafeUser = Omit<UserWithChurch, 'password'>;

// Type for Prisma User selection
export type UserSelect = Prisma.UserSelect; 