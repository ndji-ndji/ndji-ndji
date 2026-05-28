import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 py-8 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} CongoBooking. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Accueil
            </Link>
            <Link href="/demande" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Nouvelle demande
            </Link>
            <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
