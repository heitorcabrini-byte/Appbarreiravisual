// 🔍 Tipos e Constantes exigidos pelo FilterSearchBar
export type FilterOption = 'todos' | 'urgente' | 'importante' | 'geral' | 'informativo';
export type SortOption = 'recente' | 'antigo';

export const FILTER_OPTIONS: { value: FilterOption; label: string; icon?: string }[] = [
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
  category: string; // 'urgente', 'importante', 'informativo', 'geral'
  date: string;
  author?: string;
  tags?: string[];
}

export const announcementsData: Announcement[] = [
  {
    id: "1",
    title: "Período de Rematrícula Escolar 2026",
    content: "Atenção responsáveis! O prazo para renovação de matrícula para o second semestre já está aberto. Os documentos necessários devem ser entregues diretamente na secretaria ou enviados pelo portal do aluno até o dia 30/06.",
    category: "urgente",
    date: "11/06/2026",
    author: "Secretaria Escolar",
    tags: ["rematricula", "prazos", "documentos"]
  },
  {
    id: "2",
    title: "Reunião de Pais e Mestres do 2º Bimestre",
    content: "Convidamos todos os pais e responsáveis para a nossa reunião bimestral que acontecerá neste sábado, das 09h às 12h. Será uma excelente oportunidade para discutir o desempenho acadêmico e a entrega de boletins.",
    category: "importante",
    date: "10/06/2026",
    author: "Coordenação Pedagógica",
    tags: ["reuniao", "pais", "boletins"]
  },
  {
    id: "3",
    title: "Feira de Ciências Interdisciplinar",
    content: "Estão abertas as inscrições para os projetos da Feira de Ciências deste ano! O tema central será 'Sustentabilidade e Tecnologia no Cotidiano'. Procure seu professor de biologia ou física para registrar seu grupo.",
    category: "informativo",
    date: "08/06/2026",
    author: "Direção Escolar",
    tags: ["feira", "ciencias", "projetos"]
  },
  {
    id: "4",
    title: "Manutenção do Bloco B e Laboratórios",
    content: "Informamos que o Bloco B passará por manutenções preventivas na rede elétrica durante o próximo final de semana. O acesso aos laboratórios de informática estará suspenso temporariamente.",
    category: "geral",
    date: "05/06/2026",
    author: "Coordenação de Infraestrutura",
    tags: ["manutencao", "blocob", "laboratorios"]
  },
  {
    id: "5",
    title: "Suspensão das Aulas — Quinta-feira 28/05",
    content: "As aulas do dia 28/05 estão suspensas em razão das fortes chuvas previstas para a região.",
    category: "urgente",
    date: "27/05/2026",
    author: "Prof.ª Maria Helena Souza",
    tags: ["cancelamento", "chuvas", "comunicado"]
  },
  {
    id: "6",
    title: "Reunião Extraordinária de Pais — Hoje às 19h",
    content: "Convocamos todos os responsáveis para reunião urgente sobre o calendário do 2º semestre.",
    category: "urgente",
    date: "27/05/2026",
    author: "Secretaria Escolar",
    tags: ["reuniao", "pais", "urgente"]
  },
  {
    id: "7",
    title: "Entrega de Boletins — 1º Bimestre 2026",
    content: "Os boletins do 1º bimestre estarão disponíveis para retirada a partir de 30/05.",
    category: "importante",
    date: "26/05/2026",
    author: "Coordenação Pedagógica",
    tags: ["boletins", "notas", "bimestre"]
  },
  {
    id: "8",
    title: "Prazo Final para Inscrição na Excursão Histórica",
    content: "As inscrições para a excursão a Ouro Preto encerram no dia 31/05. Apenas 12 vagas restantes.",
    category: "importante",
    date: "25/05/2026",
    author: "Coordenação de Eventos",
    tags: ["excursao", "inscricao", "prazo"]
  },
  {
    id: "9",
    title: "Calendário de Provas — 2º Bimestre 2026",
    content: "Confira as datas das avaliações do 2º bimestre para todos os anos e disciplinas.",
    category: "importante",
    date: "24/05/2026",
    author: "Coordenação Pedagógica",
    tags: ["provas", "avaliacoes", "calendario"]
  },
  {
    id: "10",
    title: "Novo Horário de Funcionamento da Biblioteca",
    content: "A biblioteca passa a funcionar de segunda a sexta das 7h às 20h a partir de junho.",
    category: "geral",
    date: "23/05/2026",
    author: "Bibliotecária Fernanda Lopes",
    tags: ["biblioteca", "horario", "servicos"]
  }
];
