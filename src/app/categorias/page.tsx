'use client';
import React, { useState } from 'react';
import { categorias } from '@/data/mockData';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';

export default function Categorias() {
  const [categoriasState, setCategoriasState] = useState(categorias);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);

  const toggleStatus = (id) => {
    setCategoriasState(
      categoriasState.map((cat) =>
        cat.id === id
          ? { ...cat, status: cat.status === 'ativo' ? 'inativo' : 'ativo' }
          : cat
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias de Treinos</h1>
        <button 
          className="btn-primary flex items-center"
          onClick={() => {
            setEditingCategoria(null);
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriasState.map((categoria) => (
          <div key={categoria.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{categoria.nome}</h2>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  categoria.status === 'ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {categoria.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{categoria.descricao}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Volume</span>
                <span className="font-medium capitalize">{categoria.volume}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500 block">Intensidade</span>
                <span className="font-medium capitalize">{categoria.intensidade}</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="space-x-2">
                <button 
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setEditingCategoria(categoria);
                    setShowModal(true);
                  }}
                >
                  <Edit className="h-4 w-4 text-amber-600" />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-100">
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
              </div>
              
              <button
                className={`p-2 rounded-md ${
                  categoria.status === 'ativo'
                    ? 'hover:bg-red-50 text-red-600'
                    : 'hover:bg-green-50 text-green-600'
                }`}
                onClick={() => toggleStatus(categoria.id)}
              >
                {categoria.status === 'ativo' ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar/editar categoria */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={editingCategoria?.nome || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  rows={3}
                  defaultValue={editingCategoria?.descricao || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Volume</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue={editingCategoria?.volume || 'medio'}
                  >
                    <option value="baixo">Baixo</option>
                    <option value="medio">Médio</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Intensidade</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue={editingCategoria?.intensidade || 'media'}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
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
                  {editingCategoria ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}