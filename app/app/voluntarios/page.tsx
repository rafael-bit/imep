'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Volunteer = {
	id: string;
	name: string;
	email: string;
	phone: string;
	baptized: boolean;
	ministry: string;
	createdAt: string;
	updatedAt: string;
	selected?: boolean;
};

const ministryLabels: Record<string, string> = {
	"kidschurch": "Igreja da Criança",
	"musicteam": "Ministério de Louvor",
	"techinicalsuporte": "Suporte Técnico",
	"sound": "Técnico de Som",
	"slide": "Mídia Slide",
	"photograph": "Mídia Fotografia",
	"geralmidia": "Mídia Geral",
};

const getMinistryLabel = (ministryValue: string): string => {
	return ministryLabels[ministryValue] || ministryValue;
};

export default function Voluntarios() {
	const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

	useEffect(() => {
		const fetchVolunteers = async () => {
			try {
				const response = await fetch('/api/volunteers');
				if (!response.ok) {
					throw new Error('Falha ao buscar voluntários');
				}
				const data = await response.json();
				setVolunteers(data);
			} catch (error) {
				console.error('Erro ao buscar voluntários:', error);
				toast.error('Erro ao carregar voluntários');
			} finally {
				setLoading(false);
			}
		};

		fetchVolunteers();
	}, []);

	const handleSelectVolunteer = (volunteerId: string) => {
		setSelectedVolunteers(prev => {
			if (prev.includes(volunteerId)) {
				return prev.filter(id => id !== volunteerId);
			} else {
				return [...prev, volunteerId];
			}
		});
	};

	const exportSelectedVolunteers = () => {
		const selected = volunteers.filter(volunteer => selectedVolunteers.includes(volunteer.id));

		if (selected.length === 0) {
			toast.warning('Nenhum voluntário selecionado');
			return;
		}

		// Formatar os dados para exportação
		const csvContent = [
			'Nome,Email,Telefone,Batizado,Ministério,Data de Cadastro',
			...selected.map(v =>
				`${v.name},${v.email},${v.phone},${v.baptized ? 'Sim' : 'Não'},${v.ministry},${new Date(v.createdAt).toLocaleDateString('pt-BR')}`
			)
		].join('\n');

		// Criar blob e fazer download
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `voluntarios-selecionados-${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success(`${selected.length} voluntários exportados com sucesso`);
	};

	return (
		<div className="min-h-screen bg-[#121212] text-white py-16 px-4">
			<div className="container mx-auto max-w-6xl">
				<h1 className="text-4xl font-bold text-center mb-8">Gerenciamento de Voluntários</h1>

				<Tabs defaultValue="all" className="w-full">
					<TabsList className="grid grid-cols-3 mb-6">
						<TabsTrigger value="all">Todos</TabsTrigger>
						<TabsTrigger value="selected">Selecionados ({selectedVolunteers.length})</TabsTrigger>
						<TabsTrigger value="ministry">Por Ministério</TabsTrigger>
					</TabsList>

					<TabsContent value="all">
						<Card className="bg-neutral-900 border-none shadow-lg">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-2xl text-neutral-100">Lista de Voluntários</CardTitle>
									<Button
										onClick={exportSelectedVolunteers}
										disabled={selectedVolunteers.length === 0}
										variant="outline"
										className='bg-neutral-100 text-neutral-900 hover:bg-neutral-900 hover:text-neutral-100'
									>
										Exportar Selecionados
									</Button>
								</div>
								<CardDescription>
									{loading ? 'Carregando...' : `Total de ${volunteers.length} voluntários cadastrados`}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex justify-center py-8">Carregando voluntários...</div>
								) : volunteers.length === 0 ? (
									<div className="text-center py-8">Nenhum voluntário cadastrado</div>
								) : (
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-12"></TableHead>
													<TableHead className='text-neutral-100'>Nome</TableHead>
													<TableHead className='text-neutral-100'>Email</TableHead>
													<TableHead className='text-neutral-100'>Telefone</TableHead>
													<TableHead className='text-neutral-100'>Batizado</TableHead>
													<TableHead className='text-neutral-100'>Ministério</TableHead>
													<TableHead className='text-neutral-100'>Cadastrado</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{volunteers.map((volunteer) => (
													<TableRow key={volunteer.id}>
														<TableCell>
															<Checkbox
																checked={selectedVolunteers.includes(volunteer.id)}
																onCheckedChange={() => handleSelectVolunteer(volunteer.id)}
															/>
														</TableCell>
														<TableCell className="font-medium text-neutral-100">{volunteer.name}</TableCell>
														<TableCell className="text-neutral-100">{volunteer.email}</TableCell>
														<TableCell className="text-neutral-100">{volunteer.phone}</TableCell>
														<TableCell className="text-neutral-100">{volunteer.baptized ? 'Sim' : 'Não'}</TableCell>
														<TableCell className="text-neutral-100">{getMinistryLabel(volunteer.ministry)}</TableCell>
														<TableCell className="text-neutral-100">
															{formatDistance(
																new Date(volunteer.createdAt),
																new Date(),
																{ addSuffix: true, locale: ptBR }
															)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="selected">
						<Card className="bg-neutral-900 border-none shadow-lg">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className='text-neutral-100'	>Voluntários Selecionados</CardTitle>
									<Button
										onClick={exportSelectedVolunteers}
										disabled={selectedVolunteers.length === 0}
										variant="outline"
										className='bg-neutral-100 text-neutral-900 hover:bg-neutral-900 hover:text-neutral-100'
									>
										Exportar Selecionados
									</Button>
								</div>
								<CardDescription>
									{selectedVolunteers.length} voluntários selecionados
								</CardDescription>
							</CardHeader>
							<CardContent>
								{selectedVolunteers.length === 0 ? (
									<div className="text-center py-8">Nenhum voluntário selecionado</div>
								) : (
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-12"></TableHead>
													<TableHead className='text-neutral-100'>Nome</TableHead>
													<TableHead className='text-neutral-100'>Email</TableHead>
													<TableHead className='text-neutral-100'>Telefone</TableHead>
													<TableHead className='text-neutral-100'>Batizado</TableHead>
													<TableHead className='text-neutral-100'>Ministério</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{volunteers
													.filter(v => selectedVolunteers.includes(v.id))
													.map((volunteer) => (
														<TableRow key={volunteer.id}>
															<TableCell>
																<Checkbox
																	checked={true}
																	onCheckedChange={() => handleSelectVolunteer(volunteer.id)}
																/>
															</TableCell>
															<TableCell className="font-medium text-neutral-100">{volunteer.name}</TableCell>
															<TableCell className="text-neutral-100">{volunteer.email}</TableCell>
															<TableCell className="text-neutral-100">{volunteer.phone}</TableCell>
															<TableCell className="text-neutral-100">{volunteer.baptized ? 'Sim' : 'Não'}</TableCell>
															<TableCell className="text-neutral-100">{getMinistryLabel(volunteer.ministry)}</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="ministry">
						<Card className="bg-neutral-900 border-none shadow-lg">
							<CardHeader>
								<CardTitle className='text-neutral-100'>Voluntários por Ministério</CardTitle>
								<CardDescription>
									Agrupados por área de interesse
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex justify-center py-8">Carregando...</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{Array.from(new Set(volunteers.map(v => v.ministry))).map(ministry => (
											<Card key={ministry} className="bg-neutral-800 border-none">
												<CardHeader>
													<CardTitle className="text-lg text-neutral-100">{getMinistryLabel(ministry)}</CardTitle>
													<CardDescription>
														{volunteers.filter(v => v.ministry === ministry).length} voluntários
													</CardDescription>
												</CardHeader>
												<CardContent>
													<ul className="space-y-2">
														{volunteers
															.filter(v => v.ministry === ministry)
															.map(volunteer => (
																<li key={volunteer.id} className="flex items-center justify-between">
																	<span className='text-neutral-100'>{volunteer.name}</span>
																	<Checkbox
																		checked={selectedVolunteers.includes(volunteer.id)}
																		onCheckedChange={() => handleSelectVolunteer(volunteer.id)}
																	/>
																</li>
															))}
													</ul>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}