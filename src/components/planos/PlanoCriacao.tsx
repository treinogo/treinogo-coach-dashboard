import { useState, useEffect } from 'react';
import { PlusCircle, Save, Eye, Play, Zap, Wind, Mountain, Target, X, Plus, Users, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import { TipoTreino, TreinoDetalhe, TipoMedida, ZonaTreino, Aluno } from '../../types';

import { PlanosService, AlunosService, ProvasService } from '../../lib/services';

interface PlanoCriacaoProps {
  onVoltar?: () => void;
}

export function PlanoCriacao({ onVoltar }: PlanoCriacaoProps = {}) {
  // Dados reais do backend  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [provas, setProvas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [nomePlano, setNomePlano] = useState('');
  const [categoria, setCategoria] = useState('');
  const [duracao, setDuracao] = useState('4');
  const [diasPorSemana, setDiasPorSemana] = useState('4');
  const [programacao, setProgramacao] = useState<{ [key: string]: TreinoDetalhe | null }>({});
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoTreino | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomizacao, setShowCustomizacao] = useState(false);
  const [diaParaCustomizar, setDiaParaCustomizar] = useState<string | null>(null);
  
  // Estados para customização
  const [tipoTreinoModal, setTipoTreinoModal] = useState<TipoTreino | null>(null);
  const [medida, setMedida] = useState<TipoMedida>('KM');
  const [valor, setValor] = useState('');
  const [zona, setZona] = useState<ZonaTreino>('Z2');
  const [descricao, setDescricao] = useState('');
  const [intervalos, setIntervalos] = useState<{ valor: string; zona: ZonaTreino }[]>([
    { valor: '', zona: 'Z2' }
  ]);
  
  // Estados específicos para Prova/Teste
  const [tipoProvaTeste, setTipoProvaTeste] = useState<'Prova' | 'Teste'>('Prova');
  const [provaId, setProvaId] = useState('');
  const [tipoTeste, setTipoTeste] = useState<'12min' | '3km' | '5km'>('12min');
  
  // Estados específicos para Intervalado
  const [tempoDescanso, setTempoDescanso] = useState('1:00');
  
  // Estados para seleção de alunos
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [aplicarTodosAlunos, setAplicarTodosAlunos] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(false);

  const diasSemana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

  // Carrega dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [alunosData, provasData] = await Promise.all([
          AlunosService.getAthletes(),
          ProvasService.getRaces()
        ]);
        setAlunos(alunosData);
        setProvas(provasData);
      } catch (error) {
        console.error('Error loading data:', error);
        setAlunos([]);
        setProvas([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const tiposTreino: { tipo: TipoTreino; icon: any; cor: string; descricao: string }[] = [
    {
      tipo: 'Corrida Contínua',
      icon: Play,
      cor: 'bg-blue-100 text-blue-700 border-blue-300',
      descricao: 'Corrida em ritmo constante, ideal para resistência aeróbica',
    },
    {
      tipo: 'Intervalado',
      icon: Zap,
      cor: 'bg-orange-100 text-orange-700 border-orange-300',
      descricao: 'Alternância entre alta e baixa intensidade, melhora velocidade',
    },
    {
      tipo: 'Fartlek',
      icon: Wind,
      cor: 'bg-purple-100 text-purple-700 border-purple-300',
      descricao: 'Treino de velocidade variável, combina ritmos diferentes',
    },
    {
      tipo: 'Longão',
      icon: Mountain,
      cor: 'bg-green-100 text-green-700 border-green-300',
      descricao: 'Corrida longa em ritmo confortável, desenvolve resistência',
    },
    {
      tipo: 'Prova/Teste',
      icon: Target,
      cor: 'bg-red-100 text-red-700 border-red-300',
      descricao: 'Simulação de prova ou teste de performance',
    },
  ];

  const handleDiaClick = (semana: number, dia: string) => {
    const key = `semana${semana}-${dia}`;
    
    setDiaParaCustomizar(key);
    
    // Resetar estados
    setTipoTreinoModal(tipoSelecionado);
    setMedida('KM');
    setValor('');
    setZona('Z2');
    setDescricao('');
    setIntervalos([{ valor: '', zona: 'Z2' }]);
    setTipoProvaTeste('Prova');
    setProvaId('');
    setTipoTeste('12min');
    setTempoDescanso('1:00');
    
    setShowCustomizacao(true);
  };

  const handleSalvarCustomizacao = () => {
    if (!diaParaCustomizar || !tipoTreinoModal) {
      toast.error('Selecione um tipo de treino');
      return;
    }

    const treinoDetalhe: TreinoDetalhe = {
      tipo: tipoTreinoModal,
      medida,
      valor,
      zona,
      descricao,
    };

    // Para Fartlek, incluir intervalos
    if (tipoTreinoModal === 'Fartlek') {
      treinoDetalhe.intervalos = intervalos.filter(i => i.valor);
    }
    
    // Para Prova/Teste
    if (tipoTreinoModal === 'Prova/Teste') {
      treinoDetalhe.tipoProvaTeste = tipoProvaTeste;
      if (tipoProvaTeste === 'Prova') {
        treinoDetalhe.provaId = provaId;
      } else {
        treinoDetalhe.tipoTeste = tipoTeste;
        treinoDetalhe.zona = 'Z4'; // Sempre Z4 para testes
      }
    }
    
    // Para Intervalado
    if (tipoTreinoModal === 'Intervalado') {
      treinoDetalhe.tempoDescanso = tempoDescanso;
    }

    setProgramacao(prev => ({
      ...prev,
      [diaParaCustomizar]: treinoDetalhe,
    }));

    setShowCustomizacao(false);
    setDiaParaCustomizar(null);
    setTipoTreinoModal(null);
    toast.success('Treino personalizado adicionado!');
  };

  const handleRemoverTreino = (semana: number, dia: string) => {
    const key = `semana${semana}-${dia}`;
    setProgramacao((prev) => ({ ...prev, [key]: null }));
  };

  const handleToggleAluno = (alunoId: string) => {
    setAlunosSelecionados(prev => 
      prev.includes(alunoId) 
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const handleSalvar = async () => {
    if (!nomePlano || !categoria) {
      toast.error('Erro ao salvar', {
        description: 'Preencha os campos obrigatórios: Nome e Categoria',
      });
      return;
    }

    try {
      setLoading(true);

      // Mapear categoria para o backend
      const categoryMap: Record<string, string> = {
        'Iniciante': 'BEGINNER',
        'Intermediário': 'INTERMEDIATE', 
        'Avançado': 'ADVANCED',
        '5K': 'FIVE_K',
        '10K': 'TEN_K',
        'Meia Maratona': 'HALF_MARATHON',
        'Maratona': 'MARATHON'
      };

      // Criar plano
      const planData = {
        name: nomePlano,
        category: categoryMap[categoria] || categoria,
        duration: parseInt(duracao),
        daysPerWeek: parseInt(diasPorSemana)
      };

      const response = await PlanosService.createPlan(planData);
      const planId = response.plan.id;

      // Atribuir aos alunos se selecionado
      if (aplicarTodosAlunos || alunosSelecionados.length > 0) {
        const alunosData = alunos;
        const alunosParaAtribuir = aplicarTodosAlunos 
          ? alunosData.filter(a => a.status === 'Ativo').map(a => a.athleteId || a.id)
          : alunosSelecionados;

        if (alunosParaAtribuir.length > 0) {
          await PlanosService.assignPlanToAthletes(planId, alunosParaAtribuir);
        }
      }

      let mensagemAlunos = '';
      if (aplicarTodosAlunos) {
        const alunosAtivos = alunos.filter(a => a.status === 'Ativo').length;
        mensagemAlunos = ` e aplicado a todos os ${alunosAtivos} alunos ativos`;
      } else if (alunosSelecionados.length > 0) {
        mensagemAlunos = ` e aplicado a ${alunosSelecionados.length} aluno(s)`;
      }

      toast.success('✅ Plano salvo com sucesso', {
        description: `O plano "${nomePlano}" foi criado${mensagemAlunos}.`,
      });

      // Limpar formulário
      setNomePlano('');
      setCategoria('');
      setDuracao('4');
      setDiasPorSemana('4');
      setProgramacao({});
      setAlunosSelecionados([]);
      setAplicarTodosAlunos(false);
      
      // Voltar se callback fornecido
      if (onVoltar) {
        setTimeout(() => onVoltar(), 1500);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Erro ao salvar plano', {
        description: 'Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTreinoConfig = (tipo: TipoTreino | null) => {
    return tiposTreino.find((t) => t.tipo === tipo);
  };

  const getResumo = () => {
    const contagem: { [key: string]: number } = {};
    Object.values(programacao).forEach((detalhe) => {
      if (detalhe?.tipo) {
        contagem[detalhe.tipo] = (contagem[detalhe.tipo] || 0) + 1;
      }
    });
    return contagem;
  };

  const adicionarIntervalo = () => {
    setIntervalos([...intervalos, { valor: '', zona: 'Z2' }]);
  };

  const removerIntervalo = (index: number) => {
    setIntervalos(intervalos.filter((_, i) => i !== index));
  };

  const atualizarIntervalo = (index: number, field: 'valor' | 'zona', value: string) => {
    const novosIntervalos = [...intervalos];
    novosIntervalos[index] = {
      ...novosIntervalos[index],
      [field]: value,
    };
    setIntervalos(novosIntervalos);
  };

  const resumo = getResumo();
  const semanas = Array.from({ length: Number(duracao) }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Criar Novo Plano de Treino
          </CardTitle>
          <CardDescription>
            Configure os detalhes e a programação semanal do plano de treino
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome do Plano <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Preparação 10K Intermediário"
                value={nomePlano}
                onChange={(e) => setNomePlano(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                  <SelectItem value="5K">5K</SelectItem>
                  <SelectItem value="10K">10K</SelectItem>
                  <SelectItem value="Meia Maratona">Meia Maratona</SelectItem>
                  <SelectItem value="Maratona">Maratona</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (semanas)</Label>
              <Select value={duracao} onValueChange={setDuracao}>
                <SelectTrigger id="duracao">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} semanas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dias">Dias por Semana</Label>
              <Select value={diasPorSemana} onValueChange={setDiasPorSemana}>
                <SelectTrigger id="dias">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} dias
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">ℹ️ Privacidade:</span> As informações do plano serão
              utilizadas apenas para gestão de treinos. Os dados dos alunos são visíveis apenas
              para o professor responsável.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Atribuir Plano aos Alunos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Atribuir Plano aos Alunos
          </CardTitle>
          <CardDescription>
            Selecione os alunos que receberão este plano de treino
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Ações lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seleção de alunos específicos */}
              <div className="space-y-2">
                <Label>Selecionar Alunos Específicos</Label>
                <Popover open={popoverAberto} onOpenChange={setPopoverAberto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={aplicarTodosAlunos}
                    >
                      <span>
                        {alunosSelecionados.length === 0
                          ? 'Selecionar alunos'
                          : `${alunosSelecionados.length} aluno(s) selecionado(s)`}
                      </span>
                      <Users className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="p-4 border-b">
                      <h4 className="text-sm">Selecionar Alunos</h4>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 space-y-2">
                        {alunos.map((aluno) => (
                          <div
                            key={aluno.id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleToggleAluno(aluno.id)}
                          >
                            <Checkbox
                              id={`aluno-criar-${aluno.id}`}
                              checked={alunosSelecionados.includes(aluno.id)}
                              onCheckedChange={() => handleToggleAluno(aluno.id)}
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            />
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={aluno.foto} alt={aluno.nome} />
                              <AvatarFallback>{aluno.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{aluno.nome}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-xs">
                                  {aluno.nivel}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
                      <p className="text-xs text-gray-600">
                        {alunosSelecionados.length} selecionado(s)
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAlunosSelecionados([])}
                      >
                        Limpar
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Aplicar a todos os alunos */}
              <div className="space-y-2">
                <Label>Aplicar a Todos</Label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 h-10">
                  <Checkbox
                    id="todos-alunos"
                    checked={aplicarTodosAlunos}
                    onCheckedChange={(checked: boolean) => {
                      setAplicarTodosAlunos(checked as boolean);
                      if (checked) {
                        setAlunosSelecionados([]);
                      }
                    }}
                  />
                  <Label
                    htmlFor="todos-alunos"
                    className="text-sm cursor-pointer flex-1"
                  >
                    Aplicar a todos os alunos ({alunos.length})
                  </Label>
                </div>
              </div>
            </div>

            {/* Mostrar alunos selecionados */}
            {!aplicarTodosAlunos && alunosSelecionados.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Alunos Selecionados:</Label>
                <div className="flex flex-wrap gap-2">
                  {alunosSelecionados.map((alunoId) => {
                    const aluno = alunos.find(a => a.id === alunoId);
                    if (!aluno) return null;
                    return (
                      <Badge key={alunoId} variant="secondary" className="flex items-center gap-1">
                        {aluno.nome}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-600" 
                          onClick={() => handleToggleAluno(alunoId)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Programação Semanal - Todas as semanas */}
      <Card>
        <CardHeader>
          <CardTitle>Programação Semanal</CardTitle>
          <CardDescription>
            Todas as {duracao} semanas • Clique nos dias para adicionar treinos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {semanas.map((semana) => (
              <div key={semana} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Badge variant="outline">Semana {semana}</Badge>
                </div>
                <div className="grid grid-cols-7 gap-3">
                  {diasSemana.map((dia) => {
                    const key = `semana${semana}-${dia}`;
                    const treinoNoDia = programacao[key];
                    const config = treinoNoDia ? getTreinoConfig(treinoNoDia.tipo) : null;

                    return (
                      <div key={dia} className="text-center">
                        <p className="text-xs text-gray-600 mb-2">{dia}</p>
                        <div className="relative">
                          <button
                            onClick={() => handleDiaClick(semana, dia)}
                            className={`w-full aspect-square rounded-lg border-2 transition-all ${
                              config
                                ? config.cor + ' border-transparent'
                                : tipoSelecionado
                                ? 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                            aria-label={`${dia} - ${treinoNoDia?.tipo || 'Vazio'}`}
                          >
                            {config ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center justify-center h-full p-1">
                                      <config.icon className="w-5 h-5 mb-1" />
                                      <p className="text-xs leading-tight line-clamp-2">{config.tipo}</p>
                                      {treinoNoDia?.valor && (
                                        <p className="text-xs mt-1 opacity-75">
                                          {treinoNoDia.valor}{treinoNoDia.medida === 'KM' ? 'km' : 'min'}
                                        </p>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <div className="space-y-1">
                                      <p className="font-medium">{treinoNoDia?.tipo}</p>
                                      
                                      {/* Prova/Teste */}
                                      {treinoNoDia?.tipoProvaTeste && (
                                        <>
                                          <p className="text-xs">Tipo: {treinoNoDia.tipoProvaTeste}</p>
                                          {treinoNoDia.tipoProvaTeste === 'Prova' && treinoNoDia.provaId && (
                                            <p className="text-xs">
                                              Prova: {provas.find(p => p.id === treinoNoDia.provaId)?.nome}
                                            </p>
                                          )}
                                          {treinoNoDia.tipoProvaTeste === 'Teste' && treinoNoDia.tipoTeste && (
                                            <>
                                              <p className="text-xs">Teste: {treinoNoDia.tipoTeste}</p>
                                              <p className="text-xs">Zona: Z4 (Limiar)</p>
                                            </>
                                          )}
                                        </>
                                      )}
                                      
                                      {/* Intervalado */}
                                      {treinoNoDia?.tempoDescanso && (
                                        <p className="text-xs">Descanso: {treinoNoDia.tempoDescanso.replace(':', '\'')}&#34;</p>
                                      )}
                                      
                                      {/* Valor e Zona (outros tipos) */}
                                      {treinoNoDia?.valor && !treinoNoDia?.tipoProvaTeste && (
                                        <p className="text-xs">
                                          {treinoNoDia.valor} {treinoNoDia.medida === 'KM' ? 'km' : 'minutos'}
                                        </p>
                                      )}
                                      {treinoNoDia?.zona && !treinoNoDia?.tipoProvaTeste && (
                                        <p className="text-xs">Zona: {treinoNoDia.zona}</p>
                                      )}
                                      
                                      {/* Descrição */}
                                      {treinoNoDia?.descricao && (
                                        <p className="text-xs">{treinoNoDia.descricao}</p>
                                      )}
                                      
                                      {/* Intervalos (Fartlek) */}
                                      {treinoNoDia?.intervalos && treinoNoDia.intervalos.length > 0 && (
                                        <div className="text-xs">
                                          <p className="font-medium">Intervalos:</p>
                                          {treinoNoDia.intervalos.map((int, idx) => (
                                            <p key={idx}>• {int.valor} ({int.zona})</p>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-2xl text-gray-300">+</span>
                              </div>
                            )}
                          </button>
                          {treinoNoDia && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverTreino(semana, dia);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                              aria-label="Remover treino"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>


        </CardContent>
      </Card>

      {/* Resumo do Plano */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Plano</CardTitle>
          <CardDescription>Visão geral da distribuição de treinos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tiposTreino.map((tipo) => {
              const quantidade = resumo[tipo.tipo] || 0;
              const Icon = tipo.icon;

              return (
                <div key={tipo.tipo} className={`p-4 rounded-lg border-2 ${tipo.cor}`}>
                  <Icon className="w-5 h-5 mb-2" />
                  <p className="text-sm mb-1">{tipo.tipo}</p>
                  <p className="text-2xl">{quantidade}</p>
                  <p className="text-xs mt-1">treinos</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total de Semanas</p>
              <p className="text-2xl text-gray-900">{duracao}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Treinos Programados</p>
              <p className="text-2xl text-gray-900">{Object.values(programacao).filter(Boolean).length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Dias por Semana</p>
              <p className="text-2xl text-gray-900">{diasPorSemana}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações - Fixo na tela */}
      <div className="sticky bottom-0 z-10 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 justify-between p-4">
            <div>
              {onVoltar && (
                <Button variant="outline" onClick={onVoltar}>
                  Cancelar
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Plano
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de Customização */}
      <Dialog open={showCustomizacao} onOpenChange={setShowCustomizacao}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {tipoTreinoModal ? `Personalizar Treino - ${tipoTreinoModal}` : 'Adicionar Treino'}
            </DialogTitle>
            <DialogDescription>
              {tipoTreinoModal 
                ? 'Configure os detalhes específicos deste treino'
                : 'Selecione o tipo de treino que deseja adicionar'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Seleção do Tipo de Treino */}
            {!tipoTreinoModal && (
              <div className="space-y-3">
                <Label>Selecione o Tipo de Treino</Label>
                <div className="grid grid-cols-2 gap-3">
                  {tiposTreino.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <button
                        key={tipo.tipo}
                        onClick={() => setTipoTreinoModal(tipo.tipo)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${tipo.cor} hover:opacity-80`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <p className="text-sm">{tipo.tipo}</p>
                        <p className="text-xs mt-1 opacity-75">{tipo.descricao}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botão para voltar à seleção */}
            {tipoTreinoModal && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTipoTreinoModal(null)}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Alterar Tipo de Treino
              </Button>
            )}

            {/* PROVA/TESTE */}
            {tipoTreinoModal === 'Prova/Teste' && (
              <>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={tipoProvaTeste} onValueChange={(value: any) => setTipoProvaTeste(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prova">Prova</SelectItem>
                      <SelectItem value="Teste">Teste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tipoProvaTeste === 'Prova' && (
                  <div className="space-y-2">
                    <Label htmlFor="prova">Selecione a Prova</Label>
                    <Select value={provaId} onValueChange={setProvaId}>
                      <SelectTrigger id="prova">
                        <SelectValue placeholder="Escolha uma prova cadastrada" />
                      </SelectTrigger>
                      <SelectContent>
                        {provas.map((prova) => (
                          <SelectItem key={prova.id} value={prova.id}>
                            {prova.nome} - {prova.distancias.join(', ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {tipoProvaTeste === 'Teste' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tipoTeste">Tipo de Teste</Label>
                      <Select value={tipoTeste} onValueChange={(value: any) => setTipoTeste(value)}>
                        <SelectTrigger id="tipoTeste">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12min">12 minutos</SelectItem>
                          <SelectItem value="3km">3km</SelectItem>
                          <SelectItem value="5km">5km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-900">
                        <span className="font-medium">Zona:</span> Z4 (Limiar) - Pré-selecionada para testes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricaoTeste">Descrição</Label>
                      <Textarea
                        id="descricaoTeste"
                        placeholder="Ex: Realizar em pista, aquecimento de 10min..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* INTERVALADO */}
            {tipoTreinoModal === 'Intervalado' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tempoDescanso">Tempo de Descanso</Label>
                  <Select value={tempoDescanso} onValueChange={setTempoDescanso}>
                    <SelectTrigger id="tempoDescanso">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:00">1'00&quot;</SelectItem>
                      <SelectItem value="1:30">1'30&quot;</SelectItem>
                      <SelectItem value="2:00">2'00&quot;</SelectItem>
                      <SelectItem value="2:30">2'30&quot;</SelectItem>
                      <SelectItem value="3:00">3'00&quot;</SelectItem>
                      <SelectItem value="3:30">3'30&quot;</SelectItem>
                      <SelectItem value="4:00">4'00&quot;</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zona">Zona de Intensidade</Label>
                  <Select value={zona} onValueChange={(value: any) => setZona(value)}>
                    <SelectTrigger id="zona">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Z1">Z1 - Recuperação</SelectItem>
                      <SelectItem value="Z2">Z2 - Aeróbico Leve</SelectItem>
                      <SelectItem value="Z3">Z3 - Aeróbico Moderado</SelectItem>
                      <SelectItem value="Z4">Z4 - Limiar</SelectItem>
                      <SelectItem value="Z5">Z5 - VO2 Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoIntervalado">Descrição</Label>
                  <Textarea
                    id="descricaoIntervalado"
                    placeholder="Ex: 10x400m com descanso entre cada tiro..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* LONGÃO */}
            {tipoTreinoModal === 'Longão' && (
              <>
                <div className="space-y-2">
                  <Label>Tipo de Medida</Label>
                  <RadioGroup value={medida} onValueChange={(value: any) => setMedida(value)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="KM" id="km-longao" />
                        <Label htmlFor="km-longao" className="cursor-pointer">Distância (KM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tempo" id="tempo-longao" />
                        <Label htmlFor="tempo-longao" className="cursor-pointer">Tempo (minutos)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorLongao">
                    {medida === 'KM' ? 'Distância (KM)' : 'Tempo (minutos)'}
                  </Label>
                  <Input
                    id="valorLongao"
                    type="number"
                    placeholder={medida === 'KM' ? 'Ex: 15' : 'Ex: 90'}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zonaLongao">Zona de Treino</Label>
                  <Select value={zona} onValueChange={(value: any) => setZona(value)}>
                    <SelectTrigger id="zonaLongao">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Z1">Z1 - Recuperação</SelectItem>
                      <SelectItem value="Z2">Z2 - Aeróbico Leve</SelectItem>
                      <SelectItem value="Z3">Z3 - Aeróbico Moderado</SelectItem>
                      <SelectItem value="Z4">Z4 - Limiar</SelectItem>
                      <SelectItem value="Z5">Z5 - VO2 Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoLongao">Descrição / Observações</Label>
                  <Textarea
                    id="descricaoLongao"
                    placeholder="Ex: Manter ritmo confortável, hidratar a cada 5km..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* CORRIDA CONTÍNUA */}
            {tipoTreinoModal === 'Corrida Contínua' && (
              <>
                <div className="space-y-2">
                  <Label>Tipo de Medida</Label>
                  <RadioGroup value={medida} onValueChange={(value: any) => setMedida(value)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="KM" id="km" />
                        <Label htmlFor="km" className="cursor-pointer">Quilômetros (KM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tempo" id="tempo" />
                        <Label htmlFor="tempo" className="cursor-pointer">Tempo (minutos)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">
                    {medida === 'KM' ? 'Distância (KM)' : 'Duração (minutos)'}
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder={medida === 'KM' ? 'Ex: 10' : 'Ex: 45'}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zona">Zona de Treino</Label>
                  <Select value={zona} onValueChange={(value: any) => setZona(value)}>
                    <SelectTrigger id="zona">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Z1">Z1 - Recuperação</SelectItem>
                      <SelectItem value="Z2">Z2 - Aeróbico Leve</SelectItem>
                      <SelectItem value="Z3">Z3 - Aeróbico Moderado</SelectItem>
                      <SelectItem value="Z4">Z4 - Limiar</SelectItem>
                      <SelectItem value="Z5">Z5 - VO2 Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição / Observações</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Ex: Manter ritmo constante, focar na respiração..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* FARTLEK */}
            {tipoTreinoModal === 'Fartlek' && (
              <>
                <div className="space-y-2">
                  <Label>Tipo de Medida</Label>
                  <RadioGroup value={medida} onValueChange={(value: any) => setMedida(value)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="KM" id="km-fartlek" />
                        <Label htmlFor="km-fartlek" className="cursor-pointer">Quilômetros (KM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tempo" id="tempo-fartlek" />
                        <Label htmlFor="tempo-fartlek" className="cursor-pointer">Tempo (minutos)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Intervalos de Treino</Label>
                    <Button variant="outline" size="sm" onClick={adicionarIntervalo}>
                      <Plus className="w-3 h-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {intervalos.map((intervalo, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">
                          {medida === 'KM' ? 'Distância (KM)' : 'Tempo (min)'}
                        </Label>
                        <Input
                          type="number"
                          placeholder={medida === 'KM' ? '2' : '10'}
                          value={intervalo.valor}
                          onChange={(e) => atualizarIntervalo(index, 'valor', e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Zona</Label>
                        <Select 
                          value={intervalo.zona} 
                          onValueChange={(value: any) => atualizarIntervalo(index, 'zona', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Z1">Z1</SelectItem>
                            <SelectItem value="Z2">Z2</SelectItem>
                            <SelectItem value="Z3">Z3</SelectItem>
                            <SelectItem value="Z4">Z4</SelectItem>
                            <SelectItem value="Z5">Z5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {intervalos.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removerIntervalo(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoFartlek">Descrição / Observações</Label>
                  <Textarea
                    id="descricaoFartlek"
                    placeholder="Ex: Alternar ritmos conforme sensação..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSalvarCustomizacao}>
              Adicionar Treino
            </Button>
            <Button variant="outline" onClick={() => setShowCustomizacao(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pré-visualização do Plano</DialogTitle>
            <DialogDescription>
              Revise as informações antes de salvar o plano
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome do Plano</Label>
              <p className="text-gray-900">{nomePlano || 'Não informado'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <p className="text-gray-900">{categoria || 'Não informada'}</p>
              </div>
              <div>
                <Label>Duração</Label>
                <p className="text-gray-900">{duracao} semanas</p>
              </div>
            </div>
            <div>
              <Label>Resumo de Treinos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(resumo).map(([tipo, qtd]) => (
                  <Badge key={tipo} variant="outline">
                    {tipo}: {qtd}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { handleSalvar(); setShowPreview(false); }}>
              Confirmar e Salvar
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
