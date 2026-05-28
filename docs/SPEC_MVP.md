# Spécifications Fonctionnelles MVP (V1) - CongoBooking

## Contexte
Le marché hôtelier au Congo (Brazzaville & Pointe-Noire) souffre d'un manque de synchronisation en temps réel des chambres. CongoBooking résout ce problème en proposant un modèle hybride :
1. Le client formule son besoin.
2. Les administrateurs négocient et vérifient manuellement la disponibilité.
3. La réservation est verrouillée par un acompte Mobile Money et un code voucher unique.

## Modules du Système

### 1. Formulaire Client Public
- Collecte des critères de recherche : Ville, Quartier, Budget, Dates, Voyageurs.
- Validation automatique des numéros de téléphone congolais (préfixes MTN `06` et Airtel `05`).
- Expérience utilisateur fluide et moderne, optimisée pour le format mobile (PWA).

### 2. Gestion et Calcul de la Fiabilité (Hôtels)
- Chaque hôtel possède un score de fiabilité sur 100.
- Tout incident majeur (ex: refus d'honorer une réservation confirmée, hausse de prix à l'arrivée) diminue le score de l'établissement :
  - Incident critique : -25%
  - Incident élevé : -15%
  - Incident moyen : -10%
  - Incident faible : -5%
- La résolution d'un incident redonne la moitié des points déduits pour encourager la bonne conduite.

### 3. Système d'Acompte et Paiement Manuel
- Dans le contexte local, les paiements automatisés en ligne sont peu utilisés.
- Le client paie un acompte par MTN Mobile Money ou Airtel Money vers un numéro de l'agence.
- L'administrateur confirme manuellement la réception de la transaction dans le dashboard, ce qui débloque instantanément le statut "Confirmé" et active le voucher.
