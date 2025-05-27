'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Tipos de funções de obreiros
type WorkerRole = 'porta' | 'recepcao' | 'oferta' | 'ceia' | 'limpeza' | 'seguranca';

// Interface para membro da escala
interface ScheduleMember {
	id: string;
	name: string;
	date: Date;
	role: WorkerRole;
	position?: string; // Posição específica (ex: porta principal, lateral, etc)
}

export default function EscalaObreirosPage() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [selectedRole, setSelectedRole] = useState<WorkerRole>('porta');
	const [selectedPerson, setSelectedPerson] = useState('');
	const [position, setPosition] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showDialog, setShowDialog] = useState(false);
	const [scheduleMembers, setScheduleMembers] = useState<ScheduleMember[]>([
		{ id: '1', name: 'João Silva', date: new Date(2023, 5, 4), role: 'porta', position: 'Entrada principal' },
		{ id: '2', name: 'Maria Oliveira', date: new Date(2023, 5, 4), role: 'recepcao' },
		{ id: '3', name: 'Pedro Santos', date: new Date(2023, 5, 11), role: 'oferta' },
		{ id: '4', name: 'Ana Costa', date: new Date(2023, 5, 11), role: 'ceia' },
		{ id: '5', name: 'Lucas Mendes', date: new Date(2023, 5, 18), role: 'seguranca', position: 'Estacionamento' },
		{ id: '6', name: 'Carla Almeida', date: new Date(2023, 5, 18), role: 'limpeza' },
	]);

	// Simulação de pessoas disponíveis para a escala
	const availablePeople = [
		{ id: 'p1', name: 'João Silva' },
		{ id: 'p2', name: 'Maria Oliveira' },
		{ id: 'p3', name: 'Pedro Santos' },
		{ id: 'p4', name: 'Ana Costa' },
		{ id: 'p5', name: 'Lucas Mendes' },
		{ id: 'p6', name: 'Carla Almeida' },
		{ id: 'p7', name: 'Roberto Ferreira' },
		{ id: 'p8', name: 'Sandra Lima' },
	];

	// Manipular adição de novo membro à escala
	const handleAddMember = () => {
		if (!selectedDate) {
			setError('Selecione uma data');
			return;
		}

		if (!selectedPerson) {
			setError('Selecione uma pessoa');
			return;
		}

		const person = availablePeople.find(p => p.id === selectedPerson);
		if (!person) {
			setError('Pessoa não encontrada');
			return;
		}

		const newMember: ScheduleMember = {
			id: `m${Date.now()}`,
			name: person.name,
			date: selectedDate,
			role: selectedRole,
			position: position || undefined,
		};

		setScheduleMembers([...scheduleMembers, newMember]);
		setSuccess('Obreiro adicionado à escala com sucesso!');
		setShowDialog(false);

		// Limpar campos
		setSelectedPerson('');
		setPosition('');
		setError('');
	};

	// Remover membro da escala
	const handleRemoveMember = (id: string) => {
		setScheduleMembers(scheduleMembers.filter(member => member.id !== id));
		setSuccess('Obreiro removido da escala');
	};

	// Agrupar escala por data
	const getScheduleByDate = () => {
		const scheduleByDate: Record<string, ScheduleMember[]> = {};

		scheduleMembers.forEach(member => {
			const dateStr = format(member.date, 'yyyy-MM-dd');
			if (!scheduleByDate[dateStr]) {
				scheduleByDate[dateStr] = [];
			}
			scheduleByDate[dateStr].push(member);
		});

		return Object.entries(scheduleByDate)
			.map(([dateStr, members]) => ({
				date: new Date(dateStr),
				members,
			}))
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	};

	// Filtrar membros por função
	const getFilteredMembers = (role: WorkerRole) => {
		return scheduleMembers
			.filter(member => member.role === role)
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	};

	// Traduzir nome da função
	const getRoleName = (role: WorkerRole): string => {
		const roleNames: Record<WorkerRole, string> = {
			porta: 'Porteiro',
			recepcao: 'Recepção',
			oferta: 'Oferta',
			ceia: 'Santa Ceia',
			limpeza: 'Limpeza',
			seguranca: 'Segurança',
		};

		return roleNames[role] || role;
	};

	// Verificar se uma função precisa de posição específica
	const roleNeedsPosition = (role: WorkerRole): boolean => {
		return ['porta', 'seguranca'].includes(role);
	};

	const scheduleByDate = getScheduleByDate();

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-white">Escala de Obreiros</h1>

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
							<DialogTitle>Adicionar Obreiro à Escala</DialogTitle>
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
								<Label htmlFor="role">Função</Label>
								<Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as WorkerRole)}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione a função" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="porta">Porteiro</SelectItem>
										<SelectItem value="recepcao">Recepção</SelectItem>
										<SelectItem value="oferta">Oferta</SelectItem>
										<SelectItem value="ceia">Santa Ceia</SelectItem>
										<SelectItem value="limpeza">Limpeza</SelectItem>
										<SelectItem value="seguranca">Segurança</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{roleNeedsPosition(selectedRole) && (
								<div className="space-y-2">
									<Label htmlFor="position">Posição</Label>
									<Input
										id="position"
										value={position}
										onChange={(e) => setPosition(e.target.value)}
										placeholder={selectedRole === 'porta' ? 'Ex: Entrada principal' : 'Ex: Estacionamento'}
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="person">Pessoa</Label>
								<Select value={selectedPerson} onValueChange={setSelectedPerson}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um obreiro" />
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
							<Button onClick={handleAddMember}>
								Adicionar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="by-date" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="by-date">Por Data</TabsTrigger>
					<TabsTrigger value="by-role">Por Função</TabsTrigger>
				</TabsList>

				<TabsContent value="by-date">
					<div className="space-y-6">
						{scheduleByDate.length === 0 ? (
							<Card>
								<CardContent className="py-8 text-center text-muted-foreground">
									Nenhuma escala criada ainda
								</CardContent>
							</Card>
						) : (
							scheduleByDate.map(schedule => (
								<Card key={format(schedule.date, 'yyyy-MM-dd')}>
									<CardHeader>
										<CardTitle className="flex items-center">
											<CalendarIcon className="mr-2 h-5 w-5" />
											{format(schedule.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Função</TableHead>
													<TableHead>Pessoa</TableHead>
													<TableHead>Posição</TableHead>
													<TableHead className="text-right">Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{schedule.members.map(member => (
													<TableRow key={member.id}>
														<TableCell>{getRoleName(member.role)}</TableCell>
														<TableCell>{member.name}</TableCell>
														<TableCell>{member.position || '-'}</TableCell>
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
												))}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</TabsContent>

				<TabsContent value="by-role">
					<Tabs defaultValue="porta" className="w-full">
						<TabsList className="mb-6">
							<TabsTrigger value="porta">Porteiros</TabsTrigger>
							<TabsTrigger value="recepcao">Recepção</TabsTrigger>
							<TabsTrigger value="oferta">Oferta</TabsTrigger>
							<TabsTrigger value="ceia">Santa Ceia</TabsTrigger>
							<TabsTrigger value="limpeza">Limpeza</TabsTrigger>
							<TabsTrigger value="seguranca">Segurança</TabsTrigger>
						</TabsList>

						{(['porta', 'recepcao', 'oferta', 'ceia', 'limpeza', 'seguranca'] as WorkerRole[]).map(role => (
							<TabsContent key={role} value={role}>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											Escala de {getRoleName(role)}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Data</TableHead>
													<TableHead>Pessoa</TableHead>
													{roleNeedsPosition(role) && (
														<TableHead>Posição</TableHead>
													)}
													<TableHead className="text-right">Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{getFilteredMembers(role).length === 0 ? (
													<TableRow>
														<TableCell colSpan={roleNeedsPosition(role) ? 4 : 3} className="text-center text-muted-foreground">
															Nenhuma escala para {getRoleName(role)}
														</TableCell>
													</TableRow>
												) : (
													getFilteredMembers(role).map(member => (
														<TableRow key={member.id}>
															<TableCell>
																{format(member.date, 'dd/MM/yyyy', { locale: ptBR })}
															</TableCell>
															<TableCell>{member.name}</TableCell>
															{roleNeedsPosition(role) && (
																<TableCell>{member.position || '-'}</TableCell>
															)}
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
				</TabsContent>
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