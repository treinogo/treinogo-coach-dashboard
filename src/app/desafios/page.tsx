'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays, PlusCircle, CheckCircle2, XCircle, Users, Play, Pause, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { alunos, desafios, Desafio, DesafioParticipante } from '@/data/mockData';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

function sumKm(participantes: DesafioParticipante[]) {
  return participantes.reduce((acc, p) => acc + (p.km || 0), 0);
}

export default function DesafiosPage() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [lista, setLista] = useState<Desafio[]>(desafios);
  const [showCreate, setShowCreate] = useState(false);
  const [liberacaoTipo, setLiberacaoTipo] = useState<'todos' | 'selecionar'>('todos');
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<number>();
    lista.forEach((d) => anos.add(new Date(d.inicio).getFullYear()));
    return Array.from(anos).sort((a, b) => a - b);
  }, [lista]);

  const desafiosDoAno = useMemo(() => {
    return lista.filter((d) => new Date(d.inicio).getFullYear() === anoSelecionado);
  }, [lista, anoSelecionado]);

  // Form state
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const toggleAtivo = (id: string) => {
    setLista((prev) => prev.map((d) => (d.id === id ? { ...d, ativo: !d.ativo } : d)));
  };

  const handleCreate = () => {
    if (!nome || !inicio || !fim) return;
    const id = `d${Date.now()}`;
    let participantes: DesafioParticipante[];
    if (liberacaoTipo === 'todos') {
      participantes = alunos.map((a) => ({ alunoId: a.id, nome: a.nome, km: 0, status: 'inscrito' }));
    } else {
      participantes = alunos
        .filter((a) => selecionados.includes(a.id))
        .map((a) => ({ alunoId: a.id, nome: a.nome, km: 0, status: 'inscrito' }));
    }

    const novo: Desafio = {
      id,
      nome,
      descricao,
      inicio,
      fim,
      ativo: true,
      participantes,
    };
    setLista((prev) => [novo, ...prev]);
    setShowCreate(false);
    setNome('');
    setDescricao('');
    setInicio('');
    setFim('');
    setSelecionados([]);
    setLiberacaoTipo('todos');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Desafios</h1>
          <p className="text-sm text-gray-600">Gerencie os desafios do ano</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={() => setShowCreate(true)}>
          <PlusCircle className="h-5 w-5" />
          Criar desafio
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700">Ano</label>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        >
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {desafiosDoAno.map((d) => {
          const inscritos = d.participantes.length;
          const finalizados = d.participantes.filter((p) => p.status === 'finalizado').length;
          const kmTotal = sumKm(d.participantes);
          return (
            <div key={d.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-lg">{d.nome}</h2>
                  <p className="text-sm text-gray-600">{d.descricao}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${d.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {d.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(d.inicio)} — {formatDate(d.fim)}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-md p-2">
                  <p className="text-xs text-gray-500">Inscritos</p>
                  <p className="text-base font-semibold">{inscritos}</p>
                </div>
                <div className="bg-gray-50 rounded-md p-2">
                  <p className="text-xs text-gray-500">Finalizados</p>
                  <p className="text-base font-semibold">{finalizados}</p>
                </div>
                <div className="bg-gray-50 rounded-md p-2">
                  <p className="text-xs text-gray-500">Km corridos</p>
                  <p className="text-base font-semibold">{kmTotal}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm ${d.ativo ? 'bg-gray-100 text-gray-700' : 'bg-green-600 text-white'}`}
                  onClick={() => toggleAtivo(d.id)}
                >
                  {d.ativo ? (<><Pause className="h-4 w-4" /> Desativar</>) : (<><Play className="h-4 w-4" /> Ativar</>)}
                </button>
                <div className="text-xs text-gray-500 inline-flex items-center gap-1">
                  <Users className="h-4 w-4" /> Participantes
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Criar desafio</h2>
              <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => setShowCreate(false)}>
                <XCircle className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Desafio 50K"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  rows={2}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Explique o objetivo do desafio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Início</label>
                <input type="date" className="mt-1 w-full rounded-md border-gray-300" value={inicio} onChange={(e) => setInicio(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fim</label>
                <input type="date" className="mt-1 w-full rounded-md border-gray-300" value={fim} onChange={(e) => setFim(e.target.value)} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Liberação</p>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="liberacao" checked={liberacaoTipo === 'todos'} onChange={() => setLiberacaoTipo('todos')} />
                  <span className="text-sm">Todos os alunos</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="liberacao" checked={liberacaoTipo === 'selecionar'} onChange={() => setLiberacaoTipo('selecionar')} />
                  <span className="text-sm">Selecionar alunos</span>
                </label>
              </div>

              {liberacaoTipo === 'selecionar' && (
                <div className="mt-3 max-h-40 overflow-auto border rounded-md p-2">
                  <ul className="space-y-2">
                    {alunos.map((a) => (
                      <li key={a.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(a.id)}
                          onChange={(e) => {
                            setSelecionados((prev) =>
                              e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                            );
                          }}
                        />
                        <span className="text-sm">{a.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={() => setShowCreate(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleCreate}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}