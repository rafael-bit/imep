import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Regenere - Autenticação",
	description: "Faça login para acessar o sistema Regenere",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}