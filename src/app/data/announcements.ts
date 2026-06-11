export type FilterOption = 'todos' | 'urgente' | 'importante' | 'geral' | 'informativo';
export type SortOption = 'recente' | 'antigo';

export const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'urgente', label: 'Urgente' },
  { value: 'importante', label: 'Importante' },
  { value: 'geral', label: 'Geral' },
  { value: 'informativo', label: 'Informativo' }
];

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author?: string;
  tags?: string[];
  emoji?: string;
}

export const ANNOUNCEMENTS_DATA: Announcement[] = [
  {
    id: "1",
    title: "Suspensão das Aulas — Quinta-feira 28/05",
    content: "As aulas do dia 28/05 estão suspensas em razão das fortes chuvas previstas para a região.",
    category: "Urgente",
    date: "27 de maio de 2026",
    author: "Profª Maria Helena Souza",
    tags: ["cancelamento", "chuvas", "comunicado"],
    emoji: "🚨"
  },
  {
    id: "2",
    title: "Reunião Extraordinária de Pais — Hoje às 19h",
    content: "Convocamos todos os responsáveis para reunião urgente sobre o calendário do 2º semestre.",
    category: "Urgente",
    date: "27 de maio de 2026",
    author: "Secretaria Escolar",
    tags: ["reunião", "pais", "urgente"],
    emoji: "🚨"
  },
  {
    id: "3",
    title: "Entrega de Boletins — 1º Bimestre 2026",
    content: "Os boletins do 1º bimestre estarão disponíveis para retirada a partir de 30/05.",
    category: "Importante",
    date: "26 de maio de 2026",
    author: "Coordenação Pedagógica",
    tags: ["boletins", "notas", "bimestre"],
    emoji: "⚠️"
  },
  {
    id: "4",
    title: "Prazo Final para Inscrição na Excursão Histórica",
    content: "As inscrições para a excursão a Ouro Preto encerram no dia 31/05. Apenas 12 vagas restantes.",
    category: "Importante",
    date: "25 de maio de 2026",
    author: "Coordenação de Eventos",
    tags: ["excursão", "inscrição", "prazo"],
    emoji: "⚠️"
  },
  {
    id: "5",
    title: "Calendário de Provas — 2º Bimestre 2026",
    content: "Confira as datas das avaliações do 2º bimestre para todos os anos e disciplinas.",
    category: "Importante",
    date: "24 de maio de 2026",
    author: "Coordenação Pedagógica",
    tags: ["provas", "avaliações", "calendário"],
    emoji: "⚠️"
  },
  {
    id: "6",
    title: "Novo Horário de Funcionamento da Biblioteca",
    content: "A biblioteca passa a funcionar de segunda a sexta das 7h às 20h a partir de junho.",
    category: "Geral",
    date: "23 de maio de 2026",
    author: "Bibliotecária Fernanda Lopes",
    tags: ["biblioteca", "horário", "serviços"],
    emoji: "📘"
  },
  {
    id: "7",
    title: "Torneio Interno de Xadrez — Inscrições Abertas",
    content: "O clube de xadrez convida alunos de todos os anos a participar do 5º Torneio Anual.",
    category: "Geral",
    date: "22 de maio de 2026",
    author: "Prof. Carlos Menezes",
    tags: ["xadrez", "atividade", "esporte"],
    emoji: "📘"
  },
  {
    id: "8",
    title: "Semana do Meio Ambiente — Programação Especial",
    content: "De 01 a 05 de junho a escola promoverá atividades em comemoração ao Dia do Meio Ambiente.",
    category: "Geral",
    date: "21 de maio de 2026",
    author: "Coordenação de Projetos",
    tags: ["meio ambiente", "evento", "semana"],
    emoji: "📘"
  },
  {
    id: "9",
    title: "Resultado do Concurso de Redação 2026",
    content: "Parabéns aos alunos premiados no Concurso Municipal de Redação. Confira os vencedores.",
    category: "Informativo",
    date: "20 de maio de 2026",
    author: "Direção Escolar",
    tags: ["concurso", "redação", "premiação"],
    emoji: "📢"
  },
  {
    id: "10",
    title: "Reforço Escolar — Novas Vagas Disponíveis",
    content: "O programa de reforço escolar está com vagas abertas para Matemática, Português e Inglês.",
    category: "Informativo",
    date: "19 de maio de 2026",
    author: "Coordenação Pedagógica",
    tags: ["reforço", "vagas", "gratuito"],
    emoji: "📢"
  }
];
