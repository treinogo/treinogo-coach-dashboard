import { Check, Crown, Zap, Rocket, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function Assinaturas() {
  const planoAtual = 'pro'; // Simulando o plano atual do usuário

  const planos = [
    {
      id: 'free',
      nome: 'Gratuito',
      icon: Star,
      preco: 0,
      periodo: 'Sempre grátis',
      cor: 'text-gray-600',
      bgCor: 'bg-gray-50',
      borderCor: 'border-gray-200',
      recursos: [
        'Até 5 alunos',
        '1 plano de treino',
        'Relatórios básicos',
        'Suporte por email',
      ],
    },
    {
      id: 'starter',
      nome: 'Starter',
      icon: Zap,
      preco: 49.90,
      periodo: '/mês',
      cor: 'text-blue-600',
      bgCor: 'bg-blue-50',
      borderCor: 'border-blue-200',
      recursos: [
        'Até 20 alunos',
        'Planos ilimitados',
        'Relatórios avançados',
        'Desafios e gamificação',
        'Suporte prioritário',
      ],
    },
    {
      id: 'pro',
      nome: 'Pro',
      icon: Crown,
      preco: 99.90,
      periodo: '/mês',
      cor: 'text-orange-600',
      bgCor: 'bg-orange-50',
      borderCor: 'border-orange-300',
      popular: true,
      recursos: [
        'Até 50 alunos',
        'Planos ilimitados',
        'Relatórios personalizados',
        'Desafios e gamificação',
        'Testes físicos integrados',
        'Calendário de provas',
        'Suporte 24/7',
      ],
    },
    {
      id: 'business',
      nome: 'Business',
      icon: Rocket,
      preco: 199.90,
      periodo: '/mês',
      cor: 'text-purple-600',
      bgCor: 'bg-purple-50',
      borderCor: 'border-purple-200',
      recursos: [
        'Até 150 alunos',
        'Tudo do Pro +',
        'API de integração',
        'Branding personalizado',
        'Múltiplos professores',
        'Análises com IA',
        'Gerente de conta dedicado',
      ],
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      icon: TrendingUp,
      preco: null,
      periodo: 'Personalizado',
      cor: 'text-indigo-600',
      bgCor: 'bg-indigo-50',
      borderCor: 'border-indigo-200',
      recursos: [
        'Alunos ilimitados',
        'Tudo do Business +',
        'Infraestrutura dedicada',
        'SLA garantido',
        'Treinamento da equipe',
        'Consultoria estratégica',
        'Suporte premium',
      ],
    },
  ];

  const handleUpgrade = (planoId: string) => {
    console.log('Upgrade para:', planoId);
    // Em produção, redirecionaria para página de pagamento
  };

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
          const Icon = plano.icon;
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
                <div className={`w-12 h-12 ${plano.bgCor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${plano.cor}`} />
                </div>
                <CardTitle className="text-xl">{plano.nome}</CardTitle>
                <div className="pt-4">
                  {plano.preco !== null ? (
                    <>
                      <span className="text-3xl text-gray-900">
                        R$ {plano.preco.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-gray-600">{plano.periodo}</span>
                    </>
                  ) : (
                    <span className="text-2xl text-gray-900">{plano.periodo}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plano.recursos.map((recurso, index) => (
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
                  >
                    {plano.preco === null
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
