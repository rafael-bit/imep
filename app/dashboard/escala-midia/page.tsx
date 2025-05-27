'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar as CalendarIcon, Save, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type MediaType = 'live' | 'photo' | 'slide';

interface ScheduleMember {
	id: string;
	name: string;
	date: Date;
	type: MediaType;
}

export default function EscalaMidiaPage() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [selectedType, setSelectedType] = useState<MediaType>('live');
	const [selectedPerson, setSelectedPerson] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showDialog, setShowDialog] = useState(false);
	const [scheduleMembers, setScheduleMembers] = useState<ScheduleMember[]>([
		{ id: '1', name: 'João Silva', date: new Date(2023, 5, 4), type: 'live' },
		{ id: '2', name: 'Maria Oliveira', date: new Date(2023, 5, 11), type: 'photo' },
		{ id: '3', name: 'Pedro Santos', date: new Date(2023, 5, 18), type: 'slide' },
		{ id: '4', name: 'Ana Costa', date: new Date(2023, 5, 25), type: 'live' },
	]);

	const availablePeople = [
		{ id: 'p1', name: 'João Silva' },
		{ id: 'p2', name: 'Maria Oliveira' },
		{ id: 'p3', name: 'Pedro Santos' },
		{ id: 'p4', name: 'Ana Costa' },
		{ id: 'p5', name: 'Lucas Mendes' },
		{ id: 'p6', name: 'Carla Almeida' },
	];

	const handleAddMember = () => {
		if (!selectedDate) {
			setError('Selecione uma data');
			return;
		}

		if (!selectedPerson) {
			setError('Selecione uma pessoa');
			return;
		}

		const newMember: ScheduleMember = {
			id: `m${Date.now()}`,
			name: availablePeople.find(p => p.id === selectedPerson)?.name || '',
			date: selectedDate,
			type: selectedType,
		};

		setScheduleMembers([...scheduleMembers, newMember]);
		setSuccess('Membro adicionado à escala com sucesso!');
		setShowDialog(false);

		// Limpar campos
		setSelectedPerson('');
		setError('');
	};

	const handleRemoveMember = (id: string) => {
		setScheduleMembers(scheduleMembers.filter(member => member.id !== id));
		setSuccess('Membro removido da escala');
	};

	const getFilteredMembers = (type: MediaType) => {
		return scheduleMembers
			.filter(member => member.type === type)
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-white">Escala de Mídia</h1>

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

			<div className="flex justify-end mb-6">
				<Dialog open={showDialog} onOpenChange={setShowDialog}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Adicionar à Escala
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Adicionar Pessoa à Escala</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
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

							<div className="space-y-2">
								<Label htmlFor="type">Tipo de Mídia</Label>
								<Select value={selectedType} onValueChange={(value) => setSelectedType(value as MediaType)}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o tipo" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="live">Live</SelectItem>
										<SelectItem value="photo">Fotografia</SelectItem>
										<SelectItem value="slide">Slides</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="person">Pessoa</Label>
								<Select value={selectedPerson} onValueChange={setSelectedPerson}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma pessoa" />
									</SelectTrigger>
									<SelectContent>
										{availablePeople.map(person => (
											<SelectItem key={person.id} value={person.id}>
												{person.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancelar</Button>
							</DialogClose>
							<Button onClick={handleAddMember}>Adicionar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="live" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="live">Live</TabsTrigger>
					<TabsTrigger value="photo">Fotografia</TabsTrigger>
					<TabsTrigger value="slide">Slides</TabsTrigger>
				</TabsList>

				{(['live', 'photo', 'slide'] as MediaType[]).map(type => (
					<TabsContent key={type} value={type}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									{type === 'live' && 'Escala de Live'}
									{type === 'photo' && 'Escala de Fotografia'}
									{type === 'slide' && 'Escala de Slides'}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Data</TableHead>
											<TableHead>Pessoa</TableHead>
											<TableHead className="text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getFilteredMembers(type).length === 0 ? (
											<TableRow>
												<TableCell colSpan={3} className="text-center text-muted-foreground">
													Nenhuma pessoa escalada para {type === 'live' ? 'live' : type === 'photo' ? 'fotografia' : 'slides'}
												</TableCell>
											</TableRow>
										) : (
											getFilteredMembers(type).map(member => (
												<TableRow key={member.id}>
													<TableCell>
														{format(member.date, 'dd/MM/yyyy', { locale: ptBR })}
													</TableCell>
													<TableCell>{member.name}</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleRemoveMember(member.id)}
														>
															<Trash2 className="h-4 w-4 text-red-500" />
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>

			<div className="mt-6 flex justify-end">
				<Button variant="default">
					<Save className="mr-2 h-4 w-4" />
					Salvar Escala
				</Button>
			</div>
		</div>
	);
} 