import Hero from './components/Hero';
import PublicAgendaList from './components/PublicAgendaList';
import Shared from './components/Shared';

export default function Home() {
  return (
    <main>
      <Hero />
      <Shared />
      <PublicAgendaList />
    </main>
  );
}
