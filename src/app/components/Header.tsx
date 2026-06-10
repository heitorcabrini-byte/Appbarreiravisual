import { GraduationCap, Eye, KeyboardIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface HeaderProps {
  fontSize: number;
  highContrast: boolean;
  unreadCount: number;
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onToggleContrast: () => void;
}

export function Header({
  fontSize,
  highContrast,
  unreadCount,
  onFontIncrease,
  onFontDecrease,
  onToggleContrast,
}: HeaderProps) {
  const minFont = 16;
  const maxFont = 28;

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md"
    >
      {/* Top bar: school identity + controls */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* School identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            aria-hidden="true"
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-primary/20 text-primary',
            )}
          >
            <GraduationCap size={26} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate leading-tight text-foreground">
              E.E. Dom Pedro II
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: '0.8rem' }}>
              Mural de Avisos Escolar
            </p>
          </div>
        </div>

        {/* Accessibility controls */}
        <nav
          role="navigation"
          aria-label="Controles de acessibilidade"
          className="flex items-center gap-1 sm:gap-2"
        >
          {/* Font size controls */}
          <div
            role="group"
            aria-label="Tamanho da fonte"
            className="flex items-center rounded-lg border border-border overflow-hidden"
          >
            <Button
              variant="ghost"
              onClick={onFontDecrease}
              disabled={fontSize <= minFont}
              aria-label={`Diminuir fonte. Tamanho atual: ${fontSize} pixels`}
              className="h-10 w-10 rounded-none border-0 p-0 hover:bg-secondary"
              title="Diminuir fonte (A-)"
            >
              <span aria-hidden="true" style={{ fontSize: '0.75rem', fontWeight: 700 }}>A−</span>
            </Button>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="hidden items-center justify-center border-x border-border px-2 sm:flex"
              style={{ minWidth: '3rem', fontSize: '0.8rem' }}
            >
              <span className="sr-only">Tamanho da fonte:</span>
              <span className="text-muted-foreground">{fontSize}px</span>
            </div>
            <Button
              variant="ghost"
              onClick={onFontIncrease}
              disabled={fontSize >= maxFont}
              aria-label={`Aumentar fonte. Tamanho atual: ${fontSize} pixels`}
              className="h-10 w-10 rounded-none border-0 p-0 hover:bg-secondary"
              title="Aumentar fonte (A+)"
            >
              <span aria-hidden="true" style={{ fontSize: '0.9rem', fontWeight: 700 }}>A+</span>
            </Button>
          </div>

          {/* High contrast toggle */}
          <Button
            variant="ghost"
            onClick={onToggleContrast}
            aria-pressed={highContrast}
            aria-label={
              highContrast
                ? 'Desativar modo alto contraste'
                : 'Ativar modo alto contraste'
            }
            title={highContrast ? 'Alto contraste ativado' : 'Alto contraste desativado'}
            className={cn(
              'h-10 w-10 p-0',
              highContrast && 'bg-yellow-400 text-black hover:bg-yellow-300',
            )}
          >
            <Eye size={18} strokeWidth={2.5} aria-hidden="true" />
          </Button>

          {/* Keyboard shortcut hint */}
          <Button
            variant="ghost"
            className="hidden h-10 w-10 p-0 sm:flex"
            aria-label="Atalhos de teclado disponíveis: Tab para navegar, Enter para selecionar, Escape para fechar"
            title="Atalhos de teclado"
          >
            <KeyboardIcon size={18} strokeWidth={2} aria-hidden="true" />
          </Button>

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <div
              role="status"
              aria-live="polite"
              aria-label={`${unreadCount} aviso${unreadCount > 1 ? 's' : ''} não lido${unreadCount > 1 ? 's' : ''}`}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-full px-3',
                highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-primary/20 text-primary',
              )}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 animate-pulse rounded-full bg-current"
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                {unreadCount} novo{unreadCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </nav>
      </div>

      {/* Accessibility status announcement */}
      {highContrast && (
        <div
          role="status"
          aria-live="polite"
          className="border-t border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-center"
          style={{ fontSize: '0.8rem' }}
        >
          <span className="text-yellow-300">
            ✓ Modo alto contraste ativado — maior visibilidade para baixa visão
          </span>
        </div>
      )}
    </header>
  );
}
