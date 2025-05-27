'use client';

import { ClientImage } from '@/components/ui/client-image';

interface ClientImageWrapperProps {
	src: string;
	alt: string;
}

export function ClientImageWrapper({ src, alt }: ClientImageWrapperProps) {
	return (
		<ClientImage
			src={src}
			alt={alt}
			fill
			className="object-cover"
			fallbackSrc="/default-location.jpg"
		/>
	);
} 