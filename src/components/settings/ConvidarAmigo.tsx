import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Mail, MessageCircle, Trash2, Share2, Plus, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { ReferralService } from '../../lib/services';

interface Referral {
  id: string;
  email: string;
  status: 'SENT' | 'REGISTERED' | 'REWARDED';
  discount: number;
  sentAt: string;
  registeredAt: string | null;
}

interface Stats {
  totalConvites: number;
  recompensasRecebidas: number;
  descontoAcumulado: number;
}

export function ConvidarAmigo() {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [conviteParaExcluir, setConviteParaExcluir] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkAfiliado, setLinkAfiliado] = useState('');
  const [codigoAfiliado, setCodigoAfiliado] = useState('');
  const [convites, setConvites] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats>({ totalConvites: 0, recompensasRecebidas: 0, descontoAcumulado: 0 });
  const [novoEmail, setNovoEmail] = useState('');
  const [criandoConvite, setCriandoConvite] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [codeData, referrals, statsData] = await Promise.all([
        ReferralService.getMyCode(),
        ReferralService.getReferrals(),
        ReferralService.getStats()
      ]);

      setCodigoAfiliado(codeData.code);
      setLinkAfiliado(codeData.link);
      setConvites(referrals);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de indicações');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkAfiliado);
      setLinkCopiado(true);
      toast.success('Link copiado!', {
        description: 'O link de afiliado foi copiado para a área de transferência.',
      });
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch {
      toast.error('Erro ao copiar link', {
        description: 'Tente novamente ou copie manualmente.',
      });
    }
  };

  const handleCompartilharEmail = () => {
    const assunto = 'Conheça o TreinoGO - Gestão de Treinos';
    const corpo = `Olá!\n\nConheça o TreinoGO, uma plataforma incrível para gestão de treinos de corrida.\n\nUse meu link de convite: ${linkAfiliado}\n\nAbraços!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    toast.success('Email aberto!', {
      description: 'Seu cliente de email foi aberto com o convite.',
    });
  };

  const handleCompartilharWhatsApp = () => {
    const mensagem = `Olá! Conheça o TreinoGO, uma plataforma incrível para gestão de treinos de corrida.\n\nUse meu link de convite: ${linkAfiliado}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const handleCriarConvite = async () => {
    if (!novoEmail.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    try {
      setCriandoConvite(true);
      await ReferralService.createReferral(novoEmail.trim());
      toast.success('Convite criado!', {
        description: 'O convite foi registrado com sucesso.',
      });
      setNovoEmail('');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao criar convite', {
        description: error?.message || 'Tente novamente.',
      });
    } finally {
      setCriandoConvite(false);
    }
  };

  const handleExcluir = async (id: string) => {
    try {
      await ReferralService.deleteReferral(id);
      toast.success('Convite excluído', {
        description: 'O convite foi removido da sua lista.',
      });
      setConviteParaExcluir(null);
      loadData();
    } catch {
      toast.error('Erro ao excluir convite');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REWARDED':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Recompensa recebida</Badge>;
      case 'REGISTERED':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Cadastrado</Badge>;
      case 'SENT':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Enviado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

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
                <p className="text-3xl text-orange-900 mt-1">{stats.totalConvites}</p>
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
                <p className="text-3xl text-green-900 mt-1">{stats.recompensasRecebidas}</p>
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
                <p className="text-3xl text-blue-900 mt-1">{stats.descontoAcumulado}%</p>
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

      {/* Registrar Convite */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Convite</CardTitle>
          <CardDescription>
            Registre um email para acompanhar o convite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="email@exemplo.com"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCriarConvite}
              disabled={criandoConvite}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {criandoConvite ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
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
            {convites.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum convite registrado ainda. Comece convidando seus amigos!
              </p>
            ) : (
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
                      <TableCell>{formatDate(convite.sentAt)}</TableCell>
                      <TableCell>{formatDate(convite.registeredAt)}</TableCell>
                      <TableCell>
                        {convite.discount > 0 ? (
                          <span className="text-green-700 font-medium">{convite.discount}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConviteParaExcluir(convite.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">Como funciona:</span> Quando seu amigo se cadastrar
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
