import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle2, PhoneCall } from 'lucide-react';

export default function MerciPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white transition-colors">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Demande reçue !</h1>
          
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Merci pour votre confiance. Notre équipe traite actuellement votre demande. Nous allons contacter les hôtels partenaires de la zone demandée pour vous trouver la meilleure chambre.
          </p>

          <div className="mt-6 bg-slate-50 p-4 rounded-xl dark:bg-slate-800/50 text-left space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prochaines étapes :</h3>
            <p className="text-xs text-slate-600 dark:text-slate-350">
              1. Nous vérifions la disponibilité auprès d'hôtels ayant un bon score de fiabilité.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-350">
              2. Vous recevrez un appel ou un message WhatsApp sous peu pour confirmer l'offre trouvée.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-350">
              3. Un acompte via Mobile Money MTN / Airtel sera demandé pour sécuriser votre réservation.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 transition-colors"
            >
              Retour à l'accueil
            </Link>
            <a
              href="https://wa.me/242066666666"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850 transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-emerald-500" />
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
