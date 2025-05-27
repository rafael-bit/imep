'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GalleryAPI, UploadAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { usePermission } from '@/lib/hooks/usePermission';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Upload, X } from 'lucide-react';

export default function GaleriaPage() {
	const { data: session } = useSession();
	const { hasPermission } = usePermission();
	const [galleries, setGalleries] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [selectedGallery, setSelectedGallery] = useState<any>(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		date: new Date().toISOString().split('T')[0],
	});
	const [files, setFiles] = useState<FileList | null>(null);

	// Verifica se tem permissão para gerenciar galerias
	const canManage = hasPermission('GALLERY_MANAGE');

	useEffect(() => {
		loadGalleries();
	}, [session]);

	const loadGalleries = async () => {
		if (!session?.user?.churchId) return;

		try {
			setLoading(true);
			const data = await GalleryAPI.getAll(session.user.churchId);
			setGalleries(data);
		} catch (error) {
			console.error('Erro ao carregar galerias:', error);
			setError('Não foi possível carregar as galerias. Tente novamente mais tarde.');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateGallery = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session?.user?.churchId) return;

		try {
			setUploading(true);

			const galleryData = {
				...formData,
				churchId: session.user.churchId,
			};

			const newGallery = await GalleryAPI.create(galleryData);

			// Upload de imagens se houver arquivos selecionados
			if (files && files.length > 0) {
				const fileArray = Array.from(files);
				const { urls } = await UploadAPI.uploadFiles(fileArray, 'gallery');

				// Adicionar URLs à galeria
				const images = urls.map((url, index) => ({
					url,
					order: index,
				}));

				await GalleryAPI.addImages(newGallery._id, images);
			}

			setFormData({
				title: '',
				description: '',
				date: new Date().toISOString().split('T')[0],
			});
			setFiles(null);
			setIsCreating(false);
			loadGalleries();
		} catch (error) {
			console.error('Erro ao criar galeria:', error);
			setError('Não foi possível criar a galeria. Tente novamente mais tarde.');
		} finally {
			setUploading(false);
		}
	};

	const handleAddImages = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedGallery || !files || files.length === 0) return;

		try {
			setUploading(true);

			const fileArray = Array.from(files);
			const { urls } = await UploadAPI.uploadFiles(fileArray, 'gallery');

			// Adicionar URLs à galeria
			const images = urls.map((url, index) => ({
				url,
				order: selectedGallery.images.length + index,
			}));

			await GalleryAPI.addImages(selectedGallery._id, images);

			setFiles(null);
			setIsUploading(false);
			loadGalleries();

			// Atualizar galeria selecionada
			const updatedGallery = await GalleryAPI.getById(selectedGallery._id);
			setSelectedGallery(updatedGallery);
		} catch (error) {
			console.error('Erro ao adicionar imagens:', error);
			setError('Não foi possível adicionar as imagens. Tente novamente mais tarde.');
		} finally {
			setUploading(false);
		}
	};

	const handleDeleteGallery = async (galleryId: string) => {
		if (!confirm('Tem certeza que deseja excluir esta galeria? Esta ação não pode ser desfeita.')) {
			return;
		}

		try {
			await GalleryAPI.delete(galleryId);
			loadGalleries();

			if (selectedGallery?._id === galleryId) {
				setSelectedGallery(null);
			}
		} catch (error) {
			console.error('Erro ao excluir galeria:', error);
			setError('Não foi possível excluir a galeria. Tente novamente mais tarde.');
		}
	};

	const handleDeleteImage = async (imageId: string) => {
		if (!selectedGallery || !confirm('Tem certeza que deseja remover esta imagem?')) {
			return;
		}

		try {
			await GalleryAPI.removeImages(selectedGallery._id, [imageId]);

			// Atualizar galeria selecionada
			const updatedGallery = await GalleryAPI.getById(selectedGallery._id);
			setSelectedGallery(updatedGallery);
		} catch (error) {
			console.error('Erro ao remover imagem:', error);
			setError('Não foi possível remover a imagem. Tente novamente mais tarde.');
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-white">Galeria de Fotos</h1>
				{canManage && (
					<Button onClick={() => setIsCreating(!isCreating)}>
						{isCreating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
						{isCreating ? 'Cancelar' : 'Nova Galeria'}
					</Button>
				)}
			</div>

			{error && (
				<div className="bg-destructive/20 text-destructive p-3 rounded-md">
					{error}
				</div>
			)}

			{isCreating && (
				<Card className="bg-gray-900 border-gray-800">
					<CardContent className="pt-6">
						<form onSubmit={handleCreateGallery} className="space-y-4">
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
								<Label htmlFor="description" className="text-white">Descrição</Label>
								<Input
									id="description"
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									className="bg-gray-800 border-gray-700 text-white"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="files" className="text-white">Fotos</Label>
								<Input
									id="files"
									type="file"
									onChange={(e) => setFiles(e.target.files)}
									multiple
									accept="image/*"
									className="bg-gray-800 border-gray-700 text-white"
								/>
							</div>

							<Button type="submit" disabled={uploading} className="w-full">
								{uploading ? 'Criando...' : 'Criar Galeria'}
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{selectedGallery ? (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-white">{selectedGallery.title}</h2>
							<p className="text-gray-400">{formatDate(selectedGallery.date)}</p>
							{selectedGallery.description && (
								<p className="text-gray-300 mt-2">{selectedGallery.description}</p>
							)}
						</div>

						<div className="flex gap-2">
							{canManage && (
								<>
									<Button
										variant="outline"
										onClick={() => setIsUploading(!isUploading)}
									>
										<Upload className="mr-2 h-4 w-4" />
										Adicionar Fotos
									</Button>
									<Button
										variant="destructive"
										onClick={() => handleDeleteGallery(selectedGallery._id)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Excluir Galeria
									</Button>
								</>
							)}
							<Button
								variant="outline"
								onClick={() => setSelectedGallery(null)}
							>
								Voltar
							</Button>
						</div>
					</div>

					{isUploading && (
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="pt-6">
								<form onSubmit={handleAddImages} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="more-files" className="text-white">Selecione as Fotos</Label>
										<Input
											id="more-files"
											type="file"
											onChange={(e) => setFiles(e.target.files)}
											multiple
											accept="image/*"
											className="bg-gray-800 border-gray-700 text-white"
											required
										/>
									</div>

									<div className="flex gap-2">
										<Button type="submit" disabled={uploading}>
											{uploading ? 'Enviando...' : 'Enviar Fotos'}
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsUploading(false)}
										>
											Cancelar
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{selectedGallery.images && selectedGallery.images.length > 0 ? (
							selectedGallery.images.map((image: any) => (
								<div key={image._id} className="relative group">
									<img
										src={image.url}
										alt={image.caption || 'Imagem da galeria'}
										className="w-full h-60 object-cover rounded-md"
									/>
									{canManage && (
										<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												size="icon"
												variant="destructive"
												onClick={() => handleDeleteImage(image._id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									)}
								</div>
							))
						) : (
							<div className="col-span-full text-center py-10 text-gray-400">
								Nenhuma imagem encontrada nesta galeria.
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{galleries.length > 0 ? (
						galleries.map((gallery) => (
							<Card
								key={gallery._id}
								className="bg-gray-900 border-gray-800 hover:border-primary cursor-pointer group"
								onClick={() => setSelectedGallery(gallery)}
							>
								<div className="relative h-40 overflow-hidden">
									{gallery.images && gallery.images.length > 0 ? (
										<img
											src={gallery.images[0].url}
											alt={gallery.title}
											className="w-full h-full object-cover transition-transform group-hover:scale-105"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gray-800">
											<span className="text-gray-400">Sem imagens</span>
										</div>
									)}

									{canManage && (
										<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												size="icon"
												variant="destructive"
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteGallery(gallery._id);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									)}
								</div>

								<CardContent className="p-4">
									<h3 className="font-bold text-white truncate">{gallery.title}</h3>
									<p className="text-gray-400 text-sm">{formatDate(gallery.date)}</p>
									<p className="text-gray-400 text-sm mt-1">
										{gallery.images ? gallery.images.length : 0} fotos
									</p>
								</CardContent>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-10 text-gray-400">
							Nenhuma galeria encontrada. Clique em "Nova Galeria" para criar.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
