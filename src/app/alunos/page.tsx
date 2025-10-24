'use client';

import React, { useState, useEffect } from 'react';
import { alunos } from '@/data/mockData';
import type { Aluno } from '@/data/mockData';
import { Search, Edit, Trash, Eye, Plus, X, Copy } from 'lucide-react';

export default function Alunos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [nivelFiltro, setNivelFiltro] = useState('');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const professorKey = 'prof-123';

  const historicoMensal = [
    { mes: 'Jan', plano: '10K Avançado', km: 85 },
    { mes: 'Fev', plano: 'Meia Maratona Intermediário', km: 92 },
    { mes: 'Mar', plano: '10K Avançado', km: 78 },
    { mes: 'Abr', plano: 'Maratona Iniciante', km: 110 },
    { mes: 'Mai', plano: 'Maratona Iniciante', km: 118 },
    { mes: 'Jun', plano: 'Meia Maratona Intermediário', km: 86 },
    { mes: 'Jul', plano: '10K Avançado', km: 90 },
    { mes: 'Ago', plano: 'Meia Maratona Intermediário', km: 102 },
    { mes: 'Set', plano: '10K Avançado', km: 74 },
    { mes: 'Out', plano: 'Maratona Iniciante', km: 98 },
    { mes: 'Nov', plano: 'Meia Maratona Intermediário', km: 121 },
    { mes: 'Dez', plano: '10K Avançado', km: 80 },
  ];

  const filteredAlunos = alunos.filter((aluno) => {
    const matchesSearch =
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.objetivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = !nivelFiltro || aluno.nivel === nivelFiltro;
    return matchesSearch && matchesNivel;
  });

  useEffect(() => {
    if (copiedToast) {
      const t = setTimeout(() => setCopiedToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [copiedToast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alunos</h1>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={() => setShowInviteModal(true)}>
            Convidar alunos
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Barra de busca e filtro por nível */}
      <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 gap-3">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar por nome ou objetivo..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Nível</label>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            value={nivelFiltro}
            onChange={(e) => setNivelFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>
      </div>

      {/* Header de ações em lote */}
      <div className="flex items-center justify-between bg-white rounded-md border border-gray-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selecionados.length > 0 && selecionados.length === filteredAlunos.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelecionados(filteredAlunos.map((a) => a.id));
              } else {
                setSelecionados([]);
              }
            }}
          />
          <span className="text-sm text-gray-600">Selecionar todos</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${selecionados.length === 0 ? 'bg-gray-100 text-gray-400' : 'btn-secondary'}`}
            disabled={selecionados.length === 0}
          >
            Enviar treino
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${selecionados.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700'}`}
            disabled={selecionados.length === 0}
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Tabela de alunos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nível
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objetivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlunos.map((aluno) => (
              <tr
                key={aluno.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedAluno(aluno);
                  setShowDrawer(true);
                }}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selecionados.includes(aluno.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelecionados((prev) => {
                        if (checked) return [...prev, aluno.id];
                        return prev.filter((id) => id !== aluno.id);
                      });
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{aluno.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {aluno.nivel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {aluno.telefone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {aluno.objetivo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      aluno.status === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : aluno.status === 'Pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {aluno.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1 rounded-md hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button 
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAluno(aluno);
                        setShowModal(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edição */}
      {showModal && selectedAluno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Aluno</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={selectedAluno.nome}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={selectedAluno.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={selectedAluno.telefone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objetivo</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={selectedAluno.objetivo}
                >
                  <option value="5K">5K</option>
                  <option value="10K">10K</option>
                  <option value="21K">21K</option>
                  <option value="42K">42K</option>
                  <option value="Iniciante">Iniciante</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de convite */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Convidar alunos</h2>
            <p className="text-sm text-gray-700 mb-3">Compartilhe o link abaixo para os alunos se cadastrarem:</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md p-2">
              <span className="text-xs text-gray-600 flex-1 break-all">{`https://treinogo.com/cadastro?professor=${professorKey}`}</span>
              <button
                className="btn-secondary flex items-center gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(`https://treinogo.com/cadastro?professor=${professorKey}`);
                  setCopiedToast(true);
                }}
              >
                <Copy className="h-4 w-4" /> Copiar link
              </button>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowInviteModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de cópia */}
      {copiedToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow">
          Link copiado com sucesso
        </div>
      )}

      {/* Drawer lateral com detalhes do aluno */}
      {showDrawer && selectedAluno && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDrawer(false)}
          />
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-lg bg-white shadow-xl p-6 transform transition-transform duration-300 translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Detalhes do Aluno</h2>
                <button
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowDrawer(false)}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações do aluno */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Informações do aluno</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div><span className="font-medium">Nome:</span> {selectedAluno.nome}</div>
                    <div><span className="font-medium">Email:</span> {selectedAluno.email}</div>
                    <div><span className="font-medium">Telefone:</span> {selectedAluno.telefone}</div>
                    <div><span className="font-medium">Data de nascimento:</span> {selectedAluno.dataNascimento}</div>
                    <div><span className="font-medium">Objetivo:</span> {selectedAluno.objetivo}</div>
                  </div>
                </section>

                {/* Resultado do teste */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Resultado do teste</h3>
                  {selectedAluno.testes && selectedAluno.testes.length > 0 ? (
                    <div className="space-y-2 text-sm text-gray-700">
                      {(() => {
                        const ultimoTeste = selectedAluno.testes[selectedAluno.testes.length - 1];
                        return (
                          <div className="space-y-2">
                            <div><span className="font-medium">Data:</span> {ultimoTeste.data}</div>
                            <div className="grid grid-cols-3 gap-2">
                              <div><span className="font-medium">Pace:</span> {ultimoTeste.pace} min/km</div>
                              <div><span className="font-medium">FC Máx:</span> {ultimoTeste.fcMaxima} bpm</div>
                              <div><span className="font-medium">VO2max:</span> {ultimoTeste.vo2max}</div>
                            </div>
                            <div>
                              <div className="font-medium mb-1">Zonas</div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>Z1: {ultimoTeste.zonas.z1.min}-{ultimoTeste.zonas.z1.max} bpm</div>
                                <div>Z2: {ultimoTeste.zonas.z2.min}-{ultimoTeste.zonas.z2.max} bpm</div>
                                <div>Z3: {ultimoTeste.zonas.z3.min}-{ultimoTeste.zonas.z3.max} bpm</div>
                                <div>Z4: {ultimoTeste.zonas.z4.min}-{ultimoTeste.zonas.z4.max} bpm</div>
                                <div>Z5: {ultimoTeste.zonas.z5.min}-{ultimoTeste.zonas.z5.max} bpm</div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Sem teste cadastrado.</div>
                  )}
                </section>

                {/* Rollover: Plano do mês e KM corridos */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Histórico mensal</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mês</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plano do mês</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">KM corridos no mês</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {historicoMensal.map((h) => (
                          <tr key={h.mes}>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.mes}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.plano}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.km} km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}