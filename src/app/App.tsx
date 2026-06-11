import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
// Importe aqui o seu componente do Mural de Avisos, ex:
// import { Dashboard } from './components/Dashboard'; 

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const minFont = 16;
  const maxFont = 28;

  // Sincroniza os modos de contraste injetando classes na raiz HTML do navegador
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'inverted-contrast');
    if (contrastMode === 'high-contrast') root.classList.add('high-contrast');
    if (contrastMode === 'inverted') root.classList.add('inverted-contrast');
  }, [contrastMode]);

  // Funções globais de tamanho de fonte
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
        /* AQUI VAI O COMPONENTE DO SEU MURAL DE AVISOS.
          Passe as mesmas propriedades para a barra de acessibilidade do mural!
          Exemplo:
          <Dashboard 
            fontSize={fontSize}
            contrastMode={contrastMode}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            onCycleContrast={cycleContrast}
            setShowKeyboardHelp={setShowKeyboardHelp}
            onLogout={() => setSession(null)}
          />
        */
        <div className="p-8">
          {/* Substitua esta div temporária pela estrutura real do seu mural se necessário */}
          <h1 className="text-2xl font-bold">Mural de Avisos Carregado</h1>
          <button onClick={() => setSession(null)} className="mt-4 bg-red-600 px-4 py-2 rounded">Sair</button>
        </div>
      )}

      {/* Modal Global de Atalhos de Teclado (Funciona em qualquer tela) */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-neutral-900 p-6 text-white border-neutral-700">
            <h3 className="text-lg font-bold mb-4">⌨️ Atalhos de Navegação</h3>
            <ul className="space-y-3 text-sm">
              <li><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-600 font-mono">Tab</kbd> Avança para o próximo elemento.</li>
              <li><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-600 font-mono">Shift + Tab</kbd> Volta para o elemento anterior.</li>
              <li><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-600 font-mono">Enter</kbd> Ativa links e botões.</li>
            </ul>
            <button onClick={() => setShowKeyboardHelp(false)} className="mt-6 w-full bg-white text-black font-bold py-2 rounded-xl">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
