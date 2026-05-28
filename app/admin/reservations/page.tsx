'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/EmptyState';
import { Loader2, Ticket, CheckCircle, Ban, AlertCircle } from 'lucide-react';

export default function AdminReservationsPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setSessionChecked(true);
      fetchReservations();
    }

    checkAuthAndFetch();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, hotels(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchReservations();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white transition-colors">
      <Header />
      <AdminNav />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestion des Réservations</h1>
          <p className="text-sm text-slate-500">Suivez le statut des dossiers clients, l'envoi de vouchers et les check-ins.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : reservations.length === 0 ? (
          <EmptyState 
            title="Aucune réservation trouvée" 
            description="Les réservations apparaîtront ici dès que vous aurez converti des demandes clients."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-850 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Code Voucher</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Hôtel</th>
                  <th className="px-6 py-3">Prix Final (Acompte)</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Ticket className="h-4 w-4 shrink-0" />
                      {res.voucher_code}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{res.customer_name}</p>
                      <p className="text-xs text-slate-400">{res.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.hotels?.name || 'Hôtel inconnu'}
                      <p className="text-xs text-slate-400">{res.city}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-950 dark:text-white">{res.final_price.toLocaleString()} FCFA</p>
                      <p className="text-xs text-slate-400">Acompte: {res.deposit_amount.toLocaleString()} FCFA</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge type="booking" status={res.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {res.status === 'created' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'waiting_payment')}
                          className="text-xs font-semibold text-amber-600 hover:underline"
                        >
                          Attendre acompte
                        </button>
                      )}
                      {res.status === 'payment_confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'voucher_sent')}
                          className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          <Ticket className="h-3 w-3" /> Envoyé
                        </button>
                      )}
                      {res.status === 'voucher_sent' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'checkin_confirmed')}
                          className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          <CheckCircle className="h-3 w-3" /> Check-in ok
                        </button>
                      )}
                      {res.status !== 'cancelled' && res.status !== 'refunded' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-0.5"
                        >
                          <Ban className="h-3 w-3" /> Annuler
                        </button>
                      )}
                      {res.status === 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'refunded')}
                          className="text-xs font-semibold text-amber-600 hover:underline"
                        >
                          Remboursé
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
