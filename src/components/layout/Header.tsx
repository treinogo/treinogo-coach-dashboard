'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, LogOut, Search, User, ChevronDown, Settings, Crown, Gift, Contact } from 'lucide-react';
import { dashboardData } from '@/data/mockData';

export default function Header() {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const latestNotifications = dashboardData.notificacoes.slice(0, 3);

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifMenu((v) => !v)}
              aria-haspopup="true"
              aria-expanded={showNotifMenu}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="p-3 border-b">
                  <span className="text-sm font-medium">Notificações</span>
                </div>
                <ul className="max-h-60 overflow-auto">
                  {latestNotifications.map((n) => (
                    <li key={n.id} className="px-3 py-2 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">{n.mensagem}</p>
                      <span className="text-xs text-gray-500">{n.data}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-2 text-center text-xs text-gray-500">Últimas 3 notificações</div>
              </div>
            )}
          </div>

          {/* Avatar e menu */}
          <div className="relative flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 group"
              onClick={() => setShowAvatarMenu((v) => !v)}
              aria-haspopup="true"
              aria-expanded={showAvatarMenu}
            >
              <div className="flex flex-col items-end">
                <span className="font-medium leading-tight">João Silva</span>
                <span className="text-xs text-gray-500">Professor</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white group-hover:opacity-90">
                <User className="h-5 w-5" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {showAvatarMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li>
                    <Link className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="#">
                      <Contact className="h-4 w-4 text-gray-500" />
                      <span>Meus dados</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="/assinaturas">
                      <Crown className="h-4 w-4 text-amber-600" />
                      <span>Assinaturas</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="#">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>Configurações</span>
                    </Link>
                  </li>
                </ul>
                <div className="border-t p-3 bg-blue-50">
                  <p className="text-xs text-blue-800 mb-2">
                    Convite e ganhe: cada convite aceito e cada assinatura realizada, você ganhará 10% de desconto na parcela do mês da sua assinatura.
                  </p>
                  <Link href="/convidar-amigo" className="w-full inline-flex items-center gap-2 btn-secondary text-sm py-1 justify-center">
                    <Gift className="h-4 w-4" />
                    Convidar amigo
                  </Link>
                </div>
              </div>
            )}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}