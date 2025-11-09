import { useState } from 'react';
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

  const plano = planosMock.find(p => p.id === planoId);

  if (!plano) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">Plano não encontrado</p>
          <Button onClick={onVoltar} className="mt-4">Voltar</Button>
        </CardContent>
      </Card>
    );
  }

  // Mock de alunos com status no plano
  const alunosComProgresso = alunosMock.slice(0, 8).map((aluno, index) => ({
    ...aluno,
    treinosTotal: 24,
    treinosRealizados: index < 3 ? 24 : index < 6 ? Math.floor(Math.random() * 24) : 0,
    statusPlano: index < 3 ? 'Concluído' : index < 6 ? 'Ativo' : 'Não realizado',
  }));

  const alunosAtivos = alunosComProgresso.filter(a => a.statusPlano === 'Ativo');
  const alunosConcluidos = alunosComProgresso.filter(a => a.statusPlano === 'Concluído');
  const alunosNaoRealizados = alunosComProgresso.filter(a => a.statusPlano === 'Não realizado');

  const handleToggleTreino = (treinoId: string) => {
    setTreinosAbertos(prev => ({
      ...prev,
      [treinoId]: !prev[treinoId],
    }));
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
          onClick={() => setAlunoDesempenhoAberto(aluno.id)}
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

      {/* Tabs de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>Alunos no Plano</CardTitle>
          <CardDescription>
            Acompanhe o progresso dos alunos neste plano de treino
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ativos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ativos">
                Ativos ({alunosAtivos.length})
              </TabsTrigger>
              <TabsTrigger value="concluidos">
                Concluídos ({alunosConcluidos.length})
              </TabsTrigger>
              <TabsTrigger value="nao-realizados">
                Não Realizados ({alunosNaoRealizados.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ativos" className="space-y-3 mt-4">
              {alunosAtivos.length > 0 ? (
                alunosAtivos.map(renderAlunoLinha)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum aluno ativo neste plano
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
      <Sheet open={!!alunoDesempenhoAberto} onOpenChange={(open) => !open && setAlunoDesempenhoAberto(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Desempenho Detalhado
            </SheetTitle>
            <SheetDescription>
              {alunoDesempenhoAberto && alunosComProgresso.find(a => a.id === alunoDesempenhoAberto)?.nome}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Resumo */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500 mb-1">Treinos Realizados</p>
                  <p className="text-2xl text-gray-900">
                    {mockDesempenho.treinosRealizados}/{mockDesempenho.treinosTotal}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500 mb-1">Taxa de Conclusão</p>
                  <p className="text-2xl text-gray-900">
                    {Math.round((mockDesempenho.treinosRealizados / mockDesempenho.treinosTotal) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Treinos */}
            <div>
              <h3 className="text-sm text-gray-900 mb-3">Histórico de Treinos</h3>
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-2 pr-4">
                  {mockDesempenho.detalhes.map((treino) => (
                    <Collapsible
                      key={treino.id}
                      open={treinosAbertos[treino.id]}
                      onOpenChange={() => handleToggleTreino(treino.id)}
                    >
                      <Card>
                        <CollapsibleTrigger className="w-full">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Activity className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-gray-900">{treino.tipo}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(treino.data).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">{treino.distancia}</Badge>
                                <ChevronDown 
                                  className={`w-4 h-4 text-gray-400 transition-transform ${
                                    treinosAbertos[treino.id] ? 'rotate-180' : ''
                                  }`} 
                                />
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-4 border-t">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {/* Pace */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  <p className="text-xs text-gray-600">Pace</p>
                                </div>
                                <div className="pl-6 space-y-1">
                                  <p className="text-xs text-gray-500">
                                    Médio: <span className="text-gray-900">{treino.paceMedia}</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Mín: <span className="text-gray-900">{treino.paceMin}</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Máx: <span className="text-gray-900">{treino.paceMax}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Frequência Cardíaca */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-red-600" />
                                  <p className="text-xs text-gray-600">Frequência Cardíaca</p>
                                </div>
                                <div className="pl-6 space-y-1">
                                  <p className="text-xs text-gray-500">
                                    Média: <span className="text-gray-900">{treino.fcMedia} bpm</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Mín: <span className="text-gray-900">{treino.fcMin} bpm</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Máx: <span className="text-gray-900">{treino.fcMax} bpm</span>
                                  </p>
                                </div>
                              </div>

                              {/* Cadência e Passada */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-orange-600" />
                                  <p className="text-xs text-gray-600">Cadência e Passada</p>
                                </div>
                                <div className="pl-6 space-y-1">
                                  <p className="text-xs text-gray-500">
                                    Cadência: <span className="text-gray-900">{treino.cadenciaMedia} spm</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Passada: <span className="text-gray-900">{treino.passadaMedia}m</span>
                                  </p>
                                </div>
                              </div>

                              {/* Outros Dados */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-green-600" />
                                  <p className="text-xs text-gray-600">Outros Dados</p>
                                </div>
                                <div className="pl-6 space-y-1">
                                  <p className="text-xs text-gray-500">
                                    Elevação: <span className="text-gray-900">{treino.elevacaoGanho}m</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Calorias: <span className="text-gray-900">{treino.calorias} kcal</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Fonte */}
                            <div className="mt-4 pt-3 border-t">
                              <p className="text-xs text-gray-500">
                                Dados sincronizados via <span className="font-medium text-gray-900">{treino.fonte}</span>
                              </p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
