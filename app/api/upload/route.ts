import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
		}

		const filename = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
		const filePath = path.join(uploadDir, filename);
		const publicPath = `/uploads/${filename}`;

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		await writeFile(filePath, buffer);

		return NextResponse.json({
			success: true,
			url: publicPath
		}, { status: 201 });
	} catch (error) {
		console.error('Erro no upload de arquivo:', error);
		return NextResponse.json({
			error: 'Erro ao fazer upload da imagem',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
} 