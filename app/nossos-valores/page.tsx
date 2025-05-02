'use client';

import { motion } from 'framer-motion';
import { faithTopics } from '../constants/header';

export default function NossosValores() {
	return (
		<div className="min-h-screen bg-[#121212] text-white py-16 px-4">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-4xl font-bold text-center mb-16">Nossos Valores e Doutrinas</h1>

				<div className="space-y-24">
					{faithTopics.map((topic) => (
						<motion.div
							key={topic.id}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="flex flex-col md:flex-row gap-6 items-start"
						>
							<div className="flex-shrink-0">
								<div className="bg-gradient-to-br from-purple-600 to-blue-500 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
									{topic.id}
								</div>
							</div>

							<div className="flex-1">
								<h2 className="text-2xl font-semibold mb-3 text-purple-300">{topic.title}</h2>
								<p className="text-gray-300 text-lg leading-relaxed">{topic.description}</p>

								<div className="mt-6 border-b border-gray-700"></div>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1, delay: 0.2 }}
					className="mt-24 text-center"
				>
					<h3 className="text-2xl font-semibold mb-4">Nossa Missão</h3>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Levar o evangelho de Jesus Cristo a todas as pessoas, edificar os crentes na fé e promover
						o serviço cristão para a glória de Deus.
					</p>
				</motion.div>
			</div>
		</div>
	);
}
