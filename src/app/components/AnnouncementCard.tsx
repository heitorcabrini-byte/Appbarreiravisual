import { Volume2, VolumeX, Star, ChevronRight, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { Announcement, CATEGORY_CONFIG } from '../data/announcements';

interface AnnouncementCardProps {
  announcement: Announcement;
  isUnread: boolean;
  isFavorite: boolean;
  isSpeaking: boolean;
  isHighContrast: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
  onToggleTTS: () => void;
  index: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function AnnouncementCard({
  announcement,
  isUnread,
  isFavorite,
  isSpeaking,
  isHighContrast,
  onOpen,
  onToggleFavorite,
  onToggleTTS,
  index,
}: AnnouncementCardProps) {
  const config = CATEGORY_CONFIG[announcement.category];

  const cardLabel = `Aviso ${isUnread ? 'não lido. ' : ''}${config.label}: ${announcement.title}. ${announcement.summary}. Publicado em ${formatDate(announcement.date)} por ${announcement.author}.`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      aria-label={cardLabel}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-l-4 transition-all duration-200',
        'focus-within:ring-3 focus-within:ring-ring/70',
        config.cardBg,
        config.borderColor,
        isHighContrast
          ? 'border-white/40 hover:border-white'
          : 'hover:border-primary/40 hover:shadow-lg hover:shadow-black/30',
      )}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute right-4 top-4 h-3 w-3 animate-pulse rounded-full',
            isHighContrast ? 'bg-yellow-400' : 'bg-primary',
          )}
          title="Aviso não lido"
        />
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5 pb-3">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1',
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

          {isFavorite && (
            <span
              aria-label="Marcado como favorito"
              className={cn(
                'flex items-center gap-1 rounded-lg px-2 py-1',
                isHighContrast ? 'text-yellow-400' : 'text-amber-400',
              )}
              style={{ fontSize: '0.75rem' }}
            >
              <Star size={12} fill="currentColor" aria-hidden="true" />
              <span className="sr-only">Favorito</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className="text-foreground leading-snug"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          {announcement.title}
        </h2>

        {/* Summary */}
        <p
          className="text-muted-foreground"
          style={{ fontSize: '0.95rem', lineHeight: 1.65 }}
        >
          {announcement.summary}
        </p>

        {/* Meta */}
        <div
          className="flex flex-wrap items-center gap-3 text-muted-foreground"
          style={{ fontSize: '0.82rem' }}
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={announcement.date}>{formatDate(announcement.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <User size={14} aria-hidden="true" />
            <span>{announcement.author}</span>
          </span>
        </div>
      </div>

      {/* Tags */}
      {announcement.tags.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 px-5 pb-3"
          aria-label="Palavras-chave"
        >
          {announcement.tags.map(tag => (
            <span
              key={tag}
              className={cn(
                'rounded-md border px-2 py-0.5',
                isHighContrast
                  ? 'border-white/20 text-white/70'
                  : 'border-border text-muted-foreground',
              )}
              style={{ fontSize: '0.72rem' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div
        className={cn(
          'flex items-center gap-1 border-t p-3',
          isHighContrast ? 'border-white/20' : 'border-border/50',
        )}
        role="group"
        aria-label={`Ações para o aviso: ${announcement.title}`}
      >
        {/* TTS button */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleTTS(); }}
          aria-label={isSpeaking ? `Parar leitura do aviso: ${announcement.title}` : `Ouvir aviso: ${announcement.title}`}
          aria-pressed={isSpeaking}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 transition-all',
            'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            isSpeaking
              ? isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-primary/20 text-primary'
              : isHighContrast
              ? 'text-white hover:bg-white/10'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
          style={{ minHeight: '44px', fontSize: '0.85rem' }}
        >
          {isSpeaking ? (
            <VolumeX size={16} aria-hidden="true" />
          ) : (
            <Volume2 size={16} aria-hidden="true" />
          )}
          <span>{isSpeaking ? 'Parar' : '🔊 Ouvir'}</span>
        </button>

        {/* Favorite button */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          aria-label={isFavorite ? `Remover dos favoritos: ${announcement.title}` : `Adicionar aos favoritos: ${announcement.title}`}
          aria-pressed={isFavorite}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 transition-all',
            'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            isFavorite
              ? isHighContrast
                ? 'text-yellow-400'
                : 'text-amber-400'
              : isHighContrast
              ? 'text-white hover:bg-white/10'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
          style={{ minHeight: '44px', fontSize: '0.85rem' }}
        >
          <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
          <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Open detail button */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Ver aviso completo: ${announcement.title}`}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
            'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            isHighContrast
              ? 'border border-white/50 text-white hover:bg-white/10'
              : 'bg-primary/15 text-primary hover:bg-primary/25',
          )}
          style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <span>Ver aviso</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}
