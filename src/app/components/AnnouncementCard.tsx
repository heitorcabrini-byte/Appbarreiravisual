import { useState } from 'react';
import { Volume2, VolumeX, Star, ChevronRight, Calendar, User } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    category?: string;
    date: string;
    author?: string;
    tags?: string[];
  };
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const category = announcement?.category || 'geral';
  const title = announcement?.title || 'Aviso';
  const content = announcement?.content || '';
  const date = announcement?.date || '';
  const author = announcement?.author || 'Secretaria';
  const tags = announcement?.tags || [];

  const [isFavorited, setIsFavorited] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🔊 Função de Áudio Corrigida
  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert('A síntese de voz não é suportada neste navegador.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `${title}. ${content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const themeStyles: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
    urgente: { bg: 'bg-[#1e1215]', border: 'border-red-900/40', badge: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500' },
    importante: { bg: 'bg-[#1c1712]', border: 'border-amber-900/40', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
    informativo: { bg: 'bg-[#111916]', border: 'border-emerald-900/40', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
    geral: { bg: 'bg-[#121622]', border: 'border-blue-900/40', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
  };

  const currentTheme = themeStyles[category.toLowerCase()] || themeStyles['geral'];

  return (
    <article className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-xl accessibility-card ${currentTheme.bg} ${currentTheme.border}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider accessibility-badge ${currentTheme.badge}`}>
            {category}
          </span>
          <div className={`h-2 w-2 rounded-full accessibility-dot ${currentTheme.dot}`} />
        </div>
        
        <h3 className="text-base font-bold text-white tracking-tight leading-snug mb-2 accessibility-title">
          {title}
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3 accessibility-text">
          {content}
        </p>

        <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-4 accessibility-meta">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{author}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800/80 px-2 py-0.5 rounded-md accessibility-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 accessibility-footer">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={handleSpeak}
            className={`flex items-center gap-1 cursor-pointer transition-colors ${isSpeaking ? 'text-yellow-400 font-bold' : 'hover:text-white'}`}
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isSpeaking ? 'Parar' : 'Ouvir'}</span>
          </button>
          
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); }}
            className={`flex items-center gap-1 cursor-pointer transition-colors ${isFavorited ? 'text-yellow-400 font-bold' : 'hover:text-white'}`}
          >
            <Star size={14} fill={isFavorited ? "#facc15" : "none"} stroke={isFavorited ? "#facc15" : "currentColor"} />
            <span>{isFavorited ? 'Salvo' : 'Salvar'}</span>
          </button>
        </div>

        <button type="button" className="flex items-center gap-0.5 font-bold text-blue-400 accessibility-btn">
          <span>Ver aviso</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </article>
  );
}
