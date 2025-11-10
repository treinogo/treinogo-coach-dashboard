import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, PlusCircle, Trophy, Users, Settings, LogOut, Activity, Flag, MessageSquare, Star, Send, Menu, CreditCard, UserPlus, Gift, UserCircle, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { professorLogado } from '../../lib/mockData';
import { toast } from 'sonner';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleEnviarFeedback = () => {
    if (rating === 0) {
      toast.error('Avaliação obrigatória', {
        description: 'Por favor, selecione uma avaliação de 1 a 5 estrelas.',
      });
      return;
    }

    if (!categoria || !mensagem.trim()) {
      toast.error('Campos obrigatórios', {
        description: 'Preencha a categoria e a mensagem do feedback.',
      });
      return;
    }

    // Em produção, aqui seria enviado para API
    console.log('Feedback enviado:', { rating, categoria, mensagem });

    toast.success('✅ Feedback enviado com sucesso!', {
      description: 'Obrigado por nos ajudar a melhorar o RunCoach Pro!',
    });

    // Resetar formulário
    setRating(0);
    setHoverRating(0);
    setCategoria('');
    setMensagem('');
    setShowFeedbackModal(false);
  };
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'planos', label: 'Planos de Treino', icon: FileText, path: '/planos' },
    { id: 'desafios', label: 'Desafios', icon: Trophy, path: '/desafios' },
    { id: 'testes', label: 'Teste Físico', icon: Activity, path: '/testes' },
    { id: 'provas', label: 'Provas', icon: Flag, path: '/provas' },
    { id: 'alunos', label: 'Alunos', icon: Users, path: '/alunos' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo e Nome */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">RunCoach Pro</h1>
            <p className="text-sm text-gray-500">Gestão de Treinos</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || currentPage === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Feedback */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200">
          <p className="text-xs text-gray-900 mb-2">
            <span className="font-medium">💬 Sua opinião é importante</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white hover:bg-gray-50 border-orange-300 text-orange-700"
            onClick={() => setShowFeedbackModal(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ajuda e Sugestão
          </Button>
        </div>
      </div>

      {/* Perfil do Professor */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              aria-label="Menu do usuário"
            >
              <Avatar>
                <AvatarImage src={professorLogado.foto} alt={professorLogado.nome} />
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-gray-900 truncate">{professorLogado.nome}</p>
                <p className="text-xs text-gray-500">Professor</p>
              </div>
              <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate('meus-dados' as any)}>
              <UserCircle className="w-4 h-4 mr-2" />
              Meus Dados
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('assinaturas' as any)}>
              <CreditCard className="w-4 h-4 mr-2" />
              Assinaturas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('convidar-amigo' as any)}>
              <Gift className="w-4 h-4 mr-2" />
              Convidar Amigo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('configuracoes' as any)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                toast.success('Até logo!', {
                  description: 'Você foi desconectado com sucesso.',
                });
              }}
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal de Feedback */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajuda e Sugestão</DialogTitle>
            <DialogDescription>
              Sua opinião nos ajuda a melhorar! Avalie sua experiência e compartilhe seu feedback.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* CSAT - Avaliação com Estrelas */}
            <div className="space-y-3">
              <Label className="text-base">Quão bom é utilizar o RunCoach Pro?</Label>
              <div className="flex items-center justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                    aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  Você avaliou com {rating} estrela{rating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Categoria de Feedback */}
            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duvida">Dúvida</SelectItem>
                  <SelectItem value="problema">Problema</SelectItem>
                  <SelectItem value="elogio">Elogio</SelectItem>
                  <SelectItem value="sugestao">Sugestão de melhoria</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mensagem de Feedback */}
            <div className="space-y-2">
              <Label htmlFor="mensagem">
                Sua mensagem <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="mensagem"
                placeholder="Compartilhe sua experiência, dúvida ou sugestão..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Nota de Privacidade */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <span className="font-medium">🔒 Privacidade:</span> Seu feedback é anônimo e
                será usado apenas para melhorar a plataforma.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFeedbackModal(false);
                setRating(0);
                setHoverRating(0);
                setCategoria('');
                setMensagem('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEnviarFeedback}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
