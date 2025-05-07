'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ImageGalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectImage: (imagePath: string) => void;
}

export function ImageGalleryModal({ isOpen, onClose, onSelectImage }: ImageGalleryModalProps) {
	const [images, setImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isOpen) {
			fetchImages();
		}
	}, [isOpen]);

	const fetchImages = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/images');

			if (!response.ok) {
				throw new Error('Falha ao carregar imagens');
			}

			const data = await response.json();
			setImages(data.images);
		} catch (err) {
			console.error('Erro ao buscar imagens:', err);
			setError('Não foi possível carregar as imagens');
		} finally {
			setLoading(false);
		}
	};

	const handleSelectImage = (imagePath: string) => {
		onSelectImage(imagePath);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-neutral-900 text-white">
				<DialogHeader>
					<DialogTitle>Galeria de Imagens</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className="flex justify-center items-center p-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				) : error ? (
					<div className="text-red-500 p-4">{error}</div>
				) : images.length === 0 ? (
					<div className="p-4">Nenhuma imagem encontrada</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
						{images.map((image, index) => (
							<div
								key={index}
								className="relative h-40 cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
								onClick={() => handleSelectImage(image)}
							>
								<Image
									src={image}
									alt={`Imagem ${index + 1}`}
									fill
									className="object-cover"
								/>
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
} 