import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'Nenhum arquivo foi enviado' },
				{ status: 400 }
			);
		}

		const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		if (!validTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Tipo de arquivo não suportado. Apenas imagens são permitidas.' },
				{ status: 400 }
			);
		}

		const uploadsDir = path.join(process.cwd(), 'public/uploads');
		await mkdir(uploadsDir, { recursive: true });

		const fileExtension = path.extname(file.name);
		const fileName = `${uuidv4()}${fileExtension}`;
		const filePath = path.join(uploadsDir, fileName);

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		await writeFile(filePath, buffer);
		
		return NextResponse.json({
			url: `/uploads/${fileName}`,
			success: true
		});
	} catch (error) {
		console.error('Erro ao processar upload:', error);
		return NextResponse.json(
			{
				error: 'Erro ao processar upload',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
} 