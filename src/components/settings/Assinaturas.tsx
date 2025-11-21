import { useEffect, useState } from 'react';
import { Check, Crown, Zap, Rocket, Star, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { SubscriptionService } from '../../lib/services';

interface Plan {
  id: string;
  name: string;
  price: number | null;
  period: string;
  features: string[];
  popular?: boolean;
}

const iconMap: Record<string, any> = {
  free: Star,
  starter: Zap,
  pro: Crown,
  business: Rocket,
  enterprise: TrendingUp,
};

const colorMap: Record<string, { cor: string; bgCor: string; borderCor: string }> = {
  free: { cor: 'text-gray-600', bgCor: 'bg-gray-50', borderCor: 'border-gray-200' },
  starter: { cor: 'text-blue-600', bgCor: 'bg-blue-50', borderCor: 'border-blue-200' },
  pro: { cor: 'text-orange-600', bgCor: 'bg-orange-50', borderCor: 'border-orange-300' },
  business: { cor: 'text-purple-600', bgCor: 'bg-purple-50', borderCor: 'border-purple-200' },
  enterprise: { cor: 'text-indigo-600', bgCor: 'bg-indigo-50', borderCor: 'border-indigo-200' },
};

export function Assinaturas() {
  const [planoAtual, setPlanoAtual] = useState<string>('free');
  const [planos, setPlanos] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subscription, plans] = await Promise.all([
        SubscriptionService.getCurrentSubscription(),
        SubscriptionService.getPlans(),
      ]);
      setPlanoAtual(subscription?.planType?.toLowerCase() || 'free');
      setPlanos(plans);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planoId: string) => {
    if (planoId === 'enterprise') {
      window.open('mailto:contato@treinogo.com?subject=Interesse no plano Enterprise', '_blank');
      return;
    }

    try {
      setUpdating(planoId);
      await SubscriptionService.updateSubscription(planoId.toUpperCase());
      setPlanoAtual(planoId);
      alert('Plano atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Erro ao atualizar plano. Tente novamente.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900">Assinaturas</h1>
        <p className="text-sm text-gray-600 mt-1">
          Escolha o plano ideal para o seu negócio
        </p>
      </div>

      {/* Info sobre descontos */}
      <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-900">
            <span className="font-medium">💰 Dica:</span> Convide amigos e ganhe até 10% de
            desconto na sua assinatura! Acesse o menu "Convidar Amigo" para saber mais.
          </p>
        </CardContent>
      </Card>

      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {planos.map((plano) => {
          const Icon = iconMap[plano.id] || Star;
          const colors = colorMap[plano.id] || colorMap.free;
          const isAtual = plano.id === planoAtual;

          return (
            <Card
              key={plano.id}
              className={`relative ${
                isAtual
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md transition-shadow'
              }`}
            >
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white">Mais Popular</Badge>
                </div>
              )}

              {isAtual && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-blue-600 text-white">Plano Atual</Badge>
                </div>
              )}

              <CardHeader>
                <div className={`w-12 h-12 ${colors.bgCor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.cor}`} />
                </div>
                <CardTitle className="text-xl">{plano.name}</CardTitle>
                <div className="pt-4">
                  {plano.price !== null ? (
                    <>
                      <span className="text-3xl text-gray-900">
                        R$ {plano.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-gray-600">{plano.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl text-gray-900">{plano.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plano.features.map((recurso, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>

                {isAtual ? (
                  <Button className="w-full" variant="outline" disabled>
                    Plano Atual
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleUpgrade(plano.id)}
                    disabled={updating === plano.id}
                  >
                    {updating === plano.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {plano.price === null
                      ? 'Entrar em Contato'
                      : plano.id === 'free'
                      ? 'Downgrade'
                      : 'Fazer Upgrade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-1">Posso cancelar a qualquer momento?</p>
            <p className="text-sm text-gray-600">
              Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Como funciona o upgrade?</p>
            <p className="text-sm text-gray-600">
              O upgrade é proporcional. Você paga apenas a diferença do período restante.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Formas de pagamento aceitas?</p>
            <p className="text-sm text-gray-600">
              Aceitamos cartão de crédito, PIX e boleto bancário.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nota de Privacidade */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">🔒 Privacidade:</span> Seus dados de pagamento são
            processados de forma segura e criptografada. Não armazenamos informações de cartão
            de crédito.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
