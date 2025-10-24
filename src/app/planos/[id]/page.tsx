'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { planosTreino, categorias, alunos } from '@/data/mockData';

export default function VisualizarPlano() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');
  const plano = planosTreino.find((p) => p.id === id);

  if (!plano) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Plano não encontrado</h1>
        <Link href="/planos" className="btn-secondary">Voltar</Link>
      </div>
    );
  }

  const categoria = categorias.find((c) => c.id === plano.categoriaId);
  const alunosAtivos = alunos.filter((a) => a.objetivo === (categoria?.nome || ''));
  const kmSemanalEstimado = plano.estruturaSemanal.reduce((km, t) => {
    const adicional = t.tipo === 'longo' ? 12 : Math.round(t.duracao * 0.12);
    return km + adicional;
  }, 0);
  const kmMensalEstimado = Math.round(kmSemanalEstimado * 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Visualizar treino</h1>
        <Link href="/planos" className="btn-secondary">Voltar</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{plano.nome}</h2>
                <div className="flex items-center mt-1">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mr-2">
                    {categoria?.nome}
                  </span>
                  <span className="text-sm text-gray-500">{plano.diasPorSemana} dias/semana</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  plano.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {plano.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium mb-2">Estrutura Semanal</h3>
            <div className="space-y-2">
              {plano.estruturaSemanal.map((treino, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="w-20 font-medium">{treino.dia}:</span>
                  <span className="capitalize">{treino.tipo}</span>
                  <span className="text-gray-600 text-xs ml-2">{treino.duracao} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-medium mb-2">Meta & criação</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="font-medium">Categoria:</span> {categoria?.nome}</div>
              <div><span className="font-medium">Data de criação:</span> —</div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium mb-2">Alunos ativos neste treino</h3>
            {alunosAtivos.length === 0 ? (
              <div className="text-sm text-gray-500">Nenhum aluno ativo vinculado.</div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Treinos realizados (mês)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quilometragem percorrida (mês)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alunosAtivos.map((a) => (
                      <tr key={a.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">{a.nome}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{plano.diasPorSemana * 4}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{kmMensalEstimado} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="btn-secondary"
              onClick={() => {
                // Placeholder de duplicação
                alert('Treino duplicado (mock).');
              }}
            >
              Duplicar
            </button>
            <button
              className="btn-primary bg-red-600 hover:bg-red-700"
              onClick={() => {
                // Placeholder de exclusão
                alert('Treino excluído (mock).');
                router.push('/planos');
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}