import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PhoneCall, CalendarCheck, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white transition-colors">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-650/10 via-teal-900/5 to-slate-950">
          <div className="mx-auto max-w-7xl relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Réservation Hôtelière Fiable au Congo
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white">
              Réservez votre chambre en toute <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Sérénité</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Fini les surprises de surréservation ou de tarifs gonflés à l&apos;arrivée. Nous vérifions la disponibilité auprès de nos hôtels partenaires à Brazzaville et Pointe-Noire avant de confirmer votre chambre.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demande"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-700/30 transition-all"
              >
                Faire une demande de chambre
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/242066666666"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-all"
              >
                <PhoneCall className="h-5 w-5 text-emerald-500" />
                Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-950 dark:text-white">Comment ça marche ?</h2>
          <p className="text-center text-slate-500 mt-2 max-w-xl mx-auto">Un fonctionnement simple conçu pour le contexte local et la fiabilité.</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold">1</div>
              <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">Envoyez votre demande</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Remplissez notre formulaire en indiquant votre budget, vos dates et vos préférences (Brazzaville ou Pointe-Noire).</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold">2</div>
              <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">Nous négocions et confirmons</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nous contactons directement les gérants d&apos;hôtels partenaires fiables et bloquons le tarif pour vous.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold">3</div>
              <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">Acompte &amp; Voucher de sécurité</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Payez un acompte sécurisé via Mobile Money (MTN/Airtel) pour recevoir votre reçu de réservation officiel.</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-100 dark:bg-slate-900/50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-950 dark:text-white">Pourquoi choisir CongoBooking ?</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">Tarifs Bloqués</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Le prix convenu est garanti par notre service. Pas de mauvaise surprise lors du check-in.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">Vérification de Fiabilité</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nous notons les hôtels partenaires pour écarter ceux qui ne respectent pas leurs engagements.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">Support Local Dédié</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Un problème lors de votre check-in ? Notre équipe locale intervient ou vous reloge immédiatement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
