'use client';

import React, { useState } from 'react';
import { CITIES, DISTRICTS_BY_CITY, STAY_TYPES } from '../lib/constants';
import { validateCongoPhone } from '../lib/validators';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RequestForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    city: 'Brazzaville',
    district: '',
    budgetMin: '',
    budgetMax: '',
    stayType: 'unknown',
    requestedDate: '',
    requestedTime: '',
    guestsCount: '1',
    preferences: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset district if city changes
      ...(name === 'city' ? { district: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Validate name
    if (!formData.customerName.trim()) {
      setErrorMsg('Veuillez entrer votre nom complet.');
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!validateCongoPhone(formData.customerPhone)) {
      setErrorMsg('Numéro de téléphone invalide (ex: 05 555 55 55 ou 06 666 66 66).');
      setLoading(false);
      return;
    }

    // Validate budget
    const min = formData.budgetMin ? parseInt(formData.budgetMin) : undefined;
    const max = formData.budgetMax ? parseInt(formData.budgetMax) : undefined;
    if (min !== undefined && min < 0) {
      setErrorMsg('Le budget minimum ne peut pas être négatif.');
      setLoading(false);
      return;
    }
    if (max !== undefined && max < 0) {
      setErrorMsg('Le budget maximum ne peut pas être négatif.');
      setLoading(false);
      return;
    }
    if (min !== undefined && max !== undefined && max < min) {
      setErrorMsg('Le budget maximum doit être supérieur ou égal au budget minimum.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('room_requests').insert([
        {
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          city: formData.city,
          district: formData.district || null,
          budget_min: min || null,
          budget_max: max || null,
          stay_type: formData.stayType,
          requested_date: formData.requestedDate || null,
          requested_time: formData.requestedTime || null,
          guests_count: parseInt(formData.guestsCount) || 1,
          preferences: formData.preferences || null,
          status: 'new'
        }
      ]);

      if (error) throw error;
      setSuccess(true);
      window.location.href = '/merci';
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Formulaire de demande de chambre</h2>
      
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom complet *</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="Ex: Jean Loubaki"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Numéro de téléphone (Congo) *</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            placeholder="Ex: 06 666 6666"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ville *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quartier (Optionnel)</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          >
            <option value="">Sélectionnez un quartier</option>
            {(DISTRICTS_BY_CITY[formData.city] || []).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Min */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Budget minimum (FCFA)</label>
          <input
            type="number"
            name="budgetMin"
            value={formData.budgetMin}
            onChange={handleChange}
            placeholder="Ex: 15000"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Budget Max */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Budget maximum (FCFA)</label>
          <input
            type="number"
            name="budgetMax"
            value={formData.budgetMax}
            onChange={handleChange}
            placeholder="Ex: 35000"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Stay Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type de séjour</label>
          <select
            name="stayType"
            value={formData.stayType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          >
            {Object.entries(STAY_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Guests Count */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de personnes</label>
          <input
            type="number"
            name="guestsCount"
            value={formData.guestsCount}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Requested Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date d'arrivée</label>
          <input
            type="date"
            name="requestedDate"
            value={formData.requestedDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Requested Time */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Heure d'arrivée approximative</label>
          <input
            type="time"
            name="requestedTime"
            value={formData.requestedTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>
      </div>

      {/* Preferences / Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Préférences (Ex: avec clim, petit déjeuner, quartier calme, etc.)</label>
        <textarea
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
          rows={3}
          placeholder="Dites-nous en plus sur vos besoins..."
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-850 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-150"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          'Envoyer la demande'
        )}
      </button>
    </form>
  );
}
