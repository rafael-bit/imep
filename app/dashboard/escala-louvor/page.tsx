'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { WorshipScheduleAPI, TeamMemberAPI, SongAPI, PlaylistAPI } from '@/lib/api';
import { formatDate, formatDateLong } from '@/lib/utils';
import { usePermission } from '@/lib/hooks/usePermission';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Plus,
	Trash2,
	Music,
	Calendar,
	ChevronDown,
	Users,
	CheckCircle2,
	X,
	Mic,
	Guitar,
	Piano,
	Drumstick
} from 'lucide-react';
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

export default function EscalaLouvorPage() {
	const { data: session } = useSession() as { data: ExtendedSession | null };
	const { hasPermission } = usePermission();
	const [schedules, setSchedules] = useState<any[]>([]);
	const [teamMembers, setTeamMembers] = useState<any[]>([]);
	const [songs, setSongs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [saving, setSaving] = useState(false);
	const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
	const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [formData, setFormData] = useState({
		date: new Date().toISOString().split('T')[0],
		time: '19:00',
		title: 'Culto de Adoração',
		description: '',
		selectedMembers: [] as string[],
		selectedSongs: [] as string[],
	});

	const canManage = hasPermission('WORSHIP_SCHEDULE_MANAGE');

	useEffect(() => {
		loadSchedules();
		if (canManage) {
			loadTeamMembers();
			loadSongs();
		}
	}, [session, canManage]);
	const loadSchedules = async () => {
		if (!session?.user?.id) return;

		try {
			setLoading(true);
			const now = new Date();
			const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
			const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

			if (!session.user.churchId) {
				console.error('Church ID is missing from user session');
				setError('Não foi possível carregar as escalas: ID da igreja não encontrado.');
				setLoading(false);
				return;
			}

			const data = await WorshipScheduleAPI.getAll(session.user.churchId, {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			});

			setSchedules(data);
		} catch (error) {
			console.error('Erro ao carregar escalas:', error);
			setError('Não foi possível carregar as escalas. Tente novamente mais tarde.');
		} finally {
			setLoading(false);
		}
	};

	const loadTeamMembers = async () => {
		if (!session?.user?.churchId) return;

		try {
			const data = await TeamMemberAPI.getAll(session.user.churchId, { isActive: true });
			setTeamMembers(data);
		} catch (error) {
			console.error('Erro ao carregar membros da equipe:', error);
		}
	};

	const loadSongs = async () => {
		if (!session?.user?.churchId) return;

		try {
			const data = await SongAPI.getAll(session.user.churchId);
			setSongs(data);
		} catch (error) {
			console.error('Erro ao carregar músicas:', error);
		}
	};

	const handleCreateSchedule = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session?.user?.churchId) return;

		try {
			setSaving(true);

			// Criar a data/hora combinada
			const [year, month, day] = formData.date.split('-').map(Number);
			const [hours, minutes] = formData.time.split(':').map(Number);
			const dateTime = new Date(year, month - 1, day, hours, minutes);

			// Preparar os dados da escala
			const scheduleData = {
				date: dateTime.toISOString(),
				title: formData.title,
				description: formData.description,
				members: formData.selectedMembers.map(id => ({ memberId: id })),
				churchId: session.user.churchId,
			};

			// Criar a escala
			const newSchedule = await WorshipScheduleAPI.create(scheduleData);

			// Se tiver músicas selecionadas, criar uma playlist
			if (formData.selectedSongs.length > 0) {
				await PlaylistAPI.create({
					title: `Playlist - ${formData.title} - ${formatDate(dateTime)}`,
					date: dateTime.toISOString(),
					eventType: 'worship',
					scheduleId: newSchedule._id,
					songs: formData.selectedSongs.map(songId => ({ songId })),
					churchId: session.user.churchId,
				});
			}

			// Limpar o formulário
			setFormData({
				date: new Date().toISOString().split('T')[0],
				time: '19:00',
				title: 'Culto de Adoração',
				description: '',
				selectedMembers: [],
				selectedSongs: [],
			});

			setIsCreating(false);
			loadSchedules();
		} catch (error) {
			console.error('Erro ao criar escala:', error);
			setError('Não foi possível criar a escala. Tente novamente mais tarde.');
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteSchedule = async (scheduleId: string) => {
		if (!confirm('Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.')) {
			return;
		}

		try {
			await WorshipScheduleAPI.delete(scheduleId);
			loadSchedules();

			if (selectedSchedule?._id === scheduleId) {
				setSelectedSchedule(null);
			}
		} catch (error) {
			console.error('Erro ao excluir escala:', error);
			setError('Não foi possível excluir a escala. Tente novamente mais tarde.');
		}
	};

	const toggleMemberSelection = (memberId: string) => {
		setFormData(prev => {
			const isSelected = prev.selectedMembers.includes(memberId);

			if (isSelected) {
				return {
					...prev,
					selectedMembers: prev.selectedMembers.filter(id => id !== memberId),
				};
			} else {
				return {
					...prev,
					selectedMembers: [...prev.selectedMembers, memberId],
				};
			}
		});
	};

	const toggleSongSelection = (songId: string) => {
		setFormData(prev => {
			const isSelected = prev.selectedSongs.includes(songId);

			if (isSelected) {
				return {
					...prev,
					selectedSongs: prev.selectedSongs.filter(id => id !== songId),
				};
			} else {
				return {
					...prev,
					selectedSongs: [...prev.selectedSongs, songId],
				};
			}
		});
	};

	// Função para obter o ícone do instrumento
	const getInstrumentIcon = (instrument: string) => {
		const size = 16;

		switch (instrument.toLowerCase()) {
			case 'vocal':
			case 'voz':
				return <Mic size={size} />;
			case 'guitarra':
			case 'violão':
				return <Guitar size={size} />;
			case 'teclado':
			case 'piano':
				return <Piano size={size} />;
			case 'bateria':
				return <Drumstick size={size} />;
			default:
				return <Music size={size} />;
		}
	};

	// Gerar calendário do mês atual
	const generateCalendar = () => {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();

		// Obter o primeiro dia do mês
		const firstDay = new Date(year, month, 1);
		// Obter o último dia do mês
		const lastDay = new Date(year, month + 1, 0);

		// Obter o dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
		const firstDayIndex = firstDay.getDay();
		// Total de dias no mês
		const totalDays = lastDay.getDate();

		// Array para armazenar os dias do calendário
		const days = [];

		// Adicionar dias vazios antes do primeiro dia do mês
		for (let i = 0; i < firstDayIndex; i++) {
			days.push(null);
		}

		// Adicionar os dias do mês
		for (let i = 1; i <= totalDays; i++) {
			days.push(i);
		}

		// Retornar o calendário organizado em semanas
		const weeks = [];
		let week = [];

		for (let i = 0; i < days.length; i++) {
			week.push(days[i]);

			if (week.length === 7 || i === days.length - 1) {
				// Preencher com dias vazios se necessário
				while (week.length < 7) {
					week.push(null);
				}

				weeks.push(week);
				week = [];
			}
		}

		return weeks;
	};

	// Obter eventos de uma data específica
	const getEventsForDay = (day: number | null) => {
		if (!day) return [];

		const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
		const dateStr = date.toISOString().split('T')[0];

		return schedules.filter(schedule => {
			const scheduleDate = new Date(schedule.date);
			return scheduleDate.toISOString().split('T')[0] === dateStr;
		});
	};

	const calendar = generateCalendar();
	const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
	const months = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	if (loading && schedules.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-white">Escala de Louvor</h1>
				<div className="flex gap-2">
					<div className="bg-gray-900 rounded-md flex p-1">
						<button
							className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
							onClick={() => setViewMode('calendar')}
						>
							Calendário
						</button>
						<button
							className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
							onClick={() => setViewMode('list')}
						>
							Lista
						</button>
					</div>

					{canManage && (
						<Button onClick={() => setIsCreating(!isCreating)}>
							{isCreating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
							{isCreating ? 'Cancelar' : 'Nova Escala'}
						</Button>
					)}
				</div>
			</div>

			{error && (
				<div className="bg-destructive/20 text-destructive p-3 rounded-md">
					{error}
				</div>
			)}

			{isCreating && (
				<Card className="bg-gray-900 border-gray-800 mb-6">
					<CardContent className="pt-6">
						<form onSubmit={handleCreateSchedule} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="date" className="text-white">Data</Label>
									<Input
										id="date"
										type="date"
										value={formData.date}
										onChange={(e) => setFormData({ ...formData, date: e.target.value })}
										required
										className="bg-gray-800 border-gray-700 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="time" className="text-white">Horário</Label>
									<Input
										id="time"
										type="time"
										value={formData.time}
										onChange={(e) => setFormData({ ...formData, time: e.target.value })}
										required
										className="bg-gray-800 border-gray-700 text-white"
									/>
								</div>

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
							</div>

							<div className="space-y-2">
								<Label htmlFor="description" className="text-white">Descrição</Label>
								<Input
									id="description"
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									className="bg-gray-800 border-gray-700 text-white"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-white">Selecione os membros da equipe</Label>
									<div className="bg-gray-800 border border-gray-700 rounded-md p-3 max-h-64 overflow-y-auto">
										{teamMembers.length > 0 ? (
											<div className="space-y-2">
												{teamMembers.map((member) => (
													<div
														key={member._id}
														className={`p-2 rounded flex items-center justify-between cursor-pointer ${formData.selectedMembers.includes(member._id) ? 'bg-primary/20 border border-primary/30' : 'hover:bg-gray-700'
															}`}
														onClick={() => toggleMemberSelection(member._id)}
													>
														<div className="flex items-center">
															<div className="w-6 h-6 flex items-center justify-center mr-2">
																{getInstrumentIcon(member.instrument)}
															</div>
															<div>
																<div className="text-white font-medium">{member.name}</div>
																<div className="text-gray-400 text-xs">{member.instrument}</div>
															</div>
														</div>
														{formData.selectedMembers.includes(member._id) && (
															<CheckCircle2 className="h-5 w-5 text-primary" />
														)}
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-4 text-gray-400">
												Nenhum membro cadastrado.
											</div>
										)}
									</div>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Selecione as músicas</Label>
									<div className="bg-gray-800 border border-gray-700 rounded-md p-3 max-h-64 overflow-y-auto">
										{songs.length > 0 ? (
											<div className="space-y-2">
												{songs.map((song) => (
													<div
														key={song._id}
														className={`p-2 rounded flex items-center justify-between cursor-pointer ${formData.selectedSongs.includes(song._id) ? 'bg-primary/20 border border-primary/30' : 'hover:bg-gray-700'
															}`}
														onClick={() => toggleSongSelection(song._id)}
													>
														<div>
															<div className="text-white font-medium">{song.title}</div>
															<div className="text-gray-400 text-xs">{song.artist} - {song.key}</div>
														</div>
														{formData.selectedSongs.includes(song._id) && (
															<CheckCircle2 className="h-5 w-5 text-primary" />
														)}
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-4 text-gray-400">
												Nenhuma música cadastrada.
											</div>
										)}
									</div>
								</div>
							</div>

							<Button type="submit" disabled={saving} className="w-full">
								{saving ? 'Salvando...' : 'Salvar Escala'}
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{viewMode === 'calendar' ? (
				<div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
					<div className="p-4 border-b border-gray-800 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<button
								className="p-1 rounded hover:bg-gray-800"
								onClick={() => {
									const newDate = new Date(selectedDate);
									newDate.setMonth(newDate.getMonth() - 1);
									setSelectedDate(newDate);
								}}
							>
								<ChevronDown className="h-5 w-5 transform rotate-90" />
							</button>
							<h2 className="text-lg font-semibold text-white">
								{months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
							</h2>
							<button
								className="p-1 rounded hover:bg-gray-800"
								onClick={() => {
									const newDate = new Date(selectedDate);
									newDate.setMonth(newDate.getMonth() + 1);
									setSelectedDate(newDate);
								}}
							>
								<ChevronDown className="h-5 w-5 transform -rotate-90" />
							</button>
						</div>
						<button
							className="text-sm text-primary"
							onClick={() => setSelectedDate(new Date())}
						>
							Hoje
						</button>
					</div>

					<div className="grid grid-cols-7 bg-gray-800">
						{weekDays.map((day, index) => (
							<div key={index} className="text-center py-2 text-gray-400 text-sm">
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 divide-x divide-y divide-gray-800">
						{calendar.map((week, weekIndex) => (
							<>
								{week.map((day, dayIndex) => {
									const events = getEventsForDay(day);
									const isToday = day &&
										new Date().getDate() === day &&
										new Date().getMonth() === selectedDate.getMonth() &&
										new Date().getFullYear() === selectedDate.getFullYear();

									return (
										<div
											key={`${weekIndex}-${dayIndex}`}
											className={`min-h-[100px] p-2 ${day ? 'hover:bg-gray-800/50' : 'bg-gray-800/20'} relative`}
										>
											{day && (
												<>
													<div className={`
														w-7 h-7 rounded-full flex items-center justify-center mb-1
														${isToday ? 'bg-primary text-white' : 'text-gray-300'}
													`}>
														{day}
													</div>

													<div className="space-y-1">
														{events.map((event) => (
															<div
																key={event._id}
																className="bg-primary/20 border border-primary/30 text-primary p-1 rounded text-xs cursor-pointer"
																onClick={() => setSelectedSchedule(event)}
															>
																{new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {event.title}
															</div>
														))}
													</div>
												</>
											)}
										</div>
									);
								})}
							</>
						))}
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{schedules.length > 0 ? (
						schedules
							.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
							.map((schedule) => (
								<Card
									key={schedule._id}
									className="bg-gray-900 border-gray-800 hover:border-primary cursor-pointer"
									onClick={() => setSelectedSchedule(schedule)}
								>
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div>
												<div className="flex items-center gap-2">
													<Calendar className="h-5 w-5 text-primary" />
													<h3 className="font-bold text-white">{schedule.title}</h3>
												</div>
												<p className="text-gray-400">
													{formatDateLong(schedule.date)} às {new Date(schedule.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
												</p>

												<div className="flex items-center gap-2 mt-2">
													<Users className="h-4 w-4 text-gray-400" />
													<span className="text-gray-400">
														{schedule.members?.length || 0} membros escalados
													</span>
												</div>
											</div>

											{canManage && (
												<Button
													size="icon"
													variant="destructive"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteSchedule(schedule._id);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							))
					) : (
						<div className="text-center py-10 text-gray-400">
							Nenhuma escala encontrada. {canManage ? 'Clique em "Nova Escala" para adicionar.' : ''}
						</div>
					)}
				</div>
			)}

			{selectedSchedule && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-3xl overflow-hidden">
						<div className="p-4 border-b border-gray-800 flex items-center justify-between">
							<h2 className="text-xl font-bold text-white">{selectedSchedule.title}</h2>
							<button
								className="p-1 rounded hover:bg-gray-800"
								onClick={() => setSelectedSchedule(null)}
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="p-6">
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-semibold text-white mb-2">Detalhes</h3>
									<div className="bg-gray-800 rounded-md p-4">
										<div className="flex items-center gap-2 mb-2">
											<Calendar className="h-5 w-5 text-primary" />
											<span className="text-gray-300">
												{formatDateLong(selectedSchedule.date)} às {new Date(selectedSchedule.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
											</span>
										</div>

										{selectedSchedule.description && (
											<p className="text-gray-300">{selectedSchedule.description}</p>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold text-white mb-2">Membros Escalados</h3>
									<div className="bg-gray-800 rounded-md p-4">
										{selectedSchedule.members && selectedSchedule.members.length > 0 ? (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
												{selectedSchedule.members.map((member: any) => (
													<div key={member._id} className="flex items-center p-2 bg-gray-700/50 rounded">
														<div className="w-8 h-8 flex items-center justify-center mr-2 bg-gray-600 rounded-full">
															{getInstrumentIcon(member.memberId.instrument)}
														</div>
														<div>
															<div className="text-white">{member.memberId.name}</div>
															<div className="text-gray-400 text-xs">{member.memberId.instrument}</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-4 text-gray-400">
												Nenhum membro escalado.
											</div>
										)}
									</div>
								</div>

								{selectedSchedule.playlist && (
									<div>
										<h3 className="text-lg font-semibold text-white mb-2">Repertório</h3>
										<div className="bg-gray-800 rounded-md p-4">
											{selectedSchedule.playlist.songs && selectedSchedule.playlist.songs.length > 0 ? (
												<div className="space-y-2">
													{selectedSchedule.playlist.songs.map((song: any, index: number) => (
														<div key={song._id} className="flex items-center p-2 bg-gray-700/50 rounded">
															<div className="w-6 h-6 flex items-center justify-center mr-2 bg-gray-600 rounded-full text-xs">
																{index + 1}
															</div>
															<div>
																<div className="text-white">{song.songId.title}</div>
																<div className="text-gray-400 text-xs">
																	{song.songId.artist} - Tom: {song.key || song.songId.key}
																</div>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-4 text-gray-400">
													Nenhuma música adicionada.
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							<div className="mt-6 flex justify-end">
								{canManage && (
									<Button
										variant="destructive"
										onClick={() => {
											handleDeleteSchedule(selectedSchedule._id);
											setSelectedSchedule(null);
										}}
										className="mr-2"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Excluir Escala
									</Button>
								)}
								<Button
									variant="outline"
									onClick={() => setSelectedSchedule(null)}
								>
									Fechar
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
} 