import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { PlanosList } from './components/planos/PlanosList';
import { PlanoCriacao } from './components/planos/PlanoCriacao';
import { Desafios } from './components/desafios/Desafios';
import { TesteFisico } from './components/testes/TesteFisico';
import { Provas } from './components/provas/Provas';
import { Alunos } from './components/alunos/Alunos';
import { Assinaturas } from './components/settings/Assinaturas';
import { ConvidarAmigo } from './components/settings/ConvidarAmigo';
import { Configuracoes } from './components/settings/Configuracoes';
import { MeusDados } from './components/settings/MeusDados';

type Page = 'dashboard' | 'planos' | 'criar-plano' | 'desafios' | 'testes' | 'provas' | 'alunos' | 'assinaturas' | 'convidar-amigo' | 'configuracoes' | 'meus-dados';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'planos':
        return 'Planos de Treino';
      case 'criar-plano':
        return 'Criar Novo Plano';
      case 'desafios':
        return 'Desafios';
      case 'testes':
        return 'Testes Físicos';
      case 'provas':
        return 'Calendário de Provas';
      case 'alunos':
        return 'Alunos';
      case 'meus-dados':
        return 'Meus Dados';
      case 'assinaturas':
        return 'Assinaturas';
      case 'convidar-amigo':
        return 'Convidar Amigo';
      case 'configuracoes':
        return 'Configurações';
      default:
        return 'RunCoach Pro';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Visão geral do desempenho e atividades';
      case 'planos':
        return 'Gerencie seus planos de treino';
      case 'criar-plano':
        return 'Configure um novo plano de treino';
      case 'desafios':
        return 'Acompanhe os desafios motivacionais';
      case 'testes':
        return 'Registre e acompanhe testes físicos';
      case 'provas':
        return 'Gerencie o calendário de eventos';
      case 'alunos':
        return 'Gerencie seus atletas';
      case 'meus-dados':
        return 'Gerencie suas informações pessoais e profissionais';
      case 'assinaturas':
        return 'Gerencie seu plano e faturamento';
      case 'convidar-amigo':
        return 'Compartilhe e ganhe descontos';
      case 'configuracoes':
        return 'Segurança, integrações e preferências';
      default:
        return '';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'planos':
        return <PlanosList onNavigate={setCurrentPage} />;
      case 'criar-plano':
        return <PlanoCriacao onVoltar={() => setCurrentPage('planos')} />;
      case 'desafios':
        return <Desafios />;
      case 'testes':
        return <TesteFisico />;
      case 'provas':
        return <Provas />;
      case 'alunos':
        return <Alunos />;
      case 'meus-dados':
        return <MeusDados />;
      case 'assinaturas':
        return <Assinaturas />;
      case 'convidar-amigo':
        return <ConvidarAmigo />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 overflow-auto">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        
        <div className="p-8">
          {renderPage()}
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
