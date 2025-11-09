import { useState } from 'react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Aluno } from '../../types';

interface AlunoAdicionarProps {
  onVoltar: () => void;
  onSalvar: (aluno: Partial<Aluno>) => void;
}

export function AlunoAdicionar({ onVoltar, onSalvar }: AlunoAdicionarProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [nivel, setNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [status, setStatus] = useState<'Pendente' | 'Ativo' | 'Inativo'>('Ativo');

  const handleSalvar = () => {
    if (!nome || !email || !idade) {
      toast.error('Erro ao salvar', {
        description: 'Preencha os campos obrigatórios: Nome, E-mail e Idade',
      });
      return;
    }

    const novoAluno: Partial<Aluno> = {
      nome,
      email,
      telefone,
      idade: Number(idade),
      nivel,
      status,
      progressoAtual: 0,
      treinosConcluidos: 0,
      tempoMedio: '-',
      ritmoMedio: '-',
      dataCadastro: new Date(),
    };

    onSalvar(novoAluno);
    toast.success('✅ Aluno adicionado com sucesso!', {
      description: `${nome} foi cadastrado na turma.`,
    });
    onVoltar();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onVoltar}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">Adicionar Novo Aluno</h1>
          <p className="text-sm text-gray-600 mt-1">
            Preencha os dados do aluno para cadastrá-lo na turma
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
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
              <Label htmlFor="status">Status Inicial</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Pendente">Pendente (Aguardando Aprovação)</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Alunos com status "Pendente" precisarão ser aprovados antes de acessar os treinos
              </p>
            </div>
          </div>

          {/* Nota de Privacidade */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">🔒 Privacidade:</span> Os dados pessoais do aluno são
              armazenados de forma segura e serão utilizados apenas para gestão de treinos.
              Você pode editar ou remover essas informações a qualquer momento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="sticky bottom-0 z-10 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 justify-end p-4">
            <Button variant="outline" onClick={onVoltar}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Aluno
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
