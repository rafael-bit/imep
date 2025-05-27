/**
 * Cliente API para o front-end
 */

// Função genérica para fazer requisições à API
async function fetchAPI<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
	};

	const response = await fetch(`/api${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao fazer requisição à API');
	}

	return response.json();
}

// API para Galerias
export const GalleryAPI = {
	getAll: (churchId: string) => fetchAPI<any[]>(`/galleries?churchId=${churchId}`),

	getById: (id: string) => fetchAPI<any>(`/galleries/${id}`),

	create: (data: any) => fetchAPI<any>('/galleries', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	update: (id: string, data: any) => fetchAPI<any>(`/galleries/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/galleries/${id}`, {
		method: 'DELETE',
	}),

	addImages: (galleryId: string, images: any[]) => fetchAPI<any>(`/galleries/${galleryId}/images`, {
		method: 'POST',
		body: JSON.stringify({ images }),
	}),

	removeImages: (galleryId: string, imageIds: string[]) => fetchAPI<any>(`/galleries/${galleryId}/images`, {
		method: 'DELETE',
		body: JSON.stringify({ imageIds }),
	}),
};

// API para Escalas de Mídia
export const MediaScheduleAPI = {
	getAll: (churchId: string, params?: { type?: string, startDate?: string, endDate?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.type) query += `&type=${params.type}`;
		if (params?.startDate) query += `&startDate=${params.startDate}`;
		if (params?.endDate) query += `&endDate=${params.endDate}`;

		return fetchAPI<any[]>(`/media-schedules${query}`);
	},

	getById: (id: string) => fetchAPI<any>(`/media-schedules/${id}`),

	create: (data: any) => fetchAPI<any>('/media-schedules', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	update: (id: string, data: any) => fetchAPI<any>(`/media-schedules/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/media-schedules/${id}`, {
		method: 'DELETE',
	}),
};

// API para Músicas
export const SongAPI = {
	getAll: (churchId: string, params?: { search?: string, category?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.search) query += `&search=${params.search}`;
		if (params?.category) query += `&category=${params.category}`;

		return fetchAPI<any[]>(`/songs${query}`);
	},

	getById: (id: string) => fetchAPI<any>(`/songs/${id}`),

	create: (data: any) => fetchAPI<any>('/songs', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	update: (id: string, data: any) => fetchAPI<any>(`/songs/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/songs/${id}`, {
		method: 'DELETE',
	}),
};

// API para Membros da Equipe
export const TeamMemberAPI = {
	getAll: (churchId: string, params?: { instrument?: string, isActive?: boolean }) => {
		let query = `?churchId=${churchId}`;

		if (params?.instrument) query += `&instrument=${params.instrument}`;
		if (params?.isActive !== undefined) query += `&isActive=${params.isActive}`;

		return fetchAPI<any[]>(`/team-members${query}`);
	},

	create: (data: any) => fetchAPI<any>('/team-members', {
		method: 'POST',
		body: JSON.stringify(data),
	}),
};

// API para Escalas de Louvor
export const WorshipScheduleAPI = {
	getAll: (churchId: string, params?: { role?: string, startDate?: string, endDate?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.role) query += `&role=${params.role}`;
		if (params?.startDate) query += `&startDate=${params.startDate}`;
		if (params?.endDate) query += `&endDate=${params.endDate}`;

		return fetchAPI<any[]>(`/worship-schedules${query}`);
	},

	create: (data: any) => fetchAPI<any>('/worship-schedules', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/worship-schedules/${id}`, {
		method: 'DELETE',
	}),
};

// API para Escalas de Obreiros
export const WorkerScheduleAPI = {
	getAll: (churchId: string, params?: { role?: string, startDate?: string, endDate?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.role) query += `&role=${params.role}`;
		if (params?.startDate) query += `&startDate=${params.startDate}`;
		if (params?.endDate) query += `&endDate=${params.endDate}`;

		return fetchAPI<any[]>(`/worker-schedules${query}`);
	},

	create: (data: any) => fetchAPI<any>('/worker-schedules', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/worker-schedules/${id}`, {
		method: 'DELETE',
	}),
};

// API para Equipamentos
export const EquipmentAPI = {
	getAll: (churchId: string, params?: { type?: string, status?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.type) query += `&type=${params.type}`;
		if (params?.status) query += `&status=${params.status}`;

		return fetchAPI<any[]>(`/equipments${query}`);
	},

	getById: (id: string) => fetchAPI<any>(`/equipments/${id}`),

	create: (data: any) => fetchAPI<any>('/equipments', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	update: (id: string, data: any) => fetchAPI<any>(`/equipments/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/equipments/${id}`, {
		method: 'DELETE',
	}),
};

// API para Playlists
export const PlaylistAPI = {
	getAll: (churchId: string, params?: { eventType?: string, startDate?: string, endDate?: string }) => {
		let query = `?churchId=${churchId}`;

		if (params?.eventType) query += `&eventType=${params.eventType}`;
		if (params?.startDate) query += `&startDate=${params.startDate}`;
		if (params?.endDate) query += `&endDate=${params.endDate}`;

		return fetchAPI<any[]>(`/playlists${query}`);
	},

	getById: (id: string) => fetchAPI<any>(`/playlists/${id}`),

	create: (data: any) => fetchAPI<any>('/playlists', {
		method: 'POST',
		body: JSON.stringify(data),
	}),

	update: (id: string, data: any) => fetchAPI<any>(`/playlists/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}),

	delete: (id: string) => fetchAPI<any>(`/playlists/${id}`, {
		method: 'DELETE',
	}),

	addSong: (playlistId: string, songData: { songId: string, key?: string, notes?: string }) =>
		fetchAPI<any>(`/playlists/${playlistId}/songs`, {
			method: 'POST',
			body: JSON.stringify(songData),
		}),

	updateSongs: (playlistId: string, songs: any[]) => fetchAPI<any>(`/playlists/${playlistId}/songs`, {
		method: 'PUT',
		body: JSON.stringify({ songs }),
	}),

	removeSong: (playlistId: string, songId: string) => fetchAPI<any>(`/playlists/${playlistId}/songs`, {
		method: 'DELETE',
		body: JSON.stringify({ songId }),
	}),
};

// API para Upload de Arquivos
export const UploadAPI = {
	uploadFiles: async (files: File[], folder: string = 'uploads') => {
		const formData = new FormData();
		formData.append('folder', folder);

		files.forEach((file, index) => {
			formData.append(`file${index}`, file);
		});

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao fazer upload dos arquivos');
		}

		return response.json();
	},
}; 