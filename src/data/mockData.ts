// Tipos
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  objetivo: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Ativo' | 'Pendente' | 'Inativo';
  testes: TesteFisico[];
}

export interface TesteFisico {
  id: string;
  alunoId: string;
  data: string;
  pace: number; // min/km
  fcMaxima: number; // bpm
  vo2max: number; // ml/kg/min
  zonas: {
    z1: { min: number; max: number }; // bpm
    z2: { min: number; max: number };
    z3: { min: number; max: number };
    z4: { min: number; max: number };
    z5: { min: number; max: number };
  };
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  volume: 'baixo' | 'medio' | 'alto';
  intensidade: 'baixa' | 'media' | 'alta';
  status: 'ativo' | 'inativo';
}

export interface PlanoTreino {
  id: string;
  nome: string;
  categoriaId: string;
  diasPorSemana: 2 | 3 | 4 | 5;
  estruturaSemanal: TreinoSemanal[];
  status: 'ativo' | 'inativo';
}

export interface TreinoSemanal {
  dia: string;
  tipo: 'corrida leve' | 'intervalado' | 'fartlek' | 'longo' | 'descanso';
  descricao: string;
  duracao: number; // minutos
  // Campos opcionais usados no formulário de planos
  zonaIntensidade?: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5' | 'Z6';
  descanso?: string; // ex: "1'00", "2'00", etc.
}

export interface Prova {
  id: string;
  nome: string;
  cidade: string;
  percursos: Array<'3km' | '5km' | '10km' | '21km' | '42km'>;
  data: string; // YYYY-MM-DD
}

// Dados mockados
export const alunos: Aluno[] = [
  {
    id: '1',
    nome: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '(11) 98765-4321',
    dataNascimento: '1990-05-15',
    objetivo: '21K',
    nivel: 'Intermediário',
    status: 'Ativo',
    testes: []
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    telefone: '(11) 91234-5678',
    dataNascimento: '1985-10-20',
    objetivo: '42K',
    nivel: 'Avançado',
    status: 'Pendente',
    testes: []
  },
  {
    id: '3',
    nome: 'Mariana Santos',
    email: 'mariana.santos@email.com',
    telefone: '(11) 99876-5432',
    dataNascimento: '1995-03-25',
    objetivo: '10K',
    nivel: 'Intermediário',
    status: 'Inativo',
    testes: []
  },
  {
    id: '4',
    nome: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    telefone: '(11) 98765-1234',
    dataNascimento: '1988-12-10',
    objetivo: '5K',
    nivel: 'Iniciante',
    status: 'Ativo',
    testes: []
  },
  {
    id: '5',
    nome: 'Juliana Lima',
    email: 'juliana.lima@email.com',
    telefone: '(11) 95432-1098',
    dataNascimento: '1992-07-30',
    objetivo: '21K',
    nivel: 'Intermediário',
    status: 'Ativo',
    testes: []
  }
];

export const provas: Prova[] = [
  {
    id: 'p1',
    nome: 'Corrida da Cidade',
    cidade: 'São Paulo',
    percursos: ['5km', '10km'],
    data: '2025-10-20'
  },
  {
    id: 'p2',
    nome: 'Meia Maratona do Sol',
    cidade: 'Natal',
    percursos: ['21km'],
    data: '2025-11-10'
  },
  {
    id: 'p3',
    nome: 'Maratona das Águas',
    cidade: 'Foz do Iguaçu',
    percursos: ['42km'],
    data: '2025-12-05'
  },
  {
    id: 'p4',
    nome: 'Circuito Parque',
    cidade: 'Curitiba',
    percursos: ['3km', '5km'],
    data: '2025-10-28'
  }
];

export const testesFisicos: TesteFisico[] = [
  {
    id: '1',
    alunoId: '1',
    data: '2023-11-10',
    pace: 5.5,
    fcMaxima: 185,
    vo2max: 42,
    zonas: {
      z1: { min: 120, max: 135 },
      z2: { min: 136, max: 150 },
      z3: { min: 151, max: 165 },
      z4: { min: 166, max: 175 },
      z5: { min: 176, max: 185 }
    }
  },
  {
    id: '2',
    alunoId: '2',
    data: '2023-11-15',
    pace: 4.8,
    fcMaxima: 178,
    vo2max: 48,
    zonas: {
      z1: { min: 115, max: 130 },
      z2: { min: 131, max: 145 },
      z3: { min: 146, max: 160 },
      z4: { min: 161, max: 170 },
      z5: { min: 171, max: 178 }
    }
  },
  {
    id: '3',
    alunoId: '3',
    data: '2023-11-20',
    pace: 6.2,
    fcMaxima: 190,
    vo2max: 38,
    zonas: {
      z1: { min: 125, max: 140 },
      z2: { min: 141, max: 155 },
      z3: { min: 156, max: 170 },
      z4: { min: 171, max: 180 },
      z5: { min: 181, max: 190 }
    }
  }
];

// Adicionar testes aos alunos
alunos[0].testes = [testesFisicos[0]];
alunos[1].testes = [testesFisicos[1]];
alunos[2].testes = [testesFisicos[2]];

export const categorias: Categoria[] = [
  {
    id: '1',
    nome: '42K',
    descricao: 'Preparação para maratona',
    volume: 'alto',
    intensidade: 'media',
    status: 'ativo'
  },
  {
    id: '2',
    nome: '21K',
    descricao: 'Preparação para meia maratona',
    volume: 'medio',
    intensidade: 'media',
    status: 'ativo'
  },
  {
    id: '3',
    nome: '10K',
    descricao: 'Preparação para 10km',
    volume: 'medio',
    intensidade: 'alta',
    status: 'ativo'
  },
  {
    id: '4',
    nome: '5K',
    descricao: 'Preparação para 5km',
    volume: 'baixo',
    intensidade: 'alta',
    status: 'ativo'
  },
  {
    id: '5',
    nome: 'Iniciante',
    descricao: 'Introdução à corrida',
    volume: 'baixo',
    intensidade: 'baixa',
    status: 'ativo'
  }
];

export const planosTreino: PlanoTreino[] = [
  {
    id: '1',
    nome: 'Maratona Iniciante',
    categoriaId: '1',
    diasPorSemana: 4,
    estruturaSemanal: [
      {
        dia: 'Segunda',
        tipo: 'corrida leve',
        descricao: '40 minutos em ritmo fácil',
        duracao: 40
      },
      {
        dia: 'Quarta',
        tipo: 'intervalado',
        descricao: '8x400m com recuperação de 200m',
        duracao: 45
      },
      {
        dia: 'Quinta',
        tipo: 'corrida leve',
        descricao: '30 minutos em ritmo fácil',
        duracao: 30
      },
      {
        dia: 'Domingo',
        tipo: 'longo',
        descricao: '15km em ritmo constante',
        duracao: 90
      }
    ],
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Meia Maratona Intermediário',
    categoriaId: '2',
    diasPorSemana: 3,
    estruturaSemanal: [
      {
        dia: 'Terça',
        tipo: 'intervalado',
        descricao: '6x800m com recuperação de 400m',
        duracao: 50
      },
      {
        dia: 'Quinta',
        tipo: 'fartlek',
        descricao: '30 minutos alternando ritmos',
        duracao: 30
      },
      {
        dia: 'Sábado',
        tipo: 'longo',
        descricao: '12km em ritmo constante',
        duracao: 70
      }
    ],
    status: 'ativo'
  },
  {
    id: '3',
    nome: '10K Avançado',
    categoriaId: '3',
    diasPorSemana: 5,
    estruturaSemanal: [
      {
        dia: 'Segunda',
        tipo: 'corrida leve',
        descricao: '30 minutos em ritmo fácil',
        duracao: 30
      },
      {
        dia: 'Terça',
        tipo: 'intervalado',
        descricao: '10x400m com recuperação de 200m',
        duracao: 50
      },
      {
        dia: 'Quarta',
        tipo: 'corrida leve',
        descricao: '40 minutos em ritmo fácil',
        duracao: 40
      },
      {
        dia: 'Sexta',
        tipo: 'fartlek',
        descricao: '40 minutos alternando ritmos',
        duracao: 40
      },
      {
        dia: 'Domingo',
        tipo: 'longo',
        descricao: '8km em ritmo constante',
        duracao: 45
      }
    ],
    status: 'ativo'
  }
];

// Dados para o dashboard
export const dashboardData = {
  totalAlunos: alunos.length,
  treinosAtivos: planosTreino.filter(p => p.status === 'ativo').length,
  treinosInativos: planosTreino.filter(p => p.status === 'inativo').length,
  atividadeMensal: [
    { mes: 'Jan', treinos: 45 },
    { mes: 'Fev', treinos: 52 },
    { mes: 'Mar', treinos: 49 },
    { mes: 'Abr', treinos: 63 },
    { mes: 'Mai', treinos: 58 },
    { mes: 'Jun', treinos: 64 },
    { mes: 'Jul', treinos: 70 },
    { mes: 'Ago', treinos: 72 },
    { mes: 'Set', treinos: 68 },
    { mes: 'Out', treinos: 74 },
    { mes: 'Nov', treinos: 80 },
    { mes: 'Dez', treinos: 65 }
  ],
  notificacoes: [
    { id: '1', mensagem: 'Teste físico de Ana Silva agendado para amanhã', data: '2023-12-01', lida: false },
    { id: '2', mensagem: 'Carlos Oliveira completou 80% do plano de treino', data: '2023-11-28', lida: true },
    { id: '3', mensagem: 'Novo aluno cadastrado: Juliana Lima', data: '2023-11-25', lida: true }
  ]
};

// Desafios
export interface DesafioParticipante {
  alunoId: string;
  nome: string;
  km: number;
  status: 'inscrito' | 'finalizado';
}

export interface Desafio {
  id: string;
  nome: string;
  descricao: string;
  inicio: string; // YYYY-MM-DD
  fim: string;    // YYYY-MM-DD
  ativo: boolean;
  participantes: DesafioParticipante[];
}

const anoAtual = new Date().getFullYear();

export const desafios: Desafio[] = [
  {
    id: 'd1',
    nome: 'Desafio 50K Mês',
    descricao: 'Complete 50 km no mês',
    inicio: `${anoAtual}-10-01`,
    fim: `${anoAtual}-10-31`,
    ativo: true,
    participantes: [
      { alunoId: alunos[0].id, nome: alunos[0].nome, km: 32, status: 'inscrito' },
      { alunoId: alunos[1].id, nome: alunos[1].nome, km: 54, status: 'finalizado' },
      { alunoId: alunos[3].id, nome: alunos[3].nome, km: 45, status: 'inscrito' }
    ]
  },
  {
    id: 'd2',
    nome: 'Desafio 100K Mês',
    descricao: 'Complete 100 km no mês',
    inicio: `${anoAtual}-11-01`,
    fim: `${anoAtual}-11-30`,
    ativo: true,
    participantes: [
      { alunoId: alunos[2].id, nome: alunos[2].nome, km: 20, status: 'inscrito' },
      { alunoId: alunos[4].id, nome: alunos[4].nome, km: 75, status: 'inscrito' }
    ]
  },
  {
    id: 'd3',
    nome: 'Desafio 200K Mês',
    descricao: 'Complete 200 km no mês',
    inicio: `${anoAtual}-09-01`,
    fim: `${anoAtual}-09-30`,
    ativo: false,
    participantes: [
      { alunoId: alunos[0].id, nome: alunos[0].nome, km: 120, status: 'finalizado' },
      { alunoId: alunos[1].id, nome: alunos[1].nome, km: 180, status: 'finalizado' }
    ]
  }
];

// Feed de treinos
export interface FeedTreinoItem {
  id: string;
  alunoId: string;
  alunoNome: string;
  descricao: string;
  data: string; // ISO
  likes: number;
}

export const feedTreinos: FeedTreinoItem[] = [
  {
    id: 'f1',
    alunoId: alunos[0].id,
    alunoNome: alunos[0].nome,
    descricao: 'Treino leve 5km concluído',
    data: `${anoAtual}-10-12T07:30:00Z`,
    likes: 3
  },
  {
    id: 'f2',
    alunoId: alunos[1].id,
    alunoNome: alunos[1].nome,
    descricao: 'Intervalado 8x400m completo',
    data: `${anoAtual}-10-13T18:10:00Z`,
    likes: 5
  },
  {
    id: 'f3',
    alunoId: alunos[4].id,
    alunoNome: alunos[4].nome,
    descricao: 'Longão de 12km finalizado',
    data: `${anoAtual}-10-14T09:00:00Z`,
    likes: 2
  }
];