'use client';
import React, { useState } from 'react';
import { alunos, testesFisicos } from '@/data/mockData';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';

export default function TestesFisicos() {
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [tipoTeste, setTipoTeste] = useState('');
  const [paceValor, setPaceValor] = useState('');
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Função para calcular zonas de treino
  const calcularZonas = (fcMaxima: number) => {
    return {
      z1: { min: Math.round(fcMaxima * 0.5), max: Math.round(fcMaxima * 0.6) },
      z2: { min: Math.round(fcMaxima * 0.6) + 1, max: Math.round(fcMaxima * 0.7) },
      z3: { min: Math.round(fcMaxima * 0.7) + 1, max: Math.round(fcMaxima * 0.8) },
      z4: { min: Math.round(fcMaxima * 0.8) + 1, max: Math.round(fcMaxima * 0.9) },
      z5: { min: Math.round(fcMaxima * 0.9) + 1, max: fcMaxima }
    };
  };

  // Filtrar testes pelo aluno selecionado
  const testesFiltrados = alunoSelecionado 
    ? testesFisicos.filter(teste => teste.alunoId === alunoSelecionado)
    : testesFisicos;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Testes Físicos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Novo Teste</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de teste</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={tipoTeste}
                  onChange={(e) => setTipoTeste(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="12min">12 minutos</option>
                  <option value="3km">3km</option>
                  <option value="5km">5km</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aluno <span className="text-red-600">*</span></label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={alunoSelecionado}
                  onChange={(e) => setAlunoSelecionado(e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Pace (min/km) <span className="text-red-600">*</span></label>
                <input 
                  type="number" 
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={paceValor}
                  onChange={(e) => setPaceValor(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">FC Máxima (bpm) <span className="text-gray-400">(opcional)</span></label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">VO2max estimado (ml/kg/min) <span className="text-gray-400">(opcional)</span></label>
                <input 
                  type="number" 
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
              
              <button 
                type="button" 
                className={`btn-primary w-full ${(!alunoSelecionado || !paceValor) ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!alunoSelecionado || !paceValor}
                aria-disabled={!alunoSelecionado || !paceValor}
                title={!alunoSelecionado || !paceValor ? 'Selecione o aluno e informe o pace' : 'Registrar Teste'}
              >
                Registrar Teste
              </button>
            </form>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Histórico de Testes</h2>
            
            <div className="space-y-4">
              {testesFiltrados.length > 0 ? (
                testesFiltrados.map(teste => {
                  const aluno = alunos.find(a => a.id === teste.alunoId);
                  const isExpanded = expandedTest === teste.id;
                  
                  return (
                    <div key={teste.id} className="border rounded-md overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                        onClick={() => setExpandedTest(isExpanded ? null : teste.id)}
                      >
                        <div>
                          <h3 className="font-medium">{aluno?.nome}</h3>
                          <p className="text-sm text-gray-500">Data: {teste.data}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="text-sm">Pace: <span className="font-medium">{teste.pace} min/km</span></p>
                            <p className="text-sm">VO2max: <span className="font-medium">{teste.vo2max} ml/kg/min</span></p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 border-t">
                          <h4 className="font-medium mb-2">Zonas de Treino</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                              <span>Zona 1 (Recuperação)</span>
                              <span className="font-medium">{teste.zonas.z1.min} - {teste.zonas.z1.max} bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                              <span>Zona 2 (Aeróbica Leve)</span>
                              <span className="font-medium">{teste.zonas.z2.min} - {teste.zonas.z2.max} bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                              <span>Zona 3 (Aeróbica Moderada)</span>
                              <span className="font-medium">{teste.zonas.z3.min} - {teste.zonas.z3.max} bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                              <span>Zona 4 (Limiar Anaeróbico)</span>
                              <span className="font-medium">{teste.zonas.z4.min} - {teste.zonas.z4.max} bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                              <span>Zona 5 (Máxima)</span>
                              <span className="font-medium">{teste.zonas.z5.min} - {teste.zonas.z5.max} bpm</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum teste encontrado</p>
                  {alunoSelecionado && (
                    <p className="text-sm text-gray-400">Registre o primeiro teste para este aluno</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}