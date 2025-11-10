import { useState, useEffect } from 'react';
import { Activity, Plus, Calendar, User, Clock, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { TestesService, AlunosService } from '../../lib/services';
import { toast } from 'sonner';
import { TipoTesteFisico, TesteFisico as TesteFisicoType, Aluno } from '../../types';

interface ZonasTreino {
  z1: string;
  z2: string;
  z3: string;
  z4: string;
  z5: string;
}

export function TesteFisico() {
  const [showNovoTeste, setShowNovoTeste] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [tipoTeste, setTipoTeste] = useState<TipoTesteFisico>('5km');
  const [pace, setPace] = useState('');
  const [tempoFinal, setTempoFinal] = useState('');
  const [filtroAluno, setFiltroAluno] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [zonasTreino, setZonasTreino] = useState<ZonasTreino | null>(null);
  const [alunoPerfilAberto, setAlunoPerfilAberto] = useState<string | null>(null);

  // Estados para dados da API
  const [testes, setTestes] = useState<TesteFisicoType[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [testesData, alunosData] = await Promise.all([
          TestesService.getTests(),
          AlunosService.getAthletes()
        ]);
        setTestes(testesData.tests || []);
        setAlunos(alunosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Converter pace string para segundos
  const paceParaSegundos = (paceStr: string): number => {
    const [minutos, segundos] = paceStr.split(':').map(Number);
    if (isNaN(minutos) || isNaN(segundos)) return 0;
    return minutos * 60 + segundos;
  };

  // Converter segundos para pace string
  const segundosParaPace = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular zonas de treino baseado no pace (Z3)
  const calcularZonasTreino = (paceZ3: string): ZonasTreino => {
    const segundosZ3 = paceParaSegundos(paceZ3);
    
    return {
      z1: segundosParaPace(segundosZ3 + 40), // +40s
      z2: segundosParaPace(segundosZ3 + 20), // +20s
      z3: paceZ3, // resultado do teste
      z4: segundosParaPace(segundosZ3 - 20), // -20s
      z5: segundosParaPace(segundosZ3 - 40), // -40s
    };
  };

  // Calcular tempo final baseado no pace e tipo de teste
  const calcularTempoFinal = (paceValue: string, tipo: TipoTesteFisico) => {
    if (!paceValue) return '';
    
    const [minutos, segundos] = paceValue.split(':').map(Number);
    if (isNaN(minutos) || isNaN(segundos)) return '';
    
    const paceEmSegundos = minutos * 60 + segundos;
    let distanciaKm = 0;
    
    switch (tipo) {
      case '3km':
        distanciaKm = 3;
        break;
      case '5km':
        distanciaKm = 5;
        break;
      case '12 minutos':
        // Para 12 minutos, o cálculo é diferente
        const tempoTotal = 12 * 60; // 12 minutos em segundos
        const distancia = tempoTotal / paceEmSegundos;
        return `${distancia.toFixed(2)}km`;
      default:
        return '';
    }
    
    const tempoTotalSegundos = paceEmSegundos * distanciaKm;
    const mins = Math.floor(tempoTotalSegundos / 60);
    const secs = Math.floor(tempoTotalSegundos % 60);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular pace baseado no tempo e tipo de teste
  const calcularPace = (tempoValue: string, tipo: TipoTesteFisico) => {
    if (!tempoValue) return '';
    
    const [minutos, segundos] = tempoValue.split(':').map(Number);
    if (isNaN(minutos) || isNaN(segundos)) return '';
    
    const tempoTotalSegundos = minutos * 60 + segundos;
    let distanciaKm = 0;
    
    switch (tipo) {
      case '3km':
        distanciaKm = 3;
        break;
      case '5km':
        distanciaKm = 5;
        break;
      case '12 minutos':
        // Para 12 minutos não calculamos pace baseado no tempo
        return '';
      default:
        return '';
    }
    
    const paceEmSegundos = tempoTotalSegundos / distanciaKm;
    const mins = Math.floor(paceEmSegundos / 60);
    const secs = Math.floor(paceEmSegundos % 60);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaceChange = (value: string) => {
    setPace(value);
    const tempo = calcularTempoFinal(value, tipoTeste);
    setTempoFinal(tempo);
    
    // Calcular zonas de treino
    if (value && value.includes(':')) {
      const zonas = calcularZonasTreino(value);
      setZonasTreino(zonas);
    } else {
      setZonasTreino(null);
    }
  };

  const handleTempoChange = (value: string) => {
    setTempoFinal(value);
    const paceCalculado = calcularPace(value, tipoTeste);
    if (paceCalculado) {
      setPace(paceCalculado);
      
      // Calcular zonas de treino
      const zonas = calcularZonasTreino(paceCalculado);
      setZonasTreino(zonas);
    }
  };

  const handleTipoTesteChange = (value: TipoTesteFisico) => {
    setTipoTeste(value);
    if (pace) {
      const tempo = calcularTempoFinal(pace, value);
      setTempoFinal(tempo);
    }
  };

  const handleSalvarTeste = async () => {
    if (!alunoSelecionado || !tipoTeste || !pace || !tempoFinal) {
      toast.error('Erro ao salvar teste', {
        description: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    try {
      // Find the selected athlete to get the correct athleteId
      const aluno = alunos.find(a => a.id === alunoSelecionado);
      if (!aluno || !aluno.athleteId) {
        toast.error('Atleta não encontrado');
        return;
      }

      const novoTeste = await TestesService.createTest({
        alunoId: aluno.athleteId, // Use athleteId instead of user id
        tipoTeste,
        pace,
        tempoFinal,
        data: new Date()
      });
      
      // Adiciona o novo teste à lista local
      setTestes(prev => [novoTeste.test, ...prev]);
      
      toast.success('✅ Teste físico salvo com sucesso', {
        description: `Teste de ${tipoTeste} registrado para ${aluno?.nome}`,
      });

      setShowNovoTeste(false);
      setAlunoSelecionado('');
      setTipoTeste('5km');
      setPace('');
      setTempoFinal('');
      setZonasTreino(null);
    } catch (error) {
      console.error('Erro ao salvar teste:', error);
      toast.error('Erro ao salvar teste físico');
    }
  };

  const testesFiltrados = testes.filter((teste: TesteFisicoType) => {
    if (filtroAluno === 'todos') {
      const matchTipo = filtroTipo === 'todos' || teste.tipoTeste === filtroTipo;
      return matchTipo;
    }
    
    // Find the athlete by user.id and compare with teste.alunoId (athleteId)
    const alunoSelecionado = alunos.find(a => a.id === filtroAluno);
    const matchAluno = alunoSelecionado?.athleteId === teste.alunoId;
    const matchTipo = filtroTipo === 'todos' || teste.tipoTeste === filtroTipo;
    return matchAluno && matchTipo;
  });

  const getTipoBadgeColor = (tipo: TipoTesteFisico) => {
    switch (tipo) {
      case '3km':
        return 'bg-green-100 text-green-700';
      case '5km':
        return 'bg-blue-100 text-blue-700';
      case '12 minutos':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(data);
  };

  // Calcular estatísticas
  const totalTestes = testesFiltrados.length;
  const alunosTestados = new Set(testesFiltrados.map((t: TesteFisicoType) => t.alunoId)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Testes Físicos
              </CardTitle>
              <CardDescription className="mt-2">
                Registre e acompanhe os resultados dos testes físicos dos seus alunos
              </CardDescription>
            </div>
            <Button onClick={() => setShowNovoTeste(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Teste
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Testes</p>
                <p className="text-2xl text-gray-900">{totalTestes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alunos Testados</p>
                <p className="text-2xl text-gray-900">{alunosTestados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Teste Mais Usado</p>
                <p className="text-2xl text-gray-900">5km</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="filtro-aluno" className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4" />
                Filtrar por Aluno
              </Label>
              <Select value={filtroAluno} onValueChange={setFiltroAluno}>
                <SelectTrigger id="filtro-aluno">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Alunos</SelectItem>
                  {alunos.filter((a: Aluno) => a.status === 'Ativo').map((aluno: Aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="filtro-tipo" className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4" />
                Filtrar por Tipo
              </Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger id="filtro-tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="3km">3km</SelectItem>
                  <SelectItem value="5km">5km</SelectItem>
                  <SelectItem value="12 minutos">12 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Testes */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Testes</CardTitle>
          <CardDescription>
            Visualize todos os testes físicos realizados pelos alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo de Teste</TableHead>
                  <TableHead>Pace</TableHead>
                  <TableHead>Tempo Final</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600">Nenhum teste encontrado</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Adicione um novo teste ou ajuste os filtros
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  testesFiltrados.map((teste: TesteFisicoType) => {
                    const aluno = alunos.find((a: Aluno) => a.athleteId === teste.alunoId);
                    if (!aluno) return null;

                    return (
                      <TableRow 
                        key={teste.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setAlunoPerfilAberto(aluno.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={aluno.foto} alt={aluno.nome} />
                              <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm text-gray-900">{aluno.nome}</p>
                              <p className="text-xs text-gray-500">{aluno.nivel}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTipoBadgeColor(teste.tipoTeste)} variant="outline">
                            {teste.tipoTeste}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{teste.pace}/km</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{teste.tempoFinal}</span>
                          {teste.distancia && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({teste.distancia.toFixed(2)}km)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatarData(teste.data)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Novo Teste */}
      <Dialog open={showNovoTeste} onOpenChange={setShowNovoTeste}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Teste Físico</DialogTitle>
            <DialogDescription>
              Registre o resultado do teste físico realizado pelo aluno
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aluno">
                Aluno <span className="text-red-500">*</span>
              </Label>
              <Select value={alunoSelecionado} onValueChange={setAlunoSelecionado}>
                <SelectTrigger id="aluno">
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.filter((a: Aluno) => a.status === 'Ativo').map((aluno: Aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      <div className="flex items-center gap-2">
                        {aluno.nome} - {aluno.nivel}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-teste">
                Tipo de Teste <span className="text-red-500">*</span>
              </Label>
              <Select value={tipoTeste} onValueChange={(v: any) => handleTipoTesteChange(v)}>
                <SelectTrigger id="tipo-teste">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3km">3km</SelectItem>
                  <SelectItem value="5km">5km</SelectItem>
                  <SelectItem value="12 minutos">12 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pace">
                Pace (mm:ss) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pace"
                placeholder="Ex: 5:30"
                value={pace}
                onChange={(e) => handlePaceChange(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Formato: minutos:segundos por quilômetro
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempo-final">
                Tempo Final / Distância <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tempo-final"
                value={tempoFinal}
                onChange={(e) => handleTempoChange(e.target.value)}
                placeholder={tipoTeste === '12 minutos' ? 'Ex: 2.5km' : 'Ex: 25:30'}
              />
              <p className="text-xs text-gray-500">
                {tipoTeste === '12 minutos' 
                  ? 'Distância percorrida em 12 minutos ou pace'
                  : 'Tempo total ou deixe calcular automaticamente pelo pace'
                }
              </p>
            </div>

            {zonasTreino && (
              <div className="space-y-2">
                <Label className="text-sm">Zonas de Treino Calculadas</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
                    <p className="text-xs text-blue-600 mb-1">Z1</p>
                    <p className="text-sm text-gray-900">{zonasTreino.z1}</p>
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
                    <p className="text-xs text-green-600 mb-1">Z2</p>
                    <p className="text-sm text-gray-900">{zonasTreino.z2}</p>
                  </div>
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                    <p className="text-xs text-yellow-600 mb-1">Z3</p>
                    <p className="text-sm text-gray-900">{zonasTreino.z3}</p>
                  </div>
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded text-center">
                    <p className="text-xs text-orange-600 mb-1">Z4</p>
                    <p className="text-sm text-gray-900">{zonasTreino.z4}</p>
                  </div>
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
                    <p className="text-xs text-red-600 mb-1">Z5</p>
                    <p className="text-sm text-gray-900">{zonasTreino.z5}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Z3 = resultado do teste • Z4 = -20s • Z5 = -40s • Z2 = +20s • Z1 = +40s
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <span className="font-medium">ℹ️ Cálculo Automático:</span> Preencha o pace ou o tempo. 
                O outro campo será calculado automaticamente, junto com as zonas de treino.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSalvarTeste} className="bg-blue-600 hover:bg-blue-700">
              Salvar Teste
            </Button>
            <Button variant="outline" onClick={() => setShowNovoTeste(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet Perfil do Aluno */}
      <Sheet open={!!alunoPerfilAberto} onOpenChange={(open: boolean) => !open && setAlunoPerfilAberto(null)}>
        <SheetContent className="w-full sm:max-w-md p-4">
          <SheetHeader>
            <SheetTitle>Informações do Aluno</SheetTitle>
            <SheetDescription>
              Visualize os dados e histórico de testes
            </SheetDescription>
          </SheetHeader>

          {alunoPerfilAberto && (() => {
            const aluno = alunos.find((a: Aluno) => a.id === alunoPerfilAberto);
            if (!aluno) return null;

            const testesDoAluno = testes.filter((t: TesteFisicoType) => t.alunoId === aluno.athleteId);

            return (
              <div className="space-y-4 mt-6">
                {/* Foto e Nome */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={aluno.foto} alt={aluno.nome} />
                    <AvatarFallback className="text-xl">{aluno.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900">{aluno.nome}</h3>
                    <p className="text-sm text-gray-500">{aluno.idade} anos</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{aluno.status}</Badge>
                      <Badge variant="outline">{aluno.nivel}</Badge>
                    </div>
                  </div>
                </div>

                {/* Dados Gerais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dados Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{aluno.email}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-gray-500">Plano Atual</p>
                      <p className="text-sm text-gray-900">{aluno.planoAtual || 'Nenhum plano'}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Treinos</p>
                        <p className="text-sm text-gray-900">{aluno.treinosConcluidos}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tempo</p>
                        <p className="text-sm text-gray-900">{aluno.tempoMedio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ritmo</p>
                        <p className="text-sm text-gray-900">{aluno.ritmoMedio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico de Testes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Histórico de Testes Físicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testesDoAluno.length > 0 ? (
                      <div className="space-y-3">
                        {testesDoAluno.map((teste: TesteFisicoType) => (
                          <div key={teste.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getTipoBadgeColor(teste.tipoTeste)}>
                                {teste.tipoTeste}
                              </Badge>
                              <span className="text-xs text-gray-500">{formatarData(teste.data)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Pace</p>
                                <p className="text-gray-900">{teste.pace}/km</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Tempo</p>
                                <p className="text-gray-900">{teste.tempoFinal}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhum teste registrado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
