import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { ANNOUNCEMENTS_DATA } from './data/announcements';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  const [fontSize, setFontSize] = useState(16); 
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const [filter, setFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('recente');

  const minFont = 12;
  const maxFont = 24;

  // ⌨️ Atalhos de teclado globais
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setFontSize(f => Math.min(f + 2, maxFont));
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setFontSize(f => Math.max(f - 2, minFont));
      }
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        cycleContrast();
      }
      if (e.altKey && e.key === '4') {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [contrastMode]);

  // ⚡ Sincronização e Injeção de Classes visuais no HTML Nativo
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.style.fontSize = `${fontSize}px`;
    
    root.classList.remove('high-contrast', 'inverted', 'inverted-contrast', 'normal');
    body.classList.remove('high-contrast', 'inverted', 'normal');
    
    if (contrastMode === 'high-contrast') {
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
    } else if (contrastMode === 'inverted') {
      root.classList.add('inverted');
      body.classList.add('inverted');
    } else {
      root.classList.add('normal');
      body.classList.add('normal');
    }
  }, [fontSize, contrastMode]);

  const handleFontIncrease = () => setFontSize(f => Math.min(f + 2, maxFont));
  const handleFontDecrease = () => setFontSize(f => Math.max(f - 2, minFont));
  
  const cycleContrast = () => {
    setContrastMode(prev => {
      if (prev === 'normal') return 'high-contrast';
      if (prev === 'high-contrast') return 'inverted';
      return 'normal';
    });
  };

  // Filtragem e busca
  const filteredAnnouncements = ANNOUNCEMENTS_DATA.filter(item => {
    const categoryStr = item?.category || 'Geral';
    const titleStr = item?.title || '';
    const contentStr = item?.content || '';

    const matchesFilter = filter === 'todos' || categoryStr.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      titleStr.toLowerCase().includes(search.toLowerCase()) ||
      contentStr.toLowerCase().includes(search.toLowerCase()) ||
      categoryStr.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Ordenação
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sort === 'antigo') {
      return a.id.localeCompare(b.id);
    }
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen bg-[#060b13] text-white antialiased transition-colors duration-200">
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
        <div className="min-h-screen">
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

          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                Escola Estadual Dom Pedro II
              </span>
              <h1 className="text-3xl font-black mt-1 tracking-tight text-white">
                Mural de Avisos
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Acompanhe comunicados, eventos e informações importantes da escola.
              </p>
            </div>

            {showKeyboardHelp && (
              <div className="mb-6 p-4 rounded-xl border bg-blue-950/20 border-blue-800/30 text-xs text-slate-300">
                <p className="font-bold text-blue-400 mb-1"> 🏢 Atalhos de acessibilidade:</p>
                <p>Alt + 1: Aumentar Texto | Alt + 2: Diminuir Texto | Alt + 3: Trocar Contraste | Alt + 4: Fechar guia</p>
              </div>
            )}

            <FilterSearchBar 
              filter={filter}
              search={search}
              sort={sort}
              resultCount={sortedAnnouncements.length}
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              onSortChange={setSort}
              highContrast={contrastMode === 'high-contrast'}
            />

            {sortedAnnouncements.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl mt-8">
                Nenhum aviso encontrado para os filtros selecionados.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {sortedAnnouncements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
