import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export async function uploadFileToLocal(
	file: Buffer,
	fileName: string,
	mimeType: string,
	folder: string = 'uploads'
): Promise<string> {
	try {
		const fileExt = fileName.split('.').pop();
		const randomName = `${uuidv4()}.${fileExt}`;

		const uploadDir = path.join(process.cwd(), 'public', folder);
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, randomName);

		fs.writeFileSync(filePath, file);

		return `/${folder}/${randomName}`;
	} catch (error) {
		console.error('Erro ao salvar arquivo:', error);
		throw new Error('Falha ao fazer upload do arquivo');
	}
}

/**
 * Processa múltiplos arquivos para upload
 */
export async function uploadMultipleFiles(
	files: Array<{ buffer: Buffer; originalname: string; mimetype: string }>,
	folder: string = 'uploads'
): Promise<string[]> {
	const uploadPromises = files.map(file =>
		uploadFileToLocal(file.buffer, file.originalname, file.mimetype, folder)
	);

	return Promise.all(uploadPromises);
} 