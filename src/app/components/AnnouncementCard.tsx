import { cn } from './ui/utils';

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
  // Se o dado real vier do map ele usa, se não, usa o fallback de segurança
  const displayTitle = announcement?.title || "Carregando aviso...";
  const displayContent = announcement?.content || "Conteúdo não disponível.";
  const displayCategory = announcement?.category || "Geral";
  const displayDate = announcement?.date || "";
  const displayEmoji = announcement?.emoji || "📢";

  return (
    <article className={cn("flex flex-col justify-between p-6 rounded-2xl border bg-slate-900 border-slate-800 transition-all hover:border-slate-700")}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>{displayEmoji}</span>
            {displayCategory}
          </span>
          <span className="text-xs text-slate-500">{displayDate}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{displayTitle}</h3>
        <p className="text-sm text-slate-300 leading-relaxed break-words">{displayContent}</p>
      </div>
    </article>
  );
}
