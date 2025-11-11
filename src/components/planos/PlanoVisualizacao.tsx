import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, FileText, Activity, ChevronDown, Heart, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { planosMock, alunosMock } from '../../lib/mockData';
import { PlanosService, AlunosService } from '../../lib/services';

interface PlanoVisualizacaoProps {
  planoId: string;
  onVoltar: () => void;
}

// Mock de dados de desempenho do aluno
const mockDesempenho = {
  treinosRealizados: 18,
  treinosTotal: 24,
  detalhes: [
    {
      id: '1',
      data: '2024-11-01',
      tipo: 'Corrida Contínua',
      distancia: '10km',
      paceMedia: '5:30/km',
      paceMin: '5:10/km',
      paceMax: '5:50/km',
      fcMedia: 152,
      fcMin: 140,
      fcMax: 165,
      cadenciaMedia: 168,
      passadaMedia: 1.12,
      elevacaoGanho: 85,
      calorias: 620,
      fonte: 'Strava',
    },
    {
      id: '2',
      data: '2024-11-03',
      tipo: 'Intervalado',
      distancia: '8km',
      paceMedia: '4:50/km',
      paceMin: '4:20/km',
      paceMax: '5:20/km',
      fcMedia: 168,
      fcMin: 155,
      fcMax: 182,
      cadenciaMedia: 175,
      passadaMedia: 1.18,
      elevacaoGanho: 45,
      calorias: 510,
      fonte: 'Garmin',
    },
    {
      id: '3',
      data: '2024-11-05',
      tipo: 'Longão',
      distancia: '15km',
      paceMedia: '6:00/km',
      paceMin: '5:45/km',
      paceMax: '6:20/km',
      fcMedia: 145,
      fcMin: 135,
      fcMax: 158,
      cadenciaMedia: 165,
      passadaMedia: 1.08,
      elevacaoGanho: 120,
      calorias: 890,
      fonte: 'Polar',
    },
  ],
};

export function PlanoVisualizacao({ planoId, onVoltar }: PlanoVisualizacaoProps) {
  const [alunoDesempenhoAberto, setAlunoDesempenhoAberto] = useState<string | null>(null);
  const [treinosAbertos, setTreinosAbertos] = useState<{ [key: string]: boolean }>({});
  const [programacaoSemanal, setProgramacaoSemanal] = useState<any[]>([]);
  const [loadingProgramacao, setLoadingProgramacao] = useState(true);
  const [plano, setPlano] = useState<any>(null);
  const [planProgress, setPlanProgress] = useState<any>(null);
  const [alunoTrainings, setAlunoTrainings] = useState<any>(null);
  const [loadingPlano, setLoadingPlano] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingTrainings, setLoadingTrainings] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      if (!planoId) return;

      setLoadingPlano(true);
      setLoadingProgress(true);
      
      try {
        // Carregar plano, progresso e programação semanal em paralelo
        const [planoCarregado, progressoCarregado, programacaoCarregada] = await Promise.all([
          PlanosService.getPlano(planoId),
          PlanosService.getPlanProgress(planoId),
          PlanosService.getWeeklyProgramming(planoId).catch(() => ({ weeklyProgramming: [] }))
        ]);
        
        setPlano(planoCarregado);
        setPlanProgress(progressoCarregado);
        setProgramacaoSemanal(programacaoCarregada.weeklyProgramming || []);
      } catch (error) {
        console.error('Erro ao carregar dados do plano:', error);
        setPlano(null);
        setPlanProgress(null);
        setProgramacaoSemanal([]);
      } finally {
        setLoadingPlano(false);
        setLoadingProgress(false);
        setLoadingProgramacao(false);
      }
    };

    carregarDados();
  }, [planoId]);

  if (loadingPlano || loadingProgress) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">Carregando dados do plano...</p>
        </CardContent>
      </Card>
    );
  }

  if (!plano || !planProgress) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">Plano não encontrado</p>
          <Button onClick={onVoltar} className="mt-4">Voltar</Button>
        </CardContent>
      </Card>
    );
  }

  // Usar dados reais do backend
  const alunosComProgresso = planProgress.athletes || [];
  
  // Considerar como "ativos" todos que não concluíram (incluindo os que não começaram)
  const alunosAtivos = alunosComProgresso.filter((a: any) => 
    a.statusPlano === 'Ativo' || a.statusPlano === 'Não realizado'
  );
  const alunosConcluidos = alunosComProgresso.filter((a: any) => a.statusPlano === 'Concluído');
  const alunosNaoRealizados = alunosComProgresso.filter((a: any) => a.statusPlano === 'Não realizado');

  const handleToggleTreino = (treinoId: string) => {
    setTreinosAbertos(prev => ({
      ...prev,
      [treinoId]: !prev[treinoId],
    }));
  };

  const handleAbrirDesempenhoAluno = async (alunoId: string) => {
    setAlunoDesempenhoAberto(alunoId);
    setLoadingTrainings(true);
    setAlunoTrainings(null);

    try {
      // Usar athleteId (não o userId) para buscar treinos
      const aluno = alunosComProgresso.find((a: any) => a.id === alunoId);
      if (aluno?.athleteId) {
        const trainingsResponse = await AlunosService.getAthleteTrainings(aluno.athleteId, planoId, 20);
        setAlunoTrainings(trainingsResponse);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos do aluno:', error);
      setAlunoTrainings(null);
    } finally {
      setLoadingTrainings(false);
    }
  };

  const renderAlunoLinha = (aluno: any) => {
    const progresso = aluno.treinosTotal > 0 
      ? Math.round((aluno.treinosRealizados / aluno.treinosTotal) * 100) 
      : 0;

    return (
      <div 
        key={aluno.id} 
        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={aluno.foto} alt={aluno.nome} />
          <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{aluno.nome}</p>
          <p className="text-xs text-gray-500">{aluno.nivel}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-900">
            {aluno.treinosRealizados}/{aluno.treinosTotal} treinos
          </p>
          <p className="text-xs text-gray-500">{progresso}% completo</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAbrirDesempenhoAluno(aluno.id)}
          disabled={aluno.treinosRealizados === 0}
        >
          Desempenho
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onVoltar}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl text-gray-900">{plano.nome}</CardTitle>
              <CardDescription className="mt-2">
                Visualização detalhada do plano de treino
              </CardDescription>
            </div>
            <Badge variant="default">{plano.status}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Informações do Plano */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Duração</p>
                <p className="text-lg text-gray-900">{plano.duracao} semanas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Dias/Semana</p>
                <p className="text-lg text-gray-900">{plano.diasPorSemana} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Alunos</p>
                <p className="text-lg text-gray-900">{plano.totalAlunos} alunos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Categoria</p>
                <p className="text-lg text-gray-900">{plano.categoria}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programação Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Programação Semanal</CardTitle>
          <CardDescription>
            Detalhes dos treinos programados por semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingProgramacao ? (
            <div className="text-center py-8 text-gray-500">
              Carregando programação...
            </div>
          ) : programacaoSemanal.length > 0 ? (
            <div className="space-y-6">
              {programacaoSemanal.map((semana) => (
                <div key={semana.week} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">Semana {semana.week}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {[
                      { key: 'monday', label: 'Seg' },
                      { key: 'tuesday', label: 'Ter' },
                      { key: 'wednesday', label: 'Qua' },
                      { key: 'thursday', label: 'Qui' },
                      { key: 'friday', label: 'Sex' },
                      { key: 'saturday', label: 'Sáb' },
                      { key: 'sunday', label: 'Dom' },
                    ].map((dia) => {
                      let treino = null;
                      if (semana[dia.key]) {
                        try {
                          treino = JSON.parse(semana[dia.key]);
                        } catch (error) {
                          console.error('Erro ao fazer parse do treino:', error, semana[dia.key]);
                          treino = null;
                        }
                      }
                      return (
                        <div key={dia.key} className="text-center">
                          <p className="text-xs text-gray-600 mb-2">{dia.label}</p>
                          <div className="min-h-[60px] p-2 border rounded-lg bg-gray-50">
                            {treino ? (
                              <div className="text-xs">
                                <p className="font-medium text-gray-900">{treino.tipo}</p>
                                {treino.distancia && (
                                  <p className="text-gray-600">{treino.distancia}</p>
                                )}
                                {treino.pace && (
                                  <p className="text-gray-600">{treino.pace}</p>
                                )}
                                {treino.valor && treino.medida && (
                                  <p className="text-gray-600">{treino.valor} {treino.medida}</p>
                                )}
                                {treino.observacoes && (
                                  <p className="text-gray-500 italic">{treino.observacoes}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">Descanso</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma programação cadastrada para este plano
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>Alunos no Plano</CardTitle>
          <CardDescription>
            Acompanhe o progresso dos alunos neste plano de treino
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">
                Todos ({alunosComProgresso.length})
              </TabsTrigger>
              <TabsTrigger value="ativos">
                Em Andamento ({alunosComProgresso.filter((a: any) => a.progressoAtual > 0 && a.progressoAtual < 100).length})
              </TabsTrigger>
              <TabsTrigger value="concluidos">
                Concluídos ({alunosConcluidos.length})
              </TabsTrigger>
              <TabsTrigger value="nao-realizados">
                Não Iniciados ({alunosNaoRealizados.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-3 mt-4">
              {alunosComProgresso.length > 0 ? (
                alunosComProgresso.map(renderAlunoLinha)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum aluno atribuído a este plano
                </div>
              )}
            </TabsContent>

            <TabsContent value="ativos" className="space-y-3 mt-4">
              {alunosComProgresso.filter((a: any) => a.progressoAtual > 0 && a.progressoAtual < 100).length > 0 ? (
                alunosComProgresso.filter((a: any) => a.progressoAtual > 0 && a.progressoAtual < 100).map(renderAlunoLinha)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum aluno com progresso em andamento
                </div>
              )}
            </TabsContent>

            <TabsContent value="concluidos" className="space-y-3 mt-4">
              {alunosConcluidos.length > 0 ? (
                alunosConcluidos.map(renderAlunoLinha)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum aluno concluiu este plano
                </div>
              )}
            </TabsContent>

            <TabsContent value="nao-realizados" className="space-y-3 mt-4">
              {alunosNaoRealizados.length > 0 ? (
                alunosNaoRealizados.map(renderAlunoLinha)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Todos os alunos estão realizando os treinos
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sheet de Desempenho do Aluno */}
      <Sheet open={!!alunoDesempenhoAberto} onOpenChange={(open: boolean) => !open && setAlunoDesempenhoAberto(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Desempenho Detalhado
            </SheetTitle>
            <SheetDescription>
              {alunoDesempenhoAberto && alunosComProgresso.find((a: any) => a.id === alunoDesempenhoAberto)?.nome}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Resumo */}
            {(() => {
              const alunoSelecionado = alunoDesempenhoAberto 
                ? alunosComProgresso.find((a: any) => a.id === alunoDesempenhoAberto) 
                : null;
              
              return (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-gray-500 mb-1">Treinos Realizados</p>
                      <p className="text-2xl text-gray-900">
                        {alunoSelecionado?.treinosRealizados || 0}/{alunoSelecionado?.treinosTotal || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-gray-500 mb-1">Taxa de Conclusão</p>
                      <p className="text-2xl text-gray-900">
                        {alunoSelecionado?.progressoAtual || 0}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}

            {/* Lista de Treinos */}
            <div>
              <h3 className="text-sm text-gray-900 mb-3">Histórico de Treinos</h3>
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-2 pr-4">
                  {loadingTrainings ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">
                        Carregando treinos...
                      </p>
                    </div>
                  ) : !alunoTrainings?.trainings || alunoTrainings.trainings.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        Nenhum treino realizado ainda
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Os treinos aparecerão aqui quando forem completados
                      </p>
                    </div>
                  ) : (
                    alunoTrainings.trainings.map((treino: any) => (
                      <Card key={treino.id}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-sm text-gray-900">{treino.tipo}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(treino.data).toLocaleDateString('pt-BR')}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{treino.distancia}</Badge>
                                {treino.pace && treino.pace !== '-' && (
                                  <Badge variant="outline">Pace: {treino.pace}</Badge>
                                )}
                                {treino.duracao && treino.duracao !== '-' && (
                                  <Badge variant="outline">{treino.duracao}</Badge>
                                )}
                                <Badge 
                                  variant={treino.status === 'COMPLETED' ? 'default' : treino.status === 'MISSED' ? 'destructive' : 'secondary'}
                                >
                                  {treino.status === 'COMPLETED' ? 'Concluído' : 
                                   treino.status === 'MISSED' ? 'Perdido' : 'Pendente'}
                                </Badge>
                              </div>
                              {treino.notes && (
                                <p className="text-xs text-gray-500 mt-2">{treino.notes}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
