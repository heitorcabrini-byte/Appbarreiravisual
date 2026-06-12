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

  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);

  const minFont = 12;
  const maxFont = 24;

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

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.style.fontSize = `${fontSize}px`;
    
    root.classList.remove('high-contrast', 'inverted', 'normal');
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

  const toggleFavoriteGlobal = (id: string) => {
    setFavoritedIds(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const filteredAnnouncements = ANNOUNCEMENTS_DATA.filter(item => {
    const categoryStr = item?.category || 'Geral';
    const titleStr = item?.title || '';
    const contentStr = item?.content || '';

    if (sort === 'favoritos' && !favoritedIds.includes(item.id)) {
      return false;
    }

    const matchesFilter = filter === 'todos' || categoryStr.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      titleStr.toLowerCase().includes(search.toLowerCase()) ||
      contentStr.toLowerCase().includes(search.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    
    if (sort === 'antigo') {
      return idA - idB;
    }
    return idB - idA;
  });

  // Estilos inline injetados diretamente para anular as limitações do build do Tailwind v4
  const highContrastStyles = `
    html.high-contrast, html.high-contrast body, html.high-contrast #root, html.high-contrast .app-main-wrapper, html.high-contrast main {
      background-color: #000000 !important;
      background: #000000 !important;
      color: #ffffff !important;
    }
    html.high-contrast header, html.high-contrast header *, html.high-contrast nav, html.high-contrast nav * {
      background-color: #facc15 !important;
      background: #facc15 !important;
      color: #000000 !important;
      border-color: #000000 !important;
    }
    html.high-contrast header svg, html.high-contrast header svg * {
      stroke: #000000 !important;
      color: #000000 !important;
      fill: transparent !important;
    }
    html.high-contrast .custom-alert-strip {
      background-color: #1a1500 !important;
      color: #facc15 !important;
      border-bottom: 2px solid #facc15 !important;
    }
    html.high-contrast .grid > div, html.high-contrast article, html.high-contrast div[class*="bg-"] {
      background-color: #170b04 !important;
      border: 2px solid #3a1d0a !important;
      box-shadow: none !important;
      border-radius: 1rem !important;
    }
    html.high-contrast .grid > div *, html.high-contrast article * {
      background-color: transparent !important;
      color: #ffffff !important;
    }
    html.high-contrast .grid > div span[class*="bg-"], html.high-contrast article span[class*="bg-"] {
      background-color: #2c1408 !important;
      border: 1px solid #facc15 !important;
      color: #facc15 !important;
    }
    html.high-contrast .grid > div button, html.high-contrast .grid > div a, html.high-contrast article button {
      border: 1px solid #3a1d0a !important;
      background-color: #110602 !important;
      color: #ffffff !important;
    }
    html.high-contrast input, html.high-contrast select, html.high-contrast input[type="search"] {
      background-color: #111111 !important;
      color: #ffffff !important;
      border: 2px solid #444444 !important;
    }
    html.high-contrast button[aria-checked="true"], html.high-contrast button[class*="bg-yellow-"] {
      background-color: #facc15 !important;
      color: #000000 !important;
    }
    html.high-contrast .max-w-md, html.high-contrast form {
      background-color: #121212 !important;
      border: 3px solid #facc15 !important;
    }
  `;

  return (
    <div className={`min-h-screen antialiased transition-colors duration-200 app-main-wrapper ${
      contrastMode === 'normal' ? 'bg-[#060b13] text-white' : ''
    }`}>
      {/* Injeção forçada de estilo direto no DOM */}
      <style>{highContrastStyles}</style>

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

          {/* 🟨 BARRA DE AVISO DA ACESSIBILIDADE DO FIGMA */}
          {contrastMode === 'high-contrast' && (
            <div className="custom-alert-strip text-center py-2 text-xs font-bold">
              ✓ Modo alto contraste ativado — maior visibilidade para baixa visão
            </div>
          )}

          {/* 👤 BARRA DE PERFIL DO PROFESSOR LOGADO */}
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 mt-4 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm border border-slate-700">
                HE
              </div>
              <div>
                <p className="text-sm font-bold text-white">heitorr</p>
                <p className="text-xs text-slate-400">Professor(a) • heitorcabrini@gmail.com</p>
              </div>
            </div>
            <button 
              onClick={() => setSession(null)}
              className="px-4 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition text-xs flex items-center gap-2"
            >
              🚪 Sair
            </button>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500 block">
                ESCOLA ESTADUAL DOM PEDRO II
              </span>
              <h1 className="text-3xl font-black mt-1 tracking-tight">
                Mural de Avisos
              </h1>
              <p className="text-sm mt-2 text-slate-400">
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
              <div className="text-center py-16 text-sm border border-dashed border-slate-800 rounded-2xl mt-8">
                {sort === 'favoritos' 
                  ? "Você ainda não favoritou nenhum aviso." 
                  : "Nenhum aviso encontrado para os filtros selecionados."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 items-start">
                {sortedAnnouncements.map((announcement) => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    isFavorited={favoritedIds.includes(announcement.id)}
                    onToggleFavorite={() => toggleFavoriteGlobal(announcement.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
