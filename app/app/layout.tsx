import { AppHeader } from './components/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-[#121212] text-white">
			<AppHeader />
			<main className="container mx-auto py-6 px-4">
				{children}
			</main>
		</div>
	);
} 