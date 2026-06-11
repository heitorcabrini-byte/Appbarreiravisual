import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

// 📋 DADOS REAIS DO FIGMA INJETADOS DIRETO AQUI
const ANNOUNCEMENTS_DATA = [
  {
    id: '1',
    title: 'Período de Rematrícula Escolar 2026',
    content: 'Atenção responsáveis! O prazo para renovação de matrícula para o segundo semestre já está aberto. Os documentos necessários devem ser entregues diretamente na secretaria ou enviados pelo portal do aluno até o dia 30/06.',
    category: 'Urgente',
    date: '11/06/2026',
    emoji: '🚨'
  },
  {
    id: '2',
    title: 'Reunião de Pais e Mestres do 2º Bimestre',
    content: 'Convidamos todos os pais e responsáveis para a nossa reunião bimestral que acontecerá neste sábado, das 09h às 12h. Será uma excelente oportunidade para discutir o desempenho acadêmico e a entrega de boletins.',
    category: 'Importante',
    date: '10/06/2026',
    emoji: '📅'
  },
  {
    id: '3',
    title: 'Feira de Ciências Interdisciplinar',
    content: 'Estão abertas as inscrições para os projetos da Feira de Ciências deste ano! O tema central será "Sustentabilidade e Tecnologia no Cotidiano". Procure seu professor de biologia ou física para registrar seu grupo.',
    category: 'Informativo',
    date: '08/06/2026',
    emoji: '📢'
  },
  {
    id: '4',
    title: 'Manutenção do Bloco B e Laboratórios',
    content: 'Informamos que o Bloco B passará por manutenções preventivas na rede elétrica durante o próximo final de semana. O acesso aos laboratórios de informática estará suspenso temporariamente.',
    category: 'Geral',
    date: '05/06/2026',
    emoji: 'ℹ️'
  }
];

export default function App() {
  // Controle de Sessão e Telas
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  
  // Estados Globais de Acessibilidade
  const [fontSize, setFontSize] = useState(18);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Estados dos Filtros do Mural
  const [filter, setFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('recente');

  const minFont = 14;
  const maxFont = 26;

  // ⌨️ Escuta Global de Atalhos de Teclado
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt + 1: Aumentar Fonte
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setFontSize(f => Math.min(f + 2, maxFont));
      }
      // Alt + 2: Diminuir Fonte
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setFontSize(f => Math.max(f - 2, minFont));
      }
      // Alt + 3: Alternar Contraste
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        cycleContrast();
      }
      // Alt + 4: Ajuda de Teclado
      if (e.altKey && e.key === '4') {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [contrastMode]);

  // Sincroniza classes CSS de Contraste no elemento raiz (HTML)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'inverted-contrast');
    if (contrastMode === 'high-contrast') root.classList.add('high-contrast');
    if (contrastMode === 'inverted') root.classList.add('inverted-contrast');
  }, [contrastMode]);

  const handleFontIncrease = () => setFontSize(f => Math.min(f + 2, maxFont));
  const handleFontDecrease = () => setFontSize(f => Math.max(f - 2, minFont));
  
  const cycleContrast = () => {
    setContrastMode(prev => {
      if
