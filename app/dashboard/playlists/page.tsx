'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar as CalendarIcon, Save, Plus, Trash2, ChevronUp, ChevronDown, Music } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose
} from '@/components/ui/dialog';

// Interface para músicas
interface Song {
	id: string;
	title: string;
	artist: string;
	key: string;
}

// Interface para playlist
interface Playlist {
	id: string;
	title: string;
	date: Date;
	eventType: string;
	songs: Song[];
}

export default function PlaylistsPage() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [searchTerm, setSearchTerm] = useState('');
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Estado para formulário de playlist
	const [playlistForm, setPlaylistForm] = useState({
		title: '',
		eventType: 'culto-domingo',
		date: new Date(),
	});

	// Estado para playlists
	const [playlists, setPlaylists] = useState<Playlist[]>([
		{
			id: 'p1',
			title: 'Culto de Domingo - Manhã',
			date: new Date(2023, 5, 4),
			eventType: 'culto-domingo',
			songs: [
				{ id: 's1', title: 'Ousado Amor', artist: 'Isaias Saad', key: 'G' },
				{ id: 's2', title: 'Nada Além do Sangue', artist: 'Fernandinho', key: 'E' },
				{ id: 's3', title: 'Digno é o Senhor', artist: 'Aline Barros', key: 'D' },
			]
		},
		{
			id: 'p2',
			title: 'Culto de Quarta - Louvor e Adoração',
			date: new Date(2023, 5, 7),
			eventType: 'culto-semana',
			songs: [
				{ id: 's4', title: 'Tua Graça Me Basta', artist: 'Davi Sacer', key: 'A' },
				{ id: 's5', title: 'Santo Espírito', artist: 'Laura Souguellis', key: 'G' },
			]
		},
		{
			id: 'p3',
			title: 'Culto de Jovens',
			date: new Date(2023, 5, 9),
			eventType: 'culto-jovens',
			songs: [
				{ id: 's1', title: 'Ousado Amor', artist: 'Isaias Saad', key: 'G' },
				{ id: 's6', title: 'Oceanos', artist: 'Hillsong', key: 'D' },
			]
		},
	]);

	// Catálogo de músicas disponíveis
	const [availableSongs, setAvailableSongs] = useState<Song[]>([
		{ id: 's1', title: 'Ousado Amor', artist: 'Isaias Saad', key: 'G' },
		{ id: 's2', title: 'Nada Além do Sangue', artist: 'Fernandinho', key: 'E' },
		{ id: 's3', title: 'Digno é o Senhor', artist: 'Aline Barros', key: 'D' },
		{ id: 's4', title: 'Tua Graça Me Basta', artist: 'Davi Sacer', key: 'A' },
		{ id: 's5', title: 'Santo Espírito', artist: 'Laura Souguellis', key: 'G' },
		{ id: 's6', title: 'Oceanos', artist: 'Hillsong', key: 'D' },
		{ id: 's7', title: 'Lugar Secreto', artist: 'Gabriela Rocha', key: 'G' },
		{ id: 's8', title: 'Bondade de Deus', artist: 'Isadora Pompeo', key: 'C' },
	]);

	// Estado para playlist em edição
	const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

	// Tipos de eventos
	const eventTypes = [
		{ value: 'culto-domingo', label: 'Culto de Domingo' },
		{ value: 'culto-semana', label: 'Culto de Semana' },
		{ value: 'culto-jovens', label: 'Culto de Jovens' },
		{ value: 'culto-mulheres', label: 'Culto de Mulheres' },
		{ value: 'culto-homens', label: 'Culto de Homens' },
		{ value: 'especial', label: 'Evento Especial' },
	];

	// Manipular mudanças no formulário
	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPlaylistForm(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// Manipular mudanças em selects
	const handleSelectChange = (name: string, value: string) => {
		setPlaylistForm(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// Criar nova playlist
	const handleCreatePlaylist = () => {
		if (!playlistForm.title) {
			setError('O título da playlist é obrigatório');
			return;
		}

		if (!selectedDate) {
			setError('Selecione uma data');
			return;
		}

		const newPlaylist: Playlist = {
			id: `p${Date.now()}`,
			title: playlistForm.title,
			date: selectedDate,
			eventType: playlistForm.eventType,
			songs: [],
		};

		setPlaylists([...playlists, newPlaylist]);
		setSuccess('Playlist criada com sucesso!');
		setShowAddDialog(false);

		// Selecionar a nova playlist para edição
		setCurrentPlaylist(newPlaylist);

		// Limpar formulário
		setPlaylistForm({
			title: '',
			eventType: 'culto-domingo',
			date: new Date(),
		});
	};

	// Adicionar música à playlist
	const handleAddSongToPlaylist = (song: Song) => {
		if (!currentPlaylist) return;

		// Verificar se a música já está na playlist
		if (currentPlaylist.songs.some(s => s.id === song.id)) {
			setError('Esta música já está na playlist');
			return;
		}

		const updatedPlaylist = {
			...currentPlaylist,
			songs: [...currentPlaylist.songs, song]
		};

		setCurrentPlaylist(updatedPlaylist);

		// Atualizar a lista de playlists
		setPlaylists(playlists.map(p =>
			p.id === updatedPlaylist.id ? updatedPlaylist : p
		));

		setSuccess('Música adicionada à playlist');
	};

	// Remover música da playlist
	const handleRemoveSongFromPlaylist = (songId: string) => {
		if (!currentPlaylist) return;

		const updatedPlaylist = {
			...currentPlaylist,
			songs: currentPlaylist.songs.filter(s => s.id !== songId)
		};

		setCurrentPlaylist(updatedPlaylist);

		// Atualizar a lista de playlists
		setPlaylists(playlists.map(p =>
			p.id === updatedPlaylist.id ? updatedPlaylist : p
		));

		setSuccess('Música removida da playlist');
	};

	// Reordenar músicas na playlist
	const handleReorderSongs = (songId: string, direction: 'up' | 'down') => {
		if (!currentPlaylist) return;

		const songIndex = currentPlaylist.songs.findIndex(s => s.id === songId);
		if (songIndex === -1) return;

		const newSongs = [...currentPlaylist.songs];

		if (direction === 'up' && songIndex > 0) {
			// Mover para cima
			[newSongs[songIndex], newSongs[songIndex - 1]] = [newSongs[songIndex - 1], newSongs[songIndex]];
		} else if (direction === 'down' && songIndex < newSongs.length - 1) {
			// Mover para baixo
			[newSongs[songIndex], newSongs[songIndex + 1]] = [newSongs[songIndex + 1], newSongs[songIndex]];
		}

		const updatedPlaylist = {
			...currentPlaylist,
			songs: newSongs
		};

		setCurrentPlaylist(updatedPlaylist);

		// Atualizar a lista de playlists
		setPlaylists(playlists.map(p =>
			p.id === updatedPlaylist.id ? updatedPlaylist : p
		));
	};

	// Excluir playlist
	const handleDeletePlaylist = (playlistId: string) => {
		setPlaylists(playlists.filter(p => p.id !== playlistId));

		if (currentPlaylist?.id === playlistId) {
			setCurrentPlaylist(null);
		}

		setSuccess('Playlist excluída com sucesso!');
	};

	// Filtrar músicas disponíveis
	const filteredSongs = availableSongs.filter(song =>
		song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		song.artist.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Traduzir tipo de evento
	const getEventTypeName = (type: string): string => {
		const eventType = eventTypes.find(t => t.value === type);
		return eventType?.label || type;
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-white">Playlists</h1>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="mb-6 bg-green-100 border-green-200">
					<AlertDescription className="text-green-800">{success}</AlertDescription>
				</Alert>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<Card className="mb-6">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Music className="mr-2 h-5 w-5" />
								Playlists
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between mb-4">
								<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
									<DialogTrigger asChild>
										<Button className="w-full">
											<Plus className="mr-2 h-4 w-4" />
											Nova Playlist
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Criar Nova Playlist</DialogTitle>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="space-y-2">
												<Label htmlFor="title">Título</Label>
												<Input
													id="title"
													name="title"
													value={playlistForm.title}
													onChange={handleFormChange}
													placeholder="Ex: Culto de Domingo - Manhã"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="eventType">Tipo de Evento</Label>
												<select
													id="eventType"
													className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													value={playlistForm.eventType}
													onChange={(e) => handleSelectChange('eventType', e.target.value)}
												>
													{eventTypes.map(type => (
														<option key={type.value} value={type.value}>
															{type.label}
														</option>
													))}
												</select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="date">Data</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className="w-full justify-start text-left font-normal"
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{selectedDate ? (
																format(selectedDate, 'PPP', { locale: ptBR })
															) : (
																<span>Selecione uma data</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0">
														<Calendar
															mode="single"
															selected={selectedDate}
															onSelect={setSelectedDate}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</div>
										</div>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant="outline">Cancelar</Button>
											</DialogClose>
											<Button onClick={handleCreatePlaylist}>Criar Playlist</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>

							<div className="space-y-2 mt-4">
								{playlists.length === 0 ? (
									<p className="text-center text-gray-500">Nenhuma playlist criada</p>
								) : (
									playlists.map(playlist => (
										<div
											key={playlist.id}
											className={`p-3 rounded-md cursor-pointer transition-colors ${currentPlaylist?.id === playlist.id
												? 'bg-primary/10 border border-primary/30'
												: 'hover:bg-gray-100 dark:hover:bg-gray-800'
												}`}
											onClick={() => setCurrentPlaylist(playlist)}
										>
											<div className="flex justify-between items-start">
												<div>
													<h3 className="font-medium">{playlist.title}</h3>
													<p className="text-sm text-gray-500">
														{format(playlist.date, 'dd/MM/yyyy')} - {getEventTypeName(playlist.eventType)}
													</p>
													<p className="text-xs text-gray-400 mt-1">
														{playlist.songs.length} música{playlist.songs.length !== 1 ? 's' : ''}
													</p>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
													onClick={(e) => {
														e.stopPropagation();
														handleDeletePlaylist(playlist.id);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-2">
					{!currentPlaylist ? (
						<Card>
							<CardContent className="py-12 text-center text-muted-foreground">
								<Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
								<p className="mb-2">Selecione ou crie uma playlist para começar</p>
								<Button onClick={() => setShowAddDialog(true)}>Criar Nova Playlist</Button>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>
										{currentPlaylist.title}
										<span className="block text-sm font-normal text-gray-500 mt-1">
											{format(currentPlaylist.date, 'dd/MM/yyyy')} - {getEventTypeName(currentPlaylist.eventType)}
										</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<h3 className="font-medium mb-4">Músicas na Playlist</h3>

									{currentPlaylist.songs.length === 0 ? (
										<p className="text-center text-gray-500 my-6">
											Nenhuma música adicionada. Busque músicas abaixo para adicionar.
										</p>
									) : (
										<div className="space-y-2 mb-6">
											{currentPlaylist.songs.map((song, index) => (
												<div
													key={song.id}
													className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
												>
													<div className="flex-1">
														<div className="flex items-center">
															<span className="w-6 text-gray-400 text-sm">{index + 1}.</span>
															<div>
																<h4 className="font-medium">{song.title}</h4>
																<p className="text-sm text-gray-500">{song.artist} - Tom: {song.key}</p>
															</div>
														</div>
													</div>
													<div className="flex items-center space-x-1">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															disabled={index === 0}
															onClick={() => handleReorderSongs(song.id, 'up')}
														>
															<ChevronUp className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															disabled={index === currentPlaylist.songs.length - 1}
															onClick={() => handleReorderSongs(song.id, 'down')}
														>
															<ChevronDown className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-red-500 hover:text-red-700"
															onClick={() => handleRemoveSongFromPlaylist(song.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</div>
									)}

									<div className="border-t pt-4">
										<h3 className="font-medium mb-4">Adicionar Músicas</h3>
										<div className="relative mb-4">
											<Input
												placeholder="Buscar músicas por título ou artista..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="pl-10"
											/>
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
												<Music className="h-5 w-5 text-gray-400" />
											</div>
										</div>

										<div className="space-y-2 max-h-60 overflow-y-auto">
											{filteredSongs.length === 0 ? (
												<p className="text-center text-gray-500 my-4">
													Nenhuma música encontrada
												</p>
											) : (
												filteredSongs.map(song => (
													<div
														key={song.id}
														className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
														onClick={() => handleAddSongToPlaylist(song)}
													>
														<div>
															<h4 className="font-medium">{song.title}</h4>
															<p className="text-sm text-gray-500">{song.artist} - Tom: {song.key}</p>
														</div>
														<Button size="sm" variant="outline">
															<Plus className="h-4 w-4 mr-1" />
															Adicionar
														</Button>
													</div>
												))
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</div>
		</div>
	);
} 