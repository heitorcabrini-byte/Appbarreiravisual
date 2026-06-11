import { Eye, LogOut, User } from 'lucide-react';

interface HeaderProps {
  fontSize: number;
  contrastMode: 'normal' | 'high-contrast' | 'inverted';
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onCycleContrast: () => void;
  onLogout: () => void;
}

export function Header({
  fontSize,
  contrastMode,
  onFontIncrease,
  onFontDecrease,
  onCycleContrast,
  onLogout
}: HeaderProps) {

  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur px-4 py-3 flex items-center justify-between gap-4">
      {/* Lado Esquerdo: Identificação da Escola */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {/* Ícone de chapéu de formatura ou logo */}
          <span className="font-bold text-lg">🎓</span>
        </div>
        <div>
          <h2 className="font-bold text-sm sm:text-base leading-tight text-foreground">E.E. Dom Pedro II</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">Mural de Avisos Escolar</p>
        </div>
      </div>

      {/* Lado Direito: Controlos de Acessibilidade e Utilizador */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Seletor de Tamanho de Fonte (Zoom) */}
        <div role="group" aria-label="Tamanho do texto" className="flex items-center rounded-lg border border-border bg-background overflow-hidden h-9">
          <button type="button" onClick={onFontDecrease} title="Diminuir texto" className="px-2.5 hover:bg-secondary font-bold text-sm text-foreground h-full transition-colors">A−</button>
          <span className="px-2 text-xs font-mono border-x border-border text-foreground bg-secondary/30 flex items-center h-full">{fontSize}px</span>
          <button type="button" onClick={onFontIncrease} title="Aumentar texto" className="px-2.5 hover:bg-secondary font-bold text-sm text-foreground h-full transition-colors">A+</button>
        </div>

        {/* Botão de Contraste Cíclico */}
        <button
          type="button"
          onClick={onCycleContrast}
          title="Alternar contraste"
          className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-secondary transition-all"
        >
          <Eye size={14} />
          <span className="hidden md:inline">Contraste</span>
        </button>

        {/* Divisor Visual */}
        <div className="h-6 w-[1px] bg-border hidden xs:block"></div>

        {/* Perfil Simplificado do Aluno / Responsável */}
        <div className="flex items-center gap-2 max-w-[150px] hidden sm:flex">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <User size={16} />
          </div>
          <div className="text-left truncate">
            <p className="text-xs font-bold leading-tight truncate text-foreground">heitorr</p>
            <p className="text-[10px] text-muted-foreground truncate">Responsável</p>
          </div>
        </div>

        {/* Botão de Sair (Logout) */}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 w-9 sm:w-auto items-center justify-center gap-2 rounded-lg bg-red-950/40 text-red-400 border border-red-900/50 sm:px-3 text-xs font-bold hover:bg-red-900/40 transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
