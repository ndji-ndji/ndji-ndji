'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/EmptyState';
import { Loader2, Check, X, ShieldCheck } from 'lucide-react';
import { PAYMENT_METHODS } from '../../../lib/constants';

export default function AdminPaiementsPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setEmail(session.user?.email || '');
      setSessionChecked(true);
      fetchPayments();
    }

    checkAuthAndFetch();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*, bookings(voucher_code, customer_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmPayment = async (pay: any) => {
    try {
      // 1. Update payment to received
      const { error: payError } = await supabase
        .from('payments')
        .update({
          status: 'received',
          confirmed_by: email,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', pay.id);

      if (payError) throw payError;

      // 2. Update the booking status to payment_confirmed
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'payment_confirmed' })
        .eq('id', pay.booking_id);

      if (bookingError) throw bookingError;

      fetchPayments();
      alert('Paiement confirmé avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la validation du paiement.');
    }
  };

  const handleCancelPayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', id);

      if (error) throw error;
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du marquage du paiement comme échoué.');
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Validation des Paiements</h1>
          <p className="text-sm text-slate-500">Validez manuellement les acomptes reçus par MTN Mobile Money, Airtel Money ou Cash.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState 
            title="Aucun paiement en attente" 
            description="Les transactions d'acompte apparaîtront ici dès qu'une réservation nécessitant un acompte sera créée."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-850 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Réservation / Client</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Méthode</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Confirmé Par</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-955 dark:text-white">{pay.bookings?.customer_name}</p>
                      <p className="font-mono text-xs text-emerald-650 dark:text-emerald-450">{pay.bookings?.voucher_code}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-950 dark:text-white">
                      {pay.amount.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4">
                      {PAYMENT_METHODS[pay.method as keyof typeof PAYMENT_METHODS] || pay.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge type="payment" status={pay.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {pay.confirmed_by ? (
                        <div>
                          <p className="font-semibold">{pay.confirmed_by}</p>
                          <p>{new Date(pay.confirmed_at).toLocaleString()}</p>
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {pay.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmPayment(pay)}
                            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Confirmer
                          </button>
                          <button
                            onClick={() => handleCancelPayment(pay.id)}
                            className="bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" /> Échoué
                          </button>
                        </>
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
