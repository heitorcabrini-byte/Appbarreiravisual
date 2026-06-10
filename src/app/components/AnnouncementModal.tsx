import { useEffect, useRef } from 'react';
import { X, Calendar, User, Volume2, VolumeX, Star, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import { Announcement, CATEGORY_CONFIG } from '../data/announcements';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  isFavorite: boolean;
  isSpeaking: boolean;
  isHighContrast: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onToggleTTS: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export function AnnouncementModal({
  announcement,
  isFavorite,
  isSpeaking,
  isHighContrast,
  onClose,
  onToggleFavorite,
  onToggleTTS,
}: AnnouncementModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (announcement) {
      closeRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [announcement]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && announcement) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [announcement, onClose]);

  const config = announcement ? CATEGORY_CONFIG[announcement.category] : null;

  return (
    <AnimatePresence>
      {announcement && config && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Aviso: ${announcement.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop — clicking it closes modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative flex w-full max-w-2xl flex-col rounded-2xl border shadow-2xl',
              'max-h-[90vh] overflow-hidden',
              isHighContrast
                ? 'border-white/50 bg-black'
                : 'border-border bg-card',
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className={cn(
                'flex items-start justify-between gap-4 border-b p-5',
                isHighContrast ? 'border-white/20' : 'border-border',
              )}
            >
              <div className="flex flex-col gap-2">
                {/* Category */}
                <span
                  className={cn(
                    'flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1',
                    isHighContrast
                      ? 'border-white/50 bg-white/10 text-white'
                      : `${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`,
                  )}
                  style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}
                  aria-label={`Categoria: ${config.label}`}
                >
                  <span aria-hidden="true">{config.emoji}</span>
                  <span>{config.label.toUpperCase()}</span>
                </span>

                <h2
                  className="text-foreground leading-snug"
                  style={{ fontSize: '1.2rem', fontWeight: 700 }}
                >
                  {announcement.title}
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar aviso"
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Meta info */}
            <div
              className={cn(
                'flex flex-wrap items-center gap-4 border-b px-5 py-3',
                isHighContrast ? 'border-white/20 bg-white/5' : 'border-border bg-secondary/30',
              )}
            >
              <span className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '0.9rem' }}>
                <Calendar size={16} aria-hidden="true" />
                <time dateTime={announcement.date}>{formatDate(announcement.date)}</time>
              </span>
              <span className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '0.9rem' }}>
                <User size={16} aria-hidden="true" />
                <span>
                  <strong className="text-foreground">{announcement.author}</strong>
                  {' — '}
                  <span>{announcement.authorRole}</span>
                </span>
              </span>
            </div>

            {/* Body content */}
            <div className="flex-1 overflow-y-auto p-5">
              <p
                className="text-foreground"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}
              >
                {announcement.body}
              </p>

              {/* Tags */}
              {announcement.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Palavras-chave deste aviso">
                  <Tag size={14} className="text-muted-foreground" aria-hidden="true" />
                  {announcement.tags.map(tag => (
                    <span
                      key={tag}
                      className={cn(
                        'rounded-lg border px-2.5 py-1',
                        isHighContrast
                          ? 'border-white/30 text-white/70'
                          : 'border-border text-muted-foreground',
                      )}
                      style={{ fontSize: '0.8rem' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div
              className={cn(
                'flex items-center gap-2 border-t p-4',
                isHighContrast ? 'border-white/20' : 'border-border',
              )}
              role="group"
              aria-label="Ações para este aviso"
            >
              {/* TTS */}
              <button
                type="button"
                onClick={onToggleTTS}
                aria-label={isSpeaking ? 'Parar leitura em voz alta' : 'Ouvir aviso em voz alta'}
                aria-pressed={isSpeaking}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isSpeaking
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-primary text-primary-foreground'
                    : isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'bg-primary/15 text-primary hover:bg-primary/25',
                )}
                style={{ minHeight: '48px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {isSpeaking ? (
                  <VolumeX size={18} aria-hidden="true" />
                ) : (
                  <Volume2 size={18} aria-hidden="true" />
                )}
                <span>{isSpeaking ? 'Parar leitura' : '🔊 Ouvir aviso'}</span>
              </button>

              {/* Favorite */}
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                aria-pressed={isFavorite}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isFavorite
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-amber-500/20 text-amber-400'
                    : isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'border border-border text-muted-foreground hover:border-amber-500/50 hover:text-amber-400',
                )}
                style={{ minHeight: '48px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                <span>{isFavorite ? 'Remover favorito' : 'Adicionar favorito'}</span>
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'rounded-xl px-4 py-2.5 transition-colors',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'border border-border text-muted-foreground hover:bg-secondary',
                )}
                style={{ minHeight: '48px', fontSize: '0.9rem' }}
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
