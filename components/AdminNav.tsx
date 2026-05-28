'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  Hotel, 
  CalendarDays, 
  CircleDollarSign, 
  AlertTriangle, 
  LogOut 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/demandes', label: 'Demandes', icon: Inbox },
    { href: '/admin/hotels', label: 'Hôtels', icon: Hotel },
    { href: '/admin/reservations', label: 'Réservations', icon: CalendarDays },
    { href: '/admin/paiements', label: 'Paiements', icon: CircleDollarSign },
    { href: '/admin/incidents', label: 'Incidents', icon: AlertTriangle },
  ];

  return (
    <div className="w-full bg-slate-900 text-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
