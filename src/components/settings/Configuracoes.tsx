import { useState, useEffect } from 'react';
import { Settings, Lock, Link2, Bell, Check, X, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { api } from '../../lib/api';

interface Integration {
  id: string;
  platform: 'STRAVA' | 'POLAR' | 'GARMIN';
  isConnected: boolean;
  lastSync: string | null;
}

export function Configuracoes() {
  // Alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Integrações
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(true);

  // Notificações
  const [emailNotificacoes, setEmailNotificacoes] = useState(true);
  const [emailRelatorios, setEmailRelatorios] = useState(true);
  const [emailDesafios, setEmailDesafios] = useState(false);
  const [pushNotificacoes, setPushNotificacoes] = useState(true);
  const [pushNovosAlunos, setPushNovosAlunos] = useState(true);
  const [pushTreinos, setPushTreinos] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
    loadIntegrations();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await api.get('/users/me/preferences');
      console.log('Resposta completa da API:', response);

      // A resposta já vem com .preferences direto
      const prefs = response.preferences;

      console.log('Preferências carregadas do banco:', prefs);

      if (prefs) {
        setEmailNotificacoes(prefs.emailNotifications ?? true);
        setEmailRelatorios(prefs.emailReports ?? true);
        setEmailDesafios(prefs.emailChallenges ?? false);
        setPushNotificacoes(prefs.pushNotifications ?? true);
        setPushNovosAlunos(prefs.pushNewAthletes ?? true);
        setPushTreinos(prefs.pushTrainings ?? false);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      toast.error('Erro ao carregar preferências', {
        description: 'Não foi possível carregar suas preferências.',
      });
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const loadIntegrations = async () => {
    try {
      const response = await api.get('/users/me/integrations');
      console.log('Resposta de integrações:', response);
      setIntegrations(response.integrations || []);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
    } finally {
      setIsLoadingIntegrations(false);
    }
  };

  const getIntegrationStatus = (platform: 'STRAVA' | 'POLAR' | 'GARMIN') => {
    const integration = integrations.find(i => i.platform === platform);
    return integration?.isConnected || false;
  };

  const getIntegrationLastSync = (platform: 'STRAVA' | 'POLAR' | 'GARMIN') => {
    const integration = integrations.find(i => i.platform === platform);
    if (!integration?.lastSync) return null;

    const lastSync = new Date(integration.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'há alguns minutos';
    if (diffHours === 1) return 'há 1 hora';
    if (diffHours < 24) return `há ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'há 1 dia';
    return `há ${diffDays} dias`;
  };

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error('Erro ao alterar senha', {
        description: 'Preencha todos os campos de senha.',
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('Senhas não conferem', {
        description: 'A nova senha e a confirmação devem ser iguais.',
      });
      return;
    }

    if (novaSenha.length < 8) {
      toast.error('Senha muito curta', {
        description: 'A senha deve ter no mínimo 8 caracteres.',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.post('/users/me/change-password', {
        currentPassword: senhaAtual,
        newPassword: novaSenha,
      });

      toast.success('✅ Senha alterada!', {
        description: 'Sua senha foi atualizada com sucesso.',
      });

      // Limpar campos
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);

      const errorMessage = error.message || 'Erro ao alterar senha';

      if (errorMessage.includes('Current password is incorrect')) {
        toast.error('Senha atual incorreta', {
          description: 'A senha atual informada está incorreta.',
        });
      } else {
        toast.error('Erro ao alterar senha', {
          description: errorMessage,
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleIntegration = async (platform: 'STRAVA' | 'POLAR' | 'GARMIN') => {
    const isCurrentlyConnected = getIntegrationStatus(platform);
    const platformName = platform.charAt(0) + platform.slice(1).toLowerCase();

    if (platform === 'STRAVA') {
      if (isCurrentlyConnected) {
        // Disconnect Strava
        try {
          await api.post('/integrations/strava/disconnect');
          await loadIntegrations();
          toast.success('Strava desconectado', {
            description: 'Sua conta Strava foi desconectada.',
          });
        } catch (error) {
          console.error('Erro ao desconectar Strava:', error);
          toast.error('Erro ao desconectar', {
            description: 'Não foi possível desconectar sua conta Strava.',
          });
        }
      } else {
        // Start Strava OAuth flow
        try {
          const response = await api.get('/integrations/strava/authorize');
          if (response.authUrl) {
            // Open Strava authorization in new window
            const width = 600;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            const authWindow = window.open(
              response.authUrl,
              'Strava Authorization',
              `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for OAuth callback
            const handleMessage = async (event: MessageEvent) => {
              if (event.data.type === 'strava-auth' && event.data.code) {
                try {
                  await api.post('/integrations/strava/callback', {
                    code: event.data.code,
                  });

                  await loadIntegrations();

                  toast.success('Strava conectado!', {
                    description: 'Sua conta Strava foi conectada com sucesso.',
                  });

                  // Close the auth window
                  authWindow?.close();
                } catch (error) {
                  console.error('Erro no callback do Strava:', error);
                  toast.error('Erro ao conectar', {
                    description: 'Não foi possível completar a conexão com Strava.',
                  });
                }

                window.removeEventListener('message', handleMessage);
              }
            };

            window.addEventListener('message', handleMessage);

            // Cleanup after 5 minutes
            setTimeout(() => {
              window.removeEventListener('message', handleMessage);
            }, 5 * 60 * 1000);
          }
        } catch (error) {
          console.error('Erro ao iniciar OAuth do Strava:', error);
          toast.error('Erro ao conectar', {
            description: 'Não foi possível iniciar a conexão com Strava.',
          });
        }
      }
    } else {
      // For Polar and Garmin (not implemented yet)
      try {
        await api.post(`/users/me/integrations/${platform}`, {
          connect: !isCurrentlyConnected
        });

        await loadIntegrations();

        if (!isCurrentlyConnected) {
          toast.success(`${platformName} conectado!`, {
            description: `Sua conta ${platformName} foi conectada com sucesso.`,
          });
        } else {
          toast.success(`${platformName} desconectado`, {
            description: `Sua conta ${platformName} foi desconectada.`,
          });
        }
      } catch (error) {
        console.error(`Erro ao ${isCurrentlyConnected ? 'desconectar' : 'conectar'} ${platformName}:`, error);
        toast.error('Erro na integração', {
          description: `Não foi possível ${isCurrentlyConnected ? 'desconectar' : 'conectar'} ${platformName}.`,
        });
      }
    }
  };

  const handleSalvarPreferencias = async () => {
    setIsSavingPreferences(true);

    const preferencesToSave = {
      emailNotifications: emailNotificacoes,
      emailReports: emailRelatorios,
      emailChallenges: emailDesafios,
      pushNotifications: pushNotificacoes,
      pushNewAthletes: pushNovosAlunos,
      pushTrainings: pushTreinos,
    };

    console.log('Salvando preferências:', preferencesToSave);

    try {
      const response = await api.put('/users/me/preferences', preferencesToSave);
      console.log('Resposta do backend:', response);

      toast.success('Preferências salvas!', {
        description: 'Suas preferências de notificação foram atualizadas.',
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências', {
        description: 'Não foi possível salvar suas preferências. Tente novamente.',
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Configurações
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie segurança, integrações e preferências
        </p>
      </div>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            Segurança - Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura com uma senha forte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">
                Senha Atual <span className="text-red-500">*</span>
              </Label>
              <Input
                id="senhaAtual"
                type="password"
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="novaSenha">
                Nova Senha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="novaSenha"
                type="password"
                placeholder="Digite a nova senha (mín. 8 caracteres)"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">
                Confirmar Nova Senha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>

          {/* Requisitos de Senha */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-900 font-medium mb-2">
              Requisitos de senha:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                Mínimo de 8 caracteres
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                Recomendado: letras maiúsculas e minúsculas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                Recomendado: números e caracteres especiais
              </li>
            </ul>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={handleAlterarSenha}
              disabled={isChangingPassword}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-600" />
            Integrações
          </CardTitle>
          <CardDescription>
            Conecte suas contas de dispositivos e plataformas de treino
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strava */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#FC4C02">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">Strava</h3>
                  {getIntegrationStatus('STRAVA') && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <Check className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Sincronize automaticamente seus treinos e atividades do Strava
                </p>
                {getIntegrationStatus('STRAVA') && getIntegrationLastSync('STRAVA') && (
                  <p className="text-xs text-gray-500 mt-2">
                    Última sincronização: {getIntegrationLastSync('STRAVA')}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleToggleIntegration('STRAVA')}
              variant={getIntegrationStatus('STRAVA') ? 'outline' : 'default'}
              className={getIntegrationStatus('STRAVA') ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'bg-orange-600 hover:bg-orange-700'}
              disabled={isLoadingIntegrations}
            >
              {getIntegrationStatus('STRAVA') ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Desconectar
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>

          {/* Polar */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#E02020">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">Polar</h3>
                  {getIntegrationStatus('POLAR') && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <Check className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Importe dados de treino e frequência cardíaca dos dispositivos Polar
                </p>
                {getIntegrationStatus('POLAR') && getIntegrationLastSync('POLAR') && (
                  <p className="text-xs text-gray-500 mt-2">
                    Última sincronização: {getIntegrationLastSync('POLAR')}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleToggleIntegration('POLAR')}
              variant={getIntegrationStatus('POLAR') ? 'outline' : 'default'}
              className={getIntegrationStatus('POLAR') ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'bg-red-600 hover:bg-red-700'}
              disabled={isLoadingIntegrations}
            >
              {getIntegrationStatus('POLAR') ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Desconectar
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>

          {/* Garmin */}
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#007CC3">
                  <path d="M12.9 3.6c0-.5-.4-.9-.9-.9s-.9.4-.9.9V6c0 .5.4.9.9.9s.9-.4.9-.9V3.6zm8.1 7.5c-.5 0-.9.4-.9.9s.4.9.9.9h2.4c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H21zM3.6 11.1c-.5 0-.9.4-.9.9s.4.9.9.9H6c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H3.6zm15.3-5.4l1.7-1.7c.3-.3.3-.9 0-1.2s-.9-.3-1.2 0l-1.7 1.7c-.3.3-.3.9 0 1.2.3.3.9.3 1.2 0zm-13.2 0c.3.3.9.3 1.2 0s.3-.9 0-1.2L5.2 2.8c-.3-.3-.9-.3-1.2 0s-.3.9 0 1.2l1.7 1.7zM12 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0 4.2c-.5 0-.9.4-.9.9v2.4c0 .5.4.9.9.9s.9-.4.9-.9v-2.4c0-.5-.4-.9-.9-.9z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">Garmin</h3>
                  {getIntegrationStatus('GARMIN') && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <Check className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Conecte com Garmin Connect para sincronizar atividades e métricas
                </p>
                {getIntegrationStatus('GARMIN') && getIntegrationLastSync('GARMIN') && (
                  <p className="text-xs text-gray-500 mt-2">
                    Última sincronização: {getIntegrationLastSync('GARMIN')}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleToggleIntegration('GARMIN')}
              variant={getIntegrationStatus('GARMIN') ? 'outline' : 'default'}
              className={getIntegrationStatus('GARMIN') ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'bg-blue-600 hover:bg-blue-700'}
              disabled={isLoadingIntegrations}
            >
              {getIntegrationStatus('GARMIN') ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Desconectar
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-900">
              <span className="font-medium">ℹ️ Sobre integrações:</span> Os dados são
              sincronizados automaticamente a cada hora. Você pode desconectar a qualquer momento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferências de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Preferências de Notificação
          </CardTitle>
          <CardDescription>
            Escolha como e quando deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notificações por E-mail */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Notificações por E-mail</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Notificações gerais</p>
                  <p className="text-xs text-gray-500">Atualizações importantes da plataforma</p>
                </div>
                <Switch
                  checked={emailNotificacoes}
                  onCheckedChange={setEmailNotificacoes}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Relatórios semanais</p>
                  <p className="text-xs text-gray-500">Resumo semanal de desempenho dos alunos</p>
                </div>
                <Switch
                  checked={emailRelatorios}
                  onCheckedChange={setEmailRelatorios}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Desafios completados</p>
                  <p className="text-xs text-gray-500">Quando um aluno completar um desafio</p>
                </div>
                <Switch
                  checked={emailDesafios}
                  onCheckedChange={setEmailDesafios}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Notificações Push */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Notificações Push (Navegador)</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Notificações push</p>
                  <p className="text-xs text-gray-500">Receba alertas no navegador em tempo real</p>
                </div>
                <Switch
                  checked={pushNotificacoes}
                  onCheckedChange={setPushNotificacoes}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Novos alunos</p>
                  <p className="text-xs text-gray-500">Quando um novo aluno se cadastrar</p>
                </div>
                <Switch
                  checked={pushNovosAlunos}
                  onCheckedChange={setPushNovosAlunos}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Treinos concluídos</p>
                  <p className="text-xs text-gray-500">Quando um aluno completar um treino</p>
                </div>
                <Switch
                  checked={pushTreinos}
                  onCheckedChange={setPushTreinos}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={handleSalvarPreferencias}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSavingPreferences || isLoadingPreferences}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavingPreferences ? 'Salvando...' : 'Salvar Preferências'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nota de Privacidade */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-medium">🔒 Segurança:</span> Todas as suas integrações são
            protegidas com OAuth 2.0 e criptografia de ponta a ponta. Seus dados de login não
            são armazenados em nossos servidores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
