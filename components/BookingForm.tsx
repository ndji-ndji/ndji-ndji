'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { generateVoucherCode } from '../lib/voucher';
import { Loader2 } from 'lucide-react';

interface BookingFormProps {
  request: any;
  onSubmit: (bookingData: any) => Promise<void>;
  onCancel: () => void;
}

export default function BookingForm({ request, onSubmit, onCancel }: BookingFormProps) {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('0');
  const [hotelContactName, setHotelContactName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('status', 'active')
          .eq('city', request.city)
          .order('reliability_score', { ascending: false });

        if (error) throw error;
        setHotels(data || []);
        if (data && data.length > 0) {
          setSelectedHotelId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHotels(false);
      }
    }

    fetchHotels();
  }, [request.city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!selectedHotelId) {
      setErrorMsg('Veuillez sélectionner un hôtel.');
      setLoading(false);
      return;
    }

    if (!finalPrice || parseInt(finalPrice) <= 0) {
      setErrorMsg('Veuillez saisir un prix final valide.');
      setLoading(false);
      return;
    }

    const price = parseInt(finalPrice);
    const deposit = parseInt(depositAmount) || 0;

    if (deposit > price) {
      setErrorMsg('L\'acompte ne peut pas être supérieur au prix total.');
      setLoading(false);
      return;
    }

    try {
      const voucher = generateVoucherCode(request.city);
      const remaining = price - deposit;

      await onSubmit({
        request_id: request.id,
        hotel_id: selectedHotelId,
        customer_name: request.customer_name,
        customer_phone: request.customer_phone,
        city: request.city,
        district: request.district,
        final_price: price,
        deposit_amount: deposit,
        remaining_amount: remaining,
        voucher_code: voucher,
        checkin_date: request.requested_date,
        checkin_time: request.requested_time,
        status: deposit > 0 ? 'waiting_payment' : 'confirmed',
        price_locked: true,
        hotel_contact_name: hotelContactName || null,
        admin_notes: adminNotes || null
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la création de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Convertir la demande en réservation
      </h3>

      <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <p><strong>Client:</strong> {request.customer_name} ({request.customer_phone})</p>
        <p><strong>Critères:</strong> {request.city} - {request.district || 'Tout quartier'} | Budget max: {request.budget_max || 'N/A'} FCFA</p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
          {errorMsg}
        </div>
      )}

      {loadingHotels ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-sm text-rose-600 dark:text-rose-400">
          Aucun hôtel partenaire actif trouvé pour cette ville. Ajoutez d'abord un hôtel dans la section Hôtels.
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Choisir un hôtel partenaire *</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.district || 'Sans quartier'}) - Fiabilité: {h.reliability_score}% | {h.price_min || 'N/A'}-{h.price_max || 'N/A'} FCFA
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Prix total final (FCFA) *</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Acompte requis (FCFA) - 0 si aucun</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Contact hôtel (Nom du gérant / réceptionniste)</label>
              <input
                type="text"
                value={hotelContactName}
                onChange={(e) => setHotelContactName(e.target.value)}
                placeholder="Ex: Mme. Flore"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Notes Internes / Admin</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-955 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-350 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-850"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Créer la réservation
            </button>
          </div>
        </>
      )}
    </form>
  );
}
