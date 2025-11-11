import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, TrendingUp, Calendar, Clock, Activity, Award, Heart, Target, Utensils, Moon, Cigarette, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Aluno } from '../../types';
import { AlunosService, TestesService } from '../../lib/services';
import { toast } from 'sonner';

interface AlunoPerfilProps {
  aluno: Aluno;
  onVoltar: () => void;
}

interface DadosEvolucao {
  semana: string;
  corridas: number;
  tempoMedio: number;
}

interface PlanoHistorico {
  id: string;
  nome: string;
  periodo: string;
  conclusao: number;
  status: string;
}

export function AlunoPerfil({ aluno, onVoltar }: AlunoPerfilProps) {
  // States for real data
  const [dadosEvolucao, setDadosEvolucao] = useState<DadosEvolucao[]>([]);
  const [historicoplanos, setHistoricoPlanos] = useState<PlanoHistorico[]>([]);
  const [testesFisicos, setTestesFisicos] = useState<any[]>([]);
  const [estatisticasTestes, setEstatisticasTestes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTestes, setLoadingTestes] = useState(false);

  // Load real data on component mount
  useEffect(() => {
    const loadAthleteData = async () => {
      try {
        setLoading(true);
        
        // Load evolution data (use athlete ID for API call)
        const athleteId = aluno.athleteId || aluno.id;
        
        const [evolutionResponse, planHistoryResponse, testsResponse, statsResponse] = await Promise.all([
          AlunosService.getAthleteEvolution(athleteId),
          AlunosService.getAthletePlanHistory(athleteId),
          TestesService.getAthleteTests(athleteId),
          TestesService.getAthleteStats(athleteId)
        ]);

        setDadosEvolucao(evolutionResponse.evolution || []);
        setHistoricoPlanos(planHistoryResponse.planHistory || []);
        setTestesFisicos(testsResponse.tests || []);
        setEstatisticasTestes(statsResponse.stats || []);
        
      } catch (error) {
        console.error('Error loading athlete data:', error);
        toast.error('Erro ao carregar dados do atleta');
        
        // Fallback to mock data if API fails
        setDadosEvolucao([
          { semana: 'Sem 1', corridas: 0, tempoMedio: 0 },
          { semana: 'Sem 2', corridas: 0, tempoMedio: 0 },
          { semana: 'Sem 3', corridas: 0, tempoMedio: 0 },
          { semana: 'Sem 4', corridas: 0, tempoMedio: 0 },
          { semana: 'Sem 5', corridas: 0, tempoMedio: 0 },
          { semana: 'Sem 6', corridas: 0, tempoMedio: 0 },
        ]);
        setHistoricoPlanos([]);
      } finally {
        setLoading(false);
      }
    };

    if (aluno) {
      loadAthleteData();
    }
  }, [aluno]);

  const getBadgeVariant = (status: string) => {
    return status === 'Ativo' ? 'default' : 'secondary';
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Iniciante':
        return 'bg-green-100 text-green-700';
      case 'Intermediário':
        return 'bg-blue-100 text-blue-700';
      case 'Avançado':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onVoltar} className="w-fit mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Alunos
          </Button>

          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={aluno.foto} alt={aluno.nome} />
              <AvatarFallback className="text-2xl">{aluno.nome.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">{aluno.nome}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={getBadgeVariant(aluno.status)}>{aluno.status}</Badge>
                    <Badge className={getNivelColor(aluno.nivel)}>{aluno.nivel}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-900">{aluno.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Idade</p>
                      <p className="text-gray-900">{aluno.idade} anos</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => toast.success('Aplicando novo plano ao aluno...')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Aplicar Novo Plano
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Plano Atual e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plano Atual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aluno.planoAtual ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg text-gray-900">{aluno.planoAtual}</h3>
                    <Badge variant="outline">Em Andamento</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Aplicado por Carlos Silva em 15/10/2024
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">Progresso do Plano</p>
                    <p className="text-sm text-gray-900">{aluno.progressoAtual}%</p>
                  </div>
                  <Progress value={aluno.progressoAtual} className="h-3 mb-2" />
                  <p className="text-xs text-gray-500">
                    {aluno.treinosConcluidos} de 32 treinos concluídos
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600 mb-2" />
                    <p className="text-xs text-blue-600 mb-1">Treinos/Semana</p>
                    <p className="text-lg text-blue-900">4</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600 mb-2" />
                    <p className="text-xs text-green-600 mb-1">Tempo Médio</p>
                    <p className="text-lg text-green-900">{aluno.tempoMedio}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-orange-600 mb-2" />
                    <p className="text-xs text-orange-600 mb-1">Ritmo Médio</p>
                    <p className="text-lg text-orange-900">{aluno.ritmoMedio}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Nenhum plano aplicado no momento</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Aplicar Plano de Treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo de Desempenho */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total de Treinos</p>
              <p className="text-3xl text-gray-900">{aluno.treinosConcluidos}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-1">Tempo Médio</p>
              <p className="text-2xl text-gray-900">{aluno.tempoMedio}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-1">Ritmo Médio</p>
              <p className="text-2xl text-gray-900">{aluno.ritmoMedio}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-1">Nível</p>
              <Badge className={getNivelColor(aluno.nivel) + ' text-base py-1'}>
                {aluno.nivel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolução de Desempenho
          </CardTitle>
          <CardDescription>
            Acompanhamento das últimas 6 semanas
            <br />
            <span className="text-xs text-gray-500">Dados coletados dos treinos registrados pelo aluno</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando dados de evolução...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosEvolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="corridas"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Corridas"
                />
                <Line
                  type="monotone"
                  dataKey="tempoMedio"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Tempo (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Histórico de Planos Anteriores
          </CardTitle>
          <CardDescription>Planos de treino já aplicados a este aluno</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando histórico...</span>
            </div>
          ) : historicoplanos.length > 0 ? (
            <div className="space-y-4">
              {historicoplanos.map((plano) => (
                <div
                  key={plano.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900">{plano.nome}</h4>
                      <Badge variant={plano.status === 'Concluído' ? 'default' : 'secondary'}>
                        {plano.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{plano.periodo}</p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-600">Taxa de Conclusão</p>
                        <p className="text-xs text-gray-900">{plano.conclusao}%</p>
                      </div>
                      <Progress value={plano.conclusao} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum plano anterior encontrado</p>
              <p className="text-sm text-gray-500 mt-1">Os planos aplicados a este atleta aparecerão aqui</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">ℹ️ Responsabilidade:</span> Nome do professor que aplicou
              cada plano é registrado para rastreabilidade e controle de qualidade.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Complementares */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Complementares do Atleta</CardTitle>
          <CardDescription>
            Histórico médico, treinamento, estilo de vida e histórico familiar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="historico-medico" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="historico-medico">
                <Heart className="w-4 h-4 mr-2" />
                Histórico Médico
              </TabsTrigger>
              <TabsTrigger value="historico-treinamento">
                <Target className="w-4 h-4 mr-2" />
                Histórico de Treino
              </TabsTrigger>
              <TabsTrigger value="testes-fisicos">
                <Activity className="w-4 h-4 mr-2" />
                Testes Físicos
              </TabsTrigger>
              <TabsTrigger value="estilo-vida">
                <Utensils className="w-4 h-4 mr-2" />
                Estilo de Vida
              </TabsTrigger>
              <TabsTrigger value="historico-familiar">
                <UsersIcon className="w-4 h-4 mr-2" />
                Histórico Familiar
              </TabsTrigger>
            </TabsList>

            {/* Histórico Médico */}
            <TabsContent value="historico-medico" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lesões Anteriores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Tendinite no Joelho Esquerdo</p>
                      <p className="text-xs text-gray-600">Data: Março 2023 • Recuperado</p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Fascite Plantar</p>
                      <p className="text-xs text-gray-600">Data: Agosto 2022 • Recuperado</p>
                    </div>
                    <p className="text-xs text-gray-500 pt-2">Nenhuma lesão ativa no momento</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Doenças Crônicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Nenhuma doença crônica registrada</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cirurgias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Apendicectomia</p>
                      <p className="text-xs text-gray-600">Data: Janeiro 2019</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Alergias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pólen</Badge>
                      <Badge variant="outline">Poeira</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Medicamentos: Nenhum registrado</p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">🔒 Privacidade:</span> Informações médicas são confidenciais e
                  visíveis apenas para o professor responsável. Utilizadas exclusivamente para planejamento de treinos seguros.
                </p>
              </div>
            </TabsContent>

            {/* Histórico de Treinamento */}
            <TabsContent value="historico-treinamento" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tempo de Prática</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Corrida de Rua</p>
                        <p className="text-2xl text-gray-900">2 anos e 6 meses</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Início da Prática</p>
                        <p className="text-lg text-gray-900">Maio de 2022</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Frequência Semanal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Média Atual</p>
                        <p className="text-2xl text-gray-900">4-5 treinos/semana</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Volume Semanal</p>
                        <p className="text-lg text-gray-900">35-45 km/semana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distâncias Preferidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm text-gray-900">10K</span>
                        <Badge>Favorita</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">5K</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">Meia Maratona</span>
                        <Badge variant="outline">Meta</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Objetivos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Curto Prazo (3 meses)</p>
                      <p className="text-xs text-gray-600">Completar 10K em menos de 50 minutos</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Médio Prazo (6-12 meses)</p>
                      <p className="text-xs text-gray-600">Primeira meia maratona</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Testes Físicos */}
            <TabsContent value="testes-fisicos" className="space-y-4 mt-4">
              {loadingTestes ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Carregando testes físicos...</span>
                </div>
              ) : (
                <>
                  {/* Estatísticas por Tipo de Teste */}
                  {estatisticasTestes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {estatisticasTestes.map((stat) => {
                        const testTypeNames = {
                          'TWELVE_MINUTES': '12 Minutos',
                          'THREE_KM': '3km',
                          'FIVE_KM': '5km'
                        };
                        
                        const testTypeName = testTypeNames[stat.testType as keyof typeof testTypeNames] || stat.testType;
                        
                        return (
                          <Card key={stat.testType}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600" />
                                {testTypeName}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Total de Testes</p>
                                  <p className="text-2xl text-gray-900">{stat.count}</p>
                                </div>
                                
                                {stat.improvement !== null && (
                                  <>
                                    <Separator />
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Evolução</p>
                                      <div className="flex items-center gap-2">
                                        <p className={`text-lg font-semibold ${stat.improvement > 0 ? 'text-green-600' : stat.improvement < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                          {stat.improvement > 0 ? '+' : ''}{stat.improvement.toFixed(1)}%
                                        </p>
                                        {stat.improvement > 0 && <TrendingUp className="w-4 h-4 text-green-600" />}
                                        {stat.improvement < 0 && <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {stat.testType === 'TWELVE_MINUTES' 
                                          ? 'Distância percorrida' 
                                          : 'Tempo de conclusão'
                                        }
                                      </p>
                                    </div>
                                  </>
                                )}
                                
                                {stat.tests && stat.tests.length > 0 && (
                                  <>
                                    <Separator />
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Último Teste</p>
                                      <p className="text-sm text-gray-900">
                                        {new Date(stat.tests[stat.tests.length - 1].testDate).toLocaleDateString('pt-BR')}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {stat.testType === 'TWELVE_MINUTES' 
                                          ? `${stat.tests[stat.tests.length - 1].distance?.toFixed(2)}m` 
                                          : `${stat.tests[stat.tests.length - 1].finalTime}`
                                        }
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Lista de Testes Recentes */}
                  {testesFisicos.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Histórico de Testes</CardTitle>
                        <CardDescription>
                          Últimos testes físicos realizados
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {testesFisicos.slice(0, 10).map((teste) => {
                            const testTypeNames = {
                              'TWELVE_MINUTES': '12 Minutos',
                              'THREE_KM': '3km', 
                              'FIVE_KM': '5km'
                            };
                            
                            const testTypeName = testTypeNames[teste.testType as keyof typeof testTypeNames] || teste.testType;
                            
                            return (
                              <div key={teste.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-full">
                                    <Activity className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">{testTypeName}</h4>
                                    <p className="text-xs text-gray-500">
                                      {new Date(teste.testDate).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    {teste.testType === 'TWELVE_MINUTES' 
                                      ? `${teste.distance?.toFixed(2)}m` 
                                      : teste.finalTime
                                    }
                                  </p>
                                  {teste.pace && (
                                    <p className="text-xs text-gray-500">
                                      Pace: {teste.pace}/km
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">Nenhum teste físico registrado</p>
                      <p className="text-sm text-gray-500 mt-1">Os testes realizados pelo atleta aparecerão aqui</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Estilo de Vida */}
            <TabsContent value="estilo-vida" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-orange-600" />
                      Alimentação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Tipo de Dieta</p>
                      <Badge className="bg-green-100 text-green-700">Balanceada</Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Restrições Alimentares</p>
                      <p className="text-sm text-gray-900">Nenhuma</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Hidratação</p>
                      <p className="text-sm text-gray-900">2-3 litros/dia</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suplementação</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline">Whey Protein</Badge>
                        <Badge variant="outline">BCAA</Badge>
                        <Badge variant="outline">Vitamina D</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-600" />
                      Sono e Recuperação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Horas de Sono</p>
                      <p className="text-2xl text-gray-900">7-8 horas/noite</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Qualidade do Sono</p>
                      <Badge className="bg-green-100 text-green-700">Boa</Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Recuperação Ativa</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline">Alongamento</Badge>
                        <Badge variant="outline">Yoga</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cigarette className="w-4 h-4 text-red-600" />
                      Hábitos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-900">Fumante</span>
                      <Badge className="bg-green-100 text-green-700">Não</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm text-gray-900">Consumo de Álcool</span>
                      <Badge className="bg-yellow-100 text-yellow-700">Ocasional</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mt-2">
                        Ocasional: 1-2 vezes por mês, socialmente
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rotina Diária</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Ocupação Principal</p>
                      <p className="text-sm text-gray-900">Profissional de TI (Trabalho sentado)</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Nível de Estresse</p>
                      <Badge className="bg-yellow-100 text-yellow-700">Moderado</Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Horário Preferido para Treinos</p>
                      <p className="text-sm text-gray-900">Manhã (06:00 - 07:30)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Histórico Familiar */}
            <TabsContent value="historico-familiar" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doenças Recorrentes na Família</CardTitle>
                  <CardDescription>
                    Informações importantes para prevenção e cuidados especiais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Hipertensão</p>
                      <p className="text-xs text-gray-600">Pai e avô paterno</p>
                    </div>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Diabetes Tipo 2</p>
                      <p className="text-xs text-gray-600">Avó materna</p>
                    </div>
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Problemas Cardíacos</p>
                      <p className="text-xs text-gray-600">Avô paterno</p>
                    </div>
                    <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">Obesidade</p>
                      <p className="text-xs text-gray-600">Mãe</p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900 mb-2">
                      <span className="font-medium">⚠️ Atenção:</span> Histórico familiar de hipertensão e diabetes
                    </p>
                    <p className="text-xs text-yellow-800">
                      Recomenda-se monitoramento regular da pressão arterial e glicemia. 
                      Manter estilo de vida ativo e alimentação balanceada como prevenção.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">ℹ️ Uso Responsável:</span> Estas informações são utilizadas
                      exclusivamente para adequar o planejamento de treinos e garantir a segurança do atleta.
                      Nunca são compartilhadas com terceiros.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
