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
}

export const announcementsData: Announcement[] = [
  {
    id: "1",
    title: "Suspensão das Aulas — Quinta-feira 28/05",
    content: "As aulas do dia 28/05 estão suspensas em razão das fortes chuvas previstas para a região.",
    category: "urgente",
    date: "27/05/2026",
    author: "Prof.ª Maria Helena Souza",
    tags: ["cancelamento", "chuvas", "comunicado"]
  },
  {
    id: "2",
    title: "Reunião Extraordinária de Pais — Hoje às 19h",
    content: "Convocamos todos os responsáveis para reunião urgente sobre o calendário do 2º semestre.",
    category: "urgente",
    date: "27/05/2026",
    author: "Secretaria Escolar",
    tags: ["reuniao", "pais", "urgente"]
  },
  {
    id: "3",
    title: "Entrega de Boletins — 1º Bimestre 2026",
    content: "Os boletins do 1º bimestre estarão disponíveis para retirada a partir de 30/05.",
    category: "importante",
    date: "26/05/2026",
    author: "Coordenação Pedagógica",
    tags: ["boletins", "notas", "bimestre"]
  },
  {
    id: "4",
    title: "Prazo Final para Inscrição na Excursão Histórica",
    content: "As inscrições para a excursão a Ouro Preto encerram no dia 31/05. Apenas 12 vagas restantes.",
    category: "importante",
    date: "25/05/2026",
    author: "Coordenação de Eventos",
    tags: ["excursao", "inscricao", "prazo"]
  },
  {
    id: "5",
    title: "Calendário de Provas — 2º Bimestre 2026",
    content: "Confira as datas das avaliações do 2º bimestre para todos os anos e disciplinas.",
    category: "importante",
    date: "24/05/2026",
    author: "Coordenação Pedagógica",
    tags: ["provas", "avaliacoes", "calendario"]
  },
  {
    id: "6",
    title: "Novo Horário de Funcionamento da Biblioteca",
    content: "A biblioteca passa a funcionar de segunda a sexta das 7h às 20h a partir de junho.",
    category: "geral",
    date: "23/05/2026",
    author: "Bibliotecária Fernanda Lopes",
    tags: ["biblioteca", "horario", "servicos"]
  },
  {
    id: "7",
    title: "Torneio Interno de Xadrez — Inscrições Abertas",
    content: "O clube de xadrez convida alunos de todos os anos a participar do 5º Torneio Anual.",
    category: "geral",
    date: "22/05/2026",
    author: "Prof. Carlos Menezes",
    tags: ["xadrez", "atividade", "esporte"]
  },
  {
    id: "8",
    title: "Semana do Meio Ambiente — Programação Especial",
    content: "De 01 a 05 de junho a escola promoverá atividades em comemoração ao Dia do Meio Ambiente.",
    category: "geral",
    date: "21/05/2026",
    author: "Coordenação de Projetos",
    tags: ["meio ambiente", "evento", "semana"]
  },
  {
    id: "9",
    title: "Resultado do Concurso de Redação 2026",
    content: "Parabéns aos alunos premiados no Concurso Municipal de Redação. Confira os vencedores.",
    category: "informativo",
    date: "20/05/2026",
    author: "Direção Escolar",
    tags: ["concurso", "redacao", "premiacao"]
  },
  {
    id: "10",
    title: "Reforço Escolar — Novas Vagas Disponíveis",
    content: "O programa de reforço escolar está com vagas abertas para Matemática, Português e Inglês.",
    category: "informativo",
    date: "19/05/2026",
    author: "Coordenação Pedagógica",
    tags: ["reforco", "vagas", "gratuito"]
  }
];
