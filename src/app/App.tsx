import { useState, useEffect } from 'react';
import { LoginScreen } from './app/components/LoginScreen';
import { Header } from './app/components/Header';
import { FilterSearchBar } from './app/components/FilterSearchBar';
import { AnnouncementCard } from './app/components/AnnouncementCard';
// Mantenha os seus outros imports de dados se existirem (ex: seus cards)

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const minFont = 14;
  const maxFont = 26;

  // Atualiza as classes CSS na tag HTML raiz para o Alto Contraste funcionar globalmente
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
    <div style={{ fontSize: `${fontSize}px` }} className="min-h-screen transition-colors">
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
        />
      ) : (
        /* SE ESTIVER LOGADO: Renderiza a estrutura do seu Mural Escolar */
        <div className={`min-h-screen transition-colors ${contrastMode !== 'normal' ? 'bg-black text-white' : 'bg-[#0b121f]'}`}>
          
          {/* O seu componente Header recebendo os comandos de acessibilidade */}
          <Header 
            fontSize={fontSize}
            contrastMode={contrastMode}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            onCycleContrast={cycleContrast}
            onLogout={() => setSession(null)}
          />

          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Escola Estadual Dom Pedro II</span>
              <h1 className="text-3xl font-extrabold mt-1 text-foreground">Mural de Avisos</h1>
              <p className="text-sm text-muted-foreground mt-1">Acompanhe comunicados, eventos e informações importantes da escola.</p>
            </div>

            {/* Barra de pesquisa original */}
            <FilterSearchBar />

            {/* Seus Cards de Aviso entram organizados em Grid responsiva (evitando o erro vertical) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* O seu mapeamento interno de avisos ou os componentes estáticos entram aqui */}
              <AnnouncementCard />
            </div>
          </main>

        </div>
      )}
    </div>
  );
}
