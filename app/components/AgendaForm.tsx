'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Agenda {
	id: string;
	title: string;
	description: string | null;
	date: string;
}

interface AgendaFormProps {
	agenda?: Agenda;
	onSuccess: () => void;
}

export function AgendaForm({ agenda, onSuccess }: AgendaFormProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const isEditing = !!agenda;

	useEffect(() => {
		if (agenda) {
			setTitle(agenda.title);
			setDescription(agenda.description || '');
			setDate(agenda.date ? new Date(agenda.date) : null);
		} else {
			setTitle('');
			setDescription('');
			setDate(null);
		}
	}, [agenda]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !date) {
			setError('Título e data são obrigatórios');
			return;
		}

		try {
			setLoading(true);

			const url = isEditing ? `/api/agenda/${agenda.id}` : '/api/agenda';
			const method = isEditing ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description: description || null,
					date: date.toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error(isEditing ? 'Erro ao atualizar agenda' : 'Erro ao criar agenda');
			}

			setTitle('');
			setDescription('');
			setDate(null);
			setError('');
			onSuccess();
		} catch (err) {
			setError(isEditing ? 'Falha ao atualizar agenda' : 'Falha ao criar agenda');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-6">
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="title">Título</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Título da agenda"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Descrição</Label>
				<Textarea
					id="description"
					value={description}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
					placeholder="Descrição (opcional)"
					rows={4}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="date">Data e Hora</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "PPP") : <span>Selecione uma data</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date || undefined}
							onSelect={(day) => setDate(day || null)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<Button type="submit" disabled={loading} className="w-full">
				{loading ? 'Processando...' : isEditing ? 'Atualizar Agenda' : 'Criar Agenda'}
			</Button>
		</form>
	);
}
