'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Plus, Pencil, Trash, UserCog } from 'lucide-react';
import { Role, SafeUser } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Church {
	id: string;
	name: string;
}

interface UserFormData {
	id?: string;
	name: string;
	email: string;
	password: string;
	role: Role;
	churchId: string;
}

export default function UserManagementPage() {
	const [users, setUsers] = useState<SafeUser[]>([]);
	const [churches, setChurches] = useState<Church[]>([]);
	const [formData, setFormData] = useState<UserFormData>({
		name: '',
		email: '',
		password: '',
		role: Role.USER,
		churchId: '',
	});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loadingUsers, setLoadingUsers] = useState(true);

	useEffect(() => {
		fetchUsers();
		fetchChurches();
	}, []);

	const fetchUsers = async () => {
		setLoadingUsers(true);
		try {
			const response = await fetch('/api/admin/users');
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			const data = await response.json();
			setUsers(data.users);
		} catch (error) {
			console.error('Error fetching users:', error);
			setError('Erro ao carregar usuários');
		} finally {
			setLoadingUsers(false);
		}
	};

	const fetchChurches = async () => {
		try {
			const response = await fetch('/api/admin/churches');
			if (!response.ok) {
				throw new Error('Failed to fetch churches');
			}
			const data = await response.json();
			setChurches(data.churches);
		} catch (error) {
			console.error('Error fetching churches:', error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			role: Role.USER,
			churchId: '',
		});
		setIsEditing(false);
	};

	const handleEditUser = (user: SafeUser) => {
		setFormData({
			id: user.id,
			name: user.name || '',
			email: user.email || '',
			password: '', // Password is not pre-filled when editing
			role: user.role,
			churchId: user.churchId || '',
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
			const endpoint = isEditing ? `/api/admin/users/${formData.id}` : '/api/admin/users';
			const method = isEditing ? 'PUT' : 'POST';

			// If editing and password is empty, omit it
			const submitData = isEditing && !formData.password
				? { ...formData, password: undefined }
				: formData;

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submitData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao salvar usuário');
			}

			setSuccess(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
			resetForm();
			setDialogOpen(false);
			fetchUsers(); // Refresh the user list
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Erro desconhecido');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (!confirm('Tem certeza que deseja excluir este usuário?')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erro ao excluir usuário');
			}

			setSuccess('Usuário excluído com sucesso!');
			fetchUsers(); // Refresh the user list
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Erro desconhecido');
		}
	};

	const getRoleLabel = (role: Role): string => {
		const roleLabels = {
			[Role.USER]: 'Usuário',
			[Role.MEDIA_CHURCH]: 'Mídia da Igreja',
			[Role.WORSHIP_CHURCH]: 'Louvor da Igreja',
			[Role.WORKERS]: 'Obreiros',
			[Role.MASTER]: 'Master',
			[Role.DEVELOPER]: 'Desenvolvedor'
		};

		return roleLabels[role] || 'Usuário';
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-neutral-100">Gerenciamento de Usuários</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm}>
							<Plus className="mr-2 h-4 w-4" />
							Novo Usuário
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>{isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4 pt-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nome</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									placeholder="Nome completo"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									required
									placeholder="email@exemplo.com"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">
									{isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleInputChange}
									required={!isEditing}
									placeholder="••••••••"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="role">Nível de Permissão</Label>
								<Select
									value={formData.role}
									onValueChange={(value) => handleSelectChange('role', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um nível" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={Role.USER}>Usuário</SelectItem>
										<SelectItem value={Role.MEDIA_CHURCH}>Mídia da Igreja</SelectItem>
										<SelectItem value={Role.WORSHIP_CHURCH}>Louvor da Igreja</SelectItem>
										<SelectItem value={Role.WORKERS}>Obreiros</SelectItem>
										<SelectItem value={Role.MASTER}>Master</SelectItem>
										<SelectItem value={Role.DEVELOPER}>Desenvolvedor</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="churchId">Igreja</Label>
								<Select
									value={formData.churchId}
									onValueChange={(value) => handleSelectChange('churchId', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma igreja" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">Nenhuma</SelectItem>
										{churches.map((church) => (
											<SelectItem key={church.id} value={church.id}>
												{church.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									isEditing ? 'Salvar Alterações' : 'Criar Usuário'
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
					<CardTitle>Usuários</CardTitle>
					<CardDescription>
						Gerencie os usuários e suas permissões
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loadingUsers ? (
						<div className="flex justify-center items-center p-8">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Permissão</TableHead>
									<TableHead>Igreja</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8 text-gray-500">
											Nenhum usuário encontrado
										</TableCell>
									</TableRow>
								) : (
									users.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{getRoleLabel(user.role)}
												</span>
											</TableCell>
											<TableCell>{user.church?.name || '-'}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleEditUser(user)}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleDeleteUser(user.id)}
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