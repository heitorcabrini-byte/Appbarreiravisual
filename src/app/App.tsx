import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';
// Trazendo os dados reais do Figma de volta
import { ANNOUNCEMENTS, FILTER_OPTIONS } from './data/announcements'; 

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  // Controle de Sessão e Telas
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  // Estados Globais de Acessibilidade
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Estados dos Filtros do Mural
  const [filter, setFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('recente');

  const minFont = 14;
  const maxFont = 26;

  // ⌨️ Escuta Global de Atalhos de Teclado (Funciona em todo o site)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt + 1: Aumentar Fonte
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setFontSize(f => Math.min(f + 2, maxFont));
      }
      // Alt + 2: Diminuir Fonte
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setFontSize(f => Math.max(f - 2, minFont));
      }
      // Alt + 3: Alternar Contraste
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        cycleContrast();
      }
      // Alt + 4: Ajuda de Teclado
      if (e.altKey && e.key === '4') {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [contrastMode]);

  // Sincroniza classes CSS de Contraste no elemento raiz
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

  // 🔍 FILTRAGEM E ORDENAÇÃO DOS DADOS REAIS DO FIGMA
  const filteredAnnouncements = (ANNOUNCEMENTS || []).filter(item => {
    const matchesFilter = filter === 'todos' || item.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Ordenação
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sort === 'antigo') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // Padrão: Mais recente primeiro
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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
          {/* Header conectado com as funções reais de modificação */}
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
              <p className="text-sm text-slate-400 mt-1">Acompanhe comunicados, eventos e informações importantes da escola.</p>
            </div>

            {/* Filtros dinâmicos informando a quantidade correta baseada na busca */}
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

            {/* Grid Renderizando os Dados Reais do Banco/Figma */}
            {sortedAnnouncements.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
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
