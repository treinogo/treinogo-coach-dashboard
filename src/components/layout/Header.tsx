import { Bell, Search, LogOut, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { notificacoesMock } from '../../lib/mockData';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const notificacoesNaoLidas = notificacoesMock.filter(n => !n.lida).length;

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'sucesso':
        return '✅';
      case 'alerta':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'erro':
        return '❌';
      default:
        return '📌';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar alunos, planos ou desafios..."
              className="pl-10"
              aria-label="Buscar"
            />
          </div>

          {/* Notificações */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative" aria-label="Notificações">
                <Bell className="w-5 h-5" />
                {notificacoesNaoLidas > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notificacoesNaoLidas}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h3 className="text-gray-900">Notificações</h3>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {notificacoesMock.map((notificacao) => (
                      <div
                        key={notificacao.id}
                        className={`p-3 rounded-lg border ${
                          notificacao.lida
                            ? 'bg-white border-gray-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getIconeNotificacao(notificacao.tipo)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{notificacao.mensagem}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notificacao.data.toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu do usuário">
                <User className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <div className="px-2 py-1 border-b">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
