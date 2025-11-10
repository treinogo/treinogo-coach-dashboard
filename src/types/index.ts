// Types for RunCoach Pro

export interface Professor {
  id: string;
  nome: string;
  email: string;
  foto?: string;
}

export interface Aluno {
  id: string; // User ID for UI display
  athleteId?: string; // Athlete Profile ID for API operations
  nome: string;
  email: string;
  telefone?: string;
  idade: number;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Pendente' | 'Ativo' | 'Inativo';
  foto?: string;
  planoAtual?: string;
  progressoAtual: number;
  treinosConcluidos: number;
  tempoMedio: string;
  ritmoMedio: string;
  dataCadastro?: Date;
}

export interface PlanoTreino {
  id: string;
  nome: string;
  categoria: 'Iniciante' | 'Intermediário' | 'Avançado' | '5K' | '10K' | 'Meia Maratona' | 'Maratona';
  duracao: number; // em semanas
  diasPorSemana: number;
  totalAlunos: number;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  programacao: ProgramacaoSemanal[];
  criadoEm: Date;
  criadoPor: string;
  progresso?: number;
}

export interface ProgramacaoSemanal {
  semana: number;
  treinos: {
    [key: string]: TipoTreino | null; // seg, ter, qua, qui, sex, sab, dom
  };
}

export type TipoTreino = 
  | 'Corrida Contínua'
  | 'Intervalado'
  | 'Fartlek'
  | 'Longão'
  | 'Prova/Teste'
  | 'Descanso';

export type TipoMedida = 'KM' | 'Tempo';
export type ZonaTreino = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export interface TreinoDetalhe {
  tipo: TipoTreino;
  medida?: TipoMedida;
  valor?: string;
  zona?: ZonaTreino;
  descricao?: string;
  intervalos?: { valor: string; zona: ZonaTreino }[]; // Para Fartlek
  // Prova/Teste
  tipoProvaTeste?: 'Prova' | 'Teste';
  provaId?: string; // ID da prova cadastrada
  tipoTeste?: '12min' | '3km' | '5km';
  // Intervalado
  tempoDescanso?: string; // 1'00", 1'30", 2'00", etc
}

export interface Desafio {
  id: string;
  nome: string;
  objetivo: string;
  duracao: number; // em dias
  dataInicio: Date;
  dataFim: Date;
  participantes: string[]; // IDs dos alunos
  recompensa?: string;
  status: 'Ativo' | 'Concluído' | 'Cancelado';
  progresso: { [alunoId: string]: number };
  ranking: { alunoId: string; pontos: number; }[];
}

export interface Notificacao {
  id: string;
  tipo: 'sucesso' | 'alerta' | 'info' | 'erro';
  mensagem: string;
  lida: boolean;
  data: Date;
}

export interface AtividadeRecente {
  id: string;
  descricao: string;
  data: Date;
  tipo: 'plano' | 'desafio' | 'aluno';
}

export type TipoTesteFisico = '12 minutos' | '3km' | '5km';

export interface TesteFisico {
  id: string;
  alunoId: string;
  tipoTeste: TipoTesteFisico;
  pace: string; // formato: mm:ss
  tempoFinal: string; // calculado
  distancia?: number; // para teste de 12 minutos
  data: Date;
}

export interface Prova {
  id: string;
  nome: string;
  distancias: string[]; // ['3km', '5km', '10km', '15km', '21km', '42km']
  cidade: string;
  estado: string;
  data: Date;
  mes: number;
  ano: number;
  turno?: 'Manhã' | 'Tarde' | 'Noite';
  link?: string;
}
