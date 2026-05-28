# CongoBooking - Progressive Web App (PWA) de Réservation

CongoBooking est une V1 commerciale d'une application web progressive (PWA) de réservation de chambres d'hôtels et d'hébergements spécialement conçue pour le marché congolais (Brazzaville et Pointe-Noire).

## 🚀 Fonctionnalités Clés
- **Espace Public** : Présentation du service, formulaire de demande de chambre (avec budget min/max, choix du quartier, et validation des numéros de téléphone du Congo).
- **Tableau de Bord Administrateur** : Suivi global, traitement des demandes, conversion des demandes en réservations verrouillées avec génération de codes vouchers uniques.
- **Gestion des Hôtels Partenaires** : CRUD complet des hôtels, gestion de leur score de fiabilité pour assurer un service de qualité supérieure.
- **Validation Manuelle des Paiements** : Suivi des acomptes reçus par MTN Mobile Money, Airtel Money ou en Espèces.
- **Rapports d'Incidents** : Signalement des litiges hôteliers (surréservations, tarifs modifiés) impactant automatiquement le score de fiabilité de l'hôtel.

## 🛠️ Installation & Configuration

1. **Cloner le projet** et installer les dépendances :
   ```bash
   npm install
   ```

2. **Configuration Supabase** :
   - Créez un projet gratuit sur [Supabase](https://supabase.com).
   - Copiez le fichier `.env.example` sous le nom `.env.local` et renseignez vos clés d'API Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
   - Exécutez le script SQL situé dans `supabase/schema.sql` dans le SQL Editor de Supabase pour créer la structure des tables et activer la sécurité RLS.
   - (Optionnel) Exécutez le script SQL `supabase/seed.sql` pour pré-charger des données de démonstration (hôtels et districts à Brazzaville/Pointe-Noire).

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Accéder à l'application** :
   - Espace Client : [http://localhost:3000](http://localhost:3000)
   - Formulaire de Demande : [http://localhost:3000/demande](http://localhost:3000/demande)
   - Espace Admin : [http://localhost:3000/admin](http://localhost:3000/admin) (Identifiants configurés dans Supabase Auth et ajoutés à la table `admin_profiles`).
