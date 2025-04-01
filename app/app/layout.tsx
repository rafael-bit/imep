import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import handler from '@/services/auth';
import Link from 'next/link';

interface UserSession {
	user?: {
		name?: string;
		email?: string;
	};
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
	try {
		const session = await getServerSession(handler) as UserSession;

		if (!session) {
			redirect('/auth');
		}

		return (
			<main className="min-h-screen bg-[#121212] text-white">
				<div className="bg-[#121212] shadow-sm">
					<div className="container mx-auto py-4 px-4 flex justify-between items-center">
						<Link href="/" className="hover:underline">
							<h1 className="text-xl font-bold">IMEP</h1>
						</Link>
						<nav>
							<ul className="flex items-center gap-4">
								<li>
									<Link href="/" className="hover:underline">
										Inicial
									</Link>
								</li>
								<li>
									<Link href="" target="_blank" className="hover:underline">
										Voluntários
									</Link>
								</li>
								<li>
									<Link href="http://clearcash.vercel.app/" target="_blank" className="hover:underline">
										Financeiro
									</Link>
								</li>
							</ul>
						</nav>
						<div className="flex items-center gap-4">
							<span className="text-sm">
								{session.user?.name || session.user?.email || 'Usuário'}
							</span>
							<Link href="/api/auth/signout" className="text-sm text-red-600 hover:text-red-800">
								Sair
							</Link>
						</div>
					</div>
				</div>
				{children}
			</main>
		);
	} catch (error) {
		console.error('Error on verify authentication:', error);
		redirect('/auth');
	}
} 