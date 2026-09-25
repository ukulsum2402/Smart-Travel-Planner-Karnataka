import {
  PlannerState,
  Trip,
  TripDay,
  ItineraryItem,
  RouteWaypoint,
  BudgetEstimate,
  Destination,
  TransportMode,
  BudgetTier,
  Accommodation,
} from '../types';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_FOOD_PLACES } from '../data/foodPlaces';
import { KARNATAKA_ACCOMMODATIONS } from '../data/accommodations';
import { KARNATAKA_ESSENTIALS } from '../data/essentials';
import { KARNATAKA_SEASONAL_INFO } from '../data/seasons';

// Starting location coordinates lookup
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Mangaluru: { lat: 12.9141, lng: 74.8560 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Hubballi: { lat: 15.3647, lng: 75.1240 },
  Belagavi: { lat: 15.8497, lng: 74.4977 },
  Shivamogga: { lat: 13.9299, lng: 75.5681 },
  Ballari: { lat: 15.1394, lng: 76.9214 },
  Hassan: { lat: 13.0033, lng: 76.1004 },
  Tumakuru: { lat: 13.3409, lng: 77.1010 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Madikeri: { lat: 12.4244, lng: 75.7382 },
  Chikkamagaluru: { lat: 13.3161, lng: 75.7720 },
  Goa: { lat: 15.2993, lng: 74.1240 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
};

export function getCityCoordinates(name: string): { lat: number; lng: number } {
  if (CITY_COORDINATES[name]) return CITY_COORDINATES[name];
  // Fallback to central Karnataka
  return { lat: 13.5, lng: 75.8 };
}

export function generateDynamicItinerary(plan: PlannerState): Trip {
  const {
    startingPoint,
    selectedDistricts,
    durationDays,
    interests,
    transport,
    budgetTier,
    travelersCount,
    endPoint,
  } = plan;

  // Resolve district details
  const districts = selectedDistricts
    .map(id => KARNATAKA_DISTRICTS.find(d => d.id === id))
    .filter(Boolean);

  const districtNames = districts.map(d => d!.name);

  // 1. STRICT DISTRICT FILTER: Select ONLY destinations belonging to selected districts
  const eligibleDestinations = KARNATAKA_DESTINATIONS.filter(dest =>
    selectedDistricts.includes(dest.districtId)
  );

  // 2. INTEREST-BASED SCORING
  // Score each destination based on user's selected interests
  const scoredDestinations = eligibleDestinations.map(dest => {
    let score = 0;
    interests.forEach(interest => {
      // Check categories
      if (dest.categories.some(c => c.toLowerCase() === interest.toLowerCase())) {
        score += 3;
      }
      // Check activities
      if (dest.activities.some(a => a.toLowerCase().includes(interest.toLowerCase()))) {
        score += 2;
      }
      // Check descriptions
      if (
        dest.shortDescription.toLowerCase().includes(interest.toLowerCase()) ||
        dest.fullDescription.toLowerCase().includes(interest.toLowerCase())
      ) {
        score += 1;
      }
    });

    if (dest.isFeatured) score += 1.5;
    if (dest.isHiddenGem && interests.some(i => ['Adventure', 'Nature', 'Trekking'].includes(i))) {
      score += 1.5;
    }

    return { destination: dest, score };
  });

  // Group scored destinations by district
  const destinationsByDistrict: Record<string, Destination[]> = {};
  selectedDistricts.forEach(dId => {
    const list = scoredDestinations
      .filter(item => item.destination.districtId === dId)
      .sort((a, b) => b.score - a.score)
      .map(item => item.destination);
    destinationsByDistrict[dId] = list;
  });

  // 3. DAY ALLOCATION ACROSS DISTRICTS
  // Distribute requested days (1..N) across the selected districts
  const dayDistrictAssignment: string[] = [];
  const numDistricts = selectedDistricts.length;
  for (let i = 0; i < durationDays; i++) {
    // Distribute days round-robin or clustered
    const districtIndex = Math.min(
      Math.floor((i / durationDays) * numDistricts),
      numDistricts - 1
    );
    dayDistrictAssignment.push(selectedDistricts[districtIndex]);
  }

  // 4. GENERATE DAY-BY-DAY TIMELINE
  const days: TripDay[] = [];
  const waypoints: RouteWaypoint[] = [];

  // Starting waypoint
  const startCoords = getCityCoordinates(startingPoint);
  waypoints.push({
    name: startingPoint,
    latitude: startCoords.lat,
    longitude: startCoords.lng,
    day: 1,
    type: 'start',
  });

  // Keep track of visited destinations so we don't repeat unnecessarily
  const visitedDestIds = new Set<string>();

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const currentDistrictId = dayDistrictAssignment[dayNum - 1];
    const currentDistrict =
      KARNATAKA_DISTRICTS.find(d => d.id === currentDistrictId) || KARNATAKA_DISTRICTS[0];

    // Pick top destinations for this day in this district
    const districtPool = destinationsByDistrict[currentDistrictId] || [];
    const available = districtPool.filter(d => !visitedDestIds.has(d.id));
    const dayDestinations = (available.length >= 2 ? available : districtPool).slice(0, 2);
    dayDestinations.forEach(d => visitedDestIds.add(d.id));

    // Get regional food and accommodation
    const foodList = KARNATAKA_FOOD_PLACES.filter(f => f.districtId === currentDistrictId);
    const bfastFood = foodList.find(f => f.mealType === 'Breakfast') || foodList[0];
    const lunchFood = foodList.find(f => f.mealType === 'Lunch') || foodList[0];
    const dinnerFood = foodList.find(f => f.mealType === 'Dinner') || foodList[foodList.length - 1];

    const accomList = KARNATAKA_ACCOMMODATIONS.filter(
      a => a.districtId === currentDistrictId && a.tier === budgetTier
    );
    const selectedStay: Accommodation =
      accomList[0] ||
      KARNATAKA_ACCOMMODATIONS.find(a => a.districtId === currentDistrictId) ||
      KARNATAKA_ACCOMMODATIONS[0];

    const items: ItineraryItem[] = [];
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === durationDays;

    // First Day Departure from Starting Point
    if (isFirstDay) {
      items.push({
        id: `item-${dayNum}-dep`,
        time: '07:00 AM',
        type: 'departure',
        title: `Departure from ${startingPoint}`,
        subtitle: `Journey starts via ${transport}`,
        description: `Begin your Karnataka expedition from ${startingPoint} towards the scenic lands of ${currentDistrict.name}.`,
        locationName: startingPoint,
        districtName: startingPoint,
        latitude: startCoords.lat,
        longitude: startCoords.lng,
        travelInfo: {
          from: startingPoint,
          to: currentDistrict.name,
          distanceKm: estimateDistance(startingPoint, currentDistrict.name),
          durationMinutes: estimateTravelMinutes(
            startingPoint,
            currentDistrict.name,
            transport
          ),
          mode: transport,
        },
      });
    }

    // Breakfast
    items.push({
      id: `item-${dayNum}-bfast`,
      time: isFirstDay ? '09:30 AM' : '07:30 AM',
      type: 'breakfast',
      title: bfastFood ? bfastFood.name : `${currentDistrict.name} Morning Breakfast`,
      subtitle: bfastFood ? bfastFood.specialty : 'Local Karnataka Flavors',
      description: bfastFood
        ? `${bfastFood.description} Recommended: ${bfastFood.recommendedDish}`
        : `Enjoy authentic hot dosas, idlis, and fresh South Indian filter coffee.`,
      locationName: currentDistrict.name,
      districtName: currentDistrict.name,
      estimatedCost: budgetTier === 'Budget' ? 80 : budgetTier === 'Moderate' ? 180 : 350,
      foodDetails: bfastFood
        ? { cuisine: bfastFood.cuisine, mustTry: bfastFood.recommendedDish }
        : undefined,
    });

    // Morning Destination (Place 1)
    const morningPlace = dayDestinations[0];
    if (morningPlace) {
      items.push({
        id: `item-${dayNum}-place1`,
        time: '11:00 AM',
        type: 'place',
        title: morningPlace.name,
        subtitle: morningPlace.categories.join(' • '),
        description: morningPlace.shortDescription,
        locationName: morningPlace.name,
        districtName: currentDistrict.name,
        latitude: morningPlace.latitude,
        longitude: morningPlace.longitude,
        recommendedDuration: morningPlace.visitDuration,
        category: morningPlace.categories[0],
        estimatedCost: morningPlace.entryFee ? 50 : 0,
        image: morningPlace.image,
      });

      waypoints.push({
        name: morningPlace.name,
        district: currentDistrict.name,
        latitude: morningPlace.latitude,
        longitude: morningPlace.longitude,
        day: dayNum,
        type: 'stop',
      });
    }

    // Lunch
    items.push({
      id: `item-${dayNum}-lunch`,
      time: '01:00 PM',
      type: 'lunch',
      title: lunchFood ? lunchFood.name : `Authentic ${currentDistrict.name} Lunch`,
      subtitle: lunchFood ? lunchFood.specialty : 'Regional Specialties',
      description: lunchFood
        ? `${lunchFood.description} Must try: ${lunchFood.recommendedDish}.`
        : `Delight in traditional plantain-leaf Karnataka meals and refreshing beverages.`,
      locationName: currentDistrict.name,
      districtName: currentDistrict.name,
      estimatedCost: budgetTier === 'Budget' ? 140 : budgetTier === 'Moderate' ? 320 : 750,
      foodDetails: lunchFood
        ? { cuisine: lunchFood.cuisine, mustTry: lunchFood.recommendedDish }
        : undefined,
    });

    // Afternoon Destination / Activity (Place 2)
    const afternoonPlace = dayDestinations[1] || dayDestinations[0];
    if (afternoonPlace && afternoonPlace !== morningPlace) {
      items.push({
        id: `item-${dayNum}-place2`,
        time: '03:00 PM',
        type: afternoonPlace.categories.includes('Trekking') ? 'activity' : 'place',
        title: afternoonPlace.name,
        subtitle: afternoonPlace.categories.join(' • '),
        description: afternoonPlace.shortDescription,
        locationName: afternoonPlace.name,
        districtName: currentDistrict.name,
        latitude: afternoonPlace.latitude,
        longitude: afternoonPlace.longitude,
        recommendedDuration: afternoonPlace.visitDuration,
        category: afternoonPlace.categories[0],
        estimatedCost: afternoonPlace.entryFee ? 50 : 0,
        image: afternoonPlace.image,
      });

      waypoints.push({
        name: afternoonPlace.name,
        district: currentDistrict.name,
        latitude: afternoonPlace.latitude,
        longitude: afternoonPlace.longitude,
        day: dayNum,
        type: 'stop',
      });
    } else {
      // Afternoon exploration
      items.push({
        id: `item-${dayNum}-explore`,
        time: '03:15 PM',
        type: 'activity',
        title: `${currentDistrict.name} Heritage & Spice Trail`,
        subtitle: 'Local Sightseeing & Culture',
        description: `Explore local plantation paths, artisanal shops, and capture scenic views of ${currentDistrict.name}.`,
        locationName: currentDistrict.name,
        districtName: currentDistrict.name,
        recommendedDuration: '1.5 Hours',
        category: 'Culture',
      });
    }

    // Evening Viewpoint / Sunset
    items.push({
      id: `item-${dayNum}-evening`,
      time: '05:30 PM',
      type: 'viewpoint',
      title: `${currentDistrict.name} Sunset Point & Golden Hour`,
      subtitle: 'Viewpoint • Photography',
      description: `Watch the crimson sunset over the Sahyadri mountains or coastal horizon with refreshing mountain air.`,
      locationName: `${currentDistrict.name} Ridge`,
      districtName: currentDistrict.name,
      recommendedDuration: '1 Hour',
      category: 'Viewpoints',
    });

    // Dinner
    items.push({
      id: `item-${dayNum}-dinner`,
      time: '07:30 PM',
      type: 'dinner',
      title: dinnerFood ? dinnerFood.name : `Evening Dinner at ${currentDistrict.name}`,
      subtitle: dinnerFood ? dinnerFood.specialty : 'Local Dining',
      description: dinnerFood
        ? `${dinnerFood.description} Signature dish: ${dinnerFood.recommendedDish}.`
        : `Unwind with a flavorful dinner featuring hot flatbreads, gravies, and desserts.`,
      locationName: currentDistrict.name,
      districtName: currentDistrict.name,
      estimatedCost: budgetTier === 'Budget' ? 180 : budgetTier === 'Moderate' ? 420 : 950,
      foodDetails: dinnerFood
        ? { cuisine: dinnerFood.cuisine, mustTry: dinnerFood.recommendedDish }
        : undefined,
    });

    // Stay (Except on the very last night if returning home)
    if (!isLastDay || durationDays === 1) {
      items.push({
        id: `item-${dayNum}-stay`,
        time: '09:00 PM',
        type: 'stay',
        title: `Overnight at ${selectedStay.name}`,
        subtitle: `${selectedStay.tier} Accommodation • ${selectedStay.locationArea}`,
        description: selectedStay.description,
        locationName: selectedStay.locationArea,
        districtName: currentDistrict.name,
        estimatedCost: selectedStay.approxPricePerNight,
        accommodation: selectedStay,
      });
    } else {
      // Final Day: Return journey segment
      const resolvedEnd = endPoint.includes('Return to starting point')
        ? startingPoint
        : endPoint;
      const endCoords = getCityCoordinates(resolvedEnd);

      items.push({
        id: `item-${dayNum}-return`,
        time: '08:30 PM',
        type: 'return',
        title: `Return to ${resolvedEnd}`,
        subtitle: `Concluding your Karnataka Journey`,
        description: `Board your ${transport.toLowerCase()} for the homeward journey back to ${resolvedEnd}, carrying unforgettable memories of Karnataka.`,
        locationName: resolvedEnd,
        districtName: resolvedEnd,
        latitude: endCoords.lat,
        longitude: endCoords.lng,
        travelInfo: {
          from: currentDistrict.name,
          to: resolvedEnd,
          distanceKm: estimateDistance(currentDistrict.name, resolvedEnd),
          durationMinutes: estimateTravelMinutes(currentDistrict.name, resolvedEnd, transport),
          mode: transport,
        },
      });

      waypoints.push({
        name: resolvedEnd,
        latitude: endCoords.lat,
        longitude: endCoords.lng,
        day: dayNum,
        type: 'end',
      });
    }

    // Construct the Day
    days.push({
      dayNumber: dayNum,
      title: `Day ${dayNum}: ${currentDistrict.name}`,
      districtId: currentDistrictId,
      districtName: currentDistrict.name,
      theme: currentDistrict.tagline,
      summary: `Immerse in ${currentDistrict.name} with curated ${interests.slice(0, 3).join(', ')} highlights, local cuisine, and comfortable stays.`,
      items,
    });
  }

  // 5. BUDGET ESTIMATE CALCULATION
  const resolvedEnd = endPoint.includes('Return to starting point')
    ? startingPoint
    : endPoint;

  const totalDistanceKm =
    estimateDistance(startingPoint, districtNames[0] || 'Karnataka') +
    (durationDays - 1) * 80 +
    estimateDistance(districtNames[districtNames.length - 1] || 'Karnataka', resolvedEnd);

  // Transport calculation based on mode
  let transportRatePerKm = 10; // Car default
  let transportBaseCost = 0;

  switch (transport) {
    case 'Bike':
      transportRatePerKm = 3.5;
      break;
    case 'Car':
      transportRatePerKm = 11;
      break;
    case 'Bus':
      transportRatePerKm = 0;
      transportBaseCost = 450 * durationDays * travelersCount;
      break;
    case 'Train':
      transportRatePerKm = 0;
      transportBaseCost = 300 * durationDays * travelersCount;
      break;
    case 'Public Transport':
      transportRatePerKm = 0;
      transportBaseCost = 350 * durationDays * travelersCount;
      break;
    default:
      transportRatePerKm = 9;
  }

  const transportCost = Math.round(
    transportBaseCost > 0
      ? transportBaseCost
      : totalDistanceKm * transportRatePerKm + (durationDays * 200) // toll / parking
  );

  // Accommodation calculation
  let avgRoomRate = 3500;
  if (budgetTier === 'Budget') avgRoomRate = 1200;
  if (budgetTier === 'Premium') avgRoomRate = 9500;

  const roomsNeeded = Math.ceil(travelersCount / 2);
  const nights = Math.max(1, durationDays - 1);
  const accommodationCost = Math.round(avgRoomRate * roomsNeeded * nights);

  // Food calculation
  let dailyFoodPerPerson = 850;
  if (budgetTier === 'Budget') dailyFoodPerPerson = 400;
  if (budgetTier === 'Premium') dailyFoodPerPerson = 2100;

  const foodCost = Math.round(dailyFoodPerPerson * travelersCount * durationDays);

  // Activities & entry fees
  let dailyActivityPerPerson = 250;
  if (interests.includes('Adventure')) dailyActivityPerPerson += 450;
  if (interests.includes('Wildlife')) dailyActivityPerPerson += 300;
  if (budgetTier === 'Premium') dailyActivityPerPerson += 400;

  const activitiesCost = Math.round(dailyActivityPerPerson * travelersCount * durationDays);
  const miscellaneousCost = Math.round((transportCost + accommodationCost + foodCost) * 0.07);

  const totalCost = transportCost + accommodationCost + foodCost + activitiesCost + miscellaneousCost;
  const perPersonCost = Math.round(totalCost / Math.max(1, travelersCount));

  const budgetEstimate: BudgetEstimate = {
    transportCost,
    accommodationCost,
    foodCost,
    activitiesCost,
    miscellaneousCost,
    totalCost,
    perPersonCost,
    currency: 'INR (₹)',
  };

  // 6. ROUTE SUMMARY
  const routeSegments = [startingPoint, ...districtNames];
  if (resolvedEnd !== districtNames[districtNames.length - 1]) {
    routeSegments.push(resolvedEnd);
  }
  const routeSummary = routeSegments.join(' → ');

  // 7. ESSENTIALS & SEASONAL TIPS
  const essentialsToCarry = KARNATAKA_ESSENTIALS.filter(
    ess =>
      !ess.relevantDistricts ||
      ess.relevantDistricts.some(d => selectedDistricts.includes(d)) ||
      ess.importance === 'Essential'
  ).map(e => e.item);

  const seasonalTips = [
    KARNATAKA_SEASONAL_INFO.winter.overallMood,
    KARNATAKA_SEASONAL_INFO.winter.suitabilityNote,
    `Optimal transport mode: ${transport} chosen for flexibility.`,
    `Total estimated travel distance: ~${totalDistanceKm} km across ${districtNames.join(', ')}.`,
  ];

  // Cover image from first district
  const coverImage =
    districts[0]?.heroImage || KARNATAKA_DISTRICTS[0].heroImage;

  const tripId = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  return {
    id: tripId,
    title: `${routeSummary}`,
    startingPoint,
    selectedDistricts,
    selectedDistrictNames: districtNames,
    durationDays,
    interests,
    transport,
    budgetTier,
    travelersCount,
    endPoint: resolvedEnd,
    routeSummary,
    createdAt: new Date().toISOString(),
    days,
    budgetEstimate,
    waypoints,
    essentialsToCarry,
    seasonalTips,
    coverImage,
    isCustomSaved: false,
  };
}

// Distance estimation helper between Karnataka locations (in km)
function estimateDistance(from: string, to: string): number {
  const normFrom = from.toLowerCase();
  const normTo = to.toLowerCase();
  if (normFrom === normTo) return 25;

  const key = `${normFrom}-${normTo}`;
  const distances: Record<string, number> = {
    'mangaluru-kodagu': 140,
    'mangaluru-chikkamagaluru': 150,
    'mangaluru-udupi': 55,
    'mangaluru-mysuru': 255,
    'mangaluru-bengaluru': 350,
    'bengaluru-mysuru': 145,
    'bengaluru-kodagu': 250,
    'bengaluru-chikkamagaluru': 240,
    'bengaluru-hampi': 340,
    'bengaluru-vijayanagara': 340,
    'bengaluru-shivamogga': 300,
    'bengaluru-bagalkote': 475,
    'mysuru-kodagu': 120,
    'mysuru-chikkamagaluru': 175,
    'mysuru-hassan': 115,
    'chikkamagaluru-kodagu': 130,
    'chikkamagaluru-shivamogga': 95,
    'shivamogga-uttara-kannada': 160,
    'udupi-uttara-kannada': 170,
  };

  if (distances[key]) return distances[key];
  const reverseKey = `${normTo}-${normFrom}`;
  if (distances[reverseKey]) return distances[reverseKey];

  return 180; // default estimated inter-district distance
}

function estimateTravelMinutes(
  from: string,
  to: string,
  mode: TransportMode
): number {
  const km = estimateDistance(from, to);
  let speedKmH = 45; // average mountain/rural speed
  if (mode === 'Car') speedKmH = 55;
  if (mode === 'Bike') speedKmH = 48;
  if (mode === 'Bus') speedKmH = 38;
  if (mode === 'Train') speedKmH = 50;

  return Math.round((km / speedKmH) * 60);
}
