export type Category = 'urgente' | 'importante' | 'geral' | 'informativo';
export type FilterOption = 'todos' | Category;
export type SortOption = 'recente' | 'antigo' | 'favoritos';

export interface Announcement {
  id: number;
  category: Category;
  title: string;
  summary: string;
  body: string;
  date: string;
  author: string;
  authorRole: string;
  tags: string[];
}

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; cardBg: string; borderColor: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  urgente: {
    label: 'Urgente',
    emoji: '🚨',
    cardBg: 'bg-red-950/50',
    borderColor: 'border-l-red-500',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-500/60',
  },
  importante: {
    label: 'Importante',
    emoji: '⚠️',
    cardBg: 'bg-amber-950/50',
    borderColor: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/60',
  },
  geral: {
    label: 'Geral',
    emoji: 'ℹ️',
    cardBg: 'bg-blue-950/50',
    borderColor: 'border-l-blue-500',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/60',
  },
  informativo: {
    label: 'Informativo',
    emoji: '📢',
    cardBg: 'bg-emerald-950/50',
    borderColor: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/60',
  },
};

export const FILTER_OPTIONS: { value: FilterOption; label: string; emoji: string; ariaLabel: string }[] = [
  { value: 'todos', label: 'Todos', emoji: '📋', ariaLabel: 'Mostrar todos os avisos' },
  { value: 'urgente', label: 'Urgente', emoji: '🚨', ariaLabel: 'Filtrar avisos urgentes' },
  { value: 'importante', label: 'Importante', emoji: '⚠️', ariaLabel: 'Filtrar avisos importantes' },
  { value: 'geral', label: 'Geral', emoji: 'ℹ️', ariaLabel: 'Filtrar avisos gerais' },
  { value: 'informativo', label: 'Informativo', emoji: '📢', ariaLabel: 'Filtrar avisos informativos' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    category: 'urgente',
    title: 'Suspensão das Aulas — Quinta-feira 28/05',
    summary: 'As aulas do dia 28/05 estão suspensas em razão das fortes chuvas previstas para a região.',
    body: 'Informamos que, em virtude do alerta meteorológico emitido pela Defesa Civil para fortes chuvas e ventos na região, as aulas presenciais do dia 28 de maio de 2026 (quinta-feira) estão suspensas para todos os turnos. As atividades remotas serão disponibilizadas no portal da escola. Aguardem novas informações sobre a reposição das aulas pelo portal ou pela secretaria. Em caso de dúvidas urgentes, entre em contato pelo WhatsApp da secretaria: (11) 9 9999-8888.',
    date: '2026-05-27',
    author: 'Prof.ª Maria Helena Souza',
    authorRole: 'Diretora Escolar',
    tags: ['cancelamento', 'chuvas', 'comunicado'],
  },
  {
    id: 2,
    category: 'urgente',
    title: 'Reunião Extraordinária de Pais — Hoje às 19h',
    summary: 'Convocamos todos os responsáveis para reunião urgente sobre o calendário do 2º semestre.',
    body: 'A direção convoca todos os responsáveis pelos alunos do Ensino Médio para uma reunião extraordinária nesta quarta-feira, 27 de maio de 2026, às 19h, no auditório da escola. A pauta incluirá alterações no calendário letivo do 2º semestre, calendário de provas finais e comunicados sobre a formatura do 3º ano. Sua presença é imprescindível. Para confirmação, acesse o portal ou entre em contato com a secretaria.',
    date: '2026-05-27',
    author: 'Secretaria Escolar',
    authorRole: 'Administração',
    tags: ['reunião', 'pais', 'urgente'],
  },
  {
    id: 3,
    category: 'importante',
    title: 'Entrega de Boletins — 1º Bimestre 2026',
    summary: 'Os boletins do 1º bimestre estarão disponíveis para retirada a partir de 30/05.',
    body: 'Comunicamos que os boletins do 1º Bimestre de 2026 estarão disponíveis para retirada a partir de 30 de maio de 2026 (sexta-feira). A entrega será feita na secretaria, de segunda a sexta-feira, das 8h às 17h. Responsáveis que não puderem comparecer podem autorizar um terceiro por escrito. O boletim também estará disponível no portal do aluno a partir de 02/06. Para dúvidas sobre notas e faltas, agende uma conversa com a coordenação pedagógica.',
    date: '2026-05-26',
    author: 'Coordenação Pedagógica',
    authorRole: 'Coordenação',
    tags: ['boletins', 'notas', 'bimestre'],
  },
  {
    id: 4,
    category: 'importante',
    title: 'Prazo Final para Inscrição na Excursão Histórica',
    summary: 'As inscrições para a excursão a Ouro Preto encerram no dia 31/05. Apenas 12 vagas restantes.',
    body: 'Atenção! As inscrições para a Excursão Histórica a Ouro Preto (MG), prevista para os dias 14 e 15 de junho de 2026, encerram no dia 31 de maio de 2026. A excursão é destinada aos alunos do 2º e 3º ano do Ensino Médio. O custo é de R$ 180,00 por aluno, incluindo transporte, seguro e ingresso nos museus. As inscrições devem ser feitas presencialmente na secretaria com pagamento da primeira parcela. Restam apenas 12 vagas. Não perca esta oportunidade de aprendizado fora da sala de aula!',
    date: '2026-05-25',
    author: 'Coordenação de Eventos',
    authorRole: 'Coordenação',
    tags: ['excursão', 'inscrição', 'prazo'],
  },
  {
    id: 5,
    category: 'importante',
    title: 'Calendário de Provas — 2º Bimestre 2026',
    summary: 'Confira as datas das avaliações do 2º bimestre para todos os anos e disciplinas.',
    body: 'A coordenação pedagógica divulga o calendário oficial de provas do 2º Bimestre de 2026. As avaliações ocorrerão entre os dias 10 e 21 de junho de 2026. Cada turma receberá o cronograma específico por meio dos representantes de classe. O gabarito das provas será publicado no portal do aluno no dia seguinte à aplicação. Os alunos com necessidades especiais devem procurar a coordenação com antecedência para agendamento de adaptações. Estudem com antecedência e tirem dúvidas com os professores!',
    date: '2026-05-24',
    author: 'Coordenação Pedagógica',
    authorRole: 'Coordenação',
    tags: ['provas', 'avaliações', 'calendário'],
  },
  {
    id: 6,
    category: 'geral',
    title: 'Novo Horário de Funcionamento da Biblioteca',
    summary: 'A biblioteca passa a funcionar de segunda a sexta das 7h às 20h a partir de junho.',
    body: 'Comunicamos que, a partir de 01 de junho de 2026, a Biblioteca Escolar Monteiro Lobato passará a funcionar com o novo horário: segunda a sexta-feira, das 7h às 20h. O acervo conta com mais de 8.000 títulos, incluindo obras de literatura, ciências, história e revistas científicas. Os alunos podem retirar até 3 livros por vez, pelo prazo de 15 dias. O laboratório de informática da biblioteca estará disponível para pesquisas escolares mediante agendamento prévio. Acesse o catálogo online pelo portal da escola.',
    date: '2026-05-23',
    author: 'Bibliotecária Fernanda Lopes',
    authorRole: 'Biblioteca',
    tags: ['biblioteca', 'horário', 'serviços'],
  },
  {
    id: 7,
    category: 'geral',
    title: 'Torneio Interno de Xadrez — Inscrições Abertas',
    summary: 'O clube de xadrez convida alunos de todos os anos a participar do 5º Torneio Anual.',
    body: 'O Clube de Xadrez da Escola Estadual Dom Pedro II convida todos os alunos interessados a participar do 5º Torneio Interno de Xadrez. O torneio acontecerá nos dias 7 e 8 de junho, no laboratório de informática. Não é necessário conhecimento avançado — haverá categorias para iniciantes e experientes. As inscrições são gratuitas e podem ser feitas com o Prof. Carlos Menezes até dia 3 de junho. Os 3 primeiros colocados receberão certificados e premiações especiais.',
    date: '2026-05-22',
    author: 'Prof. Carlos Menezes',
    authorRole: 'Professor de Matemática',
    tags: ['xadrez', 'atividade', 'esporte'],
  },
  {
    id: 8,
    category: 'geral',
    title: 'Semana do Meio Ambiente — Programação Especial',
    summary: 'De 01 a 05 de junho a escola promoverá atividades em comemoração ao Dia do Meio Ambiente.',
    body: 'Em comemoração ao Dia Mundial do Meio Ambiente (05/06), a escola promoverá a Semana do Meio Ambiente de 01 a 05 de junho de 2026. A programação inclui: palestra sobre sustentabilidade com a ONG EcoBrasil (02/06 às 9h); oficina de reciclagem artística (03/06 às 14h); plantio coletivo no jardim escolar (04/06 às 8h); e exposição de projetos ambientais no pátio (05/06 das 9h às 12h). A participação nas atividades valerá nota extra na disciplina de Ciências.',
    date: '2026-05-21',
    author: 'Coordenação de Projetos',
    authorRole: 'Coordenação',
    tags: ['meio ambiente', 'evento', 'semana'],
  },
  {
    id: 9,
    category: 'informativo',
    title: 'Resultado do Concurso de Redação 2026',
    summary: 'Parabéns aos alunos premiados no Concurso Municipal de Redação. Confira os vencedores.',
    body: 'Com muita alegria, a direção comunica os resultados do Concurso Municipal de Redação 2026, promovido pela Secretaria Municipal de Educação. Nossa escola se destacou com 3 premiações: 1º lugar — Ana Beatriz Santos (9º ano A), com "Vozes do Amanhã"; 2º lugar — Lucas Ferreira Oliveira (3º ano B do EM), com "O Legado que Construímos"; Menção Honrosa — Isabela Costa Ramos (8º ano C). Os alunos serão homenageados em cerimônia no dia 10/06. Parabéns a todos os participantes pela dedicação!',
    date: '2026-05-20',
    author: 'Direção Escolar',
    authorRole: 'Diretora Escolar',
    tags: ['concurso', 'redação', 'premiação'],
  },
  {
    id: 10,
    category: 'informativo',
    title: 'Reforço Escolar — Novas Vagas Disponíveis',
    summary: 'O programa de reforço escolar está com vagas abertas para Matemática, Português e Inglês.',
    body: 'O Programa de Reforço Escolar da escola está com vagas disponíveis para as disciplinas de Matemática, Língua Portuguesa e Inglês. As aulas de reforço são gratuitas e acontecem de segunda a sexta-feira, no contraturno. Podem se inscrever alunos com dificuldades comprovadas indicados pelos professores, ou que desejam aprofundar seus conhecimentos. As inscrições devem ser feitas na secretaria mediante apresentação do boletim mais recente. As turmas têm no máximo 8 alunos para garantir atendimento personalizado.',
    date: '2026-05-19',
    author: 'Coordenação Pedagógica',
    authorRole: 'Coordenação',
    tags: ['reforço', 'vagas', 'gratuito'],
  },
];
