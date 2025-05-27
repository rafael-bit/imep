'use client';

import { useEffect, useState } from 'react';
import { AgendaForm } from '@/app/components/AgendaForm';
import { AgendaList } from '@/app/components/AgendaList';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Agenda {
	id: string;
	title: string;
	description: string | null;
	date: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function AgendasPage() {
	const [agendas, setAgendas] = useState<Agenda[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

	const fetchAgendas = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/agenda');

			if (!response.ok) {
				throw new Error('Erro ao carregar agendas');
			}

			const data = await response.json();
			setAgendas(data);
			setError('');
		} catch (err) {
			setError('Falha ao carregar agendas');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAgendas();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`/api/agenda/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Erro ao excluir agenda');
			}

			fetchAgendas();
		} catch (err) {
			setError('Falha ao excluir agenda');
			console.error(err);
		}
	};

	const handleEdit = (agenda: Agenda) => {
		setSelectedAgenda(agenda);
	};

	const handleFormSuccess = () => {
		setSelectedAgenda(null);
		fetchAgendas();
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-white">Gerenciamento de Agendas</h1>
				<Sheet>
					<SheetTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nova Agenda
						</Button>
					</SheetTrigger>
					<SheetContent className="bg-[#121212] border-none p-3 text-white">
						<SheetTitle className="text-white">Adicionar Nova Agenda</SheetTitle>
						<AgendaForm onSuccess={handleFormSuccess} />
					</SheetContent>
				</Sheet>
			</div>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{loading ? (
				<div className="flex justify-center">
					<p>Carregando agendas...</p>
				</div>
			) : agendas.length === 0 ? (
				<div className="text-center py-10">
					<p className="text-gray-500">Nenhuma agenda encontrada. Crie uma nova agenda!</p>
				</div>
			) : (
				<AgendaList
					agendas={agendas}
					onDelete={handleDelete}
					onEdit={handleEdit}
					selectedAgenda={selectedAgenda}
					onFormSuccess={handleFormSuccess}
				/>
			)}
		</div>
	);
} 