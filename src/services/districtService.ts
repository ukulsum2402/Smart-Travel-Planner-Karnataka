import { District, Destination, FoodPlace, Accommodation } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_FOOD_PLACES } from '../data/foodPlaces';
import { KARNATAKA_ACCOMMODATIONS } from '../data/accommodations';
import { apiClient } from './apiClient';

export interface DistrictDetailResponse {
  district: District;
  destinations: Destination[];
  foodPlaces: FoodPlace[];
  accommodations: Accommodation[];
}

export const districtService = {
  // Synchronous fallback getter
  getAllDistrictsSync(): District[] {
    return KARNATAKA_DISTRICTS;
  },

  // Async fetch from backend API
  async getAllDistricts(): Promise<District[]> {
    try {
      const res = await apiClient.get<{ success: boolean; districts: District[] }>('/api/districts');
      if (res.success && res.districts && res.districts.length > 0) {
        return res.districts;
      }
    } catch (err: any) {
      console.warn('Failed to fetch districts from API, using static data:', err.message);
    }
    return KARNATAKA_DISTRICTS;
  },

  // Fetch district details by slug
  async getDistrictBySlug(slug: string): Promise<DistrictDetailResponse | null> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        district: District;
        destinations: Destination[];
        foodPlaces: FoodPlace[];
        accommodations: Accommodation[];
      }>(`/api/districts/${slug}`);

      if (res.success && res.district) {
        return {
          district: res.district,
          destinations: res.destinations || [],
          foodPlaces: res.foodPlaces || [],
          accommodations: res.accommodations || [],
        };
      }
    } catch (err: any) {
      console.warn(`Failed to fetch district ${slug} from API, using static data:`, err.message);
    }

    const district = KARNATAKA_DISTRICTS.find(d => d.slug === slug);
    if (!district) return null;

    return {
      district,
      destinations: KARNATAKA_DESTINATIONS.filter(d => d.districtId === district.id),
      foodPlaces: KARNATAKA_FOOD_PLACES.filter(f => f.districtId === district.id),
      accommodations: KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === district.id),
    };
  },
};
