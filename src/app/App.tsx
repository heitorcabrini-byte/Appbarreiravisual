import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { ANNOUNCEMENTS_DATA } from './data/announcements';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  const [fontSize, setFontSize] = useState(16); 
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const [filter, setFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('recente');

  // 📁 Estado Global de Favoritos: Guarda um array com os IDs favoritados
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);

  const minFont = 12;
  const maxFont = 24;

  // ⌨️ Atalhos de teclado globais
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setFontSize(f => Math.min(f + 2, maxFont));
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setFontSize(f => Math.max(f - 2, minFont));
      }
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        cycleContrast();
      }
      if (e.altKey && e.key === '4') {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [contrastMode]);

  // ⚡ Sincronização do modo de acessibilidade visual
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.style.fontSize = `${fontSize}px`;
    
    root.classList.remove('high-contrast', 'inverted', 'normal');
    body.classList.remove('high-contrast', 'inverted', 'normal');
    
    if (contrastMode === 'high-contrast') {
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
    } else if (contrastMode ===
