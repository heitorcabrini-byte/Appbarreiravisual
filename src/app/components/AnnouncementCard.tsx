import { cn } from './ui/utils'; // Ajuste o caminho se necessário

// Interface segura caso você use tipagem
interface AnnouncementCardProps {
  announcement?: {
    id: string;
    title: string;
    content: string;
    category: string;
    date: string;
    emoji?: string;
  };
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  // Dados estáticos de teste caso o componente seja chamado sem nenhuma prop (como está no seu App.tsx)
  const displayTitle = announcement?.title || "Bem-vindo ao Novo Mural!";
  const displayContent = announcement?.content || "O sistema de acessibilidade está totalmente integrado com o Tailwind. Os avisos oficiais da E.E. Dom Pedro II serão listados aqui assim que a conexão com o banco de dados for concluída.";
  const displayCategory = announcement?.category || "Geral";
  const displayDate = announcement?.date || "11/06/2026";
  const displayEmoji = announcement?.emoji || "📢";

  return (
    <article 
      className={cn(
        "flex flex-col justify-between p-6 rounded-2xl border bg-slate-900 border-slate-800",
        "transition-all hover:border-slate-700"
      )}
      style={{ minHeight: '200px' }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span aria-hidden="true">{displayEmoji}</span>
            {displayCategory}
          </span>
          <time className="text-xs text-slate-500" dateTime={displayDate}>
            {displayDate}
          </time>
        </div>
        
        <h3 className="text-xl font-bold tracking-tight text-white mb-2">
          {displayTitle}
        </h3>
        
        <p className="text-sm text-slate-300 leading-relaxed break-words">
          {displayContent}
        </p>
      </div>
    </article>
  );
}
