import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "IMEP - Autenticação",
	description: "Faça login para acessar o sistema IMEP",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}