import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
	try {
		const uploadsDir = path.join(process.cwd(), 'public/uploads');

		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const files = fs.readdirSync(uploadsDir);

		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
		const imageFiles = files.filter(file => {
			const ext = path.extname(file).toLowerCase();
			return imageExtensions.includes(ext);
		});

		const imagePaths = imageFiles.map(file => `/uploads/${file}`);

		return NextResponse.json({
			images: imagePaths,
			success: true
		});
	} catch (error) {
		console.error('Error listing images:', error);
		return NextResponse.json(
			{ error: 'Failed to list images', success: false },
			{ status: 500 }
		);
	}
} 