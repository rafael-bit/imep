import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Tipo para as permissões
export type Permission =
	| 'GALLERY_VIEW'
	| 'GALLERY_MANAGE'
	| 'MEDIA_SCHEDULE_VIEW'
	| 'MEDIA_SCHEDULE_MANAGE'
	| 'SONG_VIEW'
	| 'SONG_MANAGE'
	| 'WORSHIP_SCHEDULE_VIEW'
	| 'WORSHIP_SCHEDULE_MANAGE'
	| 'WORKER_SCHEDULE_VIEW'
	| 'WORKER_SCHEDULE_MANAGE'
	| 'EQUIPMENT_VIEW'
	| 'EQUIPMENT_MANAGE'
	| 'PLAYLIST_VIEW'
	| 'PLAYLIST_MANAGE';

// Mapeamento de roles para permissões
const rolePermissions: Record<string, Permission[]> = {
	'ADMIN': [
		'GALLERY_VIEW', 'GALLERY_MANAGE',
		'MEDIA_SCHEDULE_VIEW', 'MEDIA_SCHEDULE_MANAGE',
		'SONG_VIEW', 'SONG_MANAGE',
		'WORSHIP_SCHEDULE_VIEW', 'WORSHIP_SCHEDULE_MANAGE',
		'WORKER_SCHEDULE_VIEW', 'WORKER_SCHEDULE_MANAGE',
		'EQUIPMENT_VIEW', 'EQUIPMENT_MANAGE',
		'PLAYLIST_VIEW', 'PLAYLIST_MANAGE'
	],
	'MASTER': [
		'GALLERY_VIEW', 'GALLERY_MANAGE',
		'MEDIA_SCHEDULE_VIEW', 'MEDIA_SCHEDULE_MANAGE',
		'SONG_VIEW', 'SONG_MANAGE',
		'WORSHIP_SCHEDULE_VIEW', 'WORSHIP_SCHEDULE_MANAGE',
		'WORKER_SCHEDULE_VIEW', 'WORKER_SCHEDULE_MANAGE',
		'EQUIPMENT_VIEW', 'EQUIPMENT_MANAGE',
		'PLAYLIST_VIEW', 'PLAYLIST_MANAGE'
	],
	'MEDIA_CHURCH': [
		'GALLERY_VIEW', 'GALLERY_MANAGE',
		'MEDIA_SCHEDULE_VIEW', 'MEDIA_SCHEDULE_MANAGE',
		'EQUIPMENT_VIEW'
	],
	'WORSHIP_CHURCH': [
		'SONG_VIEW', 'SONG_MANAGE',
		'WORSHIP_SCHEDULE_VIEW', 'WORSHIP_SCHEDULE_MANAGE',
		'PLAYLIST_VIEW', 'PLAYLIST_MANAGE',
		'EQUIPMENT_VIEW'
	],
	'WORKERS': [
		'WORKER_SCHEDULE_VIEW', 'WORKER_SCHEDULE_MANAGE'
	],
	'USER': [
		'GALLERY_VIEW',
		'MEDIA_SCHEDULE_VIEW',
		'SONG_VIEW',
		'WORSHIP_SCHEDULE_VIEW',
		'WORKER_SCHEDULE_VIEW',
		'EQUIPMENT_VIEW',
		'PLAYLIST_VIEW'
	]
};

export const usePermission = () => {
	const { data: session, status } = useSession();
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'loading') {
			setLoading(true);
		} else if (status === 'authenticated' && session?.user?.role) {
			const userRole = session.user.role;
			setPermissions(rolePermissions[userRole] || []);
			setLoading(false);
		} else {
			setPermissions([]);
			setLoading(false);
		}
	}, [session, status]);

	const hasPermission = (permission: Permission): boolean => {
		return permissions.includes(permission);
	};

	return { hasPermission, permissions, loading };
}; 