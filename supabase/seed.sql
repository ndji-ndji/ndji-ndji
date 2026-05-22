-- ==========================================
-- SEED DATA - BOOKING ACCESSIBLE CONGO
-- ==========================================

-- 1. Insert seed hotels in Brazzaville and Pointe-Noire
INSERT INTO hotels (name, city, district, address, phone, whatsapp, category, price_min, price_max, reliability_score, status, notes)
VALUES
('Hôtel Olympic Palace', 'Brazzaville', 'Centre-ville', 'Avenue Nelson Mandela', '+242 05 555 1234', '+242 06 666 1234', 'business', 75000, 150000, 90, 'active', 'Hôtel haut de gamme, très fiable mais prix élevés.'),
('Ledger Plaza Maya Maya', 'Brazzaville', 'Centre-ville', 'Avenue de la Libération', '+242 05 111 2222', '+242 06 333 4444', 'business', 90000, 180000, 85, 'active', 'Hôtel de référence près de l\\'aéroport. Service constant.'),
('Résidence Elbo Suites', 'Brazzaville', 'Centre-ville', 'Rue de Reims', '+242 05 777 8888', '+242 06 999 0000', 'mixed', 45000, 80000, 75, 'active', 'Bon rapport qualité prix, studios équipés.'),
('Hôtel Elaïs', 'Pointe-Noire', 'Centre-ville', 'Boulevard du Général de Gaulle', '+242 05 444 5555', '+242 06 222 3333', 'business', 80000, 160000, 95, 'active', 'La référence à Pointe-Noire pour les affaires. Fiabilité excellente.'),
('Auberge la Frontière Talangaï', 'Brazzaville', 'Talangaï', 'Rond-point Mazanza', '+242 05 999 1111', '', 'local_express', 15000, 30000, 60, 'active', 'Auberge locale bon marché. Climatisation parfois défaillante, à surveiller.'),
('Résidence Konda', 'Pointe-Noire', 'Côte Sauvage', 'Avenue de la Côte Sauvage', '+242 05 888 7777', '+242 06 888 7777', 'mixed', 35000, 65000, 50, 'active', 'Nouveau partenaire, calme, proche de la plage.'),
('Hôtel le Phénix (Éviter)', 'Brazzaville', 'Bacongo', 'Avenue de l\\'OUA', '+242 05 222 1111', '', 'avoid', 25000, 50000, 20, 'paused', 'Nombreux changements de tarifs injustifiés lors des dernières réservations.');

-- 2. Insert sample room requests
INSERT INTO room_requests (customer_name, customer_phone, city, district, budget_min, budget_max, stay_type, requested_date, requested_time, guests_count, preferences, status, admin_notes)
VALUES
('Jean-Pierre Makosso', '+242 06 888 1234', 'Brazzaville', 'Centre-ville', 30000, 60000, 'one_night', '2026-06-01', '14:00', 1, 'Besoin de Wi-Fi haut débit et climatisation obligatoire.', 'new', 'Nouvelle demande reçue par formulaire. À proposer à Résidence Elbo.'),
('Marie-Claire Bouanga', '+242 05 777 4321', 'Pointe-Noire', 'Centre-ville', 50000, 100000, 'multiple_nights', '2026-06-05', '18:00', 2, 'Chambre avec lit double et petit-déjeuner inclus.', 'contacting_hotels', 'Contact en cours avec Hôtel Elaïs pour validation de la disponibilité.'),
('Alain Moundanga', '+242 06 999 5678', 'Brazzaville', 'Talangaï', 15000, 25000, 'few_hours', '2026-05-25', '11:00', 1, 'Pas de préférence particulière, entrée rapide.', 'booked', 'Réservation validée et payée.');

-- 3. Insert a sample booking to match the 'booked' request above
-- First we fetch the ID in normal operations, here we mock it or link it
-- We insert a dummy booking
INSERT INTO bookings (id, request_id, customer_name, customer_phone, city, district, final_price, deposit_amount, remaining_amount, voucher_code, checkin_date, checkin_time, status, price_locked, hotel_contact_name, admin_notes)
VALUES
('b0000000-0000-0000-0000-000000000001', NULL, 'Alain Moundanga', '+242 06 999 5678', 'Brazzaville', 'Talangaï', 20000, 10000, 10000, 'BZV-39281', '2026-05-25', '11:00', 'confirmed', true, 'M. Michel (Gérant)', 'Chambre validée au téléphone avec le gérant de l\\'auberge.');

-- 4. Insert a mock payment
INSERT INTO payments (booking_id, amount, method, status, reference, confirmed_by, confirmed_at, admin_notes)
VALUES
('b0000000-0000-0000-0000-000000000001', 10000, 'mtn_money', 'received', 'MTN-REF-9928371', 'Admin Principal', now(), 'Acompte reçu par Mobile Money sur le numéro de l\\'agence.');

-- 5. Insert a mock incident
INSERT INTO incidents (booking_id, type, severity, description, resolved, resolution_notes)
VALUES
(NULL, 'price_changed', 'medium', 'Hôtel Le Phénix a tenté de facturer 30 000 FCFA au lieu de 25 000 FCFA lors du check-in.', true, 'L\\'agence a couvert la différence de 5 000 FCFA pour le client. Partenaire rétrogradé à la catégorie "avoid".');
