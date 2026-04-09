-- ============================================================
-- Cyprus Trip Planner — Supabase Schema + Seed Data
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 6),
  day_date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'night')),
  type TEXT NOT NULL CHECK (type IN ('activity', 'meal', 'nightlife', 'transport')),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  emoji TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES itinerary_items(id) ON DELETE SET NULL,
  day_number INTEGER,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('edit', 'addition', 'swap', 'general')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (public read/write — no login needed)
-- ============================================================

ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read itinerary" ON itinerary_items;
DROP POLICY IF EXISTS "Public write itinerary" ON itinerary_items;
DROP POLICY IF EXISTS "Public read suggestions" ON suggestions;
DROP POLICY IF EXISTS "Public write suggestions" ON suggestions;

CREATE POLICY "Public read itinerary" ON itinerary_items FOR SELECT USING (true);
CREATE POLICY "Public write itinerary" ON itinerary_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read suggestions" ON suggestions FOR SELECT USING (true);
CREATE POLICY "Public write suggestions" ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update suggestions" ON suggestions FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Data — Cyprus Trip Aug 5–10, 2025
-- ============================================================

INSERT INTO itinerary_items (day_number, day_date, time_slot, type, title, description, location, emoji, order_index) VALUES

-- ┌─────────────────────────────────────┐
-- │  Day 1 — Aug 5 · Arrival Day        │
-- └─────────────────────────────────────┘
(1, '2025-08-05', 'morning', 'transport', 'Fly into Larnaca Airport', 'Land at Larnaca International Airport (LCA). Grab bags, exchange some euros if needed, grab a SIM card from the airport kiosks.', 'Larnaca International Airport', '✈️', 1),
(1, '2025-08-05', 'afternoon', 'transport', 'Taxi to Ayia Napa', 'Shared taxi or OSYPA bus to Ayia Napa (~45 min, ~€50 shared taxi or €3 bus). Check into the apartment/hotel, dump your bags, sort the group.', 'Larnaca → Ayia Napa', '🚌', 2),
(1, '2025-08-05', 'afternoon', 'activity', 'Nissi Beach', 'Hit Nissi Beach to decompress after the flight. Crystal clear turquoise water, white sand — the iconic Ayia Napa beach experience. Grab a sunbed and a cold Keo beer.', 'Nissi Beach, Ayia Napa', '🏖️', 3),
(1, '2025-08-05', 'evening', 'meal', 'Vassos Fish Harbour Restaurant', 'Fresh seafood right on the harbour. Get the grilled octopus, calamari, and the full mezedes spread. Proper Cypriot vibes. Book ahead if you can.', 'Ayia Napa Harbour', '🐙', 4),
(1, '2025-08-05', 'night', 'nightlife', 'Ayia Napa Square Bar Crawl', 'First night, ease into it. Start at the main square, hit Bedrock Inn and Aqua Bar. End at Castle Club or Carwash for the full Ayia Napa experience. Brace yourselves.', 'Ayia Napa Town Square', '🍻', 5),

-- ┌─────────────────────────────────────┐
-- │  Day 2 — Aug 6 · Adventure Day      │
-- └─────────────────────────────────────┘
(2, '2025-08-06', 'morning', 'meal', 'Breakfast Fuel Up', 'Full English or Cyprus breakfast somewhere local before the day''s missions. Halloumi, eggs, fresh bread. The works. You''ll need the energy.', 'Ayia Napa Town', '☕', 1),
(2, '2025-08-06', 'morning', 'activity', 'Cape Greco Sea Caves Kayaking', 'Rent kayaks from the Cape Greco area and explore the famous sea caves and Blue Lagoon. Absolute natural wonder. One of the most stunning spots in Cyprus — turquoise water, dramatic cliffs.', 'Cape Greco National Park', '🚣', 2),
(2, '2025-08-06', 'afternoon', 'activity', 'Watersports at Makronissos Beach', 'Jet skis, banana boats, parasailing, flyboarding — go full send. Plenty of watersport rental spots along the beach. Budget ~€30–60 each depending on what you do.', 'Makronissos Beach, Ayia Napa', '🤿', 3),
(2, '2025-08-06', 'afternoon', 'meal', 'Beach Club Lunch', 'Grab lunch at one of the beach club bars. Burgers, wraps, halloumi fries, and cold beers with your feet in the sand. Don''t overthink it.', 'Makronissos Beach Area', '🍔', 4),
(2, '2025-08-06', 'evening', 'activity', 'Sunset Drinks at Rock Cafe', 'Watch the sunset with cocktails at the iconic Rock Cafe — literally built into the cliffside. Views are insane. Arrive early to get a spot. Order the frozen cocktails.', 'Rock Cafe, Ayia Napa', '🌅', 5),
(2, '2025-08-06', 'night', 'nightlife', 'Kool Pool Party or Club Camelot', 'The Kool Pool Party runs most summer nights and is one of the best things in Ayia Napa — huge outdoor pool, international DJs, thousands of people. Check the schedule. If it''s not on, Club Camelot is the next best thing.', 'Ayia Napa', '🎉', 6),

-- ┌─────────────────────────────────────┐
-- │  Day 3 — Aug 7 · Beach & Protaras   │
-- └─────────────────────────────────────┘
(3, '2025-08-07', 'morning', 'activity', 'Fig Tree Bay, Protaras', 'Consistently ranked one of Europe''s top 10 beaches. Calm, crystal-clear water — you can see the bottom at 5 metres. Get there early (10am) for a sunbed before it fills up.', 'Fig Tree Bay, Protaras', '🌊', 1),
(3, '2025-08-07', 'afternoon', 'activity', 'Snorkeling & Paddleboarding', 'Rent gear from beach vendors — the water clarity here is insane. Paddleboard out to the small rocky islands. The visibility can be 10+ metres on a calm day.', 'Fig Tree Bay, Protaras', '🏄', 2),
(3, '2025-08-07', 'afternoon', 'meal', 'Meze Lunch at a Protaras Taverna', 'Traditional Cypriot meze — halloumi, souvlaki, kleftiko, loukoumades, fresh salad. This is the real food Cyprus is known for. Heavy but worth every bite.', 'Protaras', '🥙', 3),
(3, '2025-08-07', 'evening', 'meal', 'Seafood Dinner at Pernera', 'Fresh catch of the day, grilled fish whole, cold Keo beers watching the sea turn golden. The restaurants along Pernera Beach are great value.', 'Pernera, Protaras', '🐟', 4),
(3, '2025-08-07', 'night', 'nightlife', 'Protaras Bar Strip', 'Way more laid-back than Ayia Napa. Good vibes at Sirens Bar and the strip along Fig Tree Bay Road. Ideal recovery night — cocktails, not carnage.', 'Protaras', '🍹', 5),

-- ┌─────────────────────────────────────┐
-- │  Day 4 — Aug 8 · Limassol Day Trip  │
-- └─────────────────────────────────────┘
(4, '2025-08-08', 'morning', 'transport', 'Drive to Limassol', 'Rent a car (~€30/day split) or take the OSYPA intercity bus from Ayia Napa (~€8, 1.5hr). Early start recommended — you want maximum time in the city.', 'Ayia Napa → Limassol', '🚗', 1),
(4, '2025-08-08', 'morning', 'activity', 'Limassol Old Town & Medieval Castle', 'Explore the old town''s narrow streets and colourful buildings. Visit Limassol Medieval Castle (€4.50 entry) — Richard the Lionheart literally got married here in 1191 before leaving for the Crusades.', 'Limassol Old Town', '🏰', 2),
(4, '2025-08-08', 'afternoon', 'activity', 'Limassol Marina', 'Walk the marina, spot the mega yachts, grab coffee at one of the waterfront spots. The new development is seriously impressive. Cyprus money is something else.', 'Limassol Marina', '⚓', 3),
(4, '2025-08-08', 'afternoon', 'meal', 'Traditional Meze at Ladas Tavern', 'No frills, legendary Cypriot food. Massive portions, local crowd, cheap prices. Order the full meze — you will not be disappointed and you will not be able to move afterwards.', 'Limassol Town', '🍽️', 4),
(4, '2025-08-08', 'evening', 'meal', 'Drinks at Saripolou Square', 'The lively bar square in Limassol''s old town. Outdoor seating, cocktails, great atmosphere. Good place to spend an hour before heading back to Ayia Napa.', 'Saripolou Square, Limassol', '🥂', 5),
(4, '2025-08-08', 'night', 'transport', 'Return to Ayia Napa', 'Head back to base. If you rented a car, use it — or get an intercity taxi. Important: do NOT drink and drive. Sort a taxi if needed.', 'Limassol → Ayia Napa', '🌙', 6),

-- ┌─────────────────────────────────────┐
-- │  Day 5 — Aug 9 · Paphos & History   │
-- └─────────────────────────────────────┘
(5, '2025-08-09', 'morning', 'transport', 'Drive to Paphos', 'Early start — Paphos is 2.5 hours from Ayia Napa via the A1/A6 motorway. Worth every minute of the drive. Rent a car if you haven''t already.', 'Ayia Napa → Paphos', '🚗', 1),
(5, '2025-08-09', 'morning', 'activity', 'Paphos Archaeological Park', 'UNESCO World Heritage site. Roman mosaics that are genuinely one of the most impressive things in the Mediterranean. €6.50 entry. Wear sunscreen — lots of walking in the open. Hire the audio guide.', 'Paphos Archaeological Park', '🏛️', 2),
(5, '2025-08-09', 'afternoon', 'activity', 'Aphrodite''s Rock (Petra tou Romiou)', 'The mythical birthplace of Aphrodite. Dramatic rocky coastline with crystal-clear water. Swim around the rock — legend says it brings luck in love. Make of that what you will.', 'Petra tou Romiou, Paphos', '💎', 3),
(5, '2025-08-09', 'afternoon', 'meal', 'Lunch at Paphos Harbour', 'Tons of restaurants along the harbour. Get a table with a harbour view and order fresh fish or calamari. The tourist strip is a bit pricey but the location makes up for it.', 'Paphos Old Harbour', '🦑', 4),
(5, '2025-08-09', 'evening', 'meal', 'Dinner at Theo''s Seafood Restaurant', 'Consistently rated best seafood in Paphos. Pricier than the rest of the trip (~€25-35 each) but it''s the last proper dinner. Worth it. Book ahead.', 'Paphos', '🍤', 5),
(5, '2025-08-09', 'night', 'nightlife', 'Paphos Bar Street', 'Apostolou Pavlou Avenue is the main strip. More relaxed than Ayia Napa — cocktail bars rather than mega clubs. Good final night out vibe.', 'Paphos Bar Street', '🎶', 6),

-- ┌─────────────────────────────────────┐
-- │  Day 6 — Aug 10 · Last Day & Home   │
-- └─────────────────────────────────────┘
(6, '2025-08-10', 'morning', 'activity', 'Final Sunrise Beach Session', 'Last morning in Cyprus. Get down to Nissi Beach one more time. Early morning swim before the crowds arrive — the light is perfect. Soak it all in.', 'Nissi Beach, Ayia Napa', '🌅', 1),
(6, '2025-08-10', 'morning', 'meal', 'Final Cyprus Breakfast', 'Full Cypriot breakfast — halloumi, fried eggs, olives, fresh bread, tomatoes. Sit outside. This is the last one for a while.', 'Ayia Napa', '🍳', 2),
(6, '2025-08-10', 'afternoon', 'activity', 'Souvenir Shopping', 'Grab vacuum-packed halloumi (it clears customs), Commandaria wine (world''s oldest wine designation), cold-pressed olive oil, and the obligatory Cyprus fridge magnet. Check airline bag limits.', 'Ayia Napa Town', '🛍️', 3),
(6, '2025-08-10', 'afternoon', 'transport', 'Transfer to Larnaca Airport', 'Allow 2 hours for the drive (~45 min) + check-in + security. Do not miss the flight because someone wanted one more swim.', 'Larnaca Airport', '✈️', 4),
(6, '2025-08-10', 'evening', 'transport', 'Fly Home', 'Wheels up. Trip complete. Already planning the next one.', 'In the air ✈️', '🏠', 5);
