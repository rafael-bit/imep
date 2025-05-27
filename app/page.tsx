import Hero from './components/Hero';
import PublicAgendaList from './components/PublicAgendaList';
import Shared from './components/Shared';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Shared />
      <PublicAgendaList />
    </main>
  );
}
