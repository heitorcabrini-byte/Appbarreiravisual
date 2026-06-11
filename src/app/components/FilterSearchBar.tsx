import { useRef, KeyboardEvent } from 'react';
import { Search, SortAsc, X } from 'lucide-react';
import { cn } from './ui/utils';
import { FILTER_OPTIONS, FilterOption, SortOption } from '../data/announcements';

interface FilterSearchBarProps {
  filter: FilterOption;
  search: string;
  sort: SortOption;
  resultCount: number;
  onFilterChange: (f: FilterOption) => void;
  onSearchChange: (s: string) => void;
  onSortChange: (s: SortOption) => void;
  highContrast: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'antigo', label: 'Mais antigo' },
  { value: 'favoritos', label: 'Meus favoritos' },
];

export function FilterSearchBar({
  filter,
  search,
  sort,
  resultCount,
  onFilterChange,
  onSearchChange,
  onSortChange,
  highContrast,
}: FilterSearchBarProps) {
  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleFilterKeyDown = (e: KeyboardEvent, index: number) => {
    // Garante segurança caso FILTER_OPTIONS venha zerado por erro de importação
    const optionsLength = FILTER_OPTIONS?.length || 0;
    if (optionsLength === 0) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % optionsLength;
      filterRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + optionsLength) % optionsLength;
      filterRefs.current[prev]?.focus();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      filterRefs.current[0]?.focus();
    }
    if (e.key === 'End') {
      e.preventDefault();
      filterRefs.current[optionsLength - 1]?.focus();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
      {/* Search input */}
      <div className="relative mb-5">
        <label htmlFor="search-avisos" className="sr-only">
          Buscar avisos por título, conteúdo ou categoria
        </label>
        <div aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={20} strokeWidth={2} />
        </div>
        <input
          id="search-avisos"
          type="search"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar avisos..."
          aria-label="Buscar avisos por título, conteúdo ou categoria"
          aria-describedby="search-hint"
          className={cn(
            'w-full rounded-xl border bg-secondary pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground',
            'transition-colors focus:outline-none focus:ring-3 focus:ring-ring/70 focus:border-primary',
            'border-border',
          )}
          style={{ fontSize: '1rem' }}
          autoComplete="off"
          spellCheck="false"
        />
        <span id="search-hint" className="sr-only">
          Use as setas do teclado para navegar pelos filtros abaixo
        </span>
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpar busca"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filters + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category filter buttons */}
        <nav role="navigation" aria-label="Filtrar avisos por categoria">
          <div role="radiogroup" aria-label="Categorias de avisos" className="flex flex-wrap gap-2">
            {FILTER_OPTIONS?.map((opt, i) => {
              const isActive = filter === opt.value;
              return (
                <button
                  key={opt.value}
                  ref={el => { filterRefs.current[i] = el; }}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={opt.ariaLabel}
                  onClick={() => onFilterChange(opt.value)}
                  onKeyDown={e => handleFilterKeyDown(e, i)}
                  tabIndex={isActive ? 0 : -1}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all',
                    'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                    'border',
                    isActive
                      ? highContrast
                        ? 'border-yellow-400 bg-yellow-400 text-black'
                        : 'border-primary bg-primary text-primary-foreground shadow-md'
                      : highContrast
                      ? 'border-white/40 bg-secondary text-foreground hover:border-white hover:bg-secondary/80'
                      : 'border-border bg-secondary text-foreground hover:border-primary/50 hover:bg-accent',
                  )}
                  style={{ minHeight: '48px', fontSize: '0.9rem', fontWeight: isActive ? 700 : 500 }}
                >
                  <span aria-hidden="true">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sort control */}
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">Ordenar avisos</label>
          <div className="relative flex items-center gap-2 rounded-xl border border-border bg-secondary px-4" style={{ minHeight: '48px' }}>
            <SortAsc size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
            <select
              id="sort-select"
              value={sort}
              onChange={e => onSortChange(e.target.value as SortOption)}
              aria-label="Ordenar avisos"
              className="flex-1 bg-transparent py-2 text-foreground focus:outline-none"
              style={{ fontSize: '0.9rem', minHeight: '44px', cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-secondary text-foreground">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results summary (Proteção contra undefined aplicada aqui) */}
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-muted-foreground" style={{ fontSize: '0.85rem' }}>
        {search ? (
          <span>
            {resultCount === 0
              ? 'Nenhum aviso encontrado para a busca.'
              : `${resultCount} aviso${resultCount > 1 ? 's' : ''} encontrado${resultCount > 1 ? 's' : ''} para "${search}"`}
          </span>
        ) : (
          <span>
            {resultCount} aviso{resultCount !== 1 ? 's' : ''} exibido{resultCount !== 1 ? 's' : ''}
            {filter !== 'todos' ? ` na categoria "${FILTER_OPTIONS?.find(f => f.value === filter)?.label || 'Selecionada'}"` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
