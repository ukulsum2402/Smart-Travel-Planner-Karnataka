import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_FOOD_PLACES } from '../data/foodPlaces';
import { KARNATAKA_ACCOMMODATIONS } from '../data/accommodations';
import { districtService } from '../services/districtService';
import { ImageAttributionBadge } from '../components/common/ImageAttributionBadge';
import { LeafletMap } from '../components/common/LeafletMap';
import { usePlanner } from '../context/PlannerContext';
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Utensils,
  Hotel,
  Calendar,
  Compass,
} from 'lucide-react';

export const DistrictDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { preselectDistrict } = usePlanner();

  const staticDist = KARNATAKA_DISTRICTS.find(d => d.slug === slug);
  const [district, setDistrict] = useState(staticDist);
  const [destinations, setDestinations] = useState(staticDist ? KARNATAKA_DESTINATIONS.filter(d => d.districtId === staticDist.id) : []);
  const [foodPlaces, setFoodPlaces] = useState(staticDist ? KARNATAKA_FOOD_PLACES.filter(f => f.districtId === staticDist.id) : []);
  const [accommodations, setAccommodations] = useState(staticDist ? KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === staticDist.id) : []);

  useEffect(() => {
    if (slug) {
      districtService.getDistrictBySlug(slug).then(data => {
        if (data) {
          setDistrict(data.district);
          if (data.destinations) setDestinations(data.destinations);
          if (data.foodPlaces) setFoodPlaces(data.foodPlaces);
          if (data.accommodations) setAccommodations(data.accommodations);
        }
      });
    }
  }, [slug]);

  if (!district) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-stone-400 mb-3" />
        <h2 className="text-xl font-bold text-stone-800">District Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          The requested Karnataka district could not be located in our verified directory.
        </p>
        <Link
          to="/explore"
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const waypoints = destinations.map((d, index) => ({
    name: d.name,
    district: district.name,
    latitude: d.latitude,
    longitude: d.longitude,
    day: 1,
    type: 'stop' as const,
  }));

  const handlePlanTripToDistrict = () => {
    preselectDistrict(district.id);
    navigate('/plan-trip');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Back Nav */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Districts</span>
          </Link>

          <button
            type="button"
            onClick={handlePlanTripToDistrict}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Plan a Trip to {district.name}</span>
          </button>
        </div>
      </div>

      {/* District Hero Banner */}
      <div className="relative h-[360px] sm:h-[440px] bg-stone-950 overflow-hidden">
        <img
          src={district.heroImage.imageUrl}
          alt={district.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-7xl mx-auto text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {district.kannadaName} • {district.tagline}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {district.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-2xl leading-relaxed">
            {district.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Best Season: {district.bestTimeToVisit}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{destinations.length} Verified Highlights</span>
            </span>
          </div>
        </div>
      </div>

      {/* District Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
        {/* Tourist Destinations in this District */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Attractions & Natural Wonders
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-1">
                Places to Visit in {district.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(dest => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={dest.image.imageUrl}
                    alt={dest.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <ImageAttributionBadge metadata={dest.image} dark />
                  </div>
                  {dest.isHiddenGem && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Hidden Gem
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {dest.categories.map(c => (
                        <span
                          key={c}
                          className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {dest.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {dest.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{dest.visitDuration}</span>
                    </span>

                    <Link
                      to={`/destination/${dest.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Regional Dining & Specialties */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          <div className="max-w-xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Culinary Heritage
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <span>Regional Dining in {district.name}</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Local dining recommendations serving authentic district flavors and culinary heirlooms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodPlaces.map(food => (
              <div
                key={food.id}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {food.mealType}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {food.cuisine}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900">{food.name}</h4>
                <p className="text-xs text-stone-600">{food.description}</p>

                <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-800">
                  <span className="font-semibold text-emerald-800">Specialty: </span>
                  <span>{food.specialty}</span>
                </div>
                <div className="text-xs text-stone-800">
                  <span className="font-semibold text-amber-800">Must Try: </span>
                  <span>{food.recommendedDish}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accommodation Options */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          <div className="max-w-xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Where to Stay
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-indigo-600" />
              <span>Recommended Accommodations in {district.name}</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Curated stays spanning Budget homestays, Moderate estates, and Premium heritage resorts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodations.map(stay => (
              <div
                key={stay.id}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2.5 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    stay.tier === 'Premium'
                      ? 'bg-purple-100 text-purple-800'
                      : stay.tier === 'Moderate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {stay.tier} Tier
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    ₹{stay.approxPricePerNight}/night
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900">{stay.name}</h4>
                <p className="text-xs text-stone-500">{stay.locationArea}</p>
                <p className="text-xs text-stone-600 leading-relaxed">{stay.description}</p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {stay.amenities.map(a => (
                    <span
                      key={a}
                      className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map View of District Waypoints */}
        {waypoints.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Map of {district.name} Landmarks</span>
            </h3>
            <LeafletMap waypoints={waypoints} height="380px" />
          </section>
        )}
      </div>
    </div>
  );
};
