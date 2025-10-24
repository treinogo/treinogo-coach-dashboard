'use client';

import React, { useState } from 'react';
import { Crown, CheckCircle, ArrowUpRight } from 'lucide-react';

type Plano = {
  id: string;
  nome: string;
  preco: string;
  beneficios: string[];
};

const planos: Plano[] = [
  { id: 'gratuito', nome: 'Gratuito', preco: 'R$ 0/mês', beneficios: ['Gestão básica de alunos', 'Planos limitados'] },
  { id: 'essencial', nome: 'Essencial', preco: 'R$ 29/mês', beneficios: ['Planos semanais', 'Relatórios simples'] },
  { id: 'pro', nome: 'Pro', preco: 'R$ 59/mês', beneficios: ['Planos avançados', 'Dashboard completo', 'Exportações'] },
  { id: 'elite', nome: 'Elite', preco: 'R$ 99/mês', beneficios: ['Automação de treino', 'Suporte prioritário', 'Integrações'] },
  { id: 'empresarial', nome: 'Empresarial', preco: 'Sob consulta', beneficios: ['Times de professores', 'Admin avançado'] },
];

export default function AssinaturasPage() {
  const [planoAtual, setPlanoAtual] = useState<string>('pro');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Crown className="h-6 w-6 text-amber-600" /> Assinaturas</h1>
      </div>

      <p className="text-sm text-gray-600">Escolha o plano que melhor atende às suas necessidades. Seu plano atual está marcado abaixo.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => {
          const isAtual = plano.id === planoAtual;
          return (
            <div key={plano.id} className={`card border ${isAtual ? 'border-amber-400' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{plano.nome}</h2>
                {isAtual ? (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full"><CheckCircle className="h-3 w-3" /> Plano atual</span>
                ) : (
                  <span className="text-xs text-gray-500">Disponível</span>
                )}
              </div>
              <p className="text-xl font-bold mb-3">{plano.preco}</p>
              <ul className="space-y-1 text-sm text-gray-700 mb-4">
                {plano.beneficios.map((b, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> {b}</li>
                ))}
              </ul>

              {isAtual ? (
                <button className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-gray-50" disabled>Seu plano atual</button>
              ) : (
                <button className="w-full btn-primary inline-flex items-center justify-center gap-2" onClick={() => setPlanoAtual(plano.id)}>
                  Fazer upgrade de assinatura <ArrowUpRight className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}