'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Plus, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Church {
	id: string;
	name: string;
	address: string | null;
	createdAt: string;
	updatedAt: string;
}

interface ChurchFormData {
	id?: string;
	name: string;
	address: string;
}

export default function ChurchManagementPage() {
	const [churches, setChurches] = useState<Church[]>([]);
	const [formData, setFormData] = useState<ChurchFormData>({
		name: '',
		address: '',
	});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loadingChurches, setLoadingChurches] = useState(true);

	useEffect(() => {
		fetchChurches();
	}, []);

	const fetchChurches = async () => {
		setLoadingChurches(true);
		try {
			const response = await fetch('/api/admin/churches');
			if (!response.ok) {
				throw new Error('Failed to fetch churches');
			}
			const data = await response.json();
			setChurches(data.churches);
		} catch (error) {
			console.error('Error fetching churches:', error);
			setError('Erro ao carregar igrejas');
		} finally {
			setLoadingChurches(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const resetForm = () => {
		setFormData({
			name: '',
			address: '',
		});
		setIsEditing(false);
	};

	const handleEditChurch = (church: Church) => {
		setFormData({
			id: church.id,
			name: church.name,
			address: church.address || '',
		});
		setIsEditing(true);
		setDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const endpoint = isEditing ? `/api/admin/churches/${formData.id}` : '/api/admin/churches';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao salvar igreja');
			}

			setSuccess(isEditing ? 'Igreja atualizada com sucesso!' : 'Igreja criada com sucesso!');
			resetForm();
			setDialogOpen(false);
			fetchChurches(); // Refresh the church list
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Erro desconhecido');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteChurch = async (churchId: string) => {
		if (!confirm('Tem certeza que deseja excluir esta igreja? Isso afetará todos os usuários vinculados.')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/churches/${churchId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erro ao excluir igreja');
			}

			setSuccess('Igreja excluída com sucesso!');
			fetchChurches();
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Erro desconhecido');
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-neutral-100">Gerenciamento de Igrejas</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm}>
							<Plus className="mr-2 h-4 w-4" />
							Nova Igreja
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>{isEditing ? 'Editar Igreja' : 'Criar Nova Igreja'}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4 pt-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nome da Igreja</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									placeholder="Nome da igreja"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">Endereço</Label>
								<Textarea
									id="address"
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									placeholder="Endereço completo"
									rows={3}
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processando...
									</>
								) : (
									isEditing ? 'Salvar Alterações' : 'Criar Igreja'
								)}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="mb-4 bg-green-100 border-green-200">
					<AlertDescription className="text-green-800">{success}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Igrejas</CardTitle>
					<CardDescription>
						Gerencie as igrejas cadastradas no sistema
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loadingChurches ? (
						<div className="flex justify-center items-center p-8">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Endereço</TableHead>
									<TableHead>Data de Criação</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{churches.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center py-8 text-gray-500">
											Nenhuma igreja encontrada
										</TableCell>
									</TableRow>
								) : (
									churches.map((church) => (
										<TableRow key={church.id}>
											<TableCell className="font-medium">{church.name}</TableCell>
											<TableCell>{church.address || '-'}</TableCell>
											<TableCell>{formatDate(church.createdAt)}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleEditChurch(church)}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleDeleteChurch(church.id)}
													>
														<Trash className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
} 