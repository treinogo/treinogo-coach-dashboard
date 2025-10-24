'use client';

import React, { useState } from 'react';
import { dashboardData, provas, desafios, feedTreinos } from '@/data/mockData';
import { Bell, Users, Calendar, AlertTriangle, CalendarDays, Eye, ThumbsUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { totalAlunos, treinosAtivos, treinosInativos, atividadeMensal, notificacoes } = dashboardData;
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState<number>(hoje.getMonth());
  const provasDoMes = provas.filter((p) => new Date(p.data).getMonth() === mesSelecionado);
  const [mesDesafiosSelecionado, setMesDesafiosSelecionado] = useState<number>(hoje.getMonth());
  const desafiosDoMes = desafios.filter((d) => {
    const inicio = new Date(d.inicio);
    const fim = new Date(d.fim);
    const mesInicio = inicio.getMonth();
    const mesFim = fim.getMonth();
    const anoInicio = inicio.getFullYear();
    const anoFim = fim.getFullYear();
    const anoAtual = hoje.getFullYear();
    const estaNoMes = anoInicio <= anoAtual && anoFim >= anoAtual && mesDesafiosSelecionado >= mesInicio && mesDesafiosSelecionado <= mesFim;
    return d.ativo && estaNoMes;
  });
  const [popoverAbertoId, setPopoverAbertoId] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>(() => Object.fromEntries(feedTreinos.map(f => [f.id, f.likes])));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Total de Alunos</h2>
            <p className="text-3xl font-bold text-primary">{totalAlunos}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Treinos Ativos</h2>
            <p className="text-3xl font-bold text-green-600">{treinosAtivos}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-orange-100 mr-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Treinos Inativos</h2>
            <p className="text-3xl font-bold text-orange-600">{treinosInativos}</p>
          </div>
        </div>
      </div>
      
      {/* Gráfico de atividade mensal */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Atividade Mensal</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={atividadeMensal}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="treinos" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provas do mês corrente */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Provas do mês</h2>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <select
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(Number(e.target.value))}
            >
              {meses.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        {provasDoMes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma prova neste mês.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {provasDoMes.map((prova) => (
              <div key={prova.id} className="p-3 rounded-md border border-gray-200 bg-white">
                <div className="font-medium text-gray-800">{prova.nome}</div>
                <div className="text-sm text-gray-600">{new Date(prova.data).toLocaleDateString('pt-BR')}</div>
                <div className="text-sm text-gray-700 mt-1">Cidade: <span className="font-medium">{prova.cidade}</span></div>
                <div className="text-sm text-gray-700">Percursos: <span className="font-medium">{prova.percursos.join(', ')}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desafios do mês */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Desafios do mês</h2>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <select
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={mesDesafiosSelecionado}
              onChange={(e) => setMesDesafiosSelecionado(Number(e.target.value))}
            >
              {meses.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        {desafiosDoMes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum desafio ativo neste mês.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {desafiosDoMes.map((d) => (
              <div key={d.id} className="p-3 rounded-md border border-gray-200 bg-white relative">
                <div className="font-medium text-gray-800">{d.nome}</div>
                <div className="text-sm text-gray-600">{new Date(d.inicio).toLocaleDateString('pt-BR')} — {new Date(d.fim).toLocaleDateString('pt-BR')}</div>
                <div className="text-sm text-gray-700 mt-1">Inscritos: <span className="font-medium">{d.participantes.length}</span></div>
                <div className="mt-2">
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm btn-secondary"
                    onClick={() => setPopoverAbertoId(popoverAbertoId === d.id ? null : d.id)}
                  >
                    <Eye className="h-4 w-4" /> Visualizar
                  </button>
                </div>
                {popoverAbertoId === d.id && (
                  <div className="absolute top-2 right-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                    <div className="text-sm font-medium mb-2">Alunos inscritos</div>
                    <ul className="max-h-40 overflow-auto text-sm">
                      {d.participantes.map((p) => (
                        <li key={p.alunoId} className="py-1 border-b last:border-b-0">
                          {p.nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feed dos alunos */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Atividade dos alunos</h2>
        <div className="space-y-3">
          {feedTreinos.map((f) => (
            <div key={f.id} className="p-3 rounded-md border border-gray-200 bg-white flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-800">{f.alunoNome}</div>
                <div className="text-sm text-gray-700">{f.descricao}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(f.data).toLocaleString('pt-BR')}</div>
              </div>
              <button
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100"
                onClick={() => setLikes((prev) => ({ ...prev, [f.id]: (prev[f.id] ?? 0) + 1 }))}
                aria-label="Curtir"
              >
                <ThumbsUp className="h-4 w-4" /> {likes[f.id] ?? 0}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notificações */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notificações</h2>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notificacoes.filter(n => !n.lida).length} novas
          </span>
        </div>
        <div className="space-y-4">
          {notificacoes.map((notificacao) => (
            <div 
              key={notificacao.id} 
              className={`p-3 rounded-md flex items-start ${
                notificacao.lida ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-primary'
              }`}
            >
              <Bell className={`h-5 w-5 mr-3 ${notificacao.lida ? 'text-gray-400' : 'text-primary'}`} />
              <div>
                <p className={`${notificacao.lida ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                  {notificacao.mensagem}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notificacao.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}