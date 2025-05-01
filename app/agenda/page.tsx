'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

interface Agenda {
	id: string;
	title: string;
	description: string;
	date: string;
	image: string | null;
}

export default function Page() {
	const [agendas, setAgendas] = useState<Agenda[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchAgendas() {
			try {
				const response = await fetch('/api/agenda');
				if (response.ok) {
					const data = await response.json();
					setAgendas(data);
				}
			} catch (error) {
				console.error("Failed to fetch agendas:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchAgendas();
	}, []);

	if (loading) {
		return <div className="text-white text-center py-10">Carregando agendas...</div>;
	}

	return (
		<section className="text-white py-10 container mx-auto px-4">
			<h1 className="text-2xl font-semibold text-center mb-16 my-5">Todas as agendas</h1>

			{agendas.length === 0 ? (
				<p className="text-center">Nenhuma agenda encontrada.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{agendas.map((agenda) => (
						<Card key={agenda.id} className="w-4/5 h-8/9 border border-neutral-700 bg-black/20 text-white overflow-hidden py-0! -pt-5! pb-5!">
							{agenda.image && (
								<div className="relative w-full h-64 md:h-[16rem] overflow-hidden">
									<Image
										src={agenda.image}
										alt={agenda.title}
										fill
										className="object-fill"
									/>
								</div>
							)}
							<CardContent className="p-5">
								<h3 className="font-medium text-xl mb-2">{agenda.title}</h3>
								<p className="text-gray-400 text-sm mb-3">
									{format(new Date(agenda.date), "dd 'de' MMM 'de' yyyy 'às' HH:mm", {
										locale: ptBR
									})}
								</p>
								{agenda.description && (
									<p className="text-gray-300 text-sm line-clamp-4">{agenda.description}</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</section>
	)
}
