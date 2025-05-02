'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageGalleryModal } from './ImageGalleryModal';

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

type FormState = {
	title: string;
	description: string;
	date: Date | null;
	image: string | null;
	imageFile: File | null;
};

export function AgendaForm({ agenda, onSuccess }: AgendaFormProps) {
	const [form, setForm] = useState<FormState>({
		title: '',
		description: '',
		date: null,
		image: null,
		imageFile: null,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showGallery, setShowGallery] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isEditing = !!agenda;

	useEffect(() => {
		if (agenda) {
			setForm({
				title: agenda.title,
				description: agenda.description || '',
				date: agenda.date ? new Date(agenda.date) : null,
				image: agenda.image,
				imageFile: null,
			});
		} else {
			setForm({
				title: '',
				description: '',
				date: null,
				image: null,
				imageFile: null,
			});
		}
	}, [agenda]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setForm(prev => ({
			...prev,
			imageFile: file,
		}));

		const reader = new FileReader();
		reader.onloadend = () => {
			setForm(prev => ({
				...prev,
				image: reader.result as string,
			}));
		};
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setForm(prev => ({
			...prev,
			image: null,
			imageFile: null,
		}));
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleGallerySelect = (imagePath: string) => {
		setForm(prev => ({
			...prev,
			image: imagePath,
			imageFile: null,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!form.title || !form.date) {
			setError('Título e data são obrigatórios');
			return;
		}

		try {
			setLoading(true);

			let imageUrl = form.image;

			// Handle new image upload
			if (form.imageFile) {
				const formData = new FormData();
				formData.append('file', form.imageFile);

				const uploadResponse = await fetch('/api/upload', {
					method: 'POST',
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error('Falha no upload da imagem');
				}

				const { url } = await uploadResponse.json();
				imageUrl = url;
			}

			const url = isEditing ? `/api/agenda/${agenda.id}` : '/api/agenda';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: form.title,
					description: form.description || null,
					date: form.date?.toISOString(),
					image: imageUrl,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message ||
					(isEditing ? 'Falha ao atualizar agenda' : 'Falha ao criar agenda')
				);
			}

			setForm({
				title: '',
				description: '',
				date: null,
				image: null,
				imageFile: null,
			});

			onSuccess();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Ocorreu um erro inesperado'
			);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4 mt-6">
				{error && (
					<div
						role="alert"
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
					>
						{error}
					</div>
				)}

				<div className="space-y-2">
					<Label htmlFor="title">Título *</Label>
					<Input
						id="title"
						value={form.title}
						onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
						placeholder="Título da agenda"
						required
						aria-required="true"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Descrição</Label>
					<Textarea
						id="description"
						value={form.description}
						onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
						placeholder="Descrição (opcional)"
						rows={4}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="image">Imagem</Label>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowGallery(true)}
							className="flex items-center gap-2 text-black cursor-pointer"
						>
							<ImageIcon className="h-4 w-4" />
							Galeria
						</Button>

						{form.image && (
							<Button
								type="button"
								variant="destructive"
								size="icon"
								onClick={removeImage}
								aria-label="Remover imagem"
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
							aria-label="Selecionar imagem"
						/>
					</div>

					{form.image && (
						<div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
							<Image
								src={form.image}
								alt="Preview da imagem"
								fill
								className="object-cover"
								priority={false}
							/>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="date">Data *</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full justify-start text-left font-normal text-neutral-900",
									!form.date && "text-muted-foreground"
								)}
								id="date"
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{form.date ? format(form.date, "PPP") : "Selecione uma data"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={form.date || undefined}
								onSelect={(day) => setForm(prev => ({ ...prev, date: day || null }))}
								initialFocus
								disabled={(date) => date < new Date()}
							/>
						</PopoverContent>
					</Popover>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full"
					aria-busy={loading}
				>
					{loading ? (
						<span className="inline-flex items-center gap-2">
							<span className="animate-spin">↻</span>
							Processando...
						</span>
					) : isEditing ? (
						'Atualizar Agenda'
					) : (
						'Criar Agenda'
					)}
				</Button>
			</form>

			<ImageGalleryModal
				isOpen={showGallery}
				onClose={() => setShowGallery(false)}
				onSelectImage={handleGallerySelect}
			/>
		</>
	);
}