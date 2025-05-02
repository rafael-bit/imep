'use client';

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AccessDenied() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 px-4">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-100">
						Acesso Negado
					</h2>
					<p className="mt-2 text-center text-sm text-neutral-500">
						Você não tem permissão para acessar esta área.
						<br />
						Apenas administradores podem acessar o painel de controle.
					</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-4">
					<Link href="/" className="w-full">
						<Button className="w-full hover:border transition-all duration-300">
							Voltar para a página inicial
						</Button>
					</Link>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => signOut({ callbackUrl: '/auth' })}
					>
						Sair
					</Button>
				</div>
			</div>
		</div>
	);
} 