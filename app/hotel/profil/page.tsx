'use client';

import React, { useEffect, useState } from 'react';
import HotelNav from '../../components/HotelNav';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function HotelProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/hotel/login';
        return;
      }
      const { data: hp, error } = await supabase
        .from('hotel_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      if (error) {
        console.error(error);
        window.location.href = '/hotel/login';
        return;
      }
      setProfile(hp);
      setLoading(false);
    }
    fetchProfile();
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
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
        <div className="rounded bg-teal-800 p-4">
          <p className="text-teal-300 mb-2"><strong>Email:</strong> {profile.email}</p>
          <p className="text-teal-300"><strong>Hotel ID:</strong> {profile.hotel_id}</p>
        </div>
        {/* Future edit form could be added here */}
      </div>
    </div>
  );
}
