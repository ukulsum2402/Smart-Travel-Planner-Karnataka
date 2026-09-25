import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_FOOD_PLACES } from '../data/foodPlaces';
import { KARNATAKA_ACCOMMODATIONS } from '../data/accommodations';
import { destinationService } from '../services/destinationService';
import { ImageAttributionBadge } from '../components/common/ImageAttributionBadge';
import { LeafletMap } from '../components/common/LeafletMap';
import { usePlanner } from '../context/PlannerContext';
import {
  MapPin,
  Clock,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Compass,
  ArrowLeft,
  Sparkles,
  Utensils,
  Hotel,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { preselectDistrict } = usePlanner();

  const staticDest = KARNATAKA_DESTINATIONS.find(d => d.slug === slug);
  const [destination, setDestination] = useState(staticDest);
  const [district, setDistrict] = useState(staticDest ? KARNATAKA_DISTRICTS.find(d => d.id === staticDest.districtId) : null);
  const [districtFoods, setDistrictFoods] = useState(staticDest ? KARNATAKA_FOOD_PLACES.filter(f => f.districtId === staticDest.districtId) : []);
  const [districtStays, setDistrictStays] = useState(staticDest ? KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === staticDest.districtId) : []);

  useEffect(() => {
    if (slug) {
      destinationService.getDestinationBySlug(slug).then(data => {
        if (data) {
          setDestination(data.destination);
          if (data.district) setDistrict(data.district);
          if (data.foodPlaces) setDistrictFoods(data.foodPlaces);
          if (data.accommodations) setDistrictStays(data.accommodations);
        }
      });
    }
  }, [slug]);

  if (!destination) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-stone-400 mb-3" />
        <h2 className="text-xl font-bold text-stone-800">Destination Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          The requested Karnataka destination could not be located in our verified directory.
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

  const handlePlanTripHere = () => {
    preselectDistrict(destination.districtId);
    navigate('/plan-trip');
  };

  const waypoint = {
    name: destination.name,
    district: destination.districtName,
    latitude: destination.latitude,
    longitude: destination.longitude,
    day: 1,
    type: 'stop' as const,
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Back Navigation Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Destinations</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: destination.name,
                    text: destination.shortDescription,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Banner */}
      <div className="relative h-[340px] sm:h-[460px] bg-stone-950 overflow-hidden">
        <img
          src={destination.image.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover opacity-90 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="absolute top-4 right-4 z-10">
          <ImageAttributionBadge metadata={destination.image} dark />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-7xl mx-auto text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {destination.districtName}
            </span>
            {destination.categories.map(c => (
              <span
                key={c}
                className="bg-white/20 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-white/20"
              >
                {c}
              </span>
            ))}
            {destination.isHiddenGem && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow">
                Hidden Gem
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl line-clamp-2">
            {destination.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Stats Grid */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Best Months
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{destination.bestMonths[0]} – {destination.bestMonths[destination.bestMonths.length - 1]}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Visit Duration
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{destination.visitDuration}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Entry Fee
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5 mt-1">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>{destination.entryFee ? 'Entry Ticket' : 'Free Entry'}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Rating
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5 mt-1">
                  <span className="text-amber-500">★</span>
                  <span>{destination.rating || 4.8} / 5.0</span>
                </span>
              </div>
            </div>

            {/* Comprehensive Description */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-3">About {destination.name}</h2>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {destination.fullDescription}
                </p>
              </div>

              {/* Recommended Activities */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Key Activities & Things to Do</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destination.activities.map(act => (
                    <div
                      key={act}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Tips */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
                <span className="font-bold text-emerald-900 block text-sm">Traveler Advisory & Tips</span>
                <p>
                  • Start early in the morning to beat tourist crowds and experience cool mountain air or tranquil shoreline serenity.
                </p>
                <p>
                  • Please respect local traditions, maintain silence at sanctums, and leave no plastic behind.
                </p>
              </div>

              {/* Wikipedia Source Verification Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-stone-800 block">Verified Image Source:</span>
                  <span>Photographed by {destination.image.photographer} under {destination.image.license}</span>
                </div>
                <a
                  href={destination.image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
                >
                  <span>View on Wikimedia</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Leaflet Map for this Destination */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Geographic Location</span>
              </h3>
              <LeafletMap
                waypoints={[waypoint]}
                height="320px"
                focusLocation={{ lat: destination.latitude, lng: destination.longitude }}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Plan a Trip CTA Card */}
            <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>

              <div>
                <h3 className="text-lg font-bold">Include in Custom Trip</h3>
                <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                  Add {destination.name} and the breathtaking district of {destination.districtName} to a custom multi-day Karnataka itinerary.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlanTripHere}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Plan a Trip to {destination.districtName}
              </button>
            </div>

            {/* Regional Dining in this district */}
            {districtFoods.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Regional Dining in {destination.districtName}</span>
                </h3>

                <div className="space-y-3">
                  {districtFoods.slice(0, 2).map(food => (
                    <div key={food.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>{food.name}</span>
                        <span className="text-[10px] text-amber-700 font-semibold">{food.specialty}</span>
                      </div>
                      <p className="text-stone-500 mt-1 line-clamp-2">{food.description}</p>
                      <div className="mt-2 text-[11px] font-medium text-emerald-800">
                        Must Try: {food.recommendedDish}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accommodations in this district */}
            {districtStays.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-indigo-600" />
                  <span>Where to Stay</span>
                </h3>

                <div className="space-y-3">
                  {districtStays.slice(0, 2).map(stay => (
                    <div key={stay.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>{stay.name}</span>
                        <span className="text-emerald-700">₹{stay.approxPricePerNight}/nt</span>
                      </div>
                      <span className="text-[10px] font-semibold text-stone-400 block mt-0.5">
                        {stay.tier} Tier • {stay.locationArea}
                      </span>
                      <p className="text-stone-500 mt-1 line-clamp-2">{stay.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to district link */}
            {district && (
              <div className="text-center pt-2">
                <Link
                  to={`/district/${district.slug}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Explore more in {district.name} District →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
