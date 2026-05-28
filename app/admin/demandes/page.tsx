'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/EmptyState';
import BookingForm from '../../../components/BookingForm';
import { Loader2, Plus, Phone, Calendar, ArrowRight } from 'lucide-react';

export default function AdminDemandesPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState<any | null>(null);
  const [converting, setConverting] = useState(false);
  const [updatingNotesId, setUpdatingNotesId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setSessionChecked(true);
      fetchDemandes();
    }

    checkAuthAndFetch();
  }, []);

  async function fetchDemandes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('room_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('room_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchDemandes();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleUpdateNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('room_requests')
        .update({ admin_notes: adminNotes })
        .eq('id', id);

      if (error) throw error;
      setUpdatingNotesId(null);
      fetchDemandes();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour des notes.');
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      // 1. Insert the booking
      const { data: newBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Update room request status to booked
      const { error: requestError } = await supabase
        .from('room_requests')
        .update({ status: 'booked' })
        .eq('id', bookingData.request_id);

      if (requestError) throw requestError;

      // 3. If there is a deposit required, initialize a payment record
      if (bookingData.deposit_amount > 0) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
              booking_id: newBooking.id,
              amount: bookingData.deposit_amount,
              method: 'other',
              status: 'pending',
              admin_notes: "Acompte requis pour confirmation de réservation"
            }
          ]);

        if (paymentError) throw paymentError;
      }

      setConverting(false);
      setSelectedDemande(null);
      fetchDemandes();
      alert('Réservation créée avec succès !');
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Impossible de créer la réservation.');
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestion des Demandes</h1>
            <p className="text-sm text-slate-500">Traitez les demandes de vos clients et transformez-les en réservations fermes.</p>
          </div>
        </div>

        {converting && selectedDemande ? (
          <div className="max-w-2xl mx-auto mb-8">
            <BookingForm 
              request={selectedDemande}
              onSubmit={handleCreateBooking}
              onCancel={() => {
                setConverting(false);
                setSelectedDemande(null);
              }}
            />
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : demandes.length === 0 ? (
          <EmptyState 
            title="Aucune demande trouvée" 
            description="Les demandes des clients s'afficheront ici lorsqu'ils rempliront le formulaire public."
          />
        ) : (
          <div className="space-y-4">
            {demandes.map((req) => (
              <div 
                key={req.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-lg text-slate-950 dark:text-white">{req.customer_name}</h3>
                    <StatusBadge type="request" status={req.status} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {req.customer_phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Arrivée : {req.requested_date || 'Non spécifié'} à {req.requested_time || 'N/A'}
                    </p>
                    <p>
                      <strong>Lieu :</strong> {req.city} {req.district ? `(${req.district})` : ''}
                    </p>
                    <p>
                      <strong>Budget :</strong> {req.budget_min ? `${req.budget_min} - ` : ''}{req.budget_max || 'N/A'} FCFA
                    </p>
                    <p>
                      <strong>Voyageurs :</strong> {req.guests_count} pers.
                    </p>
                    <p>
                      <strong>Préférences :</strong> {req.preferences || 'Aucune spécifiée'}
                    </p>
                  </div>

                  {/* Internal Notes */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                    {updatingNotesId === req.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="flex-grow rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-850 dark:bg-slate-900"
                          placeholder="Notes internes..."
                        />
                        <button
                          onClick={() => handleUpdateNotes(req.id)}
                          className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-750"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setUpdatingNotesId(null)}
                          className="border border-slate-300 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>Notes admin :</strong> {req.admin_notes || 'Aucune note'} 
                        <button
                          onClick={() => {
                            setUpdatingNotesId(req.id);
                            setAdminNotes(req.admin_notes || '');
                          }}
                          className="ml-2 text-emerald-600 hover:underline"
                        >
                          (Modifier)
                        </button>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 self-start md:self-center">
                  {req.status === 'new' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'contacting_hotels')}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      Démarrer recherche
                    </button>
                  )}
                  {req.status === 'contacting_hotels' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'offer_found')}
                      className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      Offre trouvée
                    </button>
                  )}
                  {['new', 'contacting_hotels', 'offer_found', 'waiting_payment'].includes(req.status) && (
                    <button
                      onClick={() => {
                        setSelectedDemande(req);
                        setConverting(true);
                        // scroll to top form
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      Réserver
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                  {req.status !== 'booked' && req.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                      className="bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
