import { Eye, LogOut, User, Keyboard } from 'lucide-react';

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
  setShowKeyboardHelp
}: HeaderProps) {

  const getContrastLabel = () => {
    if (contrastMode === 'normal') return 'Contraste: Padrão';
    if (contrastMode === 'high-contrast') return 'Contraste: Alto';
    return 'Contraste: Invertido';
  };

  return (
    <header className="w-full border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur px-6 py-4 flex items-center justify-between gap-4">
      
      {/* Lado Esquerdo */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-xl">
          🎓
        </div>
        <div>
          <h2 className="font-bold text-base text-white leading-tight">E.E. Dom Pedro II</h2>
          <p className="text-xs text-slate-400">Mural de Avisos Escolar</p>
        </div>
      </div>

      {/* Lado Direito: Controles Conectados com o App.tsx */}
      <div className="flex items-center gap-3">
        
        {/* Controle do Zoom de Fonte */}
        <div role="group" aria-label="Tamanho do texto" className="flex items-center rounded-lg border border-slate-700 bg-[#0f172a] overflow-hidden h-9">
          <button type="button" onClick={onFontDecrease} className="px-3 hover:bg-slate-800 font-bold text-sm text-white h-full transition-colors">A−</button>
          <span className="px-2 text-xs font-mono border-x border-slate-700 text-slate-300 bg-slate-800/50 flex items-center h-full">{fontSize}px</span>
          <button type="button" onClick={onFontIncrease} className="px-3 hover:bg-slate-800 font-bold text-sm text-white h-full transition-colors">A+</button>
        </div>

        {/* Correção Bug #01: Alternador de Contraste Cíclico */}
        <button
          type="button"
          onClick={onCycleContrast}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-700 bg-[#0f172a] px-3 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-all"
        >
          <Eye size={14} className="text-blue-400" />
          <span>{getContrastLabel()}</span>
        </button>

        {/* Correção Bug #02: Botão de Atalhos do Teclado Ativo */}
        <button
          type="button"
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${showKeyboardHelp ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700 bg-[#0f172a] text-slate-200 hover:bg-slate-800'}`}
          title="Ver atalhos de teclado"
        >
          <Keyboard size={16} />
        </button>

        <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Identificação do Usuário Logado */}
        <div className="flex items-center gap-2 hidden sm:flex">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
            <User size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight text-white">heitorr</p>
            <p className="text-[10px] text-slate-400">Responsável</p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 items-center gap-2 rounded-lg bg-red-950/30 text-red-400 border border-red-900/40 px-3 text-xs font-bold hover:bg-red-900/30 transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
