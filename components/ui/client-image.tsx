'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientImageProps extends Omit<ImageProps, 'onError'> {
	fallbackSrc?: string;
}

export function ClientImage({
	fallbackSrc = '/default-location.jpg',
	alt,
	src,
	...props
}: ClientImageProps) {
	const [imgSrc, setImgSrc] = useState(src);

	const handleError = () => {
		setImgSrc(fallbackSrc);
	};

	return (
		<Image
			{...props}
			src={imgSrc}
			alt={alt}
			onError={handleError}
		/>
	);
} 