'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, UserCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function HotelNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/hotel/login';
  };

  const navItems = [
    { href: '/hotel', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/hotel/dispo', label: 'Disponibilités', icon: CalendarDays },
    { href: '/hotel/profil', label: 'Mon Profil', icon: UserCircle },
  ];

  return (
    <div className="w-full bg-teal-800 text-white dark:bg-teal-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-teal-700 text-teal-100'
                      : 'text-teal-200 hover:bg-teal-700 hover:text-white'
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
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-rose-300 hover:bg-teal-700 hover:text-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
