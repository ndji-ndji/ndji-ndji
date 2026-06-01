'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Hotel, Loader2 } from 'lucide-react';

export default function HotelLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in as hotel user
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('hotel_profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        window.location.href = '/hotel';
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      // Verify this user is a hotel manager, not an admin
      const { data: hotelProfile, error: profileError } = await supabase
        .from('hotel_profiles')
        .select('*')
        .eq('user_id', data.user?.id)
        .single();

      if (profileError || !hotelProfile) {
        await supabase.auth.signOut();
        throw new Error("Accès refusé. Ce compte n'est pas associé à un établissement hôtelier.");
      }

      window.location.href = '/hotel';
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Identifiants invalides. Vérifiez votre email et mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-teal-900 p-8 rounded-2xl border border-teal-800 shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-teal-200">
            <Hotel className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Espace Établissement</h2>
          <p className="mt-2 text-center text-sm text-teal-300">
            Connectez-vous pour gérer votre hôtel partenaire
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-rose-950/40 border border-rose-800/50 p-3 text-sm text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400">
              Adresse e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hotel@example.com"
              className="mt-1 block w-full rounded-lg border border-teal-700 bg-teal-800/50 px-3 py-2 text-white placeholder-teal-500 focus:border-teal-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-teal-700 bg-teal-800/50 px-3 py-2 text-white placeholder-teal-500 focus:border-teal-400 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-teal-900 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Se connecter'}
          </button>

          <p className="text-center text-xs text-teal-400 mt-2">
            Pas encore de compte ?{' '}
            <a href="/admin/login" className="text-teal-200 hover:underline">
              Contactez l'administrateur CongoBooking
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
