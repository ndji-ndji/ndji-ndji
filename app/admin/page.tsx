'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminNav from '../../components/AdminNav';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Loader2, Inbox, CalendarDays, AlertTriangle, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [stats, setStats] = useState({
    newRequests: 0,
    activeBookings: 0,
    pendingPayments: 0,
    activeIncidents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndFetchStats() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setSessionChecked(true);

      try {
        // Fetch new requests count
        const { count: newReqCount } = await supabase
          .from('room_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        // Fetch active bookings count
        const { count: activeBCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .not('status', 'in', '("cancelled","disputed","refunded")');

        // Fetch pending payments
        const { count: pendingPayCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Fetch active incidents
        const { count: incidentCount } = await supabase
          .from('incidents')
          .select('*', { count: 'exact', head: true })
          .eq('resolved', false);

        setStats({
          newRequests: newReqCount || 0,
          activeBookings: activeBCount || 0,
          pendingPayments: pendingPayCount || 0,
          activeIncidents: incidentCount || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchStats();
  }, []);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tableau de Bord Admin</h1>
            <p className="text-sm text-slate-500">Vue d'ensemble de l'activité commerciale d'Omnirent V1 au Congo</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat Card 1 */}
            <Link href="/admin/demandes" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.newRequests}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Nouvelles Demandes</h3>
              <p className="mt-1 text-xs text-slate-400">Demandes de chambres non traitées</p>
            </Link>

            {/* Stat Card 2 */}
            <Link href="/admin/reservations" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.activeBookings}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Réservations Actives</h3>
              <p className="mt-1 text-xs text-slate-400">Dossiers confirmés ou en attente d'acompte</p>
            </Link>

            {/* Stat Card 3 */}
            <Link href="/admin/paiements" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <CircleDollarSign className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.pendingPayments}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Paiements en Attente</h3>
              <p className="mt-1 text-xs text-slate-400">Acomptes Mobile Money ou Cash à valider</p>
            </Link>

            {/* Stat Card 4 */}
            <Link href="/admin/incidents" className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.activeIncidents}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Incidents Non Résolus</h3>
              <p className="mt-1 text-xs text-slate-400">Surréservations ou litiges hôteliers à traiter</p>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Inline fallback component for lucide-react build issue if any
function CalendarCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}
