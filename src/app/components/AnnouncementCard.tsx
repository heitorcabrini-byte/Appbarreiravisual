import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author?: string;
  tags?: string[];
  emoji?: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // 🔄 SOLUÇÃO DO FAVORITO: Estado dinâmico que começa como "falso" (desativado)
  const [isFavorited, setIsFavorited] = useState(false);

  // Garante que o áudio pare se o componente sumir da tela de repente
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 🔊 FUNÇÃO DE ÁUDIO REFORÇADA (Zera filas presas no navegador)
  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita conflito com o clique de expandir o card

    if (!('speechSynthesis' in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Mata qualquer áudio fantasma que tenha ficado travado antes
    window.speechSynthesis.cancel();

    const textToRead = `Aviso da categoria ${announcement.category}. Título: ${announcement.title}. Conteúdo: ${announcement.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; // Velocidade padrão totalmente limpa

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Erro na leitura:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // ⭐ FUNÇÃO PARA ALTERNAR O FAVORITO
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita expandir o card ao favoritar
    setIsFavorited(!isFavorited);
  };

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'urgente':
        return { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400' };
      case 'importante':
        return { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' };
      case 'informativo':
        return { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' };
      default:
        return { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' };
    }
  };

  const styles = getCategoryStyles(announcement.category);

  return (
    <div 
      className={`w-full rounded-2xl border bg-[#0d1527] p-5 transition-all duration-300 flex flex-col justify-between ${styles.border} ${
        isExpanded 
          ? 'md:col-span-2 lg:col-span-3 ring-2 ring-blue-500/50 shadow-2xl bg-[#0f1b35]' 
          : 'hover:border-slate-700'
      }`}
    >
      <div>
        {/* Topo do Card */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
            {announcement.emoji} {announcement.category}
          </span>
          <span className="text-slate-400 font-medium">
            {announcement.date}
          </span>
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
          {announcement.title}
        </h2>

        {/* Conteúdo com contraste correto */}
        <p className={`mt-3 text-sm text-slate-200 leading-relaxed font-normal ${
          isExpanded ? '' : 'line-clamp-3'
        }`}>
          {announcement.content}
        </p>

        {/* Detalhes extras ao expandir */}
        {isExpanded && (
          <div className="mt-5 pt-4 border-t border-slate-800/60 transition-all duration-200">
            {announcement.author && (
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-3">
                <span>👤 Autor(a):</span>
                <span className="text-slate-300 font-semibold">{announcement.author}</span>
              </p>
            )}
            
            {announcement.tags && announcement.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {announcement.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[11px] font-medium bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rodapé de Ações */}
      <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between">
        <div className="flex gap-4 text-xs font-medium">
          
          {/* 🔊 Botão de Áudio com Corretor de Filas */}
          <button 
            onClick={handleListen}
            className={`transition-colors flex items-center gap-1 font-semibold p-1 rounded cursor-pointer ${
              isSpeaking ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isSpeaking ? '🛑 Parar' : '🔊 Ouvir'}
          </button>

          {/* ⭐ Botão de Favorito Dinâmico Corrigido */}
          <button 
            onClick={handleToggleFavorite}
            className={`transition-colors flex items-center gap-1 font-semibold p-1 rounded cursor-pointer ${
              isFavorited ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFavorited ? '★ Salvo' : '☆ Salvar'}
          </button>
        </div>

        {/* Expandir / Recolher */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>Voltar ao normal ↩️</>
          ) : (
            <>Ver aviso <span>❯</span></>
          )}
        </button>
      </div>
    </div>
  );
}
