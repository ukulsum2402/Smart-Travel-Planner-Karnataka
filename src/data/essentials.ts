export interface EssentialItem {
  id: string;
  category: 'Clothing' | 'Footwear' | 'Electronics' | 'Health' | 'Documents' | 'Gear';
  item: string;
  importance: 'Essential' | 'Recommended' | 'Optional';
  note: string;
  relevantDistricts?: string[];
  relevantInterests?: string[];
}

export const KARNATAKA_ESSENTIALS: EssentialItem[] = [
  {
    id: 'ess-1',
    category: 'Footwear',
    item: 'Sturdy trekking shoes with good grip',
    importance: 'Essential',
    note: 'Critical for steep trails in Mullayanagiri, Z Point, and wet rocks at waterfalls.',
    relevantInterests: ['Trekking', 'Nature', 'Waterfalls', 'Adventure'],
  },
  {
    id: 'ess-2',
    category: 'Clothing',
    item: 'Light fleece / Windcheater jacket',
    importance: 'Essential',
    note: 'Early morning temperatures in Madikeri and Chikkamagaluru can drop to 14°C.',
    relevantDistricts: ['kodagu', 'chikkamagaluru', 'shivamogga'],
  },
  {
    id: 'ess-3',
    category: 'Clothing',
    item: 'Breathable cotton & linen clothes',
    importance: 'Essential',
    note: 'Ideal for coastal heat in Gokarna, Udupi, and sunny stone ruins in Hampi.',
    relevantDistricts: ['uttara-kannada', 'udupi', 'dakshina-kannada', 'vijayanagara', 'bagalkote'],
  },
  {
    id: 'ess-4',
    category: 'Gear',
    item: 'Leech socks / Salt pouch (Monsoon)',
    importance: 'Recommended',
    note: 'Western Ghats rainforests in Agumbe and Kodagu have active leeches June through October.',
    relevantDistricts: ['kodagu', 'chikkamagaluru', 'shivamogga'],
  },
  {
    id: 'ess-5',
    category: 'Electronics',
    item: 'High-capacity power bank (20,000 mAh)',
    importance: 'Essential',
    note: 'Remote viewpoints and hillside network searches drain battery quickly.',
  },
  {
    id: 'ess-6',
    category: 'Health',
    item: 'Motion sickness tablets (Avomine / Ondansetron)',
    importance: 'Recommended',
    note: 'Frequent hairpin curves on Charmadi, Shiradi, and Madikeri Ghat roads.',
    relevantDistricts: ['kodagu', 'chikkamagaluru', 'shivamogga', 'dakshina-kannada'],
  },
  {
    id: 'ess-7',
    category: 'Documents',
    item: 'Original Government Photo ID (Aadhaar / Passport)',
    importance: 'Essential',
    note: 'Required for forest permits (Kudremukha), ASI monuments, and hotel check-ins.',
  },
  {
    id: 'ess-8',
    category: 'Gear',
    item: 'Quick-dry microfiber towel & waterproof dry bag',
    importance: 'Recommended',
    note: 'Essential for waterfalls, coracle rides, and coastal beach dips.',
    relevantInterests: ['Waterfalls', 'Beaches', 'Adventure'],
  },
  {
    id: 'ess-9',
    category: 'Health',
    item: 'Sun protection (SPF 50+ sunscreen, wide-brim hat, UV sunglasses)',
    importance: 'Essential',
    note: 'Intense midday sun on unshaded stone monuments in Hampi and open beaches.',
  },
  {
    id: 'ess-10',
    category: 'Clothing',
    item: 'Modest temple attire (shoulders and knees covered)',
    importance: 'Essential',
    note: 'Mandatory dress code at Udupi Sri Krishna Matha, Chamundeshwari, and Murudeshwara.',
    relevantInterests: ['Spiritual', 'Heritage'],
  },
];
