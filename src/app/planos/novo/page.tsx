'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { categorias } from '@/data/mockData';

type DiasCount = 2 | 3 | 4 | 5;

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const tiposTreino = ['corrida leve', 'intervalado', 'fartlek', 'longo', 'descanso'] as const;
const zonas = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6'] as const;
const descansoOptions = ['Sem descanso', "1'00", "1'30\"", "2'00", "2'30\"", "3'00", "3'30\"", "4'00"] as const;

interface DayConfig {
  dia: string;
  tipo: typeof tiposTreino[number];
  duracao: number;
  zonaIntensidade: typeof zonas[number];
  descanso?: typeof descansoOptions[number];
  descricao: string;
}

interface WeekConfig {
  prova: boolean;
  dias: DayConfig[];
}

function makeDefaultDay(idx: number): DayConfig {
  return {
    dia: diasSemana[idx % 7],
    tipo: 'corrida leve',
    duracao: 30,
    zonaIntensidade: 'Z1',
    descanso: 'Sem descanso',
    descricao: ''
  };
}

function extendOrTrimDays(existing: DayConfig[], count: DiasCount): DayConfig[] {
  if (existing.length === count) return existing;
  if (existing.length < count) {
    const needed = count - existing.length;
    const add = Array.from({ length: needed }).map((_, i) => makeDefaultDay(existing.length + i));
    return [...existing, ...add];
  } else {
    return existing.slice(0, count);
  }
}

export default function NovoPlano() {
  const router = useRouter();

  const [nomePlano, setNomePlano] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [semanas, setSemanas] = useState<4 | 5>(4);
  const [diasPorSemana, setDiasPorSemana] = useState<DiasCount>(3);
  const [weeks, setWeeks] = useState<WeekConfig[]>(() => {
    return Array.from({ length: 4 }).map(() => ({ prova: false, dias: Array.from({ length: 3 }).map((_, i) => makeDefaultDay(i)) }));
  });

  // Atualiza semanas mantendo o máximo de estado possível
  useEffect(() => {
    setWeeks((prev) => {
      if (prev.length === semanas) {
        return prev.map((w) => ({ ...w, dias: extendOrTrimDays(w.dias, diasPorSemana) }));
      }

      if (prev.length < semanas) {
        const toAdd = semanas - prev.length;
        const newWeeks = Array.from({ length: toAdd }).map(() => ({
          prova: false,
          dias: Array.from({ length: diasPorSemana }).map((_, i) => makeDefaultDay(i))
        }));
        return [...prev.map((w) => ({ ...w, dias: extendOrTrimDays(w.dias, diasPorSemana) })), ...newWeeks];
      }

      // prev.length > semanas
      return prev.slice(0, semanas).map((w) => ({ ...w, dias: extendOrTrimDays(w.dias, diasPorSemana) }));
    });
  }, [semanas, diasPorSemana]);

  const gridStyle = useMemo(() => ({ gridTemplateColumns: `repeat(${diasPorSemana}, minmax(0, 1fr))` }), [diasPorSemana]);

  const handleSave = () => {
    // Neste ponto poderíamos montar um objeto PlanoTreino e enviar para API.
    // Por agora, apenas navega de volta e simula criação.
    router.push('/planos');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Novo Plano de Treino</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={() => router.push('/planos')}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave}>Salvar Plano</button>
        </div>
      </div>

      {/* Informações */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Informações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Plano</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={nomePlano}
              onChange={(e) => setNomePlano(e.target.value)}
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
      </div>

      {/* Configurações */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Configuração do Plano</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semanas</label>
            <div className="flex gap-3">
              {[4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`px-4 py-2 rounded-md ${semanas === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setSemanas(s as 4 | 5)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dias por semana</label>
            <div className="flex gap-3">
              {[2,3,4,5].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`px-4 py-2 rounded-md ${diasPorSemana === d ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setDiasPorSemana(d as DiasCount)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estrutura Semanal */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Estrutura semanal</h2>
        <div className="space-y-6">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold">Semana {wIndex + 1}</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={week.prova}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setWeeks((prev) => prev.map((w, idx) => idx === wIndex ? { ...w, prova: checked } : w));
                    }}
                  />
                  Prova na semana
                </label>
              </div>

              <div className="grid gap-4" style={gridStyle}>
                {week.dias.map((day, dIndex) => (
                  <div key={dIndex} className="bg-white rounded-md border border-gray-200 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dia</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          value={day.dia}
                          onChange={(e) => {
                            const value = e.target.value;
                            setWeeks((prev) => prev.map((w, wi) => {
                              if (wi !== wIndex) return w;
                              const dias = w.dias.map((d, di) => di === dIndex ? { ...d, dia: value } : d);
                              return { ...w, dias };
                            }));
                          }}
                        >
                          {diasSemana.map((ds) => (
                            <option key={ds} value={ds}>{ds}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Treino</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          value={day.tipo}
                          onChange={(e) => {
                            const value = e.target.value as DayConfig['tipo'];
                            setWeeks((prev) => prev.map((w, wi) => {
                              if (wi !== wIndex) return w;
                              const dias = w.dias.map((d, di) => di === dIndex ? { ...d, tipo: value } : d);
                              return { ...w, dias };
                            }));
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
                          min={0}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          value={day.duracao}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setWeeks((prev) => prev.map((w, wi) => {
                              if (wi !== wIndex) return w;
                              const dias = w.dias.map((d, di) => di === dIndex ? { ...d, duracao: value } : d);
                              return { ...w, dias };
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Zona de Intensidade</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          value={day.zonaIntensidade}
                          onChange={(e) => {
                            const value = e.target.value as DayConfig['zonaIntensidade'];
                            setWeeks((prev) => prev.map((w, wi) => {
                              if (wi !== wIndex) return w;
                              const dias = w.dias.map((d, di) => di === dIndex ? { ...d, zonaIntensidade: value } : d);
                              return { ...w, dias };
                            }));
                          }}
                        >
                          {zonas.map((z) => (
                            <option key={z} value={z}>{z}</option>
                          ))}
                        </select>
                      </div>
                      {day.tipo === 'intervalado' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Descanso</label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            value={day.descanso}
                            onChange={(e) => {
                              const value = e.target.value as DayConfig['descanso'];
                              setWeeks((prev) => prev.map((w, wi) => {
                                if (wi !== wIndex) return w;
                                const dias = w.dias.map((d, di) => di === dIndex ? { ...d, descanso: value } : d);
                                return { ...w, dias };
                              }));
                            }}
                          >
                            {descansoOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        value={day.descricao}
                        onChange={(e) => {
                          const value = e.target.value;
                          setWeeks((prev) => prev.map((w, wi) => {
                            if (wi !== wIndex) return w;
                            const dias = w.dias.map((d, di) => di === dIndex ? { ...d, descricao: value } : d);
                            return { ...w, dias };
                          }));
                        }}
                        placeholder="Descreva o treino..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}