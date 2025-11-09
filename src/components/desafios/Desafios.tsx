import { useState } from 'react';
import { Trophy, Plus, Calendar, Users, Award, TrendingUp, Target, Clock, UserCheck, UserPlus, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { desafiosMock, alunosMock } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

export function Desafios() {
  const [showNovoDesafio, setShowNovoDesafio] = useState(false);
  const [nomeDesafio, setNomeDesafio] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [duracao, setDuracao] = useState('30');
  const [recompensa, setRecompensa] = useState('');
  const [tipoParticipacao, setTipoParticipacao] = useState<'todos' | 'selecionados'>('todos');
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  
  // Estados para Ranking Sheet
  const [desafioRankingAberto, setDesafioRankingAberto] = useState<string | null>(null);
  
  // Estados para Adicionar Participante
  const [popoverAdicionarAberto, setPopoverAdicionarAberto] = useState<string | null>(null);
  const [buscaAluno, setBuscaAluno] = useState('');

  const handleCriarDesafio = () => {
    if (!nomeDesafio || !objetivo) {
      toast.error('Erro ao criar desafio', {
        description: 'Preencha os campos obrigatórios: Nome e Objetivo',
      });
      return;
    }

    if (tipoParticipacao === 'selecionados' && alunosSelecionados.length === 0) {
      toast.error('Erro ao criar desafio', {
        description: 'Selecione pelo menos um aluno para o desafio',
      });
      return;
    }

    const numParticipantes = tipoParticipacao === 'todos' 
      ? alunosMock.filter(a => a.status === 'Ativo').length 
      : alunosSelecionados.length;

    toast.success('✅ Desafio criado com sucesso', {
      description: `O desafio "${nomeDesafio}" foi criado com ${numParticipantes} participante(s).`,
    });
    setShowNovoDesafio(false);
    setNomeDesafio('');
    setObjetivo('');
    setDuracao('30');
    setRecompensa('');
    setTipoParticipacao('todos');
    setAlunosSelecionados([]);
  };

  const handleToggleAluno = (alunoId: string) => {
    setAlunosSelecionados(prev => 
      prev.includes(alunoId) 
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'default';
      case 'Concluído':
        return 'secondary';
      case 'Cancelado':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const calcularDiasRestantes = (dataFim: Date) => {
    const hoje = new Date();
    const diferenca = dataFim.getTime() - hoje.getTime();
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const handleAdicionarParticipante = (desafioId: string, alunoId: string) => {
    const aluno = alunosMock.find(a => a.id === alunoId);
    toast.success('Participante adicionado', {
      description: `${aluno?.nome} foi adicionado ao desafio com sucesso.`,
    });
    setPopoverAdicionarAberto(null);
    setBuscaAluno('');
  };

  const getAlunosDisponiveis = (desafioId: string) => {
    const desafio = desafiosMock.find(d => d.id === desafioId);
    if (!desafio) return [];
    
    // Filtrar alunos que já não estão no desafio
    const alunosDisponiveis = alunosMock.filter(
      aluno => !desafio.participantes.includes(aluno.id) && aluno.status === 'Ativo'
    );
    
    // Filtrar pela busca
    if (buscaAluno.trim()) {
      return alunosDisponiveis.filter(aluno =>
        aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase())
      );
    }
    
    return alunosDisponiveis;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-600" />
                Desafios
              </CardTitle>
              <CardDescription className="mt-2">
                Crie e acompanhe desafios motivacionais para seus alunos
              </CardDescription>
            </div>
            <Button onClick={() => setShowNovoDesafio(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Desafio
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Desafios Ativos */}
      <div>
        <h2 className="text-lg text-gray-900 mb-4">Desafios Ativos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {desafiosMock
            .filter((d) => d.status === 'Ativo')
            .map((desafio) => {
              const diasRestantes = calcularDiasRestantes(desafio.dataFim);
              const progressoMedio =
                Object.values(desafio.progresso).reduce((a, b) => a + b, 0) /
                Object.values(desafio.progresso).length;

              return (
                <Card key={desafio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{desafio.nome}</CardTitle>
                        <CardDescription className="mt-2">{desafio.objetivo}</CardDescription>
                      </div>
                      <Badge variant={getBadgeVariant(desafio.status)}>{desafio.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Informações */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{diasRestantes} dias restantes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{desafio.participantes.length} participantes</span>
                      </div>
                    </div>

                    {desafio.recompensa && (
                      <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <Award className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-orange-600 mb-1">Recompensa</p>
                          <p className="text-sm text-orange-900">{desafio.recompensa}</p>
                        </div>
                      </div>
                    )}

                    {/* Progresso Médio */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Progresso Médio</p>
                        <p className="text-sm text-gray-900">{Math.round(progressoMedio)}%</p>
                      </div>
                      <Progress value={progressoMedio} className="h-2" />
                    </div>

                    {/* Ranking Top 3 */}
                    <div>
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Top 3 Ranking
                      </p>
                      <div className="space-y-2">
                        {desafio.ranking.slice(0, 3).map((item, index) => {
                          const aluno = alunosMock.find((a) => a.id === item.alunoId);
                          if (!aluno) return null;

                          const medalhas = ['🥇', '🥈', '🥉'];

                          return (
                            <div
                              key={item.alunoId}
                              className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                            >
                              <span className="text-lg">{medalhas[index]}</span>
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={aluno.foto} alt={aluno.nome} />
                                <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{aluno.nome}</p>
                              </div>
                              <Badge variant="outline">{item.pontos} pts</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDesafioRankingAberto(desafio.id)}
                      >
                        Ver Ranking Completo
                      </Button>
                      <Popover 
                        open={popoverAdicionarAberto === desafio.id} 
                        onOpenChange={(open) => {
                          setPopoverAdicionarAberto(open ? desafio.id : null);
                          if (!open) setBuscaAluno('');
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                          <div className="p-4 border-b">
                            <h4 className="text-sm mb-3">Adicionar Participante</h4>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="Buscar aluno..."
                                value={buscaAluno}
                                onChange={(e) => setBuscaAluno(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <ScrollArea className="h-[280px]">
                            <div className="p-2">
                              {getAlunosDisponiveis(desafio.id).length > 0 ? (
                                getAlunosDisponiveis(desafio.id).map((aluno) => (
                                  <button
                                    key={aluno.id}
                                    onClick={() => handleAdicionarParticipante(desafio.id, aluno.id)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={aluno.foto} alt={aluno.nome} />
                                      <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                      <p className="text-sm text-gray-900">{aluno.nome}</p>
                                      <p className="text-xs text-gray-500">{aluno.nivel}</p>
                                    </div>
                                    <UserPlus className="w-4 h-4 text-gray-400" />
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                  {buscaAluno ? 'Nenhum aluno encontrado' : 'Todos os alunos já estão participando'}
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.success('Notificação enviada', {
                            description: 'Os participantes foram notificados sobre o progresso.',
                          })
                        }
                      >
                        Notificar
                      </Button>
                    </div>

                    {/* Transparência */}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">ℹ️ Transparência:</span> Pontuações baseadas
                        nos treinos registrados pelos alunos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Desafios Concluídos */}
      {desafiosMock.filter((d) => d.status === 'Concluído').length > 0 && (
        <div>
          <h2 className="text-lg text-gray-900 mb-4">Desafios Concluídos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {desafiosMock
              .filter((d) => d.status === 'Concluído')
              .map((desafio) => (
                <Card key={desafio.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{desafio.nome}</CardTitle>
                        <CardDescription className="mt-2">{desafio.objetivo}</CardDescription>
                      </div>
                      <Badge variant={getBadgeVariant(desafio.status)}>{desafio.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {desafio.participantes.length} participantes
                      </div>

                      {/* Vencedor */}
                      {desafio.ranking[0] && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-600 mb-2">🏆 Vencedor</p>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const vencedor = alunosMock.find((a) => a.id === desafio.ranking[0].alunoId);
                              return vencedor ? (
                                <>
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={vencedor.foto} alt={vencedor.nome} />
                                    <AvatarFallback>{vencedor.nome.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm text-yellow-900">{vencedor.nome}</p>
                                </>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Dica */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">💡 Sugestão:</span> Comece com desafios de curta
                duração para engajar mais alunos
              </p>
              <p className="text-xs text-gray-600">
                Desafios de 7 a 14 dias têm maior taxa de participação e conclusão
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet Ranking Completo */}
      <Sheet open={!!desafioRankingAberto} onOpenChange={(open) => !open && setDesafioRankingAberto(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              Ranking Completo
            </SheetTitle>
            <SheetDescription>
              {desafioRankingAberto && desafiosMock.find(d => d.id === desafioRankingAberto)?.nome}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-2 pr-4">
              {desafioRankingAberto && 
                desafiosMock.find(d => d.id === desafioRankingAberto)?.ranking.map((item, index) => {
                  const aluno = alunosMock.find(a => a.id === item.alunoId);
                  if (!aluno) return null;

                  const isPodio = index < 3;
                  const medalhas = ['🥇', '🥈', '🥉'];
                  const coresDestaque = [
                    'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300',
                    'bg-gradient-to-r from-gray-50 to-slate-100 border-gray-300',
                    'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
                  ];

                  return (
                    <div
                      key={item.alunoId}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isPodio
                          ? `${coresDestaque[index]} shadow-sm`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {isPodio ? (
                          <span className="text-2xl">{medalhas[index]}</span>
                        ) : (
                          <span className="text-sm text-gray-600">#{index + 1}</span>
                        )}
                      </div>
                      <Avatar className={isPodio ? 'w-12 h-12 ring-2 ring-white' : 'w-10 h-10'}>
                        <AvatarImage src={aluno.foto} alt={aluno.nome} />
                        <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isPodio ? 'font-medium text-gray-900' : 'text-gray-900'}`}>
                          {aluno.nome}
                        </p>
                        <p className="text-xs text-gray-500">{aluno.nivel}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={isPodio ? 'default' : 'outline'}
                          className={isPodio ? 'bg-orange-600' : ''}
                        >
                          {item.pontos} pts
                        </Badge>
                        {item.distancia && (
                          <p className="text-xs text-gray-500 mt-1">{item.distancia} km</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Dialog Novo Desafio */}
      <Dialog open={showNovoDesafio} onOpenChange={setShowNovoDesafio}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Desafio</DialogTitle>
            <DialogDescription>
              Defina os parâmetros e critérios para o desafio motivacional
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-desafio">
                Nome do Desafio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome-desafio"
                placeholder="Ex: Desafio 100K em Dezembro"
                value={nomeDesafio}
                onChange={(e) => setNomeDesafio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo-desafio">
                Objetivo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="objetivo-desafio"
                placeholder="Descreva o objetivo do desafio..."
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracao-desafio">Duração (dias)</Label>
                <Select value={duracao} onValueChange={setDuracao}>
                  <SelectTrigger id="duracao-desafio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[7, 14, 21, 30, 60, 90].map((dias) => (
                      <SelectItem key={dias} value={dias.toString()}>
                        {dias} dias
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recompensa-desafio">Recompensa (opcional)</Label>
                <Input
                  id="recompensa-desafio"
                  placeholder="Ex: Medalha + Desconto"
                  value={recompensa}
                  onChange={(e) => setRecompensa(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>Participantes do Desafio</Label>
              <RadioGroup value={tipoParticipacao} onValueChange={(value: any) => setTipoParticipacao(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="todos" id="todos" />
                  <Label htmlFor="todos" className="cursor-pointer">
                    Todos os alunos ativos ({alunosMock.filter(a => a.status === 'Ativo').length} alunos)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selecionados" id="selecionados" />
                  <Label htmlFor="selecionados" className="cursor-pointer">
                    Selecionar alunos específicos
                  </Label>
                </div>
              </RadioGroup>

              {tipoParticipacao === 'selecionados' && (
                <div className="mt-3 p-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto space-y-2">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Selecione os alunos que participarão do desafio:
                  </p>
                  {alunosMock.filter(a => a.status === 'Ativo').map(aluno => (
                    <div key={aluno.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox 
                        id={`aluno-${aluno.id}`}
                        checked={alunosSelecionados.includes(aluno.id)}
                        onCheckedChange={() => handleToggleAluno(aluno.id)}
                      />
                      <Label 
                        htmlFor={`aluno-${aluno.id}`} 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={aluno.foto} alt={aluno.nome} />
                          <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-gray-900">{aluno.nome}</p>
                          <p className="text-xs text-gray-500">{aluno.nivel}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                  {alunosSelecionados.length > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-blue-900">
                        {alunosSelecionados.length} aluno(s) selecionado(s)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <span className="font-medium">ℹ️ Critérios de Pontuação:</span> A pontuação será
                calculada automaticamente com base nos treinos concluídos pelos alunos durante o
                período do desafio.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovoDesafio(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarDesafio} className="bg-orange-600 hover:bg-orange-700">
              Criar Desafio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
