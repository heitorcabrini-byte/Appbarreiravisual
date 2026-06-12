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
  isFavorited: boolean;          // Recebe o estado real do App.tsx
  onToggleFavorite: () => void;  // Recebe a função de clique do App.tsx
}

export function AnnouncementCard({ announcement, isFavorited, onToggleFavorite }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Desliga a voz automaticamente se mudar de página ou deslogar
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 🔊 Função Reforçada de Leitura do Navegador (Corrige travamentos locais)
  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Limpa qualquer fila pendente no motor de áudio
    window.speechSynthesis.cancel();

    const textToRead = `Aviso ${announcement.category}. Título: ${announcement.title}. Conteúdo: ${announcement.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
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
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
            {announcement.emoji} {announcement.category}
          </span>
          <span className="text-slate-400 font-medium">{announcement.date}</span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
          {announcement.title}
        </h2>

        <p className={`mt-3 text-sm text-slate-200 leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-3'}`}>
          {announcement.content}
        </p>

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
                  <span key={idx} className="text-[11px] font-medium bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800/40">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between">
        <div className="flex gap-4 text-xs font-medium">
          <button 
            onClick={handleListen}
            className={`transition-colors flex items-center gap-1 font-semibold p-1 rounded cursor-pointer ${
              isSpeaking ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isSpeaking ? '🛑 Parar' : '🔊 Ouvir'}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`transition-colors flex items-center gap-1 font-semibold p-1 rounded cursor-pointer ${
              isFavorited ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFavorited ? '★ Salvo' : '☆ Salvar'}
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? <>Voltar ao normal ↩️</> : <>Ver aviso <span>❯</span></>}
        </button>
      </div>
    </div>
  );
}
