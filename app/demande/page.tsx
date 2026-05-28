import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RequestForm from '../../components/RequestForm';

export default function DemandePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white transition-colors">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Soumettre votre demande</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Indiquez-nous vos préférences et nous nous chargeons de vous trouver la meilleure chambre disponible auprès de partenaires de confiance.
            </p>
          </div>
          
          <RequestForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
