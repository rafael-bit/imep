'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
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

// Interface para representar um equipamento
interface Equipment {
	id: string;
	name: string;
	type: string;
	status: 'available' | 'in_use' | 'maintenance';
	assignedTo?: string;
	notes?: string;
}

export default function EquipamentosPage() {
	const [equipments, setEquipments] = useState<Equipment[]>([
		{ id: '1', name: 'Microfone SM58', type: 'audio', status: 'available' },
		{ id: '2', name: 'Câmera Sony Alpha', type: 'video', status: 'in_use', assignedTo: 'João Silva' },
		{ id: '3', name: 'Mesa de Som Behringer X32', type: 'audio', status: 'available' },
		{ id: '4', name: 'Projetor Epson', type: 'video', status: 'maintenance', notes: 'Lâmpada com problema' },
		{ id: '5', name: 'Teclado Yamaha', type: 'instrument', status: 'in_use', assignedTo: 'Maria Oliveira' },
	]);

	const [showAddDialog, setShowAddDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Formulário para novo equipamento
	const [form, setForm] = useState<Omit<Equipment, 'id'>>({
		name: '',
		type: 'audio',
		status: 'available',
		assignedTo: '',
		notes: '',
	});

	const equipmentTypes = [
		{ value: 'audio', label: 'Áudio' },
		{ value: 'video', label: 'Vídeo' },
		{ value: 'instrument', label: 'Instrumento' },
		{ value: 'lighting', label: 'Iluminação' },
		{ value: 'computer', label: 'Computador' },
		{ value: 'other', label: 'Outro' },
	];

	const statusOptions = [
		{ value: 'available', label: 'Disponível' },
		{ value: 'in_use', label: 'Em Uso' },
		{ value: 'maintenance', label: 'Em Manutenção' },
	];

	// Manipular mudanças no formulário
	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// Manipular mudanças em selects
	const handleSelectChange = (name: string, value: string) => {
		setForm(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// Adicionar novo equipamento
	const handleAddEquipment = () => {
		if (!form.name) {
			setError('Nome do equipamento é obrigatório');
			return;
		}

		const newEquipment: Equipment = {
			id: `e${Date.now()}`,
			...form,
			assignedTo: form.status === 'in_use' ? form.assignedTo : undefined,
		};

		setEquipments([...equipments, newEquipment]);
		setSuccess('Equipamento adicionado com sucesso!');
		setShowAddDialog(false);
		resetForm();
	};

	// Iniciar edição de equipamento
	const handleEditStart = (equipment: Equipment) => {
		setCurrentEquipment(equipment);
		setForm({
			name: equipment.name,
			type: equipment.type,
			status: equipment.status,
			assignedTo: equipment.assignedTo || '',
			notes: equipment.notes || '',
		});
		setShowEditDialog(true);
	};

	// Atualizar equipamento
	const handleUpdateEquipment = () => {
		if (!currentEquipment) return;
		if (!form.name) {
			setError('Nome do equipamento é obrigatório');
			return;
		}

		const updatedEquipment: Equipment = {
			...currentEquipment,
			...form,
			assignedTo: form.status === 'in_use' ? form.assignedTo : undefined,
		};

		setEquipments(equipments.map(eq =>
			eq.id === currentEquipment.id ? updatedEquipment : eq
		));
		setSuccess('Equipamento atualizado com sucesso!');
		setShowEditDialog(false);
		resetForm();
	};

	// Remover equipamento
	const handleDeleteEquipment = (id: string) => {
		setEquipments(equipments.filter(eq => eq.id !== id));
		setSuccess('Equipamento removido com sucesso!');
	};

	// Resetar formulário
	const resetForm = () => {
		setForm({
			name: '',
			type: 'audio',
			status: 'available',
			assignedTo: '',
			notes: '',
		});
		setCurrentEquipment(null);
		setError('');
	};

	// Traduzir tipo de equipamento
	const getTypeName = (type: string): string => {
		const typeOption = equipmentTypes.find(t => t.value === type);
		return typeOption?.label || type;
	};

	// Traduzir status
	const getStatusName = (status: string): string => {
		const statusOption = statusOptions.find(s => s.value === status);
		return statusOption?.label || status;
	};

	// Cor do status
	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'available': return 'text-green-500';
			case 'in_use': return 'text-blue-500';
			case 'maintenance': return 'text-amber-500';
			default: return '';
		}
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-white">Gerenciamento de Equipamentos</h1>

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
				<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
					<DialogTrigger asChild>
						<Button onClick={resetForm}>
							<Plus className="mr-2 h-4 w-4" />
							Adicionar Equipamento
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Adicionar Novo Equipamento</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nome</Label>
								<Input
									id="name"
									name="name"
									value={form.name}
									onChange={handleFormChange}
									placeholder="Nome do equipamento"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Tipo</Label>
								<Select
									value={form.type}
									onValueChange={(value) => handleSelectChange('type', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o tipo" />
									</SelectTrigger>
									<SelectContent>
										{equipmentTypes.map(type => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={form.status}
									onValueChange={(value) => handleSelectChange('status', value as 'available' | 'in_use' | 'maintenance')}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map(status => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{form.status === 'in_use' && (
								<div className="space-y-2">
									<Label htmlFor="assignedTo">Atribuído a</Label>
									<Input
										id="assignedTo"
										name="assignedTo"
										value={form.assignedTo}
										onChange={handleFormChange}
										placeholder="Nome da pessoa"
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="notes">Observações</Label>
								<Input
									id="notes"
									name="notes"
									value={form.notes}
									onChange={handleFormChange}
									placeholder="Observações (opcional)"
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancelar</Button>
							</DialogClose>
							<Button onClick={handleAddEquipment}>Adicionar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Editar Equipamento</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="edit-name">Nome</Label>
								<Input
									id="edit-name"
									name="name"
									value={form.name}
									onChange={handleFormChange}
									placeholder="Nome do equipamento"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="edit-type">Tipo</Label>
								<Select
									value={form.type}
									onValueChange={(value) => handleSelectChange('type', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o tipo" />
									</SelectTrigger>
									<SelectContent>
										{equipmentTypes.map(type => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="edit-status">Status</Label>
								<Select
									value={form.status}
									onValueChange={(value) => handleSelectChange('status', value as 'available' | 'in_use' | 'maintenance')}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map(status => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{form.status === 'in_use' && (
								<div className="space-y-2">
									<Label htmlFor="edit-assignedTo">Atribuído a</Label>
									<Input
										id="edit-assignedTo"
										name="assignedTo"
										value={form.assignedTo}
										onChange={handleFormChange}
										placeholder="Nome da pessoa"
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="edit-notes">Observações</Label>
								<Input
									id="edit-notes"
									name="notes"
									value={form.notes}
									onChange={handleFormChange}
									placeholder="Observações (opcional)"
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancelar</Button>
							</DialogClose>
							<Button onClick={handleUpdateEquipment}>Atualizar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Lista de Equipamentos</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Atribuído a</TableHead>
								<TableHead>Observações</TableHead>
								<TableHead className="text-right">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{equipments.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										Nenhum equipamento cadastrado
									</TableCell>
								</TableRow>
							) : (
								equipments.map(equipment => (
									<TableRow key={equipment.id}>
										<TableCell className="font-medium">{equipment.name}</TableCell>
										<TableCell>{getTypeName(equipment.type)}</TableCell>
										<TableCell className={getStatusColor(equipment.status)}>
											{getStatusName(equipment.status)}
										</TableCell>
										<TableCell>{equipment.assignedTo || '-'}</TableCell>
										<TableCell>{equipment.notes || '-'}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleEditStart(equipment)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteEquipment(equipment.id)}
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
} 