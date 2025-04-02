'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { AgendaForm } from './AgendaForm';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Agenda {
	id: string;
	title: string;
	description: string | null;
	date: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
}

interface AgendaListProps {
	agendas: Agenda[];
	onDelete: (id: string) => void;
	onEdit: (agenda: Agenda) => void;
	selectedAgenda: Agenda | null;
	onFormSuccess: () => void;
}

export function AgendaList({
	agendas,
	onDelete,
	onEdit,
	selectedAgenda,
	onFormSuccess
}: AgendaListProps) {
	const [agendaToDelete, setAgendaToDelete] = useState<string | null>(null);

	const confirmDelete = (id: string) => {
		setAgendaToDelete(id);
	};

	const handleDelete = () => {
		if (agendaToDelete) {
			onDelete(agendaToDelete);
			setAgendaToDelete(null);
		}
	};

	const cancelDelete = () => {
		setAgendaToDelete(null);
	};

	return (
		<div className="space-y-4">
			{agendas.map((agenda) => (
				<div
					key={agenda.id}
					className="flex gap-5 border border-neutral-700 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow overflow-hidden"
				>
					{agenda.image && (
						<div className="relative h-40 rounded overflow-hidden">
							<Image
								src={agenda.image}
								alt={agenda.title}
								width={500}
								height={500}
								className="object-cover"
							/>
						</div>
					)}
					<div className="w-full flex flex-col md:flex-row justify-between items-start">
						<div className="flex-1">
							<h3 className="font-medium text-lg">{agenda.title}</h3>

							<p className="text-gray-500 text-sm mb-2">
								{format(new Date(agenda.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
							</p>

							{agenda.description && (
								<p className="text-gray-300 mt-2 whitespace-pre-line">{agenda.description}</p>
							)}
						</div>

						<div className="flex gap-2">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon"
										className="text-neutral-700 hover:text-neutral-900"
										onClick={() => onEdit(agenda)}>
										<Edit className="h-4 w-4" />
									</Button>
								</SheetTrigger>
								<SheetContent className="bg-[#121212] text-white border-none p-5">
									<SheetTitle className='text-xl text-white'>Editar Agenda</SheetTitle>
									{selectedAgenda && selectedAgenda.id === agenda.id && (
										<AgendaForm agenda={selectedAgenda} onSuccess={onFormSuccess} />
									)}
								</SheetContent>
							</Sheet>

							<Button
								variant="outline"
								size="icon"
								className="text-red-500 hover:text-red-700 hover:bg-red-50"
								onClick={() => confirmDelete(agenda.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			))}

			<AlertDialog open={!!agendaToDelete} onOpenChange={() => setAgendaToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta ação não pode ser desfeita. A agenda será permanentemente removida.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
							Sim, excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
} 