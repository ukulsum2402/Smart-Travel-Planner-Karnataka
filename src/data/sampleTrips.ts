import { Trip } from '../types';
import { generateDynamicItinerary } from '../services/itineraryGenerator';

export const SAMPLE_TRIPS: Trip[] = [
  {
    ...generateDynamicItinerary({
      startingPoint: 'Mangaluru',
      selectedDistricts: ['kodagu', 'chikkamagaluru'],
      durationDays: 4,
      interests: ['Nature', 'Trekking', 'Food'],
      transport: 'Car',
      budgetTier: 'Moderate',
      travelersCount: 2,
      endPoint: 'Return to starting point',
    }),
    id: 'trip-sample-coorg-chik',
    title: 'Mangaluru → Kodagu → Chikkamagaluru → Mangaluru',
    isCustomSaved: true,
  },
  {
    ...generateDynamicItinerary({
      startingPoint: 'Bengaluru',
      selectedDistricts: ['mysuru'],
      durationDays: 2,
      interests: ['History', 'Heritage'],
      transport: 'Bus',
      budgetTier: 'Budget',
      travelersCount: 3,
      endPoint: 'Return to starting point',
    }),
    id: 'trip-sample-mysuru-heritage',
    title: 'Bengaluru → Mysuru → Bengaluru',
    isCustomSaved: true,
  },
  {
    ...generateDynamicItinerary({
      startingPoint: 'Bengaluru',
      selectedDistricts: ['vijayanagara'],
      durationDays: 3,
      interests: ['History', 'Heritage', 'Photography', 'Culture'],
      transport: 'Train',
      budgetTier: 'Moderate',
      travelersCount: 2,
      endPoint: 'Return to starting point',
    }),
    id: 'trip-sample-hampi-expedition',
    title: 'Bengaluru → Vijayanagara (Hampi) → Bengaluru',
    isCustomSaved: false,
  },
  {
    ...generateDynamicItinerary({
      startingPoint: 'Mangaluru',
      selectedDistricts: ['udupi', 'uttara-kannada'],
      durationDays: 3,
      interests: ['Beaches', 'Adventure', 'Food', 'Spiritual'],
      transport: 'Car',
      budgetTier: 'Moderate',
      travelersCount: 4,
      endPoint: 'Return to starting point',
    }),
    id: 'trip-sample-coastal-trail',
    title: 'Mangaluru → Udupi → Gokarna Coastal Escape',
    isCustomSaved: false,
  },
];
