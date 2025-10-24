'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Users, Activity, Layers, Calendar, Flag, Star, X } from 'lucide-react';
import TreinoGoLogo from '@/components/icons/TreinoGoLogo';

export default function Sidebar() {
  const pathname = usePathname();

  const [showCSAT, setShowCSAT] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [categoria, setCategoria] = useState('');
  const [feedback, setFeedback] = useState('');

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Alunos', href: '/alunos', icon: Users },
    { name: 'Testes Físicos', href: '/testes', icon: Activity },
    { name: 'Categorias', href: '/categorias', icon: Layers },
    { name: 'Planos de Treino', href: '/planos', icon: Calendar },
    { name: 'Provas', href: '/provas', icon: Flag },
    { name: 'Desafios', href: '/desafios', icon: Star },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">
          <span className="sr-only">TreinoGO</span>
          <TreinoGoLogo />
        </h1>
        <p className="text-sm text-gray-500">Plataforma para Professores</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t space-y-3">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-800">Sua opinião é importante</p>
          <p className="text-xs text-gray-600">Ajude a melhorar o TreinoGO</p>
          <button className="mt-2 w-full btn-secondary text-sm py-1" onClick={() => setShowCSAT(true)}>Ajuda e sugestão</button>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-800 font-medium">Versão Pro</p>
          <p className="text-xs text-blue-600">Acesse recursos avançados</p>
          <button className="mt-2 w-full btn-primary text-sm py-1">Upgrade</button>
        </div>
        {showCSAT && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Qual bom é utilizar o TreinoGo?</h2>
                <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => setShowCSAT(false)}>
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className={`p-2 ${rating >= n ? 'text-yellow-500' : 'text-gray-300'}`}>
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="Dúvida">Dúvida</option>
                    <option value="Problema">Problema</option>
                    <option value="Elogio">Elogio</option>
                    <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feedback</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Digite seu feedback aqui..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={() => setShowCSAT(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={() => setShowCSAT(false)}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}