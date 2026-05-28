'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import EmptyState from '../../../components/EmptyState';
import { Loader2, Plus, AlertTriangle, AlertCircle } from 'lucide-react';
import { INCIDENT_TYPES, INCIDENT_SEVERITIES } from '../../../lib/constants';

export default function AdminIncidentsPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    hotel_id: '',
    booking_id: '',
    type: 'other',
    severity: 'medium',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setSessionChecked(true);
      fetchIncidents();
      fetchHotelsAndBookings();
    }

    checkAuthAndFetch();
  }, []);

  async function fetchIncidents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*, hotels(name), bookings(voucher_code)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHotelsAndBookings() {
    try {
      const { data: hotelsData } = await supabase.from('hotels').select('id, name');
      const { data: bookingsData } = await supabase.from('bookings').select('id, voucher_code, customer_name');
      setHotels(hotelsData || []);
      setBookings(bookingsData || []);
      if (hotelsData && hotelsData.length > 0) {
        setFormData(prev => ({ ...prev, hotel_id: hotelsData[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.description.trim()) {
      alert('Veuillez entrer une description.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Insert incident
      const { error: incidentError } = await supabase
        .from('incidents')
        .insert([
          {
            hotel_id: formData.hotel_id || null,
            booking_id: formData.booking_id || null,
            type: formData.type,
            severity: formData.severity,
            description: formData.description,
            resolved: false
          }
        ]);

      if (incidentError) throw incidentError;

      // 2. Adjust hotel reliability score based on severity
      if (formData.hotel_id) {
        const { data: hotel, error: hotelFetchError } = await supabase
          .from('hotels')
          .select('reliability_score')
          .eq('id', formData.hotel_id)
          .single();

        if (!hotelFetchError && hotel) {
          let scoreDeduction = 5; // Low
          if (formData.severity === 'critical') scoreDeduction = 25;
          else if (formData.severity === 'high') scoreDeduction = 15;
          else if (formData.severity === 'medium') scoreDeduction = 10;

          const newScore = Math.max(0, (hotel.reliability_score || 50) - scoreDeduction);
          
          await supabase
            .from('hotels')
            .update({ reliability_score: newScore })
            .eq('id', formData.hotel_id);
        }
      }

      setShowForm(false);
      setFormData({
        hotel_id: hotels[0]?.id || '',
        booking_id: '',
        type: 'other',
        severity: 'medium',
        description: '',
      });
      fetchIncidents();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement de l\'incident.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveIncident = async (id: string, hotelId: string, severity: string) => {
    const notes = prompt('Notes de résolution :');
    if (notes === null) return;

    try {
      const { error } = await supabase
        .from('incidents')
        .update({
          resolved: true,
          resolution_notes: notes
        })
        .eq('id', id);

      if (error) throw error;

      // Restore some reliability points back to the hotel upon resolution (+half of the deduction)
      if (hotelId) {
        const { data: hotel } = await supabase
          .from('hotels')
          .select('reliability_score')
          .eq('id', hotelId)
          .single();

        if (hotel) {
          let scoreRecovery = 2; // Low
          if (severity === 'critical') scoreRecovery = 12;
          else if (severity === 'high') scoreRecovery = 7;
          else if (severity === 'medium') scoreRecovery = 5;

          const newScore = Math.min(100, (hotel.reliability_score || 50) + scoreRecovery);
          
          await supabase
            .from('hotels')
            .update({ reliability_score: newScore })
            .eq('id', hotelId);
        }
      }

      fetchIncidents();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la résolution de l\'incident.');
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-400';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400';
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Rapports d'Incidents</h1>
            <p className="text-sm text-slate-500">Signalez les anomalies (surréservations, hausse de tarif). Impacte automatiquement la fiabilité des hôtels.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Signaler un Incident
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Déclarer un incident</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Hôtel concerné</label>
                <select
                  value={formData.hotel_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotel_id: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">Sélectionner l'hôtel</option>
                  {hotels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Réservation concernée (Optionnel)</label>
                <select
                  value={formData.booking_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, booking_id: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">Aucune réservation</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>{b.voucher_code} - {b.customer_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Type d'incident</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  {Object.entries(INCIDENT_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Gravité</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  {Object.entries(INCIDENT_SEVERITIES).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Description des faits</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Racontez ce qu'il s'est passé..."
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-350 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-850"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Signaler & Pénaliser
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : incidents.length === 0 ? (
          <EmptyState 
            title="Aucun incident signalé" 
            description="Le journal des incidents est vide. Félicitations, vos partenaires sont fiables !"
          />
        ) : (
          <div className="space-y-4">
            {incidents.map((inc) => (
              <div 
                key={inc.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getSeverityBadgeClass(inc.severity)}`}>
                      {INCIDENT_SEVERITIES[inc.severity as keyof typeof INCIDENT_SEVERITIES] || inc.severity}
                    </span>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {INCIDENT_TYPES[inc.type as keyof typeof INCIDENT_TYPES] || inc.type}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-350">{inc.description}</p>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong>Établissement :</strong> {inc.hotels?.name || 'Inconnu'}</p>
                    {inc.bookings?.voucher_code && (
                      <p><strong>Code Réservation :</strong> {inc.bookings.voucher_code}</p>
                    )}
                    {inc.resolved && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 p-2.5 rounded-lg mt-2">
                        <p className="font-bold">Résolu :</p>
                        <p className="italic">"{inc.resolution_notes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  {!inc.resolved ? (
                    <button
                      onClick={() => handleResolveIncident(inc.id, inc.hotel_id, inc.severity)}
                      className="bg-emerald-100 text-emerald-850 hover:bg-emerald-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" /> Résoudre l'incident
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Résolu</span>
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
