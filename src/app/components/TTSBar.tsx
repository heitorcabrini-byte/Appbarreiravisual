import { Volume2, Pause, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import { Announcement } from '../data/announcements';

interface TTSBarProps {
  announcement: Announcement | null;
  isPlaying: boolean;
  rate: number;
  isHighContrast: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
}

const RATE_OPTIONS = [
  { value: 0.75, label: 'Lento' },
  { value: 1.0, label: 'Normal' },
  { value: 1.5, label: 'Rápido' },
  { value: 2.0, label: 'Muito rápido' },
];

export function TTSBar({
  announcement,
  isPlaying,
  rate,
  isHighContrast,
  onPause,
  onResume,
  onStop,
  onRateChange,
}: TTSBarProps) {
  const visible = announcement !== null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          role="region"
          aria-label="Leitor de voz — controles de reprodução"
          aria-live="polite"
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 border-t shadow-2xl',
            isHighContrast
              ? 'border-white/50 bg-black'
              : 'border-border bg-card backdrop-blur-md',
          )}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
            {/* Status + title */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                aria-hidden="true"
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  isPlaying
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-primary text-primary-foreground'
                    : isHighContrast
                    ? 'border border-white/50 text-white'
                    : 'bg-secondary text-muted-foreground',
                )}
              >
                <Volume2 size={18} className={isPlaying ? 'animate-pulse' : ''} />
              </div>
              <div className="min-w-0">
                <p
                  className={isHighContrast ? 'text-white' : 'text-foreground'}
                  style={{ fontSize: '0.8rem', fontWeight: 700 }}
                >
                  {isPlaying ? '🔊 Lendo em voz alta...' : '⏸ Pausado'}
                </p>
                <p
                  className="truncate text-muted-foreground"
                  style={{ fontSize: '0.8rem' }}
                  title={announcement?.title}
                >
                  {announcement?.title}
                </p>
              </div>
            </div>

            {/* Playback controls */}
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Controles de reprodução"
            >
              {/* Pause / Resume */}
              <button
                type="button"
                onClick={isPlaying ? onPause : onResume}
                aria-label={isPlaying ? 'Pausar leitura' : 'Continuar leitura'}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'bg-primary/15 text-primary hover:bg-primary/25',
                )}
                style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {isPlaying ? (
                  <Pause size={16} aria-hidden="true" />
                ) : (
                  <Play size={16} aria-hidden="true" />
                )}
                <span>{isPlaying ? 'Pausar' : 'Continuar'}</span>
              </button>

              {/* Stop */}
              <button
                type="button"
                onClick={onStop}
                aria-label="Parar leitura"
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
                  'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                  isHighContrast
                    ? 'border border-white/50 text-white hover:bg-white/10'
                    : 'border border-border text-muted-foreground hover:bg-secondary',
                )}
                style={{ minHeight: '44px', fontSize: '0.85rem' }}
              >
                <Square size={14} aria-hidden="true" />
                <span>Parar</span>
              </button>
            </div>

            {/* Speed control */}
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Velocidade de leitura"
            >
              <span
                className="text-muted-foreground"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                aria-hidden="true"
              >
                Velocidade:
              </span>
              {RATE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onRateChange(opt.value)}
                  aria-label={`Velocidade ${opt.label}`}
                  aria-pressed={rate === opt.value}
                  className={cn(
                    'rounded-lg px-2.5 py-1.5 transition-all',
                    'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                    rate === opt.value
                      ? isHighContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-primary text-primary-foreground'
                      : isHighContrast
                      ? 'text-white hover:bg-white/10'
                      : 'text-muted-foreground hover:bg-secondary',
                  )}
                  style={{ minHeight: '36px', fontSize: '0.78rem', fontWeight: rate === opt.value ? 700 : 500 }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
