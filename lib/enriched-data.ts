export interface EnrichedData {
  image: string
  cost: string
  maps_url: string
  info_url?: string
  info_label?: string
}

// Keyed by exact activity title from the DB
export const ENRICHED: Record<string, EnrichedData> = {

  // ── Day 1 · Arrival ──────────────────────────────────────────────────────

  'Fly into Larnaca Airport': {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&fit=crop',
    cost: 'Airline ticket (pre-booked)',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Larnaca+International+Airport+Cyprus',
    info_url: 'https://www.hermesairports.com/',
    info_label: 'Airport Website',
  },

  'Taxi to Ayia Napa': {
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80&fit=crop',
    cost: '€3 pp (bus) · €50 total (shared taxi)',
    maps_url: 'https://www.google.com/maps/dir/Larnaca+International+Airport/Ayia+Napa',
    info_url: 'https://www.intercity-buses.com/',
    info_label: 'Bus Timetable',
  },

  'Nissi Beach': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&fit=crop',
    cost: 'Free entry · Sunbeds ~€10–15 each',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Nissi+Beach+Ayia+Napa+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/sun-beach/beaches/item/328-nissi-beach',
    info_label: 'Visit Cyprus Guide',
  },

  'Vassos Fish Harbour Restaurant': {
    image: 'https://images.unsplash.com/photo-1559541489164-4d40a8fde4d9?w=800&q=80&fit=crop',
    cost: '~€25–35 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Vassos+Fish+Harbour+Restaurant+Ayia+Napa',
    info_url: 'https://www.tripadvisor.com/Restaurant_Review-g190373-d2398621-Reviews-Vassos_Fish_Harbour_Restaurant-Ayia_Napa.html',
    info_label: 'TripAdvisor Reviews',
  },

  'Ayia Napa Square Bar Crawl': {
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80&fit=crop',
    cost: '~€40–70 (drinks + entry)',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Ayia+Napa+Town+Square+Cyprus',
    info_url: 'https://www.bedrockinnayanapa.com/',
    info_label: 'Bedrock Inn',
  },

  // ── Day 2 · Adventure ────────────────────────────────────────────────────

  'Breakfast Fuel Up': {
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88dc5?w=800&q=80&fit=crop',
    cost: '~€8–14 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=breakfast+cafe+Ayia+Napa+Cyprus',
  },

  'Cape Greco Sea Caves Kayaking': {
    image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80&fit=crop',
    cost: '~€25–40 kayak rental',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Cape+Greco+National+Park+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/rural/nature-trails/item/268-cape-greko',
    info_label: 'Visit Cyprus Guide',
  },

  'Watersports at Makronissos Beach': {
    image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80&fit=crop',
    cost: '~€30–60 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Makronissos+Beach+Ayia+Napa+Cyprus',
  },

  'Beach Club Lunch': {
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&fit=crop',
    cost: '~€12–20 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=beach+bar+Makronissos+Ayia+Napa',
  },

  'Sunset Drinks at Rock Cafe': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop',
    cost: '~€10–20 on drinks',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Rock+Cafe+Ayia+Napa+Cyprus',
    info_url: 'https://www.instagram.com/rockcafeayanapa/',
    info_label: 'Instagram',
  },

  'Kool Pool Party or Club Camelot': {
    image: 'https://images.unsplash.com/photo-1543007630-9359815b79b4?w=800&q=80&fit=crop',
    cost: '~€20–40 entry + drinks',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Club+Camelot+Ayia+Napa+Cyprus',
    info_url: 'https://www.instagram.com/koolpoolpartycy/',
    info_label: 'Kool Pool Party Instagram',
  },

  // ── Day 3 · Protaras ─────────────────────────────────────────────────────

  'Fig Tree Bay, Protaras': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&fit=crop',
    cost: 'Free · Sunbeds ~€10–15 each',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Fig+Tree+Bay+Protaras+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/sun-beach/beaches/item/335-fig-tree-bay',
    info_label: 'Visit Cyprus Guide',
  },

  'Snorkeling & Paddleboarding': {
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&fit=crop',
    cost: '~€15–30 equipment rental',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Fig+Tree+Bay+Protaras+Cyprus',
  },

  'Meze Lunch at a Protaras Taverna': {
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&fit=crop',
    cost: '~€15–25 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=taverna+meze+Protaras+Cyprus',
  },

  'Seafood Dinner at Pernera': {
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&fit=crop',
    cost: '~€20–30 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=seafood+restaurant+Pernera+Protaras+Cyprus',
  },

  'Protaras Bar Strip': {
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80&fit=crop',
    cost: '~€30–50 on drinks',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=bar+strip+Fig+Tree+Bay+Road+Protaras',
  },

  // ── Day 4 · Limassol ─────────────────────────────────────────────────────

  'Drive to Limassol': {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&fit=crop',
    cost: '~€8 pp (bus) · ~€30/day car (split)',
    maps_url: 'https://www.google.com/maps/dir/Ayia+Napa/Limassol+Cyprus',
    info_url: 'https://www.intercity-buses.com/',
    info_label: 'Bus Timetable',
  },

  'Limassol Old Town & Medieval Castle': {
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&fit=crop',
    cost: '€4.50 castle entry · Old town free',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Limassol+Medieval+Castle+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/rural/archaeological-sites-monuments/item/257-limassol-medieval-castle',
    info_label: 'Visit Cyprus Guide',
  },

  'Limassol Marina': {
    image: 'https://images.unsplash.com/photo-1512551744-b8be95cb4d2b?w=800&q=80&fit=crop',
    cost: 'Free to walk · Coffee ~€4–6',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Limassol+Marina+Cyprus',
    info_url: 'https://limassolmarina.com/',
    info_label: 'Marina Website',
  },

  'Traditional Meze at Ladas Tavern': {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&fit=crop',
    cost: '~€15–20 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Ladas+Tavern+Limassol+Cyprus',
    info_url: 'https://www.tripadvisor.com/Search?q=Ladas+Tavern+Limassol',
    info_label: 'TripAdvisor',
  },

  'Drinks at Saripolou Square': {
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&fit=crop',
    cost: '~€10–20 on drinks',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Saripolou+Square+Limassol+Cyprus',
  },

  'Return to Ayia Napa': {
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&fit=crop',
    cost: '~€8 pp (bus) · ~€60–80 taxi',
    maps_url: 'https://www.google.com/maps/dir/Limassol+Cyprus/Ayia+Napa',
  },

  // ── Day 5 · Paphos ───────────────────────────────────────────────────────

  'Drive to Paphos': {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&fit=crop',
    cost: '~€30/day car rental (split)',
    maps_url: 'https://www.google.com/maps/dir/Ayia+Napa/Paphos+Cyprus',
  },

  'Paphos Archaeological Park': {
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80&fit=crop',
    cost: '€6.50 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Paphos+Archaeological+Park+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/rural/archaeological-sites-monuments/item/263-paphos-archaeological-park',
    info_label: 'Visit Cyprus Guide',
  },

  "Aphrodite's Rock (Petra tou Romiou)": {
    image: 'https://images.unsplash.com/photo-1570077188-bd1196eabb52?w=800&q=80&fit=crop',
    cost: 'Free',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Petra+tou+Romiou+Aphrodite+Rock+Cyprus',
    info_url: 'https://www.visitcyprus.com/index.php/en/discovercyprus/rural/archaeological-sites-monuments/item/258-petra-tou-romiou-aphrodite-s-rock',
    info_label: 'Visit Cyprus Guide',
  },

  'Lunch at Paphos Harbour': {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop',
    cost: '~€15–25 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Paphos+Old+Harbour+Cyprus',
  },

  "Dinner at Theo's Seafood Restaurant": {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop',
    cost: '~€25–35 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Theo%27s+Seafood+Restaurant+Paphos+Cyprus',
    info_url: 'https://www.tripadvisor.com/Search?q=Theo+Seafood+Restaurant+Paphos',
    info_label: 'TripAdvisor',
  },

  'Paphos Bar Street': {
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80&fit=crop',
    cost: '~€30–50 on drinks',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Apostolou+Pavlou+Avenue+Paphos+Cyprus',
  },

  // ── Day 6 · Last Day ─────────────────────────────────────────────────────

  'Final Sunrise Beach Session': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop',
    cost: 'Free',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Nissi+Beach+Ayia+Napa+Cyprus',
  },

  'Final Cyprus Breakfast': {
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88dc5?w=800&q=80&fit=crop',
    cost: '~€8–14 per person',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=breakfast+Ayia+Napa+Cyprus',
  },

  'Souvenir Shopping': {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80&fit=crop',
    cost: '~€20–50 budget',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=souvenir+shops+Ayia+Napa+Cyprus',
  },

  'Transfer to Larnaca Airport': {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&fit=crop',
    cost: '€3 pp (bus) · €50 shared taxi',
    maps_url: 'https://www.google.com/maps/dir/Ayia+Napa/Larnaca+International+Airport',
    info_url: 'https://www.hermesairports.com/',
    info_label: 'Airport Website',
  },

  'Fly Home': {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&fit=crop',
    cost: 'Airline ticket (pre-booked)',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=Larnaca+International+Airport+Cyprus',
    info_url: 'https://www.hermesairports.com/',
    info_label: 'Airport Website',
  },
}
