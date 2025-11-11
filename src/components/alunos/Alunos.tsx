import { useState, useEffect } from 'react';
import { Users, Search, Filter, UserPlus, Eye, Edit, FileText, Link2, Copy, Check, Trash2, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
// Mock data removed - using real API data only
import { AlunosService } from '../../lib/services';
import { AlunoPerfil } from './AlunoPerfil';
import { AlunoAdicionar } from './AlunoAdicionar';
import { AlunoEditar } from './AlunoEditar';
import { Aluno } from '../../types';
import { toast } from 'sonner';

type ViewMode = 'list' | 'profile' | 'add' | 'edit';

export function Alunos() {
  const [busca, setBusca] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState<string | null>(null);
  
  // Real data from API
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  // Código de convite gerado
  const codigoConvite = 'RUNCOACH-2024-ABC123';
  const linkConvite = `https://runcoachpro.com/cadastro?ref=${codigoConvite}`;

  // Load alunos data
  useEffect(() => {
    const loadAlunos = async () => {
      try {
        setLoading(true);
        const alunosData = await AlunosService.getAthletes();
        setAlunos(alunosData);
            } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        toast.error('Erro ao carregar alunos');
        // Keep empty array on error, no fallbacks
        setAlunos([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlunos();
  }, []);

  const alunosFiltrados = alunos.filter((aluno: any) => {
    const matchBusca = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const matchNivel = filtroNivel === 'todos' || aluno.nivel === filtroNivel;
    const matchStatus = filtroStatus === 'todos' || aluno.status === filtroStatus;
    return matchBusca && matchNivel && matchStatus;
  });

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkConvite);
      setLinkCopiado(true);
      toast.success('✅ Link copiado!', {
        description: 'O link de convite foi copiado para a área de transferência.',
      });
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch (err) {
      toast.error('Erro ao copiar link', {
        description: 'Tente novamente ou copie manualmente.',
      });
    }
  };

  const handleAdicionarAluno = async (novoAluno: Partial<Aluno>) => {
    try {
      setLoading(true);
      const response = await AlunosService.createAthlete({
        nome: novoAluno.nome,
        email: novoAluno.email,
        telefone: novoAluno.telefone,
        idade: novoAluno.idade,
        nivel: novoAluno.nivel,
        status: novoAluno.status
      });

      // Reload the athletes list to get the latest data
      const alunosData = await AlunosService.getAthletes();
      setAlunos(alunosData);
      
      toast.success('✅ Aluno adicionado com sucesso!', {
        description: `${novoAluno.nome} foi cadastrado na turma.`,
      });
    } catch (error) {
      console.error('Error adding athlete:', error);
      toast.error('Erro ao adicionar aluno', {
        description: 'Não foi possível cadastrar o aluno. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditarAluno = async (alunoAtualizado: Aluno) => {
    try {
      setLoading(true);
      await AlunosService.updateAthlete(alunoAtualizado.id, {
        nome: alunoAtualizado.nome,
        email: alunoAtualizado.email,
        telefone: alunoAtualizado.telefone,
        idade: alunoAtualizado.idade,
        nivel: alunoAtualizado.nivel,
        status: alunoAtualizado.status
      });
      
      // Recarregar lista de alunos do backend
      const alunosData = await AlunosService.getAthletes();
      setAlunos(alunosData);
      
      toast.success('✅ Aluno atualizado!', {
        description: `${alunoAtualizado.nome} foi atualizado com sucesso.`,
      });
      
      setViewMode('list');
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('❌ Erro ao editar aluno', {
        description: 'Tente novamente ou verifique os dados.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAtivarAluno = (alunoId: string) => {
    const aluno = alunos.find((a: any) => a.id === alunoId);
    toast.success('Aluno ativado', {
      description: `${aluno?.nome} foi ativado com sucesso.`,
    });
  };

  const handleInativarAluno = (alunoId: string) => {
    const aluno = alunos.find((a: any) => a.id === alunoId);
    toast.success('Aluno inativado', {
      description: `${aluno?.nome} foi inativado.`,
    });
  };

  const handleExcluirAluno = async () => {
    if (alunoParaExcluir) {
      try {
        setLoading(true);
        const aluno = alunos.find((a: any) => a.id === alunoParaExcluir);
        await AlunosService.deleteAthlete(alunoParaExcluir);
        
        // Recarregar lista de alunos do backend
        const alunosData = await AlunosService.getAthletes();
        setAlunos(alunosData);
        
        toast.success('✅ Aluno excluído', {
          description: `${aluno?.nome} foi removido do sistema.`,
        });
        
        setAlunoParaExcluir(null);
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        toast.error('❌ Erro ao excluir aluno', {
          description: 'Tente novamente.',
        });
        setAlunoParaExcluir(null);
      } finally {
        setLoading(false);
      }
    }
  };

  // Renderizar views diferentes
  if (viewMode === 'profile' && alunoSelecionado) {
    const aluno = alunos.find((a: any) => a.id === alunoSelecionado);
    if (aluno) {
      return <AlunoPerfil aluno={aluno} onVoltar={() => setViewMode('list')} />;
    }
  }

  if (viewMode === 'add') {
    return (
      <AlunoAdicionar
        onVoltar={() => setViewMode('list')}
        onSalvar={handleAdicionarAluno}
      />
    );
  }

  if (viewMode === 'edit' && alunoSelecionado) {
    const aluno = alunos.find((a: any) => a.id === alunoSelecionado);
    if (aluno) {
      return (
        <AlunoEditar
          aluno={aluno}
          onVoltar={() => setViewMode('list')}
          onSalvar={handleEditarAluno}
        />
      );
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'default';
      case 'Pendente':
        return 'secondary';
      case 'Inativo':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Inativo':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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

  const estatisticas = {
    total: alunos.length,
    ativos: alunos.filter((a: any) => a.status === 'Ativo').length,
    pendentes: alunos.filter((a: any) => a.status === 'Pendente').length,
    iniciante: alunos.filter((a: any) => a.nivel === 'Iniciante').length,
    intermediario: alunos.filter((a: any) => a.nivel === 'Intermediário').length,
    avancado: alunos.filter((a: any) => a.nivel === 'Avançado').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Alunos
              </CardTitle>
              <CardDescription className="mt-2">
                Gerencie e acompanhe o desempenho de seus atletas
              </CardDescription>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setViewMode('add')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Aluno
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-2xl text-gray-900">{estatisticas.total}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 mb-1">Ativos</p>
              <p className="text-2xl text-green-700">{estatisticas.ativos}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600 mb-1">Pendentes</p>
              <p className="text-2xl text-yellow-700">{estatisticas.pendentes}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">Iniciante</p>
              <p className="text-2xl text-blue-700">{estatisticas.iniciante}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-600 mb-1">Intermediário</p>
              <p className="text-2xl text-indigo-700">{estatisticas.intermediario}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600 mb-1">Avançado</p>
              <p className="text-2xl text-purple-700">{estatisticas.avancado}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome do aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
                aria-label="Buscar alunos"
              />
            </div>

            <Select value={filtroNivel} onValueChange={setFiltroNivel}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Níveis</SelectItem>
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Link de Convite */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            Link de Convite para Alunos
          </CardTitle>
          <CardDescription>
            Compartilhe este link para que novos alunos se cadastrem na sua turma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={linkConvite}
                readOnly
                className="bg-white"
              />
              <Button
                onClick={handleCopiarLink}
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {linkCopiado ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </>
                )}
              </Button>
            </div>
            <div className="p-3 bg-white/60 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">ℹ️ Como funciona:</span> Alunos que se cadastrarem
                através deste link ficarão com status "Pendente" até que você os aprove.
                Isso garante controle sobre quem entra na turma.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nota de Privacidade */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">🔒 Privacidade:</span> As informações dos alunos são
            visíveis apenas para o professor responsável. Todos os dados são tratados com
            confidencialidade conforme diretrizes da plataforma.
          </p>
        </CardContent>
      </Card>

      {/* Tabela de Alunos */}
      <Card>
        <CardContent className="p-0">
          {alunosFiltrados.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Plano Atual</TableHead>
                    <TableHead>Treinos</TableHead>
                    <TableHead>Tempo Médio</TableHead>
                    <TableHead>Ritmo Médio</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow 
                      key={aluno.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setAlunoSelecionado(aluno.id);
                        setViewMode('profile');
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={aluno.foto} alt={aluno.nome} />
                            <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-900">{aluno.nome}</p>
                            <p className="text-xs text-gray-500">{aluno.idade} anos</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(aluno.status)}>
                          {aluno.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getNivelColor(aluno.nivel)}>
                          {aluno.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {aluno.planoAtual ? (
                            <p className="text-sm text-gray-900 truncate">{aluno.planoAtual}</p>
                          ) : (
                            <p className="text-sm text-gray-500">-</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{aluno.treinosConcluidos}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{aluno.tempoMedio}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{aluno.ritmoMedio}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setAlunoSelecionado(aluno.id);
                                setViewMode('edit');
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {aluno.status === 'Ativo' ? (
                              <DropdownMenuItem
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleInativarAluno(aluno.id);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Inativar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleAtivarAluno(aluno.id);
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Ativar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setAlunoParaExcluir(aluno.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">Nenhum aluno encontrado</p>
              <p className="text-sm text-gray-500">
                Tente ajustar os filtros ou adicione novos alunos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!alunoParaExcluir} onOpenChange={() => setAlunoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
              Todos os dados de treino e progresso serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluirAluno} className="bg-red-600 hover:bg-red-700">
              Excluir Aluno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
