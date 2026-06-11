import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
// Certifique-se de manter o import correto do componente do seu mural aqui embaixo, por exemplo:
// import { MuralDashboard } from './components/MuralDashboard';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const minFont = 16;
  const maxFont = 28;

  // Injeta os múltiplos modos de contraste direto na tag raiz do navegador (HTML)
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
        /* AQUI FICA O COMPONENTE DO SEU MURAL LOGADO.
          Insira a mesma barra de acessibilidade nele passando as propriedades globais abaixo:
          
          <MuralDashboard 
            fontSize={fontSize}
            contrastMode={contrastMode}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            onCycleContrast={cycleContrast}
            setShowKeyboardHelp={setShowKeyboardHelp}
            onLogout={() => setSession(null)}
          />
        */
        <div className={cn("p-8 min-h-screen transition-colors", contrastMode !== 'normal' ? 'bg-black text-white' : 'bg-background')}>
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-border">
            <h1 className="text-2xl font-bold">Mural de Avisos Escolar</h1>
            <div className="flex gap-2">
              <button type="button" onClick={cycleContrast} className="px-3 py-1.5 border rounded text-xs font-bold">Mudar Contraste</button>
              <button type="button" onClick={handleFontIncrease} className="px-3 py-1.5 border rounded text-xs font-bold">A+</button>
              <button type="button" onClick={handleFontDecrease} className="px-3 py-1.5 border rounded text-xs font-bold">A-</button>
              <button type="button" onClick={() => setSession(null)} className="bg-destructive text-white px-3 py-1.5 rounded text-xs font-bold">Sair</button>
            </div>
          </div>
          <p className="text-sm">O conteúdo do seu mural agora herda o zoom dinâmico de {fontSize}px e os estilos visuais de alto contraste selecionados.</p>
        </div>
      )}
    </div>
  );
}
