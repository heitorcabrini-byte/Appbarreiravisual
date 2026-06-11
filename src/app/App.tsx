import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { FilterOption, SortOption } from './data/announcements'; // Ajuste o caminho se necessário

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  // Controle de Sessão e de Telas
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  // Estados Globais de Acessibilidade
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Estados do Mural (Necessários para os filtros funcionarem sem quebrar)
  const [filter, setFilter] = useState<FilterOption>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('recente');

  const minFont = 14;
  const maxFont = 26;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'inverted-contrast');
    if (contrastMode === 'high-contrast') root.classList.add('high-contrast');
    if (contrastMode === 'inverted') root.classList.add('inverted-contrast');
  }, [contrastMode]);

  const handleFontIncrease = () => setFontSize(f => Math.min(f + 2, maxFont));
  const handleFontDecrease = () => setFontSize(f => Math.max(f - 2, minFont));
  
  const cycleContrast = () => {
    setContrastMode(prev => {
      if (prev === 'normal') return 'high-contrast';
      if (prev === 'high-contrast') return 'inverted';
      return 'normal';
    });
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="min-h-screen transition-colors bg-[#0b121f] text-white">
      {!session ? (
        <LoginScreen
          fontSize={fontSize}
          contrastMode={contrastMode}
          showKeyboardHelp={showKeyboardHelp}
          setShowKeyboardHelp={setShowKeyboardHelp}
          onFontIncrease={handleFontIncrease}
          onFontDecrease={handleFontDecrease}
          onCycleContrast={cycleContrast}
          onLoginSuccess={(userSession) => setSession(userSession)}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      ) : (
        <div className="min-h-screen bg-[#0b121f] text-white transition-colors">
          <Header 
            fontSize={fontSize}
            contrastMode={contrastMode}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            onCycleContrast={cycleContrast}
            onLogout={() => setSession(null)}
            showKeyboardHelp={showKeyboardHelp}
            setShowKeyboardHelp={setShowKeyboardHelp}
          />

          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Escola Estadual Dom Pedro II</span>
              <h1 className="text-3xl font-extrabold mt-1 text-white">Mural de Avisos</h1>
              <p className="text-sm text-slate-400 mt-1">Acompanhe comunicados, events e informações importantes da escola.</p>
            </div>

            {/* Chamada corrigida com todas as props necessárias passadas */}
            <FilterSearchBar 
              filter={filter}
              search={search}
              sort={sort}
              resultCount={1} // Provisório para renderizar o card de teste
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              onSortChange={setSort}
              highContrast={contrastMode === 'high-contrast'}
            />

            {/* Grid de Anúncios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <AnnouncementCard />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
