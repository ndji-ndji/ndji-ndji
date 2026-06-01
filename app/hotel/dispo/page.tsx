'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function HotelAvailability() {
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des disponibilités</h1>
      <p className="text-teal-300">
        Vous pouvez gérer les disponibilités de votre établissement ici.
        (Fonctionnalité à implémenter.)
      </p>
      {/* Placeholder for future availability UI */}
      <pre className="bg-teal-800 p-4 rounded">Hotel ID: {profile?.hotel_id}</pre>
    </div>
  );
}
