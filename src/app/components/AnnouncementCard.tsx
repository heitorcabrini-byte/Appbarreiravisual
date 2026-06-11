import { Volume2, Star, ChevronRight, Calendar, User } from 'lucide-react';
import { cn } from './ui/utils';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    category: string;
    date: string;
    author?: string;
    tags?: string[];
    emoji?: string;
  };
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { title, content, category, date, author = "Secretaria Escolar", tags = [] } = announcement;

  // Paleta exata do Figma para cada tipo de aviso
  const styles: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
    urgente: {
      bg: 'bg-[#1e1215]',
      border: 'border-red-900/40 hover:border-red-500/60',
      text: 'text-red-400',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      dot: 'bg-red-500',
    },
    importante: {
      bg: 'bg-[#1c1712]',
      border: 'border-amber-900/40 hover:border-amber-500/60',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
    },
    informativo: {
      bg: 'bg-[#111916]',
      border: 'border-emerald-900/40 hover:border-emerald-500/60',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    geral: {
      bg: 'bg-[#121622]',
      border: 'border-blue-900/40 hover:border-blue-500/60',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      dot: 'bg-blue-500',
    },
  };

  const currentStyle = styles[category.toLowerCase()] || styles['geral'];

  return (
    <article 
      className={cn(
        "flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-lg",
        currentStyle.bg,
        currentStyle.border
      )}
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={cn("inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", currentStyle.badge)}>
            {category}
          </span>
          <div className={cn("h-2 w-2 rounded-full", currentStyle.dot)} />
        </div>
        
        {/* Título Principal */}
        <h3 className="text-base font-bold text-white tracking-tight leading-snug mb-2">
          {title}
        </h3>
        
        {/* Descrição do comunicado */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {content}
        </p>

        {/* Metadados: Data e Professor */}
        <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-slate-500" />
            <span>{author}</span>
          </div>
        </div>

        {/* Tags Estilo Figma */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Barra de Ações Inferior (Ouvir, Salvar, Ver Aviso) */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button 
            title="Escutar aviso em áudio"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Volume2 size={14} />
            <span>Ouvir</span>
          </button>
          <button 
            title="Salvar aviso nos favoritos"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Star size={14} />
            <span>Salvar</span>
          </button>
        </div>

        <button className="flex items-center gap-0.5 font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          <span>Ver aviso</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </article>
  );
}
