'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";

export function LogoutButton() {
	const { logout, loading } = useAuth();

	return (
		<Button
			variant="ghost"
			onClick={logout}
			disabled={loading}
			className="flex items-center hover:bg-red-900/20 hover:text-red-400 transition-colors"
		>
			<LogOut className="mr-2 h-4 w-4" />
			<span className="hidden sm:inline">Sair</span>
		</Button>
	);
} 