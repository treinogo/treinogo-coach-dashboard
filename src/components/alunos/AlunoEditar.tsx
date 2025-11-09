import { useState } from 'react';
import { ArrowLeft, Save, UserCheck, UserX, Edit3, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
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
import { toast } from 'sonner@2.0.3';
import { Aluno } from '../../types';

interface AlunoEditarProps {
  aluno: Aluno;
  onVoltar: () => void;
  onSalvar: (aluno: Aluno) => void;
}

export function AlunoEditar({ aluno, onVoltar, onSalvar }: AlunoEditarProps) {
  const [nome, setNome] = useState(aluno.nome);
  const [email, setEmail] = useState(aluno.email);
  const [telefone, setTelefone] = useState(aluno.telefone || '');
  const [idade, setIdade] = useState(aluno.idade.toString());
  const [nivel, setNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>(aluno.nivel);
  const [status, setStatus] = useState<'Pendente' | 'Ativo' | 'Inativo'>(aluno.status);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'Ativo' | 'Inativo' | null>(null);

  const handleSalvar = () => {
    if (!nome || !email || !idade) {
      toast.error('Erro ao salvar', {
        description: 'Preencha os campos obrigatórios: Nome, E-mail e Idade',
      });
      return;
    }

    const alunoAtualizado: Aluno = {
      ...aluno,
      nome,
      email,
      telefone,
      idade: Number(idade),
      nivel,
      status,
    };

    onSalvar(alunoAtualizado);
    toast.success('✅ Aluno atualizado com sucesso!', {
      description: `As informações de ${nome} foram atualizadas.`,
    });
    onVoltar();
  };

  const handleAprovar = () => {
    setStatus('Ativo');
    toast.success('✅ Aluno aprovado!', {
      description: `${nome} agora pode acessar os treinos da turma.`,
    });
  };

  const handleChangeStatus = (newStatus: 'Ativo' | 'Inativo') => {
    setPendingStatus(newStatus);
    setShowConfirmDialog(true);
  };

  const confirmarMudancaStatus = () => {
    if (pendingStatus) {
      setStatus(pendingStatus);
      toast.success(
        pendingStatus === 'Ativo' ? '✅ Aluno ativado!' : '⚠️ Aluno inativado!',
        {
          description:
            pendingStatus === 'Ativo'
              ? `${nome} foi reativado e pode acessar os treinos.`
              : `${nome} foi inativado e não terá mais acesso aos treinos.`,
        }
      );
    }
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-700">Ativo</Badge>;
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
      case 'Inativo':
        return <Badge className="bg-gray-100 text-gray-700">Inativo</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onVoltar}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl text-gray-900">Editar Aluno</h1>
            {getStatusBadge(status)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Atualize os dados de {aluno.nome}
          </p>
        </div>
      </div>

      {/* Alert para alunos pendentes */}
      {status === 'Pendente' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-900">
                  <span className="font-medium">Aprovação Pendente:</span> Este aluno se cadastrou
                  via link de convite e está aguardando aprovação para acessar os treinos.
                </p>
                <Button
                  onClick={handleAprovar}
                  className="mt-3 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Aprovar Aluno
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Dados do Aluno
          </CardTitle>
          <CardDescription>
            Campos marcados com * são obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            {/* Idade */}
            <div className="space-y-2">
              <Label htmlFor="idade">
                Idade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 25"
                min="1"
                max="120"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                required
              />
            </div>

            {/* Nível */}
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível de Experiência</Label>
              <Select value={nivel} onValueChange={(value: any) => setNivel(value)}>
                <SelectTrigger id="nivel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status do Aluno</Label>
              <Select 
                value={status} 
                onValueChange={(value: any) => {
                  if (value === 'Pendente') {
                    setStatus(value);
                  } else {
                    handleChangeStatus(value);
                  }
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Treinos Concluídos</p>
              <p className="text-lg text-gray-900">{aluno.treinosConcluidos}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Tempo Médio</p>
              <p className="text-lg text-gray-900">{aluno.tempoMedio}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Ritmo Médio</p>
              <p className="text-lg text-gray-900">{aluno.ritmoMedio}</p>
            </div>
          </div>

          {/* Nota de Privacidade */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">🔒 Privacidade:</span> As alterações feitas aqui
              afetarão apenas as informações cadastrais. O histórico de treinos e progresso
              do aluno será mantido.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      {status !== 'Pendente' && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie o acesso do aluno aos treinos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              {status === 'Ativo' ? (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => handleChangeStatus('Inativo')}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Inativar Aluno
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => handleChangeStatus('Ativo')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Ativar Aluno
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="sticky bottom-0 z-10 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 justify-end p-4">
            <Button variant="outline" onClick={onVoltar}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatus === 'Ativo' ? 'Ativar' : 'Inativar'} Aluno?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus === 'Ativo' ? (
                <>
                  Ao ativar <span className="font-medium">{nome}</span>, ele terá acesso
                  novamente aos treinos e desafios da turma.
                </>
              ) : (
                <>
                  Ao inativar <span className="font-medium">{nome}</span>, ele não terá mais
                  acesso aos treinos e desafios. O histórico será mantido e você poderá
                  reativá-lo a qualquer momento.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarMudancaStatus}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
