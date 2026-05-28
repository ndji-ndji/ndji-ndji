'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import HotelForm from '../../../components/HotelForm';
import EmptyState from '../../../components/EmptyState';
import { Loader2, Plus, Phone, Award, Star, MessageSquare } from 'lucide-react';
import { HOTEL_CATEGORIES } from '../../../lib/constants';

export default function AdminHotelsPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any | null>(null);

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setSessionChecked(true);
      fetchHotels();
    }

    checkAuthAndFetch();
  }, []);

  async function fetchHotels() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('reliability_score', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (editingHotel) {
        const { error } = await supabase
          .from('hotels')
          .update(formData)
          .eq('id', editingHotel.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hotels')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingHotel(null);
      fetchHotels();
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Impossible d\'enregistrer l\'hôtel.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchHotels();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du changement de statut.');
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hôtels Partenaires</h1>
            <p className="text-sm text-slate-500">Gérez les hôtels partenaires du Congo, leurs tarifs indicatifs et leurs scores de fiabilité.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setEditingHotel(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouveau Partenaire
            </button>
          )}
        </div>

        {showForm && (
          <div className="max-w-2xl mx-auto mb-8">
            <HotelForm
              initialData={editingHotel}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingHotel(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : hotels.length === 0 ? (
          <EmptyState 
            title="Aucun hôtel trouvé" 
            description="Ajoutez votre premier hôtel partenaire pour commencer à traiter les demandes clients."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <div 
                key={hotel.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-slate-950 dark:text-white">{hotel.name}</h3>
                      <p className="text-xs text-slate-400">{hotel.city} | {hotel.district || 'Non spécifié'}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${getReliabilityColor(hotel.reliability_score)}`}>
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {hotel.reliability_score}%
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {hotel.phone || 'Non spécifié'}
                    </p>
                    {hotel.whatsapp && (
                      <p className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-emerald-500" />
                        WhatsApp: {hotel.whatsapp}
                      </p>
                    )}
                    <p>
                      <strong>Catégorie :</strong> {HOTEL_CATEGORIES[hotel.category as keyof typeof HOTEL_CATEGORIES] || hotel.category}
                    </p>
                    <p>
                      <strong>Tarifs indicatifs :</strong> {hotel.price_min ? `${hotel.price_min} - ` : ''}{hotel.price_max || 'N/A'} FCFA
                    </p>
                    {hotel.notes && (
                      <p className="text-xs italic bg-slate-50 dark:bg-slate-850 p-2 rounded-lg mt-2 text-slate-500 dark:text-slate-400">
                        "{hotel.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                    hotel.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-450' 
                      : hotel.status === 'paused'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-450'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-450'
                  }`}>
                    {hotel.status === 'active' ? 'Actif' : hotel.status === 'paused' ? 'En pause' : 'Liste noire'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingHotel(hotel);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Modifier
                    </button>
                    {hotel.status === 'active' ? (
                      <button
                        onClick={() => handleUpdateStatus(hotel.id, 'paused')}
                        className="text-xs font-semibold text-amber-600 hover:underline"
                      >
                        Suspendre
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(hotel.id, 'active')}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Activer
                      </button>
                    )}
                  </div>
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
