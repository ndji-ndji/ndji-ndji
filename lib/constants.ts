// Cities & Districts in Congo
export const CITIES = [
  { id: 'Brazzaville', name: 'Brazzaville' },
  { id: 'Pointe-Noire', name: 'Pointe-Noire' }
] as const;

export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Brazzaville: [
    'Centre-ville',
    'Bacongo',
    'Poto-Poto',
    'Moungali',
    'Ouenzé',
    'Talangaï',
    'Makélékélé',
    'Mfilou',
    'Djiri',
    'Madibou'
  ],
  'Pointe-Noire': [
    'Centre-ville',
    'Lumumba',
    'Mvoumvou',
    'Tié-Tié',
    'Loandjili',
    'Mongo-MPoukou',
    'Côte Sauvage'
  ]
};

// Hotel categories & statuses
export const HOTEL_CATEGORIES = {
  local_express: 'Local Express (Économique)',
  business: 'Business / Affaires',
  mixed: 'Mixte (Moyen de gamme)',
  avoid: 'À éviter / Surveillance'
} as const;

export const HOTEL_STATUSES = {
  active: 'Actif',
  paused: 'En pause',
  blacklisted: 'Liste noire'
} as const;

// Room requests statuses & stay types
export const STAY_TYPES = {
  few_hours: 'Quelques heures',
  one_night: 'Une nuit',
  multiple_nights: 'Plusieurs nuits',
  unknown: 'Non spécifié'
} as const;

export const REQUEST_STATUSES = {
  new: 'Nouvelle demande',
  contacting_hotels: 'Recherche en cours',
  offer_found: 'Offre trouvée',
  waiting_payment: 'Attente acompte',
  booked: 'Réservé',
  cancelled: 'Annulé',
  expired: 'Expiré',
  failed: 'Échoué'
} as const;

// Booking statuses
export const BOOKING_STATUSES = {
  created: 'Créé',
  waiting_payment: 'Attente acompte',
  payment_confirmed: 'Acompte reçu',
  confirmed: 'Confirmé par hôtel',
  voucher_sent: 'Voucher envoyé',
  checkin_pending: 'Check-in en attente',
  checkin_confirmed: 'Check-in effectué',
  cancelled: 'Annulé',
  disputed: 'Litige',
  refunded: 'Remboursé'
} as const;

// Payment methods & statuses
export const PAYMENT_METHODS = {
  mtn_money: 'MTN Mobile Money',
  airtel_money: 'Airtel Money',
  cash: 'Espèces (Cash)',
  other: 'Autre mode'
} as const;

export const PAYMENT_STATUSES = {
  pending: 'En attente',
  received: 'Reçu',
  failed: 'Échoué',
  refunded: 'Remboursé',
  blocked: 'Bloqué'
} as const;

// Incident types & severities
export const INCIDENT_TYPES = {
  price_changed: 'Changement de tarif par l\'hôtel',
  no_room: 'Pas de chambre libre (surréservation)',
  bad_room: 'Qualité chambre non conforme',
  hotel_cancelled: 'Annulation par l\'hôtel',
  client_complaint: 'Plainte du client',
  suspected_bypass: 'Soupçon de contournement',
  payment_issue: 'Problème de paiement',
  other: 'Autre incident'
} as const;

export const INCIDENT_SEVERITIES = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée',
  critical: 'Critique'
} as const;
