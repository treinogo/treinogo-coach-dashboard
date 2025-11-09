import { useState } from 'react';
import { Gift, Copy, Check, Mail, MessageCircle, Edit, Trash2, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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

export function ConvidarAmigo() {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [conviteParaExcluir, setConviteParaExcluir] = useState<string | null>(null);

  // Link de afiliado do usuário
  const linkAfiliado = 'https://runcoachpro.com/ref/CARLOS2024';
  const codigoAfiliado = 'CARLOS2024';

  // Mock de convites enviados
  const convites = [
    {
      id: '1',
      email: 'joao.silva@email.com',
      status: 'Recompensa recebida',
      dataEnvio: '15/10/2024',
      dataCadastro: '18/10/2024',
      desconto: '10%',
    },
    {
      id: '2',
      email: 'maria.santos@email.com',
      status: 'Aguardando',
      dataEnvio: '20/10/2024',
      dataCadastro: '22/10/2024',
      desconto: '-',
    },
    {
      id: '3',
      email: 'pedro.costa@email.com',
      status: 'Enviado',
      dataEnvio: '01/11/2024',
      dataCadastro: '-',
      desconto: '-',
    },
    {
      id: '4',
      email: 'ana.oliveira@email.com',
      status: 'Recompensa recebida',
      dataEnvio: '05/10/2024',
      dataCadastro: '07/10/2024',
      desconto: '10%',
    },
  ];

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkAfiliado);
      setLinkCopiado(true);
      toast.success('✅ Link copiado!', {
        description: 'O link de afiliado foi copiado para a área de transferência.',
      });
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch (err) {
      toast.error('Erro ao copiar link', {
        description: 'Tente novamente ou copie manualmente.',
      });
    }
  };

  const handleCompartilharEmail = () => {
    const assunto = 'Conheça o RunCoach Pro - Gestão de Treinos';
    const corpo = `Olá!\n\nConheça o RunCoach Pro, uma plataforma incrível para gestão de treinos de corrida.\n\nUse meu link de convite: ${linkAfiliado}\n\nAbraços!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    toast.success('Email aberto!', {
      description: 'Seu cliente de email foi aberto com o convite.',
    });
  };

  const handleCompartilharWhatsApp = () => {
    const mensagem = `Olá! Conheça o RunCoach Pro, uma plataforma incrível para gestão de treinos de corrida.\n\nUse meu link de convite: ${linkAfiliado}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const handleEditar = (id: string) => {
    console.log('Editar convite:', id);
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleExcluir = (id: string) => {
    console.log('Excluir convite:', id);
    toast.success('Convite excluído', {
      description: 'O convite foi removido da sua lista.',
    });
    setConviteParaExcluir(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Recompensa recebida':
        return <Badge className="bg-green-100 text-green-700 border-green-300">✓ Recompensa recebida</Badge>;
      case 'Aguardando':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">⏳ Aguardando</Badge>;
      case 'Enviado':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">📧 Enviado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalDescontos = convites.filter(c => c.status === 'Recompensa recebida').length * 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 flex items-center gap-2">
          <Gift className="w-6 h-6 text-orange-600" />
          Convidar Amigo
        </h1>
        <p className="text-lg text-orange-600 mt-1">
          Convide e ganhe
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Para cada convite aceito e assinatura realizada, você ganha 10% de desconto na parcela do mês da sua assinatura
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Total de Convites</p>
                <p className="text-3xl text-orange-900 mt-1">{convites.length}</p>
              </div>
              <Share2 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Recompensas Recebidas</p>
                <p className="text-3xl text-green-900 mt-1">
                  {convites.filter(c => c.status === 'Recompensa recebida').length}
                </p>
              </div>
              <Gift className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Desconto Acumulado</p>
                <p className="text-3xl text-blue-900 mt-1">{totalDescontos}%</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link de Afiliado */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            Seu Link de Afiliado
          </CardTitle>
          <CardDescription>
            Compartilhe este link com seus amigos e colegas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={linkAfiliado}
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
                  Copiar
                </>
              )}
            </Button>
          </div>

          <div className="p-3 bg-white/60 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-900 mb-1">
              <span className="font-medium">Seu código de afiliado:</span> {codigoAfiliado}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Compartilhamento */}
      <Card>
        <CardHeader>
          <CardTitle>Compartilhar Convite</CardTitle>
          <CardDescription>
            Escolha a forma de compartilhar seu link de afiliado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={handleCompartilharEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Compartilhar por E-mail
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              onClick={handleCompartilharWhatsApp}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Compartilhar por WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Convites */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Convites</CardTitle>
          <CardDescription>
            Acompanhe os convites enviados e suas recompensas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convites.map((convite) => (
                  <TableRow key={convite.id}>
                    <TableCell className="font-medium">{convite.email}</TableCell>
                    <TableCell>{getStatusBadge(convite.status)}</TableCell>
                    <TableCell>{convite.dataEnvio}</TableCell>
                    <TableCell>{convite.dataCadastro}</TableCell>
                    <TableCell>
                      {convite.desconto !== '-' ? (
                        <span className="text-green-700 font-medium">{convite.desconto}</span>
                      ) : (
                        <span className="text-gray-400">{convite.desconto}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(convite.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConviteParaExcluir(convite.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">ℹ️ Como funciona:</span> Quando seu amigo se cadastrar
            usando seu link e realizar uma assinatura paga, você receberá 10% de desconto na
            próxima mensalidade. Os descontos são acumulativos até 100%.
          </p>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!conviteParaExcluir} onOpenChange={() => setConviteParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Convite?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O convite será removido do seu histórico, mas
              não afetará o cadastro do usuário caso já tenha se registrado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => conviteParaExcluir && handleExcluir(conviteParaExcluir)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
