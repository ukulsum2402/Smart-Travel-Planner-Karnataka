export type TravelStyle =
  | 'Budget'
  | 'Moderate'
  | 'Luxury'
  | 'Backpacker'
  | 'Backpacking'
  | 'Relaxed'
  | 'Adventure'
  | 'Fast-Paced'
  | 'Cultural'
  | 'Family'
  | 'Romantic'
  | 'Solo'
  | 'Group'
  | 'Wellness'
  | 'Photography';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  travelStyle: TravelStyle;
  interests: string[];
  preferredSeasons: string[];
  budgetPreference: 'Budget' | 'Moderate' | 'Premium';
}

export interface ImageMetadata {
  imageUrl: string;
  sourceUrl: string;
  photographer: string;
  license: string;
  attribution: string;
  placeId: string;
}

export interface District {
  id: string;
  slug: string;
  name: string;
  kannadaName?: string;
  zone: 'Malnad' | 'Coastal' | 'North Karnataka' | 'South Karnataka';
  tagline: string;
  description: string;
  heroImage: ImageMetadata;
  bestTimeToVisit: string;
  idealDays: string;
  weatherSummary: string;
  latitude: number;
  longitude: number;
  popularExperiences: string[];
  destinationsCount: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  districtId: string;
  districtName: string;
  shortDescription: string;
  fullDescription: string;
  whyVisit: string[];
  categories: string[];
  activities: string[];
  bestMonths: string[];
  visitDuration: string;
  entryFee?: string;
  timings?: string;
  rating?: number;
  isHiddenGem?: boolean;
  isFeatured?: boolean;
  latitude: number;
  longitude: number;
  image: ImageMetadata;
  gallery?: ImageMetadata[];
  accessibilityNotes?: string;
}

export interface FoodPlace {
  id: string;
  name: string;
  districtId: string;
  specialty: string;
  cuisine: string;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  description: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  recommendedDish: string;
}

export interface Accommodation {
  id: string;
  name: string;
  districtId: string;
  locationArea: string;
  tier: 'Budget' | 'Moderate' | 'Premium';
  approxPricePerNight: number;
  rating: number;
  description: string;
  amenities: string[];
  image: string;
}

export type TransportMode =
  | 'Car'
  | 'Bike'
  | 'Bus'
  | 'Train'
  | 'Public Transport'
  | 'Let Planner Decide';

export type BudgetTier = 'Budget' | 'Moderate' | 'Premium';

export interface RouteWaypoint {
  name: string;
  district?: string;
  latitude: number;
  longitude: number;
  day: number;
  type: 'start' | 'stop' | 'end';
}

export interface ItineraryItem {
  id: string;
  time: string;
  type: 'departure' | 'travel' | 'breakfast' | 'place' | 'lunch' | 'activity' | 'viewpoint' | 'dinner' | 'stay' | 'return';
  title: string;
  subtitle?: string;
  description: string;
  locationName: string;
  districtName: string;
  latitude?: number;
  longitude?: number;
  recommendedDuration?: string;
  category?: string;
  estimatedCost?: number;
  image?: ImageMetadata;
  travelInfo?: {
    from: string;
    to: string;
    distanceKm: number;
    durationMinutes: number;
    mode: TransportMode;
  };
  accommodation?: Accommodation;
  foodDetails?: {
    cuisine: string;
    mustTry: string;
  };
}

export interface TripDay {
  dayNumber: number;
  title: string;
  districtId: string;
  districtName: string;
  theme: string;
  summary: string;
  items: ItineraryItem[];
}

export interface BudgetEstimate {
  transportCost: number;
  accommodationCost: number;
  foodCost: number;
  activitiesCost: number;
  miscellaneousCost: number;
  totalCost: number;
  perPersonCost: number;
  currency: string;
}

export interface Trip {
  id: string;
  title: string;
  startingPoint: string;
  selectedDistricts: string[]; // district IDs
  selectedDistrictNames: string[];
  durationDays: number;
  interests: string[];
  transport: TransportMode;
  budgetTier: BudgetTier;
  travelersCount: number;
  endPoint: string;
  routeSummary: string;
  createdAt: string;
  days: TripDay[];
  budgetEstimate: BudgetEstimate;
  waypoints: RouteWaypoint[];
  essentialsToCarry: string[];
  seasonalTips: string[];
  coverImage: ImageMetadata;
  isCustomSaved?: boolean;
}

export interface PlannerState {
  startingPoint: string;
  selectedDistricts: string[]; // district IDs
  durationDays: number;
  interests: string[];
  transport: TransportMode;
  budgetTier: BudgetTier;
  travelersCount: number;
  endPoint: string;
}
