'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type Agenda = {
	id: string;
	title: string;
	date: string;
	description: string;
	image: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

export default function PublicAgendaList() {
	const [agendas, setAgendas] = useState<Agenda[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchAgendas() {
			try {
				const response = await fetch('/api/agenda', {
					method: 'GET',
				});

				if (response.ok) {
					const data = await response.json();
					setAgendas(data);
				} else {
					console.error('Error on fetch agendas');
				}
			} catch (error) {
				console.error('Error on fetch agendas:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchAgendas();
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto py-8 text-white">
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 text-white">
			<h1 className="text-center text-3xl font-bold mb-8">Agendas</h1>

			{agendas.length === 0 ? (
				<p className="text-gray-500 text-center">Nenhuma agenda encontrada.</p>
			) : (
				<Carousel
					opts={{
						align: "center",
						loop: true,
					}}
					className="w-full max-w-4xl mx-auto"
				>
					<CarouselContent>
						{agendas.map((agenda) => (
							<CarouselItem key={agenda.id} className="md:basis-2/6 lg:basis-2/6">
								<div>
									<Card className="border border-neutral-700 bg-black/20 text-white overflow-hidden py-4">
										{agenda.image && (
											<div className="relative w-full h-64 md:h-[10rem] overflow-hidden">
												<Image
													src={agenda.image}
													alt={agenda.title}
													fill
													className="px-4 max-w-full max-h-full"
												/>
											</div>
										)}
										<CardContent className="p-5 pb-3">
											<h3 className="font-medium text-2xl mb-2">{agenda.title}</h3>
											{agenda.description && (
												<p className="text-gray-300 mt-4 whitespace-pre-line">{agenda.description}</p>
											)}
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			)}
			<div className="flex justify-center items-center py-4">
				<p className="flex items-center gap-3 bg-black px-5 py-1 pb-1.5 rounded-full">
					<span className="shimmer-text text-base sm:text-lg flex items-center gap-3">
						<span>&lt;</span> Deslize para ver mais
					</span>
				</p>
			</div>
		</div>
	);
} 