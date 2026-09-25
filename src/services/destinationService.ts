import { Destination, District, FoodPlace, Accommodation } from '../types';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_FOOD_PLACES } from '../data/foodPlaces';
import { KARNATAKA_ACCOMMODATIONS } from '../data/accommodations';
import { apiClient } from './apiClient';

export interface DestinationFilterParams {
  search?: string;
  district?: string;
  category?: string;
  hidden?: boolean;
}

export interface DestinationDetailResponse {
  destination: Destination;
  district: District | null;
  foodPlaces: FoodPlace[];
  accommodations: Accommodation[];
}

export const destinationService = {
  // Synchronous fallback
  getAllDestinationsSync(): Destination[] {
    return KARNATAKA_DESTINATIONS;
  },

  // Async fetch from API with filtering
  async getDestinations(params: DestinationFilterParams = {}): Promise<Destination[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.district && params.district !== 'all') searchParams.append('district', params.district);
      if (params.category && params.category !== 'all') searchParams.append('category', params.category);
      if (params.hidden) searchParams.append('hidden', 'true');

      const url = `/api/destinations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await apiClient.get<{ success: boolean; destinations: Destination[] }>(url);

      if (res.success && res.destinations) {
        return res.destinations;
      }
    } catch (err: any) {
      console.warn('Failed to fetch destinations from API, using static filtering:', err.message);
    }

    // Static fallback filtering
    let list = [...KARNATAKA_DESTINATIONS];
    if (params.district && params.district !== 'all') {
      list = list.filter(d => d.districtId === params.district);
    }
    if (params.hidden) {
      list = list.filter(d => d.isHiddenGem);
    }
    if (params.category && params.category !== 'all') {
      list = list.filter(d => d.categories.some(c => c.toLowerCase() === params.category?.toLowerCase()));
    }
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        d.districtName.toLowerCase().includes(q) ||
        d.categories.some(c => c.toLowerCase().includes(q))
      );
    }
    return list;
  },

  // Fetch destination detail by slug
  async getDestinationBySlug(slug: string): Promise<DestinationDetailResponse | null> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        destination: Destination;
        district: District;
        foodPlaces: FoodPlace[];
        accommodations: Accommodation[];
      }>(`/api/destinations/${slug}`);

      if (res.success && res.destination) {
        return {
          destination: res.destination,
          district: res.district || null,
          foodPlaces: res.foodPlaces || [],
          accommodations: res.accommodations || [],
        };
      }
    } catch (err: any) {
      console.warn(`Failed to fetch destination ${slug} from API, using static data:`, err.message);
    }

    const destination = KARNATAKA_DESTINATIONS.find(d => d.slug === slug);
    if (!destination) return null;

    const district = KARNATAKA_DISTRICTS.find(d => d.id === destination.districtId) || null;
    const foodPlaces = KARNATAKA_FOOD_PLACES.filter(f => f.districtId === destination.districtId);
    const accommodations = KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === destination.districtId);

    return {
      destination,
      district,
      foodPlaces,
      accommodations,
    };
  },
};
