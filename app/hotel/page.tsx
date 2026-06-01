'use client';

import React, { useEffect, useState } from 'react';
import HotelNav from '../../../components/HotelNav';
import { supabase } from '../../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function HotelDashboard() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/hotel/login';
        return;
      }
      // Get hotel profile
      const { data: profile, error: profileErr } = await supabase
        .from('hotel_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      if (profileErr || !profile) {
        window.location.href = '/hotel/login';
        return;
      }
      setHotel(profile);
      // Get bookings for this hotel
      const { data: bk, error: bkErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('hotel_id', profile.hotel_id);
      if (!bkErr) setBookings(bk);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal-950">
        <Loader2 className="h-12 w-12 animate-spin text-teal-300" />
      </div>
    );
  }

  return (
    <div className="bg-teal-950 min-h-screen text-white">
      <HotelNav />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord – {hotel?.email}</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Réservations récentes</h2>
          {bookings.length === 0 ? (
            <p className="text-teal-300">Aucune réservation pour le moment.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead className="bg-teal-800">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Client</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-teal-800">
                    <td className="p-2 text-sm text-teal-200">{b.id.slice(0, 8)}…</td>
                    <td className="p-2 text-sm">{b.customer_name}</td>
                    <td className="p-2 text-sm">{b.checkin_date}</td>
                    <td className="p-2 text-sm capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
