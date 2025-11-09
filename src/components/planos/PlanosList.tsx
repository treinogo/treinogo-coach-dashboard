import { useState } from 'react';
import { FileText, Plus, Eye, Edit, Trash2, UserPlus, Filter, Search, Mail, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { PlanoVisualizacao } from './PlanoVisualizacao';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { planosMock, alunosMock } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface PlanosListProps {
  onNavigate: (page: string) => void;
}

export function PlanosList({ onNavigate }: PlanosListProps) {
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [planoParaDeletar, setPlanoParaDeletar] = useState<string | null>(null);
  
  // Estados para o Sheet de aplicar aos alunos
  const [sheetAberto, setSheetAberto] = useState(false);
  const [planoParaAplicar, setPlanoParaAplicar] = useState<string | null>(null);
  const [buscaAluno, setBuscaAluno] = useState('');
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [enviarEmail, setEnviarEmail] = useState(false);
  
  // Estados para visualização
  const [planoParaVisualizar, setPlanoParaVisualizar] = useState<string | null>(null);

  const planosFiltrados = planosMock.filter((plano) => {
    const matchBusca = plano.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = filtroCategoria === 'todas' || plano.categoria === filtroCategoria;
    const matchStatus = filtroStatus === 'todos' || plano.status === filtroStatus;
    return matchBusca && matchCategoria && matchStatus;
  });

  const handleDeletar = (id: string) => {
    setPlanoParaDeletar(id);
  };

  const confirmarDelecao = () => {
    if (planoParaDeletar) {
      toast.success('Plano excluído com sucesso', {
        description: 'O plano foi removido do sistema.',
      });
      setPlanoParaDeletar(null);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'default';
      case 'Rascunho':
        return 'secondary';
      case 'Arquivado':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleAbrirSheetAplicar = (planoId: string) => {
    setPlanoParaAplicar(planoId);
    setAlunosSelecionados([]);
    setBuscaAluno('');
    setEnviarEmail(false);
    setSheetAberto(true);
  };

  const handleToggleAluno = (alunoId: string) => {
    setAlunosSelecionados(prev => 
      prev.includes(alunoId) 
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const handleAplicarPlano = () => {
    if (alunosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um aluno');
      return;
    }

    const plano = planosMock.find(p => p.id === planoParaAplicar);
    const nomeAlunos = alunosSelecionados
      .map(id => alunosMock.find(a => a.id === id)?.nome)
      .filter(Boolean)
      .join(', ');

    toast.success('Plano aplicado com sucesso', {
      description: `${plano?.nome} foi aplicado para ${alunosSelecionados.length} aluno(s)${enviarEmail ? ' com notificação por e-mail' : ''}.`,
    });

    setSheetAberto(false);
    setAlunosSelecionados([]);
    setPlanoParaAplicar(null);
  };

  const alunosFiltrados = alunosMock.filter(aluno =>
    aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
    aluno.email.toLowerCase().includes(buscaAluno.toLowerCase())
  );

  const handleClonarPlano = (planoId: string) => {
    const plano = planosMock.find(p => p.id === planoId);
    if (plano) {
      toast.success('Plano clonado com sucesso', {
        description: `Uma cópia de "${plano.nome}" foi criada com o nome "${plano.nome} - Cópia".`,
      });
    }
  };

  // Se estiver visualizando um plano, mostrar a tela de visualização
  if (planoParaVisualizar) {
    return (
      <PlanoVisualizacao
        planoId={planoParaVisualizar}
        onVoltar={() => setPlanoParaVisualizar(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Planos de Treino
              </CardTitle>
              <CardDescription className="mt-2">
                Gerencie e acompanhe todos os planos de treino criados
              </CardDescription>
            </div>
            <Button onClick={() => onNavigate('criar-plano')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome do plano..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
                aria-label="Buscar planos"
              />
            </div>

            {/* Filtro Categoria */}
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Categorias</SelectItem>
                <SelectItem value="5K">5K</SelectItem>
                <SelectItem value="10K">10K</SelectItem>
                <SelectItem value="Meia Maratona">Meia Maratona</SelectItem>
                <SelectItem value="Maratona">Maratona</SelectItem>
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Status */}
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
                <SelectItem value="Arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planosFiltrados.map((plano) => (
          <Card key={plano.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg text-gray-900 truncate">{plano.nome}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getBadgeVariant(plano.status)}>{plano.status}</Badge>
                    <Badge variant="outline" className="text-xs">{plano.categoria}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Opções">
                      <span className="sr-only">Opções</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onNavigate('criar-plano')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletar(plano.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Duração</p>
                  <p className="text-gray-900">{plano.duracao} semanas</p>
                </div>
                <div>
                  <p className="text-gray-500">Dias/Semana</p>
                  <p className="text-gray-900">{plano.diasPorSemana} dias</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Alunos</p>
                  <p className="text-gray-900">{plano.totalAlunos} alunos</p>
                </div>
                <div>
                  <p className="text-gray-500">Criado por</p>
                  <p className="text-gray-900 truncate">{plano.criadoPor}</p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => setPlanoParaVisualizar(plano.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleClonarPlano(plano.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Clonar
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAbrirSheetAplicar(plano.id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Aplicar aos Alunos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {planosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">Nenhum plano encontrado</p>
            <p className="text-sm text-gray-500 mb-4">
              Tente ajustar os filtros ou criar um novo plano
            </p>
            <Button onClick={() => onNavigate('criar-plano')}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Plano
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!planoParaDeletar} onOpenChange={() => setPlanoParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano de treino? Esta ação não pode ser desfeita.
              Os alunos que utilizam este plano serão notificados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarDelecao} className="bg-red-600 hover:bg-red-700">
              Excluir Plano
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sheet para Aplicar Plano aos Alunos */}
      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Aplicar Plano aos Alunos</SheetTitle>
            <SheetDescription>
              Selecione um ou mais alunos para aplicar o plano de treino
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {/* Campo de Pesquisa */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pesquisar aluno por nome ou e-mail..."
                value={buscaAluno}
                onChange={(e) => setBuscaAluno(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Contador de Selecionados */}
            {alunosSelecionados.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {alunosSelecionados.length} aluno(s) selecionado(s)
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAlunosSelecionados([])}
                >
                  Limpar
                </Button>
              </div>
            )}

            {/* Lista de Alunos */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {alunosFiltrados.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleToggleAluno(aluno.id)}
                  >
                    <Checkbox
                      id={`aluno-${aluno.id}`}
                      checked={alunosSelecionados.includes(aluno.id)}
                      onCheckedChange={() => handleToggleAluno(aluno.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={aluno.foto} alt={aluno.nome} />
                      <AvatarFallback>{aluno.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{aluno.nome}</p>
                      <p className="text-xs text-gray-500 truncate">{aluno.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {aluno.nivel}
                        </Badge>
                        {aluno.planoAtual && (
                          <Badge variant="secondary" className="text-xs">
                            {aluno.planoAtual}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {alunosFiltrados.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum aluno encontrado</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Opção de enviar por e-mail */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="enviar-email"
                checked={enviarEmail}
                onCheckedChange={(checked) => setEnviarEmail(checked as boolean)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="enviar-email"
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  Enviar notificação por e-mail
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Os alunos receberão um e-mail com detalhes do novo plano de treino
                </p>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button 
              onClick={handleAplicarPlano}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={alunosSelecionados.length === 0}
            >
              Aplicar Plano
            </Button>
            <Button variant="outline" onClick={() => setSheetAberto(false)}>
              Cancelar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
