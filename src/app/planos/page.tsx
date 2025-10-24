'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { planosTreino, categorias, alunos } from '@/data/mockData';
import { Calendar, Plus, Edit, Trash, ArrowRight, Send, X } from 'lucide-react';
import type { PlanoTreino } from '@/data/mockData';

export default function PlanosTreino() {
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoTreino | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [diasPorSemana, setDiasPorSemana] = useState<2 | 3 | 4 | 5>(3);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [showEnviarDrawer, setShowEnviarDrawer] = useState<boolean>(false);
  const [planoParaEnviar, setPlanoParaEnviar] = useState<PlanoTreino | null>(null);
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [alunoSearch, setAlunoSearch] = useState<string>('');
  const [enviarPorEmail, setEnviarPorEmail] = useState<boolean>(false);

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const tiposTreino = ['corrida leve', 'intervalado', 'fartlek', 'longo', 'descanso'];
  const descansoOptions = ['Sem descanso', "1'00", "1'30\"", "2'00", "2'30\"", "3'00", "3'30\"", "4'00"];
  const diasOptions: (2 | 3 | 4 | 5)[] = [2, 3, 4, 5];

  // Estado para controlar o tipo de treino por dia quando criando/editando plano
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);

  useEffect(() => {
    // Inicializa os tipos por dia ao abrir a modal ou alterar diasPorSemana/planoSelecionado
    const inicial = Array.from({ length: diasPorSemana }).map((_, idx) =>
      (planoSelecionado?.estruturaSemanal[idx]?.tipo || tiposTreino[0])
    );
    setTiposSelecionados(inicial);
  }, [showModal, diasPorSemana, planoSelecionado]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planos de Treino</h1>
        <Link href="/planos/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Link>
      </div>

      {/* Filtro por categoria */}
      <div className="flex items-center space-x-3">
        <label className="text-sm text-gray-700">Filtrar por categoria</label>
        <select
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planosTreino
          .filter((plano) => !categoriaFiltro || plano.categoriaId === categoriaFiltro)
          .map((plano) => {
          const categoria = categorias.find(c => c.id === plano.categoriaId);
          const alunosAtivosCount = alunos.filter(a => a.objetivo === (categoria?.nome || '')).length;
          
          return (
            <div key={plano.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{plano.nome}</h2>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mr-2">
                      {categoria?.nome}
                    </span>
                    <span className="text-sm text-gray-500">
                      {plano.diasPorSemana} dias/semana
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    plano.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plano.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">{alunosAtivosCount} aluno(s) neste plano</span>
              </div>
              
              {/* Resumo da estrutura semanal */}
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <h3 className="text-sm font-medium mb-2">Estrutura Semanal</h3>
                <div className="space-y-2">
                  {plano.estruturaSemanal.map((treino, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="w-20 font-medium">{treino.dia}:</span>
                      <span className="capitalize">{treino.tipo}</span>
                      <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                      <span className="text-gray-600 text-xs">{treino.duracao} min</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="space-x-2">
                  <button 
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => {
                      setPlanoSelecionado(plano);
                      setCategoriaSelecionada(plano.categoriaId);
                      setDiasPorSemana(plano.diasPorSemana);
                      setShowModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4 text-amber-600" />
                  </button>
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => {
                      setPlanoParaEnviar(plano);
                      setAlunosSelecionados([]);
                      setAlunoSearch('');
                      setEnviarPorEmail(false);
                      setShowEnviarDrawer(true);
                    }}
                  >
                    <Send className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
                
                <Link href={`/planos/${plano.id}`} className="btn-secondary text-xs py-1 px-3">
                  Visualizar
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para criar/editar plano */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {planoSelecionado ? 'Editar Plano de Treino' : 'Criar Plano de Treino'}
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Plano</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue={planoSelecionado?.nome || ''}
                    placeholder="Ex: Maratona Iniciante"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={categoriaSelecionada}
                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias por Semana
                </label>
                <div className="flex space-x-4">
                  {diasOptions.map((dias) => (
                    <button
                      key={dias}
                      type="button"
                      className={`px-4 py-2 rounded-md ${
                        diasPorSemana === dias
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setDiasPorSemana(dias)}
                    >
                      {dias} dias
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Estrutura Semanal</h3>
                <div className="space-y-4">
                  {Array.from({ length: diasPorSemana }).map((_, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dia</label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            defaultValue={planoSelecionado?.estruturaSemanal[index]?.dia || diasSemana[index % 7]}
                          >
                            {diasSemana.map((dia) => (
                              <option key={dia} value={dia}>
                                {dia}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tipo de Treino</label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            value={tiposSelecionados[index] ?? (planoSelecionado?.estruturaSemanal[index]?.tipo || tiposTreino[0])}
                            onChange={(e) => {
                              const novo = [...tiposSelecionados];
                              novo[index] = e.target.value;
                              setTiposSelecionados(novo);
                            }}
                          >
                            {tiposTreino.map((tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duração (min)</label>
                          <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            defaultValue={planoSelecionado?.estruturaSemanal[index]?.duracao || 30}
                            min={0}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Zona de Intensidade</label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            defaultValue={planoSelecionado?.estruturaSemanal[index]?.zonaIntensidade || 'Z1'}
                          >
                            {['Z1','Z2','Z3','Z4','Z5','Z6'].map((zona) => (
                              <option key={zona} value={zona}>
                                {zona}
                              </option>
                            ))}
                          </select>
                        </div>

                        { (tiposSelecionados[index] ?? (planoSelecionado?.estruturaSemanal[index]?.tipo || tiposTreino[0])) === 'intervalado' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Descanso</label>
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                              defaultValue={planoSelecionado?.estruturaSemanal[index]?.descanso || 'Sem descanso'}
                            >
                              {descansoOptions.map((tempo) => (
                                <option key={tempo} value={tempo}>
                                  {tempo}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          rows={2}
                          defaultValue={planoSelecionado?.estruturaSemanal[index]?.descricao || ''}
                          placeholder="Descreva o treino..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                  {planoSelecionado ? 'Atualizar' : 'Criar'} Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer para enviar treino */}
      {showEnviarDrawer && planoParaEnviar && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowEnviarDrawer(false)}
          />
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-lg bg-white shadow-xl p-6 transform transition-transform duration-300 translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Enviar treino</h2>
                <button
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowEnviarDrawer(false)}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="mb-3 text-sm text-gray-700">
                Selecione os alunos que receberão o treino: <span className="font-medium">{planoParaEnviar.nome}</span>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Pesquisar aluno</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Digite o nome ou e-mail"
                  value={alunoSearch}
                  onChange={(e) => setAlunoSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                {alunos
                  .filter((aluno) => {
                    const q = alunoSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      aluno.nome.toLowerCase().includes(q) ||
                      aluno.email.toLowerCase().includes(q)
                    );
                  })
                  .map((aluno) => {
                  const checked = alunosSelecionados.includes(aluno.id);
                  return (
                    <label key={aluno.id} className="flex items-center justify-between px-3 py-2 border-b text-sm">
                      <div>
                        <div className="font-medium">{aluno.nome}</div>
                        <div className="text-gray-500">{aluno.objetivo}</div>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={(e) => {
                          setAlunosSelecionados((prev) => {
                            if (e.target.checked) return [...prev, aluno.id];
                            return prev.filter((id) => id !== aluno.id);
                          });
                        }}
                      />
                    </label>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={enviarPorEmail}
                    onChange={(e) => setEnviarPorEmail(e.target.checked)}
                  />
                  <span>Enviar também por e-mail</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowEnviarDrawer(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    // Aqui futuramente poderemos persistir a ação de envio
                    // enviarPorEmail indica se deve enviar também por e-mail
                    setShowEnviarDrawer(false);
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}