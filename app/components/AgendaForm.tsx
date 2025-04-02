'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ImagePlus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Agenda {
	id: string;
	title: string;
	description: string | null;
	date: string;
	image: string | null;
}

interface AgendaFormProps {
	agenda?: Agenda;
	onSuccess: () => void;
}

export function AgendaForm({ agenda, onSuccess }: AgendaFormProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<Date | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isEditing = !!agenda;

	useEffect(() => {
		if (agenda) {
			setTitle(agenda.title);
			setDescription(agenda.description || '');
			setDate(agenda.date ? new Date(agenda.date) : null);
			setImage(agenda.image);
		} else {
			setTitle('');
			setDescription('');
			setDate(null);
			setImage(null);
		}
	}, [agenda]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setImage(null);
		setImageFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !date) {
			setError('Título e data são obrigatórios');
			return;
		}

		try {
			setLoading(true);

			let imageUrl = image;

			if (imageFile) {
				const formData = new FormData();
				formData.append('file', imageFile);

				const uploadResponse = await fetch('/api/upload', {
					method: 'POST',
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error('Erro ao fazer upload da imagem');
				}

				const uploadData = await uploadResponse.json();
				imageUrl = uploadData.url;
			}

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
					image: imageUrl,
				}),
			});

			if (!response.ok) {
				throw new Error(isEditing ? 'Erro ao atualizar agenda' : 'Erro ao criar agenda');
			}

			setTitle('');
			setDescription('');
			setDate(null);
			setImage(null);
			setImageFile(null);
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
				<Label htmlFor="image">Imagem</Label>
				<div className="flex items-center space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						className="flex items-center text-black cursor-pointer"
					>
						<ImagePlus className="h-4 w-4 mr-2" />
						{image ? 'Trocar Imagem' : 'Adicionar Imagem'}
					</Button>
					{image && (
						<Button
							type="button"
							variant="destructive"
							size="icon"
							onClick={removeImage}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
					<input
						type="file"
						id="image"
						ref={fileInputRef}
						onChange={handleImageChange}
						accept="image/*"
						className="hidden"
					/>
				</div>
				{image && (
					<div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
						<Image
							src={image}
							alt="Preview"
							fill
							className="object-cover"
						/>
					</div>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="date">Data e Hora</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full justify-start text-left font-normal cursor-pointer",
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

			<Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-black hover:text-white">
				{loading ? 'Processando...' : isEditing ? 'Atualizar Agenda' : 'Criar Agenda'}
			</Button>
		</form>
	);
}