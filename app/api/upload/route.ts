import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleFiles } from '@/lib/uploadService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		// Obter os dados do formulário (multipart/form-data)
		const formData = await request.formData();
		const folder = formData.get('folder') as string || 'uploads';

		// Obter os arquivos do formulário
		const files = [];
		for (const [key, value] of formData.entries()) {
			if (value instanceof File && key.startsWith('file')) {
				const buffer = await value.arrayBuffer();
				files.push({
					buffer: Buffer.from(buffer),
					originalname: value.name,
					mimetype: value.type,
				});
			}
		}

		if (files.length === 0) {
			return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
		}

		// Fazer upload dos arquivos localmente
		const urls = await uploadMultipleFiles(files, folder);

		return NextResponse.json({ urls });
	} catch (error) {
		console.error('Erro no upload de arquivo:', error);
		return NextResponse.json(
			{ error: 'Erro ao processar o upload de arquivos' },
			{ status: 500 }
		);
	}
} 