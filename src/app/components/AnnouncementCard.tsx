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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // 🔄 Estado para saber se o áudio está tocando

  // 🔊 FUNÇÃO SENSACIONAL DE LEITURA EM VOZ ALTA (Acessibilidade Digital)
  const handleListen = () => {
    // Se já estiver falando, o clique cancela a voz (funciona como Stop)
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Junta o título e o conteúdo para o robô ler tudo em sequência
      const textToRead = `Aviso ${announcement.category}. ${announcement.title}. ${announcement.content}`;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR'; // Força o idioma para português do Brasil
      utterance.rate = 1.1;     // Velocidade da fala um pouquinho mais natural

      // Eventos para mudar o texto do botão visualmente enquanto fala
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Desculpe, seu navegador não suporta a função de leitura de texto em voz alta.");
    }
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

        {/* Conteúdo */}
        <p className={`mt-3 text-sm text-slate-200 leading-relaxed font-normal ${
          isExpanded ? '' : 'line-clamp-3'
        }`}>
          {announcement.content}
        </p>

        {/* Informações adicionais ao expandir */}
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
          
          {/* 🚀 BOTÃO DE ÁUDIO TOTALMENTE FUNCIONAL */}
          <button 
            onClick={handleListen}
            className={`transition-colors flex items-center gap-1 font-semibold p-1 rounded cursor-pointer ${
              isSpeaking ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-white'
            }`}
            title={isSpeaking ? "Parar de ouvir" : "Ouvir aviso em voz alta"}
          >
            {isSpeaking ? '🛑 Parar' : '🔊 Ouvir'}
          </button>

          <button className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            ⭐ Salvar
          </button>
        </div>

        {/* Botão de Expandir / Retrair */}
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
