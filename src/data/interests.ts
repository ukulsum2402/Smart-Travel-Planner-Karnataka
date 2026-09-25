export interface InterestOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
}

export const KARNATAKA_INTERESTS: InterestOption[] = [
  { id: 'Nature', name: 'Nature', description: 'Coffee estates, green valleys, forests & waterfalls', icon: 'Trees', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Trekking', name: 'Trekking', description: 'Peak climbs, ridge walks & mountain trails', icon: 'Footprints', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Adventure', name: 'Adventure', description: 'River rafting, 4x4 safaris, kayaking & water sports', icon: 'Compass', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Beaches', name: 'Beaches', description: 'Sun-kissed sands, rocky coves, lighthouses & surf', icon: 'Waves', badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'History', name: 'History', description: 'Ancient empires, battlefield forts & monuments', icon: 'Landmark', badgeColor: 'bg-stone-100 text-stone-700 border-stone-300' },
  { id: 'Heritage', name: 'Heritage', description: 'UNESCO World Heritage temples & Hoysala architecture', icon: 'Castle', badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { id: 'Culture', name: 'Culture', description: 'Folk arts, rural artisans & royal traditions', icon: 'Palette', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Spiritual', name: 'Spiritual', description: 'Sacred river origins, ancient mathas & hill shrines', icon: 'Sparkles', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'Food', name: 'Food', description: 'Kodava curries, Mysore pak, coastal ghee roast & filter coffee', icon: 'Utensils', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'Wildlife', name: 'Wildlife', description: 'Elephant reserves, hornbill sanctuaries & shola fauna', icon: 'Bird', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'Photography', name: 'Photography', description: 'Golden hour sunsets, boulder fields & architectural details', icon: 'Camera', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Relaxation', name: 'Relaxation', description: 'Slow travel, cafe terraces & soothing nature retreats', icon: 'Coffee', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { id: 'Waterfalls', name: 'Waterfalls', description: 'Roaring monsoonal cascades & forest streams', icon: 'CloudRain', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Viewpoints', name: 'Viewpoints', description: 'High-altitude panoramic cliffs & cloud beds', icon: 'Mountain', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
];

export const STARTING_LOCATIONS = [
  'Mangaluru',
  'Bengaluru',
  'Mysuru',
  'Hubballi',
  'Belagavi',
  'Shivamogga',
  'Ballari',
  'Hassan',
  'Tumakuru',
  'Udupi',
  'Madikeri',
  'Chikkamagaluru',
  'Goa',
  'Kozhikode',
];
