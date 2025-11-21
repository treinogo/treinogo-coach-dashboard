import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AppRoutes } from './routes/AppRoutes';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Allow OAuth callback routes without authentication
  const isOAuthCallback = location.pathname.startsWith('/auth/');

  const handleNavigate = (page: string) => {
    // Mapear os nomes das páginas antigas para as rotas
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'planos': '/planos',
      'criar-plano': '/planos/criar',
      'desafios': '/desafios',
      'testes': '/testes',
      'provas': '/provas',
      'alunos': '/alunos',
      'configuracoes': '/configuracoes',
      'meus-dados': '/configuracoes/meus-dados',
      'assinaturas': '/configuracoes/assinaturas',
      'convidar-amigo': '/configuracoes/convidar-amigo',
    };
    
    navigate(routeMap[page] || '/dashboard');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/planos':
        return 'Planos de Treino';
      case '/planos/criar':
        return 'Criar Novo Plano';
      case '/desafios':
        return 'Desafios';
      case '/testes':
        return 'Testes Físicos';
      case '/provas':
        return 'Calendário de Provas';
      case '/alunos':
        return 'Alunos';
      case '/configuracoes/meus-dados':
        return 'Meus Dados';
      case '/configuracoes/assinaturas':
        return 'Assinaturas';
      case '/configuracoes/convidar-amigo':
        return 'Convidar Amigo';
      case '/configuracoes':
        return 'Configurações';
      default:
        if (path.startsWith('/planos/editar/')) {
          return 'Editar Plano';
        }
        return 'RunCoach Pro';
    }
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Visão geral do desempenho e atividades';
      case '/planos':
        return 'Gerencie seus planos de treino';
      case '/planos/criar':
        return 'Configure um novo plano de treino';
      case '/desafios':
        return 'Acompanhe os desafios motivacionais';
      case '/testes':
        return 'Registre e acompanhe testes físicos';
      case '/provas':
        return 'Gerencie o calendário de eventos';
      case '/alunos':
        return 'Gerencie seus atletas';
      case '/configuracoes/meus-dados':
        return 'Gerencie suas informações pessoais e profissionais';
      case '/configuracoes/assinaturas':
        return 'Gerencie seu plano e faturamento';
      case '/configuracoes/convidar-amigo':
        return 'Compartilhe e ganhe descontos';
      case '/configuracoes':
        return 'Segurança, integrações e preferências';
      default:
        if (path.startsWith('/planos/editar/')) {
          return 'Modifique os detalhes e programação do plano';
        }
        return '';
    }
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    // Mapear rotas para os nomes de páginas antigos para compatibilidade com Sidebar
    switch (path) {
      case '/dashboard':
        return 'dashboard';
      case '/planos':
        return 'planos';
      case '/planos/criar':
        return 'criar-plano';
      case '/desafios':
        return 'desafios';
      case '/testes':
        return 'testes';
      case '/provas':
        return 'provas';
      case '/alunos':
        return 'alunos';
      case '/configuracoes':
        return 'configuracoes';
      case '/configuracoes/meus-dados':
        return 'meus-dados';
      case '/configuracoes/assinaturas':
        return 'assinaturas';
      case '/configuracoes/convidar-amigo':
        return 'convidar-amigo';
      default:
        return 'dashboard';
    }
  };

  // Check authentication
  if (isLoading && !isOAuthCallback) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated && !isOAuthCallback) {
    const landingPageUrl = import.meta.env.VITE_LANDING_PAGE_URL || 'http://localhost:5173';
    window.location.href = `${landingPageUrl}?message=${encodeURIComponent('Você precisa estar autenticado para acessar o dashboard')}`;
    return <LoadingSpinner />;
  }

  // Render OAuth callback without layout
  if (isOAuthCallback) {
    return (
      <>
        <AppRoutes onNavigate={handleNavigate} />
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      
      <main className="flex-1 overflow-auto">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        
        <div className="p-8">
          <AppRoutes onNavigate={handleNavigate} />
        </div>
      </main>

      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
