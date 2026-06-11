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
      if (prev === 'normal') return 'high-contrast';
      if (prev === 'high-contrast') return 'inverted';
      return 'normal';
    });
  };

  // 🔍 SISTEMA DE FILTRAGEM DINÂMICA
  const filteredAnnouncements = ANNOUNCEMENTS_DATA.filter(item => {
    const matchesFilter = filter === 'todos' || item.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Ordenação
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sort === 'antigo') {
      return new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime();
    }
    return new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime();
  });

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="min-h-screen transition-colors bg-[#0b121f] text-white">
      {!session ? (
        <LoginScreen
          fontSize={fontSize}
          contrastMode={contrastMode}
          showKeyboardHelp={showKeyboardHelp}
          setShowKeyboardHelp={setShowKeyboardHelp}
          onFontIncrease={handleFontIncrease}
          onFontDecrease={handleFontDecrease}
          onCycleContrast={cycleContrast}
          onLoginSuccess={(userSession) => setSession(userSession)}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      ) : (
        <div className="min-h-screen bg-[#0b121f] text-white transition-colors" style={{ fontSize: '1em' }}>
          {/* Header conectado com os controles reais */}
          <Header 
            fontSize={fontSize}
            contrastMode={contrastMode}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            onCycleContrast={cycleContrast}
            onLogout={() => setSession(null)}
            showKeyboardHelp={showKeyboardHelp}
            setShowKeyboardHelp={setShowKeyboardHelp}
          />

          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" style={{ fontSize: '1em' }}>
            <div className="mb-6 mt-4">
              <span className="font-bold uppercase tracking-wider text-blue-400" style={{ fontSize: '0.75em' }}>
                Escola Estadual Dom Pedro II
              </span>
              <h1 className="font-extrabold mt-1 text-white" style={{ fontSize: '2em' }}>
                Mural de Avisos
              </h1>
              <p className="text-slate-400 mt-1" style={{ fontSize: '0.9em' }}>
                Acompanhe comunicados, eventos e informações importantes da escola.
              </p>
            </div>

            {/* Painel de ajuda de teclado acessível com fontes relativas */}
            {showKeyboardHelp && (
              <div 
                role="region" 
                aria-label="Guia de atalhos rápidos" 
                className="mb-6 p-5 rounded-2xl border bg-blue-950/20 border-blue-800/40 text-slate-200"
              >
                <h2 className="font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2" style={{ fontSize: '0.85em' }}>
                  ⌨️ Atalhos de Acessibilidade do Sistema
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" style={{ fontSize: '0.8em' }}>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono mr-1.5 shadow">Alt + 1</kbd> Aumentar Letra
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono mr-1.5 shadow">Alt + 2</kbd> Diminuir Letra
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono mr-1.5 shadow">Alt + 3</kbd> Mudar Contraste
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono mr-1.5 shadow">Alt + 4</kbd> Fechar Guia
                  </div>
                </div>
              </div>
            )}

            {/* Barra de pesquisa atualizando em tempo real */}
            <FilterSearchBar 
              filter={filter}
              search={search}
              sort={sort}
              resultCount={sortedAnnouncements.length}
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              onSortChange={setSort}
              highContrast={contrastMode === 'high-contrast'}
            />

            {/* Grid Renderizando os Mocks Dinâmicos */}
            {sortedAnnouncements.length === 0 ? (
              <div className="text-center py-12 text-slate-500" style={{ fontSize: '0.9em' }}>
                Nenhum aviso encontrado para os filtros selecionados.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {sortedAnnouncements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
