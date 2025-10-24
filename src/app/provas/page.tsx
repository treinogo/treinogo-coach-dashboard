'use client';

import React, { useMemo, useState } from 'react';
import { provas as provasMock } from '@/data/mockData';
import { Plus, Flag, Edit, Trash, X } from 'lucide-react';

type Percurso = '3km' | '5km' | '10km' | '21km' | '42km';
type Prova = { id: string; nome: string; cidade: string; percursos: Percurso[]; data: string };

const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const percursosList: Percurso[] = ['3km','5km','10km','21km','42km'];

export default function Provas() {
  const [listaProvas, setListaProvas] = useState<Prova[]>(() => {
    const ano = new Date().getFullYear();
    const janYearProvas = provasMock.filter(p => {
      const d = new Date(p.data);
      return d.getFullYear() === ano && d.getMonth() === 0;
    });
    if (janYearProvas.length >= 4) return provasMock;
    const defaults: Prova[] = [
      { id: `p-def-jan-${ano}-1`, nome: 'Volta da Cidade', cidade: 'São Paulo', percursos: ['5km','10km'], data: `${ano}-01-07` },
      { id: `p-def-jan-${ano}-2`, nome: 'Circuito Praia', cidade: 'Rio de Janeiro', percursos: ['3km','5km','10km'], data: `${ano}-01-14` },
      { id: `p-def-jan-${ano}-3`, nome: 'Corrida do Parque', cidade: 'Curitiba', percursos: ['5km','10km'], data: `${ano}-01-21` },
      { id: `p-def-jan-${ano}-4`, nome: 'Desafio Centro', cidade: 'Belo Horizonte', percursos: ['10km','21km'], data: `${ano}-01-28` },
    ];
    const existingNames = new Set(janYearProvas.map(p => p.nome));
    const missing = 4 - janYearProvas.length;
    const toAdd = defaults.filter(d => !existingNames.has(d.nome)).slice(0, missing);
    return [...provasMock, ...toAdd];
  });
  const anoCorrente = new Date().getFullYear();
  const anosDisponiveis = useMemo(() => {
    const s = new Set<number>(listaProvas.map(p => new Date(p.data).getFullYear()));
    s.add(anoCorrente);
    return Array.from(s).sort((a,b) => a - b);
  }, [listaProvas]);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(anoCorrente);
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth());

  const provasAno = useMemo(() => listaProvas.filter(p => new Date(p.data).getFullYear() === anoSelecionado), [listaProvas, anoSelecionado]);
  const provasPorMes = useMemo(() => {
    const groups: Prova[][] = Array.from({ length: 12 }, () => []);
    provasAno.forEach(p => {
      const m = new Date(p.data).getMonth();
      groups[m].push(p);
    });
    return groups;
  }, [provasAno]);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNome, setAddNome] = useState('');
  const [addCidade, setAddCidade] = useState('');
  const [addData, setAddData] = useState('');
  const [addPercursos, setAddPercursos] = useState<Percurso[]>([]);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editData, setEditData] = useState('');
  const [editPercursos, setEditPercursos] = useState<Percurso[]>([]);

  const togglePercurso = (value: Percurso, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      setAddPercursos(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]);
    } else {
      setEditPercursos(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]);
    }
  };

  const handleAddSave = () => {
    if (!addNome || !addCidade || !addData || addPercursos.length === 0) {
      setShowAddModal(false);
      return;
    }
    const novo: Prova = {
      id: 'p' + Date.now(),
      nome: addNome,
      cidade: addCidade,
      percursos: addPercursos,
      data: addData
    };
    setListaProvas(prev => [...prev, novo]);
    setShowAddModal(false);
    setAddNome(''); setAddCidade(''); setAddData(''); setAddPercursos([]);
  };

  const handleEditOpen = (prova: Prova) => {
    setEditId(prova.id);
    setEditNome(prova.nome);
    setEditCidade(prova.cidade);
    setEditData(prova.data);
    setEditPercursos(prova.percursos);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editId) return;
    setListaProvas(prev => prev.map(p => p.id === editId ? { id: editId, nome: editNome, cidade: editCidade, percursos: editPercursos, data: editData } : p));
    setShowEditModal(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setListaProvas(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Provas</h1>
        <button className="btn-primary flex items-center" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar prova
        </button>
      </div>

      {/* Filtro por Ano */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Ano</label>
        <select
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        >
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {/* Tabs de meses */}
      <div className="flex flex-wrap gap-2">
        {meses.map((mes, idx) => (
          <button
            key={mes}
            className={`px-3 py-1 rounded-md border text-sm transition ${mesSelecionado === idx ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => setMesSelecionado(idx)}
            aria-selected={mesSelecionado === idx}
          >
            <span>{mes}</span>
            <span className={`${mesSelecionado === idx ? 'bg-white text-primary' : 'bg-gray-100 text-gray-700'} ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs`}>{provasPorMes[idx].length}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo do mês selecionado */}
      <div className="mt-4">
        {provasPorMes[mesSelecionado].length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma prova neste mês.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percursos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {provasPorMes[mesSelecionado].map((prova) => (
                  <tr key={prova.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      <span className="font-medium text-gray-900">{prova.nome}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{prova.cidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{prova.percursos.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(prova.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => handleEditOpen(prova)}>
                          <Edit className="h-4 w-4 text-amber-600" />
                        </button>
                        <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => handleDelete(prova.id)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Adicionar Prova */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Adicionar Prova</h2>
              <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={addNome} onChange={(e) => setAddNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={addCidade} onChange={(e) => setAddCidade(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={addData} onChange={(e) => setAddData(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percursos</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {percursosList.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={addPercursos.includes(p)} onChange={() => togglePercurso(p, 'add')} /> {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="button" className="btn-primary" onClick={handleAddSave}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Prova */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Editar Prova</h2>
              <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => setShowEditModal(false)}>
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editCidade} onChange={(e) => setEditCidade(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editData} onChange={(e) => setEditData(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percursos</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {percursosList.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={editPercursos.includes(p)} onChange={() => togglePercurso(p, 'edit')} /> {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="button" className="btn-primary" onClick={handleEditSave}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}