import { useState } from 'react';
import { 
  Users, FileText, Trophy, TrendingUp, Activity, Calendar, ArrowRight, 
  Info, Sparkles, Settings2, RefreshCw, X, Filter, Lightbulb, Zap, Flag, MapPin, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { alunosMock, planosMock, desafiosMock, atividadesRecentesMock, dicasDoDia, provasMock, treinosRealizadosPorMes } from '../../lib/mockData';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const MESES = [
  { numero: 1, nome: 'Janeiro', abrev: 'Jan' },
  { numero: 2, nome: 'Fevereiro', abrev: 'Fev' },
  { numero: 3, nome: 'Março', abrev: 'Mar' },
  { numero: 4, nome: 'Abril', abrev: 'Abr' },
  { numero: 5, nome: 'Maio', abrev: 'Mai' },
  { numero: 6, nome: 'Junho', abrev: 'Jun' },
  { numero: 7, nome: 'Julho', abrev: 'Jul' },
  { numero: 8, nome: 'Agosto', abrev: 'Ago' },
  { numero: 9, nome: 'Setembro', abrev: 'Set' },
  { numero: 10, nome: 'Outubro', abrev: 'Out' },
  { numero: 11, nome: 'Novembro', abrev: 'Nov' },
  { numero: 12, nome: 'Dezembro', abrev: 'Dez' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const [dicaAtual, setDicaAtual] = useState(dicasDoDia[Math.floor(Math.random() * dicasDoDia.length)]);
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [filtroAtividade, setFiltroAtividade] = useState<'todos' | 'plano' | 'desafio' | 'aluno'>('todos');
  const [showInsight, setShowInsight] = useState(false);
  const [mesSelecionadoProvas, setMesSelecionadoProvas] = useState(new Date().getMonth() + 1);

  const alunosAtivos = alunosMock.filter(a => a.status === 'Ativo').length;
  const planosAtivos = planosMock.filter(p => p.status === 'Ativo').length;
  const desafiosAtivos = desafiosMock.filter(d => d.status === 'Ativo').length;
  const taxaConclusao = 87; // Cálculo mock
  const mediaProfessores = 75; // Média mock

  const metricas = [
    { 
      label: 'Alunos Ativos', 
      valor: alunosAtivos, 
      icon: Users, 
      cor: 'text-blue-600', 
      bgCor: 'bg-blue-100',
      variacao: '+2',
      feedback: '+12% vs mês anterior',
    },
    { 
      label: 'Planos Ativos', 
      valor: planosAtivos, 
      icon: FileText, 
      cor: 'text-green-600', 
      bgCor: 'bg-green-100',
      variacao: '+1',
      feedback: '3 novos este mês',
    },
    { 
      label: 'Desafios em Andamento', 
      valor: desafiosAtivos, 
      icon: Trophy, 
      cor: 'text-orange-600', 
      bgCor: 'bg-orange-100',
      variacao: '0',
      feedback: '85% taxa de engajamento',
    },
    { 
      label: 'Taxa de Conclusão', 
      valor: `${taxaConclusao}%`, 
      icon: TrendingUp, 
      cor: 'text-purple-600', 
      bgCor: 'bg-purple-100',
      variacao: '+5%',
      feedback: `+${taxaConclusao - mediaProfessores}% vs média`,
    },
  ];

  const atalhos = [
    { label: 'Alunos', icon: Users, page: 'alunos' },
    { label: 'Planos', icon: FileText, page: 'planos' },
    { label: 'Desafios', icon: Trophy, page: 'desafios' },
    { label: 'Testes', icon: Activity, page: 'testes' },
    { label: 'Provas', icon: Flag, page: 'provas' },
  ];

  const handleGerarNovaDica = () => {
    setIsGeneratingTip(true);
    setTimeout(() => {
      const novaDica = dicasDoDia[Math.floor(Math.random() * dicasDoDia.length)];
      setDicaAtual(novaDica);
      setIsGeneratingTip(false);
      toast.success('✨ Nova dica gerada!', {
        description: 'Confira a nova recomendação baseada em boas práticas.',
      });
    }, 1500);
  };

  const handleAjustarTemas = () => {
    toast.info('⚙️ Ajustar temas', {
      description: 'Funcionalidade em desenvolvimento',
    });
  };

  const handleDesativarDicas = () => {
    toast.error('❌ Dicas desativadas', {
      description: 'Você pode reativá-las nas configurações',
    });
  };

  const handleGerarInsight = () => {
    setIsGeneratingInsight(true);
    setTimeout(() => {
      setShowInsight(true);
      setIsGeneratingInsight(false);
      toast.success('✨ Insight gerado!', {
        description: 'Análise personalizada baseada nos seus dados',
      });
    }, 2000);
  };

  const atividadesFiltradas = filtroAtividade === 'todos' 
    ? atividadesRecentesMock 
    : atividadesRecentesMock.filter(a => a.tipo === filtroAtividade);

  // Filtrar provas por mês
  const provasFiltradas = provasMock.filter(prova => 
    prova.mes === mesSelecionadoProvas && prova.ano === 2024
  );

  // Desafios ativos com detalhes
  const desafiosAtivosDetalhes = desafiosMock.filter(d => d.status === 'Ativo');

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
    }).format(data);
  };

  const formatarDataCompleta = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(data);
  };

  // Custom tooltip para o gráfico
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.mes}</p>
          <p className="text-sm text-blue-600">
            Treinos: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Alunos ativos: {payload[0].payload.alunos}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Média: {Math.round(payload[0].value / payload[0].payload.alunos)} treinos/aluno
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, idx) => {
          const Icon = metrica.icon;
          return (
            <motion.div
              key={metrica.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{metrica.label}</p>
                      <p className="text-2xl text-gray-900 mt-1">{metrica.valor}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${metrica.bgCor}`}>
                      <Icon className={`w-6 h-6 ${metrica.cor}`} />
                    </div>
                  </div>
                  {metrica.feedback && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className="text-xs text-green-600 mt-2 flex items-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" />
                      {metrica.feedback}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Dica do Dia com IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Alert className="bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -mr-16 -mt-16" />
          <div className="flex items-start gap-3 relative z-10">
            <motion.div
              animate={isGeneratingTip ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isGeneratingTip ? Infinity : 0, ease: "linear" }}
            >
              <Lightbulb className="h-5 w-5 text-blue-700 mt-0.5" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-900">💡 Dica do dia</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs bg-white/50 border-blue-300 text-blue-700 cursor-help">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Gerada automaticamente
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Essa dica é gerada com base em boas práticas e dados de treino. 
                        Você pode atualizar ou ajustar o tema.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <AlertDescription className="text-gray-700">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={dicaAtual}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dicaAtual}
                  </motion.span>
                </AnimatePresence>
              </AlertDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4 text-blue-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleGerarNovaDica} disabled={isGeneratingTip}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingTip ? 'animate-spin' : ''}`} />
                  Gerar nova dica
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAjustarTemas}>
                  <Filter className="w-4 h-4 mr-2" />
                  Ajustar temas preferidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDesativarDicas} className="text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  Desativar dicas automáticas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Alert>
      </motion.div>

      {/* Insight Personalizado Gerado */}
      <AnimatePresence>
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <Zap className="h-5 w-5 text-purple-700" />
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-purple-900">⚡ Insight Personalizado</span>
                    <Badge variant="outline" className="text-xs bg-white/50 border-purple-300 text-purple-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Baseado nos seus dados
                    </Badge>
                  </div>
                  <AlertDescription className="text-gray-700">
                    <p className="mb-2">
                      Seus alunos estão apresentando uma taxa de conclusão {taxaConclusao}% superior à média geral ({mediaProfessores}%). 
                      Continue incentivando treinos de recuperação e descanso para manter esse desempenho!
                    </p>
                    <p className="text-xs text-purple-700">
                      💡 Sugestão: Considere criar um novo desafio focado em consistência para engajar mais alunos.
                    </p>
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowInsight(false)}
                >
                  <X className="h-4 w-4 text-purple-700" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gráfico de Evolução de Treinos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolução de Treinos Realizados
          </CardTitle>
          <CardDescription>
            Acompanhe a quantidade de treinos realizados pela turma em cada mês de 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treinosRealizadosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="treinos" radius={[8, 8, 0, 0]}>
                  {treinosRealizadosPorMes.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.treinos === 0 ? '#e5e7eb' : entry.treinos < 150 ? '#f97316' : entry.treinos < 180 ? '#3b82f6' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-xs text-gray-600">Baixo (&lt; 150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-xs text-gray-600">Moderado (150-179)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-xs text-gray-600">Alto (&ge; 180)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nova seção: Provas do Mês e Desafios Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provas do Mês */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-orange-600" />
                  Provas do Mês
                </CardTitle>
                <CardDescription className="mt-1">
                  Eventos programados para {MESES.find(m => m.numero === mesSelecionadoProvas)?.nome}
                </CardDescription>
              </div>
            </div>
            <div className="mt-4">
              <Select 
                value={mesSelecionadoProvas.toString()} 
                onValueChange={(value) => setMesSelecionadoProvas(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map(mes => (
                    <SelectItem key={mes.numero} value={mes.numero.toString()}>
                      {mes.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {provasFiltradas.length === 0 ? (
                <div className="text-center py-8">
                  <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Nenhuma prova cadastrada para {MESES.find(m => m.numero === mesSelecionadoProvas)?.nome}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                    onClick={() => onNavigate('provas')}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Adicionar Prova
                  </Button>
                </div>
              ) : (
                provasFiltradas.map((prova) => (
                  <div 
                    key={prova.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('provas')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{prova.nome}</h4>
                      <Badge variant="outline" className="text-xs">
                        {formatarData(prova.data)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{prova.cidade}, {prova.estado}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prova.distancias.map(distancia => (
                        <Badge 
                          key={distancia} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {distancia}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {provasFiltradas.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-3"
                onClick={() => onNavigate('provas')}
              >
                Ver todas as provas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Desafios Ativos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              Desafios Ativos
            </CardTitle>
            <CardDescription>
              Acompanhe os desafios em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {desafiosAtivosDetalhes.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Nenhum desafio ativo no momento</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                    onClick={() => onNavigate('desafios')}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Criar Desafio
                  </Button>
                </div>
              ) : (
                desafiosAtivosDetalhes.map((desafio) => (
                  <div 
                    key={desafio.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('desafios')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{desafio.nome}</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Ativo
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{desafio.objetivo}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatarDataCompleta(desafio.dataInicio)} - {formatarDataCompleta(desafio.dataFim)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>
                          {desafio.participantes.length} {desafio.participantes.length === 1 ? 'aluno inscrito' : 'alunos inscritos'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Progresso médio</span>
                        <span className="font-medium text-gray-900">
                          {Math.round(
                            Object.values(desafio.progresso).reduce((a, b) => a + b, 0) / 
                            desafio.participantes.length
                          )}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.round(
                          Object.values(desafio.progresso).reduce((a, b) => a + b, 0) / 
                          desafio.participantes.length
                        )} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            {desafiosAtivosDetalhes.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-3"
                onClick={() => onNavigate('desafios')}
              >
                Ver todos os desafios
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription className="mt-1">
                  Últimas ações realizadas na plataforma
                </CardDescription>
              </div>
              <Select value={filtroAtividade} onValueChange={(value: any) => setFiltroAtividade(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="plano">Planos</SelectItem>
                  <SelectItem value="desafio">Desafios</SelectItem>
                  <SelectItem value="aluno">Progresso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {atividadesFiltradas.map((atividade, idx) => {
                  const icones = {
                    plano: FileText,
                    desafio: Trophy,
                    aluno: Users,
                  };
                  const cores = {
                    plano: 'text-blue-600 bg-blue-50',
                    desafio: 'text-orange-600 bg-orange-50',
                    aluno: 'text-green-600 bg-green-50',
                  };
                  const IconeAtividade = icones[atividade.tipo];
                  
                  // Determinar se é uma ação do sistema
                  const isAcaoSistema = atividade.descricao.includes('atingiu') || atividade.descricao.includes('completou');

                  return (
                    <motion.div
                      key={atividade.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <motion.div 
                        className={`p-2 rounded-lg ${cores[atividade.tipo]}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconeAtividade className="w-4 h-4" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className="text-sm text-gray-900 flex-1">{atividade.descricao}</p>
                          {isAcaoSistema && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Sparkles className="w-3 h-3 text-purple-500 mt-0.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Atualização automática do sistema</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {atividade.data.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Atalhos Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Atalhos Rápidos</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {atalhos.map((atalho, idx) => {
                const Icon = atalho.icon;
                return (
                  <motion.div
                    key={atalho.page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-blue-50 hover:border-blue-300 transition-all"
                      onClick={() => onNavigate(atalho.page)}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {atalho.label}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
              
              {/* Botão Insight com IA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: atalhos.length * 0.1 }}
                className="pt-2 border-t"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200 transition-all"
                        onClick={handleGerarInsight}
                        disabled={isGeneratingInsight}
                      >
                        <span className="flex items-center gap-2">
                          {isGeneratingInsight ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          {isGeneratingInsight ? 'Gerando...' : 'Gerar Insight'}
                        </span>
                        <Zap className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Gera uma análise personalizada baseada nos seus dados de treino e desempenho dos alunos
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
