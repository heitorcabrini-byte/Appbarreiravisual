import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { LogOut, User as UserIcon } from 'lucide-react';

import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { AnnouncementModal } from './components/AnnouncementModal';
import { TTSBar } from './components/TTSBar';
import { LoginScreen } from './components/LoginScreen';

import {
  mockAnnouncements,
  type Announcement,
  type FilterOption,
  type SortOption,
} from './data/announcements';

import {
  loadSession,
  clearSession,
  ROLE_LABELS,
  type Session,
} from './data/users';

import { cn } from './components/ui/utils';

/* MARKER-MAKE-KIT-INVOKED */
/* No @make-kits packages found — using project Tailwind + shadcn/ui. */

const INITIAL_UNREAD = [1, 2, 4, 5];
const MIN_FONT = 16;
const MAX_FONT = 28;

function loadPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Auth
  const [session, setSession] = useState<Session | null>(() => loadSession());

  // Accessibility preferences (persisted)
  const [fontSize, setFontSize] = useState<number>(() => loadPref('a11y-font-size', 18));
  const [highContrast, setHighContrast] = useState<boolean>(() => loadPref('a11y-high-contrast', false));
  const [favorites, setFavorites] = useState<number[]>(() => loadPref('a11y-favorites', []));

  // UI state
  const [filter, setFilter] = useState<FilterOption>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('recente');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [unread, setUnread] = useState<number[]>(INITIAL_UNREAD);

  // TTS state
  const [ttsId, setTtsId] = useState<number | null>(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsRate, setTtsRate] = useState(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    localStorage.setItem('a11y-font-size', JSON.stringify(fontSize));
  }, [fontSize]);

  // Apply high contrast class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y-high-contrast', JSON.stringify(highContrast));
  }, [highContrast]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('a11y-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Mark as read when modal opens
  useEffect(() => {
    if (selectedId !== null) {
      setUnread(prev => prev.filter(id => id !== selectedId));
    }
  }, [selectedId]);

  // TTS: speak
  const speakAnnouncement = useCallback((ann: Announcement, rate: number) => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz alta. Tente Chrome ou Edge.');
      return;
    }
    window.speechSynthesis.cancel();
    const text = `${ann.title}. ${ann.summary}. ${ann.body}`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'pt-BR';
    utt.rate = rate;
    utt.onstart = () => setTtsPlaying(true);
    utt.onend = () => { setTtsPlaying(false); setTtsId(null); };
    utt.onpause = () => setTtsPlaying(false);
    utt.onresume = () => setTtsPlaying(true);
    utt.onerror = () => { setTtsPlaying(false); setTtsId(null); };
    utteranceRef.current = utt;
    setTtsId(ann.id);
    setTtsPlaying(true);
    window.speechSynthesis.speak(utt);
  }, []);

  const handleToggleTTS = useCallback((ann: Announcement) => {
    if (ttsId === ann.id) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      setTtsId(null);
    } else {
      speakAnnouncement(ann, ttsRate);
    }
  }, [ttsId, ttsRate, speakAnnouncement]);

  const handleTTSPause = () => { window.speechSynthesis.pause(); setTtsPlaying(false); };
  const handleTTSResume = () => { window.speechSynthesis.resume(); setTtsPlaying(true); };
  const handleTTSStop = () => { window.speechSynthesis.cancel(); setTtsPlaying(false); setTtsId(null); };

  const handleRateChange = useCallback((newRate: number) => {
    setTtsRate(newRate);
    if (ttsId !== null) {
      const ann = mockAnnouncements.find(a => a.id === ttsId);
      if (ann) speakAnnouncement(ann, newRate);
    }
  }, [ttsId, speakAnnouncement]);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const handleLogout = () => {
    window.speechSynthesis?.cancel();
    clearSession();
    setSession(null);
    setSelectedId(null);
    setTtsId(null);
    setTtsPlaying(false);
  };

  // Filter + sort + search
  const displayed = useMemo(() => {
    let list = [...mockAnnouncements];
    if (filter !== 'todos') list = list.filter(a => a.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)),
      );
    }
    if (sort === 'recente') list.sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === 'antigo') list.sort((a, b) => a.date.localeCompare(b.date));
    else if (sort === 'favoritos') {
      list = list.filter(a => favorites.includes(a.id));
      list.sort((a, b) => b.date.localeCompare(a.date));
    }
    return list;
  }, [filter, search, sort, favorites]);

  const selectedAnnouncement = selectedId !== null
    ? mockAnnouncements.find(a => a.id === selectedId) ?? null : null;

  const ttsAnnouncement = ttsId !== null
    ? mockAnnouncements.find(a => a.id === ttsId) ?? null : null;

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  // --- Not authenticated → show login ---
  if (!session) {
    return (
      <LoginScreen
        highContrast={highContrast}
        fontSize={fontSize}
        onFontIncrease={() => setFontSize(f => Math.min(f + 2, MAX_FONT))}
        onFontDecrease={() => setFontSize(f => Math.max(f - 2, MIN_FONT))}
        onToggleContrast={() => setHighContrast(hc => !hc)}
        onLoginSuccess={setSession}
      />
    );
  }

  // --- Authenticated → show mural ---
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <a href="#main-content" className="skip-to-content" tabIndex={0}>
        Pular para o conteúdo principal
      </a>

      <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only" id="a11y-announcer" />

      {/* Header with accessibility controls */}
      <Header
        fontSize={fontSize}
        highContrast={highContrast}
        unreadCount={unread.length}
        onFontIncrease={() => setFontSize(f => Math.min(f + 2, MAX_FONT))}
        onFontDecrease={() => setFontSize(f => Math.max(f - 2, MIN_FONT))}
        onToggleContrast={() => setHighContrast(hc => !hc)}
      />

      {/* Session bar */}
      <div
        className={cn(
          'border-b border-border px-4 py-2.5 sm:px-6',
          highContrast ? 'bg-black' : 'bg-secondary/30',
        )}
        role="complementary"
        aria-label="Sessão ativa do usuário"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              aria-hidden="true"
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                highContrast
                  ? 'border border-white/50 bg-white/10 text-white'
                  : 'bg-primary/20 text-primary',
              )}
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              {session.avatarInitials}
            </div>
            <div>
              <p
                className="text-foreground leading-tight"
                style={{ fontSize: '0.85rem', fontWeight: 700 }}
              >
                {session.name}
              </p>
              <p
                className="text-muted-foreground leading-tight"
                style={{ fontSize: '0.75rem' }}
              >
                {ROLE_LABELS[session.role]} · {session.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label={`Sair da conta de ${session.name}`}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-2 transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring',
              highContrast
                ? 'border-white/40 text-white hover:bg-white/10'
                : 'border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive',
            )}
            style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      <main id="main-content" role="main" aria-label="Mural de avisos escolares">
        {/* Hero */}
        <div className="border-b border-border bg-secondary/30 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="text-muted-foreground" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Escola Estadual Dom Pedro II
            </p>
            <h1 className="mt-1 text-foreground">Mural de Avisos</h1>
            <p className="mt-2 max-w-xl text-muted-foreground" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              Acompanhe comunicados, eventos e informações importantes da escola.
            </p>
          </div>
        </div>

        {/* Filter + search */}
        <div className="border-b border-border py-5">
          <FilterSearchBar
            filter={filter}
            search={search}
            sort={sort}
            resultCount={displayed.length}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
            onSortChange={setSort}
            highContrast={highContrast}
          />
        </div>

        {/* Announcements grid */}
        <section
          aria-label={`Lista de avisos: ${displayed.length} resultado${displayed.length !== 1 ? 's' : ''}`}
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6"
          style={{ paddingBottom: ttsId ? '7rem' : '3rem' }}
        >
          {displayed.length === 0 ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center"
            >
              <span aria-hidden="true" style={{ fontSize: '3rem' }}>🔍</span>
              <div>
                <p className="text-foreground" style={{ fontWeight: 700 }}>Nenhum aviso encontrado</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.9rem' }}>
                  {search
                    ? `Não há avisos para "${search}". Tente outros termos.`
                    : 'Não há avisos nesta categoria no momento.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setSearch(''); setFilter('todos'); }}
                className="rounded-xl border border-primary/50 px-5 py-2.5 text-primary hover:bg-primary/10"
                style={{ minHeight: '48px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                Ver todos os avisos
              </button>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Avisos">
              <AnimatePresence mode="popLayout">
                {displayed.map((ann, i) => (
                  <li key={ann.id} className="flex flex-col">
                    <AnnouncementCard
                      announcement={ann}
                      isUnread={unread.includes(ann.id)}
                      isFavorite={favorites.includes(ann.id)}
                      isSpeaking={ttsId === ann.id}
                      isHighContrast={highContrast}
                      index={i}
                      onOpen={() => setSelectedId(ann.id)}
                      onToggleFavorite={() => handleToggleFavorite(ann.id)}
                      onToggleTTS={() => handleToggleTTS(ann)}
                    />
                  </li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </main>

      <footer role="contentinfo" className="border-t border-border bg-secondary/20 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground" style={{ fontWeight: 700 }}>E.E. Dom Pedro II</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.85rem' }}>
              Rua das Acácias, 1200 — Bairro Centro · (11) 3344-5566 · secretaria@eedompedro.edu.br
            </p>
          </div>
          <div className="text-muted-foreground" style={{ fontSize: '0.8rem' }}>
            <p>Sistema acessível conforme WCAG 2.1 — Nível AA</p>
            <p>Compatível com NVDA, VoiceOver e TalkBack</p>
          </div>
        </div>
      </footer>

      {/* Detail modal */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isFavorite={selectedId !== null && favorites.includes(selectedId)}
        isSpeaking={selectedId !== null && ttsId === selectedId}
        isHighContrast={highContrast}
        onClose={() => setSelectedId(null)}
        onToggleFavorite={() => selectedId !== null && handleToggleFavorite(selectedId)}
        onToggleTTS={() => selectedAnnouncement && handleToggleTTS(selectedAnnouncement)}
      />

      {/* Floating TTS bar */}
      <TTSBar
        announcement={ttsAnnouncement}
        isPlaying={ttsPlaying}
        rate={ttsRate}
        isHighContrast={highContrast}
        onPause={handleTTSPause}
        onResume={handleTTSResume}
        onStop={handleTTSStop}
        onRateChange={handleRateChange}
      />
    </div>
  );
}
