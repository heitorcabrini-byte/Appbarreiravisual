import { Sun, Moon, Eye, ZoomIn, ZoomOut, Keyboard, LogOut } from 'lucide-react';
import { cn } from './ui/utils';

interface HeaderProps {
  fontSize: number;
  contrastMode: 'normal' | 'high-contrast' | 'inverted';
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onCycleContrast: () => void;
  onLogout: () => void;
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
}

export function Header({
  fontSize,
  contrastMode,
  onFontIncrease,
  onFontDecrease,
  onCycleContrast,
  onLogout,
  showKeyboardHelp,
  setShowKeyboardHelp,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0d1527] sticky top-0 z-50 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo / Identificação */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              🎓
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-white">E.E. Dom Pedro II</span>
              <span className="block text-xs text-slate-400">Mural de Avisos</span>
            </div>
          </div>

          {/* Barra de Ferramentas de Acessibilidade */}
          <div className="flex items-center gap-2">
            
            {/* Controles de Zoom */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-[#0b121f] p-1">
              <button
                onClick={onFontDecrease}
                title="Diminuir texto (Alt + 2)"
                aria-label="Diminuir tamanho do texto"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ZoomOut size={18} />
              </button>
              <span className="px-2 text-xs font-medium text-slate-400 min-w-[40px] text-center" aria-live="polite">
                {fontSize}px
              </span>
              <button
                onClick={onFontIncrease}
                title="Aumentar texto (Alt + 1)"
                aria-label="Aumentar tamanho do texto"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Alternador de Contraste */}
            <button
              onClick={onCycleContrast}
              title="Alternar contraste (Alt + 3)"
              aria-label={`Mudar modo de contraste. Atual: ${contrastMode}`}
              className={cn(
                "rounded-xl border p-2 transition-all flex items-center gap-1.5 text-xs font-medium",
                contrastMode === 'high-contrast'
                  ? "bg-yellow-400 border-yellow-400 text-black font-bold"
                  : "bg-[#0b121f] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Eye size={18} />
              <span className="hidden sm:inline">
                {contrastMode === 'normal' && 'Contraste'}
                {contrastMode === 'high-contrast' && 'Alto Contraste'}
                {contrastMode === 'inverted' && 'Invertido'}
              </span>
            </button>

            {/* Ajuda de Teclado */}
            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              title="Atalhos do teclado (Alt + 4)"
              aria-label="Mostrar mapa de atalhos de acessibilidade"
              aria-expanded={showKeyboardHelp}
              className={cn(
                "rounded-xl border p-2 transition-all",
                showKeyboardHelp 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-[#0b121f] border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Keyboard size={18} />
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            {/* Sair */}
            <button
              onClick={onLogout}
              aria-label="Fazer logout do sistema"
              className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-900/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/50 hover:text-white transition-all"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Sair</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
