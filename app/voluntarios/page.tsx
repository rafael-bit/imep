'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface VolunteerFormData {
	name: string;
	email: string;
	phone: string;
	baptized: string;
	ministry: string;
}

// Mapeamento de valores internos para nomes amigáveis
const ministryLabels: Record<string, string> = {
	"kidschurch": "Igreja da Criança",
	"musicteam": "Ministério de Louvor",
	"techinicalsuporte": "Suporte Técnico",
	"sound": "Técnico de Som",
	"slide": "Mídia Slide",
	"photograph": "Mídia Fotografia",
	"geralmidia": "Mídia Geral"
};

// Função para obter o nome amigável do ministério
const getMinistryLabel = (ministryValue: string): string => {
	return ministryLabels[ministryValue] || ministryValue;
};

export default function Page() {
	const [formData, setFormData] = useState<VolunteerFormData>({
		name: '',
		email: '',
		phone: '',
		baptized: 'no',
		ministry: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formatPhone = (value: string) => {
		const cleaned = value.replace(/\D/g, '').slice(0, 11);
		if (cleaned.length <= 10) {
			return cleaned.replace(
				/(\d{0,2})(\d{0,4})(\d{0,4})/,
				(_, d1, d2, d3) =>
					`${d1 ? '(' + d1 : ''}${d1 && d2 ? ') ' + d2 : ''}${d2 && d3 ? '-' + d3 : ''}`
			);
		}
		return cleaned.replace(
			/(\d{0,2})(\d{0,5})(\d{0,4})/,
			(_, d1, d2, d3) =>
				`${d1 ? '(' + d1 : ''}${d1 && d2 ? ') ' + d2 : ''}${d2 && d3 ? '-' + d3 : ''}`
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const toastId = toast.loading("Enviando seu formulário...");

		try {
			const response = await fetch('/api/volunteers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					baptized: formData.baptized === 'yes'
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao enviar formulário');
			}

			toast.success("Seu formulário foi enviado com sucesso!", {
				id: toastId,
				description: "Em breve entraremos em contato com você.",
			});

			setFormData({
				name: '',
				email: '',
				phone: '',
				baptized: 'no',
				ministry: '',
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, {
					id: toastId,
					description: "Por favor, tente novamente.",
				});
			} else {
				toast.error("Ocorreu um erro ao enviar o formulário.", {
					id: toastId,
					description: "Por favor, tente novamente mais tarde.",
				});
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="container mx-auto p-5 text-white">
			<div className="flex flex-col items-center justify-center min-h-screen">
				<Card className='flex flex-col md:flex-row md:justify-between w-5/6 border-none shadow-2xl bg-neutral-900 z-20 py-0'>
					<div className='py-12 px-10 flex flex-col justify-center relative w-full'>
						<CardHeader>
							<CardTitle className='text-4xl text-center text-white'>Eu quero ser um voluntário</CardTitle>
							<CardDescription className='mt-5 text-center'>Se quiser ser um voluntário do IMEP, preencha o formulário abaixo</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit}>
								<div className="grid w-full items-center gap-4 mt-4 text-white">
									<div className="flex flex-col space-y-5">
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="name">Nome</Label>
											<Input
												id="name"
												type="text"
												placeholder="Escreva seu nome"
												className='border border-neutral-800'
												required
												value={formData.name}
												onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											/>
										</div>
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												placeholder="Escreva seu email"
												className='border border-neutral-800'
												required
												value={formData.email}
												onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											/>
										</div>
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="phone">Telefone</Label>
											<Input
												id="phone"
												type="tel"
												value={formData.phone}
												onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
												placeholder="(00) 00000-0000"
												className='border border-neutral-800'
												maxLength={15}
												required
											/>
										</div>
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="baptized">É batizado ?</Label>
											<Select
												value={formData.baptized}
												onValueChange={(value) => setFormData({ ...formData, baptized: value })}
											>
												<SelectTrigger className="border border-neutral-800 w-full">
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
												<SelectContent className='border border-neutral-800 bg-neutral-900 text-white'>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="yes">Sim</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="no">Não</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="ministry">Qual ministério deseja participar ?</Label>
											<Select
												value={formData.ministry}
												onValueChange={(value) => setFormData({ ...formData, ministry: value })}
											>
												<SelectTrigger className="border border-neutral-800 w-full">
													<SelectValue placeholder="Selecione">
														{formData.ministry && getMinistryLabel(formData.ministry)}
													</SelectValue>
												</SelectTrigger>
												<SelectContent className='border border-neutral-800 bg-neutral-900 text-white'>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="kidschurch">Igreja da Criança</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="musicteam">Ministério de Louvor</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="techinicalsuporte">Suporte Técnico</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="sound">Técnico de Som</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="slide">Mídia Slide</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="photograph">Mídia Fotografia</SelectItem>
													<SelectItem className='bg-neutral-900 hover:bg-neutral-800' value="geralmidia">Mídia Geral</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<Button
											type="submit"
											variant='outline'
											className='cursor-pointer text-black border hover:bg-transparent hover:text-white'
											disabled={isSubmitting}
										>
											{isSubmitting ? 'Enviando...' : 'Enviar'}
										</Button>
									</div>
								</div>
							</form>
						</CardContent>
					</div>
					<Image alt="About image" width="1000" height="1000" className="md:w-[50%] object-cover rounded-b-lg md:rounded-r-lg z-20" src="/midia-image.jpeg" />
				</Card>
				<div className="w-3/4 -mt-2 bg-neutral-800 shadow-lg p-4 rounded-b-lg z-10"></div>
			</div>
		</main>
	)
}