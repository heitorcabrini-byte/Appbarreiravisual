import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; // Caminho relativo correto dentro de src/app/
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  // Controle de Sessão e de Telas (login ou registro)
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  // Estados Globais de Acessibilidade
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const minFont = 14;
  const maxFont = 26;

  // Injeta dinamicamente as classes de alto contraste na raiz HTML do site
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
        // Se NÃO estiver logado, gerencia a exibição entre Login e Cadastro
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
        // SE ESTIVER LOGADO: Renderiza o Mural Perfeito com os componentes reais
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
              <p className="text-sm text-slate-400 mt-1">Acompanhe comunicados, eventos e informações importantes da escola.</p>
            </div>

            {/* Barra de filtros original */}
            <FilterSearchBar />

            {/* Grid dos Cards formatado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <AnnouncementCard />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
