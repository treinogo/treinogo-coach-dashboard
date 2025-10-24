'use client';

import React, { useMemo, useState } from 'react';
import { Gift, Copy, Mail, MessageCircle, Edit, Trash, X, CheckCircle } from 'lucide-react';

type Convite = {
  id: string;
  destinatario: string; // nome ou email
  status: 'Enviado' | 'Aguardando' | 'Recompensa recebida';
  dataEnvio: string; // YYYY-MM-DD
  dataCadastro?: string; // YYYY-MM-DD
};

export default function ConvidarAmigoPage() {
  const codigoAfiliado = 'prof-12345';
  const linkAfiliado = useMemo(() => `https://treinogo.app/convite/${codigoAfiliado}`, [codigoAfiliado]);
  const [copiado, setCopiado] = useState(false);

  const [convites, setConvites] = useState<Convite[]>([
    { id: 'c1', destinatario: 'ana@email.com', status: 'Enviado', dataEnvio: '2025-01-05' },
    { id: 'c2', destinatario: 'Carlos Oliveira', status: 'Aguardando', dataEnvio: '2025-01-10' },
    { id: 'c3', destinatario: 'Mariana Santos', status: 'Recompensa recebida', dataEnvio: '2025-01-15', dataCadastro: '2025-01-20' },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDestinatario, setEditDestinatario] = useState('');
  const [editStatus, setEditStatus] = useState<Convite['status']>('Enviado');
  const [editDataEnvio, setEditDataEnvio] = useState('');
  const [editDataCadastro, setEditDataCadastro] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkAfiliado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      setCopiado(false);
    }
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('Convite para se juntar ao TreinoGO');
    const body = encodeURIComponent(`Oi! Use meu link para se juntar ao TreinoGO: ${linkAfiliado}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Oi! Use meu link para se juntar ao TreinoGO: ${linkAfiliado}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEditOpen = (c: Convite) => {
    setEditId(c.id);
    setEditDestinatario(c.destinatario);
    setEditStatus(c.status);
    setEditDataEnvio(c.dataEnvio);
    setEditDataCadastro(c.dataCadastro || '');
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editId) return;
    setConvites(prev => prev.map(c => c.id === editId ? {
      id: editId,
      destinatario: editDestinatario,
      status: editStatus,
      dataEnvio: editDataEnvio,
      dataCadastro: editDataCadastro || undefined
    } : c));
    setShowEditModal(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setConvites(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6 text-secondary" /> Convidar amigo</h1>
      </div>

      <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
        Convite e ganhe: cada convite aceito e cada assinatura realizada, você ganhará 10% de desconto na parcela do mês da sua assinatura.
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Seu link de afiliado</h2>
        <div className="flex items-center gap-2">
          <input type="text" readOnly className="flex-1 rounded-md border-gray-300" value={linkAfiliado} />
          <button className="btn-secondary inline-flex items-center gap-2" onClick={handleCopy}>
            <Copy className="h-4 w-4" /> Copiar
          </button>
          {copiado && (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full"><CheckCircle className="h-3 w-3" /> Copiado!</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white inline-flex items-center gap-2" onClick={shareEmail}>
            <Mail className="h-4 w-4" /> E-mail
          </button>
          <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white inline-flex items-center gap-2" onClick={shareWhatsApp}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Convites enviados</h2>
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Convite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de envio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de cadastro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {convites.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{c.destinatario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{c.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(c.dataEnvio).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{c.dataCadastro ? new Date(c.dataCadastro).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => handleEditOpen(c)}>
                        <Edit className="h-4 w-4 text-amber-600" />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => handleDelete(c.id)}>
                        <Trash className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Editar convite</h2>
              <button className="p-1 rounded-md hover:bg-gray-100" onClick={() => setShowEditModal(false)}>
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Destinatário</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editDestinatario} onChange={(e) => setEditDestinatario(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editStatus} onChange={(e) => setEditStatus(e.target.value as Convite['status'])}>
                  {['Enviado','Aguardando','Recompensa recebida'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de envio</label>
                  <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editDataEnvio} onChange={(e) => setEditDataEnvio(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de cadastro</label>
                  <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" value={editDataCadastro} onChange={(e) => setEditDataCadastro(e.target.value)} />
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