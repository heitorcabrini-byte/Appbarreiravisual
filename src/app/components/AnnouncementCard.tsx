import { useState } from 'react';

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
  // 🔄 Estado que controla se este card específico está expandido
  const [isExpanded, setIsExpanded] = useState(false);

  // Mapeamento de cores baseado na categoria para os badges
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

        {/* 👁️ Conteúdo - RESOLVIDO: Cor 'text-slate-200' garante leitura perfeita sobre o fundo escuro */}
        <p className={`mt-3 text-sm text-slate-200 leading-relaxed font-normal ${
          isExpanded ? '' : 'line-clamp-3'
        }`}>
          {announcement.content}
        </p>

        {/* Informações adicionais que aparecem APENAS ao expandir */}
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
        <div className="flex gap-4 text-xs text-slate-400 font-medium">
          <button className="hover:text-white transition-colors flex items-center gap-1">
            🔊 Ouvir
          </button>
          <button className="hover:text-white transition-colors flex items-center gap-1">
            ⭐ Salvar
          </button>
        </div>

        {/* 🚀 BOTÃO INTERATIVO COM FUNÇÃO CLIQUE CONFIGURADA */}
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
