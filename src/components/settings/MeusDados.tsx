import { useState } from 'react';
import { User, Save, Camera, MapPin, Phone, Mail, Calendar, Briefcase, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { professorLogado } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

export function MeusDados() {
  // Dados Pessoais
  const [nome, setNome] = useState(professorLogado.nome);
  const [email, setEmail] = useState(professorLogado.email);
  const [telefone, setTelefone] = useState('(11) 98765-4321');
  const [dataNascimento, setDataNascimento] = useState('1985-05-15');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [profissao, setProfissao] = useState('Professor de Educação Física');

  // Endereço
  const [cep, setCep] = useState('01310-100');
  const [logradouro, setLogradouro] = useState('Avenida Paulista');
  const [numero, setNumero] = useState('1578');
  const [complemento, setComplemento] = useState('Sala 42');
  const [bairro, setBairro] = useState('Bela Vista');
  const [cidade, setCidade] = useState('São Paulo');
  const [estado, setEstado] = useState('SP');

  // Informações Adicionais
  const [biografia, setBiografia] = useState(
    'Professor de Educação Física com mais de 10 anos de experiência em treinamento de corrida de rua. Especializado em preparação para maratonas e meias maratonas.'
  );
  const [especializacao, setEspecializacao] = useState('Treinamento para Maratonas');
  const [cref, setCref] = useState('CREF 123456-G/SP');
  const [site, setSite] = useState('www.carlossilva.com.br');

  const handleSalvarDados = () => {
    if (!nome || !email) {
      toast.error('Erro ao salvar', {
        description: 'Preencha os campos obrigatórios: Nome e E-mail',
      });
      return;
    }

    // Em produção, aqui seria feita a chamada à API
    console.log('Dados salvos:', {
      nome,
      email,
      telefone,
      dataNascimento,
      cpf,
      profissao,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      biografia,
      especializacao,
      cref,
      site,
    });

    toast.success('✅ Dados atualizados!', {
      description: 'Suas informações foram atualizadas com sucesso.',
    });
  };

  const handleAlterarFoto = () => {
    toast.info('Funcionalidade em desenvolvimento', {
      description: 'Em breve você poderá alterar sua foto de perfil.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Meus Dados
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie suas informações pessoais e profissionais
        </p>
      </div>

      {/* Foto de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>
            Atualize sua foto de perfil visível para seus alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={professorLogado.foto} alt={nome} />
                <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <button
                onClick={handleAlterarFoto}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                aria-label="Alterar foto"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={handleAlterarFoto}>
                Alterar Foto
              </Button>
              <p className="text-xs text-gray-500">
                JPG, PNG ou GIF. Tamanho máximo de 2MB.
              </p>
              <p className="text-xs text-gray-600">
                Resolução recomendada: 400x400 pixels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Dados Pessoais
          </CardTitle>
          <CardDescription>
            Informações básicas sobre você
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
                placeholder="Digite seu nome completo"
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
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="123.456.789-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            {/* Profissão */}
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="profissao"
                  placeholder="Ex: Professor de Educação Física"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Endereço
          </CardTitle>
          <CardDescription>
            Informações do seu endereço profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="UF"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                maxLength={2}
              />
            </div>

            {/* Logradouro */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                placeholder="Rua, Avenida, etc."
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
              />
            </div>

            {/* Número */}
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                placeholder="123"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>

            {/* Complemento */}
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                placeholder="Apto, Sala, etc."
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Nome da cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Informações Adicionais
          </CardTitle>
          <CardDescription>
            Informações profissionais e sobre sua atuação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Biografia */}
            <div className="space-y-2">
              <Label htmlFor="biografia">Biografia Profissional</Label>
              <Textarea
                id="biografia"
                placeholder="Conte um pouco sobre sua experiência e especialidades..."
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Esta biografia será visível para seus alunos no perfil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Especialização */}
              <div className="space-y-2">
                <Label htmlFor="especializacao">Especialização Principal</Label>
                <Input
                  id="especializacao"
                  placeholder="Ex: Treinamento para Maratonas"
                  value={especializacao}
                  onChange={(e) => setEspecializacao(e.target.value)}
                />
              </div>

              {/* CREF */}
              <div className="space-y-2">
                <Label htmlFor="cref">CREF (Registro Profissional)</Label>
                <Input
                  id="cref"
                  placeholder="CREF 000000-G/UF"
                  value={cref}
                  onChange={(e) => setCref(e.target.value)}
                />
              </div>

              {/* Site */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="site">Site / Portfolio</Label>
                <Input
                  id="site"
                  type="url"
                  placeholder="www.seusite.com.br"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end gap-3 sticky bottom-6 bg-gray-50 py-4 -mx-8 px-8 border-t border-gray-200">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancelar
        </Button>
        <Button onClick={handleSalvarDados} className="bg-blue-600 hover:bg-blue-700 min-w-[200px]">
          <Save className="w-4 h-4 mr-2" />
          Salvar Todas as Alterações
        </Button>
      </div>

      {/* Nota de Privacidade */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">🔒 Privacidade:</span> Seus dados pessoais são
            armazenados de forma segura e criptografada. Apenas você e seus alunos (informações
            de perfil público) têm acesso a essas informações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
