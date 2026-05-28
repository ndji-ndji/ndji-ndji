# Rôle et Instructions des Agents de Développement - CongoBooking

Ce projet est conçu pour être simple, évolutif et compréhensible pour des non-techniciens. Tout agent de développement (IA ou humain) travaillant sur ce projet doit respecter les règles suivantes.

## 📐 Architecture
- **Framework** : Next.js 14 avec App Router (`/app`).
- **Styling** : Tailwind CSS pour un design responsive, épuré et respectant la charte graphique premium (vert émeraude, ardoise foncée).
- **Backend & Base de données** : Supabase (BaaS). Pas de backend Node.js lourd personnalisé. Les interactions avec la base de données se font directement via `@supabase/supabase-js` sur le client ou sur le serveur.
- **Sécurité** : La sécurité au niveau des lignes (RLS) est activée sur toutes les tables Supabase. L'accès en lecture/écriture publique est restreint au strict minimum (insertion uniquement pour `room_requests`). Tout le reste nécessite le rôle d'administrateur authentifié.

## ✍️ Code & Standards de Fichiers
- **Structure** :
  - `/app` : Pages et sous-pages Next.js.
  - `/components` : Composants UI autonomes et réutilisables.
  - `/lib` : Fonctions utilitaires, constantes et validateurs partagés.
  - `/supabase` : Fichiers SQL de base de données (schémas et seeds).
- **TypeScript** : Typage obligatoire de toutes les fonctions clés, en particulier les validateurs, générateurs de codes, et clients API.
- **PWA** : Toute modification de la structure de l'application ou des en-têtes HTML doit conserver ou améliorer la configuration PWA définie dans `public/manifest.json` et `app/layout.tsx`.
