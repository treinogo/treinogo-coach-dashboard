import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../components/dashboard/Dashboard';
import { PlanosList } from '../components/planos/PlanosList';
import { PlanoCriacao } from '../components/planos/PlanoCriacao';
import { Desafios } from '../components/desafios/Desafios';
import { TesteFisico } from '../components/testes/TesteFisico';
import { Provas } from '../components/provas/Provas';
import { Alunos } from '../components/alunos/Alunos';
import { Assinaturas } from '../components/settings/Assinaturas';
import { ConvidarAmigo } from '../components/settings/ConvidarAmigo';
import { Configuracoes } from '../components/settings/Configuracoes';
import { MeusDados } from '../components/settings/MeusDados';

interface AppRoutesProps {
  onNavigate: (page: string) => void;
}

export function AppRoutes({ onNavigate }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard onNavigate={onNavigate} />} />
      <Route path="/planos" element={<PlanosList onNavigate={onNavigate} />} />
      <Route path="/planos/criar" element={<PlanoCriacao onVoltar={() => window.history.back()} />} />
      <Route path="/planos/editar/:id" element={<PlanoCriacao onVoltar={() => window.history.back()} />} />
      <Route path="/desafios" element={<Desafios />} />
      <Route path="/testes" element={<TesteFisico />} />
      <Route path="/provas" element={<Provas />} />
      <Route path="/alunos" element={<Alunos />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/configuracoes/meus-dados" element={<MeusDados />} />
      <Route path="/configuracoes/assinaturas" element={<Assinaturas />} />
      <Route path="/configuracoes/convidar-amigo" element={<ConvidarAmigo />} />
    </Routes>
  );
}