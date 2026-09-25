import { Trip, PlannerState } from '../types';
import { SAMPLE_TRIPS } from '../data/sampleTrips';
import { generateDynamicItinerary } from './itineraryGenerator';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'karnataka_travel_trips_v1';

export const tripService = {
  // Get all trips (stored + sample) synchronously from local cache
  getAllTrips(): Trip[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Trip[] = JSON.parse(stored);
        const existingIds = new Set(parsed.map(t => t.id));
        const combined = [...parsed];
        SAMPLE_TRIPS.forEach(sample => {
          if (!existingIds.has(sample.id)) {
            combined.push(sample);
          }
        });
        return combined;
      }
    } catch (e) {
      console.warn('Failed to parse stored trips from localStorage', e);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TRIPS));
    } catch {}
    return SAMPLE_TRIPS;
  },

  // Async fetch from backend API /api/trips with fallback
  async fetchTrips(): Promise<Trip[]> {
    try {
      const res = await apiClient.get<{ success: boolean; trips: Trip[] }>('/api/trips');
      if (res.success && res.trips && res.trips.length > 0) {
        // Merge with local storage
        const current = this.getAllTrips();
        const apiIds = new Set(res.trips.map(t => t.id));
        const combined = [...res.trips, ...current.filter(t => !apiIds.has(t.id))];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        } catch {}
        return combined;
      }
    } catch (err: any) {
      console.warn('Failed to fetch trips from /api/trips:', err.message);
    }
    return this.getAllTrips();
  },

  // Get trip by ID synchronously
  getTripById(id: string): Trip | null {
    const all = this.getAllTrips();
    return all.find(t => t.id === id) || null;
  },

  // Async fetch trip by ID from backend /api/trips/:id
  async fetchTripById(id: string): Promise<Trip | null> {
    try {
      const res = await apiClient.get<{ success: boolean; trip: Trip }>(`/api/trips/${id}`);
      if (res.success && res.trip) {
        this.saveTrip(res.trip, false); // save to cache without redundant remote call
        return res.trip;
      }
    } catch (err: any) {
      console.warn(`Failed to fetch trip ${id} from API:`, err.message);
    }
    return this.getTripById(id);
  },

  // Generate dynamic trip: calls backend API and falls back to client generator
  async generateTripAsync(plan: PlannerState): Promise<Trip> {
    try {
      const res = await apiClient.post<{ success: boolean; trip: Trip }>('/api/trips/generate', plan);
      if (res.success && res.trip) {
        this.saveTrip(res.trip, false);
        return res.trip;
      }
    } catch (err: any) {
      console.warn('Backend trip generation failed, falling back to local engine:', err.message);
    }

    const trip = generateDynamicItinerary(plan);
    this.saveTrip(trip);
    return trip;
  },

  // Synchronous generateTrip compatible with existing callers
  generateTrip(plan: PlannerState): Trip {
    const trip = generateDynamicItinerary(plan);
    this.saveTrip(trip);

    // Asynchronously sync to backend API in background
    apiClient.post('/api/trips/generate', plan).catch(err => {
      console.warn('Async background trip sync failed:', err.message);
    });

    return trip;
  },

  // Save a trip to cache and remote database
  saveTrip(trip: Trip, syncRemote = true): Trip {
    const trips = this.getAllTrips();
    const index = trips.findIndex(t => t.id === trip.id);
    const updatedTrip = { ...trip, isCustomSaved: true };

    let updatedTrips: Trip[];
    if (index >= 0) {
      updatedTrips = [...trips];
      updatedTrips[index] = updatedTrip;
    } else {
      updatedTrips = [updatedTrip, ...trips];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (e) {
      console.error('Error saving trip to localStorage', e);
    }

    if (syncRemote) {
      apiClient.post('/api/trips', updatedTrip).catch(err => {
        console.warn('Remote trip save sync failed:', err.message);
      });
    }

    return updatedTrip;
  },

  // Delete trip
  deleteTrip(id: string): boolean {
    const trips = this.getAllTrips();
    const filtered = trips.filter(t => t.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      apiClient.delete(`/api/trips/${id}`).catch(err => {
        console.warn('Remote trip delete failed:', err.message);
      });
      return true;
    } catch (e) {
      console.error('Error deleting trip', e);
      return false;
    }
  },

  // Toggle favorite/save state
  toggleSaveTrip(id: string): Trip | null {
    const trip = this.getTripById(id);
    if (!trip) return null;
    const updated = { ...trip, isCustomSaved: !trip.isCustomSaved };

    apiClient.put(`/api/trips/${id}`, { isCustomSaved: updated.isCustomSaved }).catch(err => {
      console.warn('Remote toggle save failed:', err.message);
    });

    return this.saveTrip(updated, false);
  },
};
