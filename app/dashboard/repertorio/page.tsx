'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SongAPI } from '@/lib/api';
import { usePermission } from '@/lib/hooks/usePermission';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Search, Music, X, ChevronDown } from 'lucide-react';
import { Session } from 'next-auth';

// Define the extended session type
interface ExtendedSession extends Session {
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		churchId: string | null;
		image?: string | null;
	}
}

export default function RepertorioPage() {
	const { data: session } = useSession() as { data: ExtendedSession | null };
	const { hasPermission } = usePermission();
	const [songs, setSongs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSong, setSelectedSong] = useState<any>(null);
	const [formData, setFormData] = useState({
		title: '',
		artist: '',
		key: '',
		bpm: '',
		category: '',
		lyrics: '',
		chords: '',
		youtubeLink: '',
	});

	const canManage = hasPermission('SONG_MANAGE');

	const categories = [
		'Adoração',
		'Louvor',
		'Celebração',
		'Contemporânea',
		'Congregacional',
		'Ofertório',
		'Comunhão',
		'Natal',
		'Páscoa'
	];

	// Lista de tons musicais
	const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	useEffect(() => {
		loadSongs();
	}, [session, searchTerm, selectedCategory]);

	const loadSongs = async () => {
		if (!session?.user?.id) return;

		try {
			setLoading(true);
			const params: any = {};

			if (!session.user.churchId) {
				console.error('Church ID is missing from user session');
				setError('Não foi possível carregar o repertório: ID da igreja não encontrado.');
				setLoading(false);
				return;
			}

			if (searchTerm) {
				params.search = searchTerm;
			}

			if (selectedCategory) {
				params.category = selectedCategory;
			}

			const data = await SongAPI.getAll(session.user.churchId, params);
			setSongs(data);
		} catch (error) {
			console.error('Erro ao carregar músicas:', error);
			setError('Não foi possível carregar o repertório. Tente novamente mais tarde.');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateSong = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session?.user?.id) return;

		try {
			setSaving(true);

			// Check if churchId exists
			if (!session.user.churchId) {
				console.error('Church ID is missing from user session');
				setError('Não foi possível criar a música: ID da igreja não encontrado.');
				setSaving(false);
				return;
			}

			const songData = {
				...formData,
				bpm: formData.bpm ? parseInt(formData.bpm) : 0,
				churchId: session.user.churchId,
			};

			await SongAPI.create(songData);

			setFormData({
				title: '',
				artist: '',
				key: '',
				bpm: '',
				category: '',
				lyrics: '',
				chords: '',
				youtubeLink: '',
			});

			setIsCreating(false);
			loadSongs();
		} catch (error) {
			console.error('Erro ao criar música:', error);
			setError('Não foi possível criar a música. Tente novamente mais tarde.');
		} finally {
			setSaving(false);
		}
	};

	const handleUpdateSong = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedSong) return;

		try {
			setSaving(true);

			const songData = {
				...formData,
				bpm: formData.bpm ? parseInt(formData.bpm) : 0,
			};

			await SongAPI.update(selectedSong._id, songData);

			setIsEditing(false);
			loadSongs();

			// Atualizar a música selecionada
			const updatedSong = await SongAPI.getById(selectedSong._id);
			setSelectedSong(updatedSong);
		} catch (error) {
			console.error('Erro ao atualizar música:', error);
			setError('Não foi possível atualizar a música. Tente novamente mais tarde.');
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteSong = async (songId: string) => {
		if (!confirm('Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.')) {
			return;
		}

		try {
			await SongAPI.delete(songId);
			loadSongs();

			if (selectedSong?._id === songId) {
				setSelectedSong(null);
			}
		} catch (error) {
			console.error('Erro ao excluir música:', error);
			setError('Não foi possível excluir a música. Tente novamente mais tarde.');
		}
	};

	const handleEditClick = () => {
		if (!selectedSong) return;

		setFormData({
			title: selectedSong.title,
			artist: selectedSong.artist,
			key: selectedSong.key,
			bpm: selectedSong.bpm ? selectedSong.bpm.toString() : '',
			category: selectedSong.category,
			lyrics: selectedSong.lyrics || '',
			chords: selectedSong.chords || '',
			youtubeLink: selectedSong.youtubeLink || '',
		});

		setIsEditing(true);
	};

	const formatYoutubeLink = (link: string) => {
		if (!link) return '';

		// Verificar se é um link de incorporação ou um link normal do YouTube
		if (link.includes('youtube.com/embed/')) {
			return link;
		}

		// Extrair o ID do vídeo de um link normal do YouTube
		const videoIdMatch = link.match(/(?:v=|youtu\.be\/)([^&]+)/);
		if (videoIdMatch && videoIdMatch[1]) {
			return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
		}

		return link;
	};

	if (loading && songs.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-white">Repertório</h1>
				{canManage && (
					<Button onClick={() => {
						setIsCreating(!isCreating);
						if (isCreating) {
							setFormData({
								title: '',
								artist: '',
								key: '',
								bpm: '',
								category: '',
								lyrics: '',
								chords: '',
								youtubeLink: '',
							});
						}
					}}>
						{isCreating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
						{isCreating ? 'Cancelar' : 'Nova Música'}
					</Button>
				)}
			</div>

			{error && (
				<div className="bg-destructive/20 text-destructive p-3 rounded-md">
					{error}
				</div>
			)}

			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1">
					<div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
									<Input
										placeholder="Pesquisar música ou artista..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 bg-gray-800 border-gray-700 text-white"
									/>
								</div>
							</div>
							<div className="w-full md:w-64">
								<div className="relative">
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 appearance-none"
									>
										<option value="">Todas as categorias</option>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
								</div>
							</div>
						</div>
					</div>

					{isCreating && (
						<Card className="bg-gray-900 border-gray-800 mb-6">
							<CardContent className="pt-6">
								<form onSubmit={handleCreateSong} className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="title" className="text-white">Título</Label>
											<Input
												id="title"
												value={formData.title}
												onChange={(e) => setFormData({ ...formData, title: e.target.value })}
												required
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="artist" className="text-white">Artista</Label>
											<Input
												id="artist"
												value={formData.artist}
												onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
												required
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="key" className="text-white">Tom</Label>
											<select
												id="key"
												value={formData.key}
												onChange={(e) => setFormData({ ...formData, key: e.target.value })}
												required
												className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
											>
												<option value="">Selecione o tom</option>
												{keys.map((key) => (
													<option key={key} value={key}>
														{key}
													</option>
												))}
											</select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="bpm" className="text-white">BPM</Label>
											<Input
												id="bpm"
												type="number"
												value={formData.bpm}
												onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
												min="0"
												max="300"
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="category" className="text-white">Categoria</Label>
											<select
												id="category"
												value={formData.category}
												onChange={(e) => setFormData({ ...formData, category: e.target.value })}
												required
												className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
											>
												<option value="">Selecione a categoria</option>
												{categories.map((category) => (
													<option key={category} value={category}>
														{category}
													</option>
												))}
											</select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="youtubeLink" className="text-white">Link do YouTube</Label>
											<Input
												id="youtubeLink"
												value={formData.youtubeLink}
												onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
												placeholder="https://www.youtube.com/watch?v=..."
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="lyrics" className="text-white">Letra</Label>
										<textarea
											id="lyrics"
											value={formData.lyrics}
											onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
											rows={6}
											className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="chords" className="text-white">Cifra</Label>
										<textarea
											id="chords"
											value={formData.chords}
											onChange={(e) => setFormData({ ...formData, chords: e.target.value })}
											rows={6}
											className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 font-mono"
										/>
									</div>

									<Button type="submit" disabled={saving} className="w-full">
										{saving ? 'Salvando...' : 'Salvar Música'}
									</Button>
								</form>
							</CardContent>
						</Card>
					)}

					<div className="grid grid-cols-1 gap-4">
						{songs.length > 0 ? (
							songs.map((song) => (
								<Card
									key={song._id}
									className={`bg-gray-900 border-gray-800 hover:border-primary cursor-pointer ${selectedSong?._id === song._id ? 'border-primary' : ''}`}
									onClick={() => setSelectedSong(song)}
								>
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div>
												<div className="flex items-center">
													<Music className="h-5 w-5 text-primary mr-2" />
													<h3 className="font-bold text-white">{song.title}</h3>
												</div>
												<p className="text-gray-400">{song.artist}</p>
												<div className="flex items-center gap-3 mt-2">
													<span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
														Tom: {song.key}
													</span>
													{song.bpm > 0 && (
														<span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
															BPM: {song.bpm}
														</span>
													)}
													<span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
														{song.category}
													</span>
												</div>
											</div>
											{canManage && (
												<div className="flex gap-2">
													<Button
														size="icon"
														variant="ghost"
														onClick={(e) => {
															e.stopPropagation();
															setSelectedSong(song);
															handleEditClick();
														}}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														size="icon"
														variant="destructive"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteSong(song._id);
														}}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<div className="text-center py-10 text-gray-400">
								Nenhuma música encontrada. {canManage ? 'Clique em "Nova Música" para adicionar.' : ''}
							</div>
						)}
					</div>
				</div>

				{selectedSong && !isEditing && (
					<div className="w-full md:w-1/2 bg-gray-900 border border-gray-800 rounded-lg p-6 h-fit sticky top-6">
						<div className="flex justify-between items-start mb-4">
							<div>
								<h2 className="text-2xl font-bold text-white">{selectedSong.title}</h2>
								<p className="text-gray-400">{selectedSong.artist}</p>
							</div>
							{canManage && (
								<div className="flex gap-2">
									<Button variant="outline" onClick={handleEditClick}>
										<Edit className="mr-2 h-4 w-4" />
										Editar
									</Button>
								</div>
							)}
						</div>

						<div className="flex flex-wrap gap-3 mb-4">
							<span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-sm">
								Tom: {selectedSong.key}
							</span>
							{selectedSong.bpm > 0 && (
								<span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-sm">
									BPM: {selectedSong.bpm}
								</span>
							)}
							<span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-sm">
								{selectedSong.category}
							</span>
						</div>

						{selectedSong.youtubeLink && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-white mb-2">Vídeo</h3>
								<div className="aspect-video">
									<iframe
										src={formatYoutubeLink(selectedSong.youtubeLink)}
										className="w-full h-full rounded-md"
										allowFullScreen
									></iframe>
								</div>
							</div>
						)}

						{selectedSong.lyrics && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-white mb-2">Letra</h3>
								<div className="bg-gray-800 rounded-md p-4 whitespace-pre-wrap text-gray-300">
									{selectedSong.lyrics}
								</div>
							</div>
						)}

						{selectedSong.chords && (
							<div>
								<h3 className="text-lg font-semibold text-white mb-2">Cifra</h3>
								<div className="bg-gray-800 rounded-md p-4 whitespace-pre-wrap text-gray-300 font-mono overflow-x-auto">
									{selectedSong.chords}
								</div>
							</div>
						)}
					</div>
				)}

				{isEditing && (
					<div className="w-full md:w-1/2">
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="pt-6">
								<form onSubmit={handleUpdateSong} className="space-y-4">
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-xl font-bold text-white">Editar Música</h3>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => setIsEditing(false)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>

									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="edit-title" className="text-white">Título</Label>
											<Input
												id="edit-title"
												value={formData.title}
												onChange={(e) => setFormData({ ...formData, title: e.target.value })}
												required
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="edit-artist" className="text-white">Artista</Label>
											<Input
												id="edit-artist"
												value={formData.artist}
												onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
												required
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="edit-key" className="text-white">Tom</Label>
												<select
													id="edit-key"
													value={formData.key}
													onChange={(e) => setFormData({ ...formData, key: e.target.value })}
													required
													className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
												>
													<option value="">Selecione o tom</option>
													{keys.map((key) => (
														<option key={key} value={key}>
															{key}
														</option>
													))}
												</select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="edit-bpm" className="text-white">BPM</Label>
												<Input
													id="edit-bpm"
													type="number"
													value={formData.bpm}
													onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
													min="0"
													max="300"
													className="bg-gray-800 border-gray-700 text-white"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="edit-category" className="text-white">Categoria</Label>
											<select
												id="edit-category"
												value={formData.category}
												onChange={(e) => setFormData({ ...formData, category: e.target.value })}
												required
												className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
											>
												<option value="">Selecione a categoria</option>
												{categories.map((category) => (
													<option key={category} value={category}>
														{category}
													</option>
												))}
											</select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="edit-youtubeLink" className="text-white">Link do YouTube</Label>
											<Input
												id="edit-youtubeLink"
												value={formData.youtubeLink}
												onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
												placeholder="https://www.youtube.com/watch?v=..."
												className="bg-gray-800 border-gray-700 text-white"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="edit-lyrics" className="text-white">Letra</Label>
											<textarea
												id="edit-lyrics"
												value={formData.lyrics}
												onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
												rows={6}
												className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="edit-chords" className="text-white">Cifra</Label>
											<textarea
												id="edit-chords"
												value={formData.chords}
												onChange={(e) => setFormData({ ...formData, chords: e.target.value })}
												rows={6}
												className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 font-mono"
											/>
										</div>

										<div className="flex gap-2">
											<Button type="submit" disabled={saving}>
												{saving ? 'Salvando...' : 'Salvar Alterações'}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => setIsEditing(false)}
											>
												Cancelar
											</Button>
										</div>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
} 