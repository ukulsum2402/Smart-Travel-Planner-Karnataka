import React from 'react';
import { ItineraryItem } from '../../types';
import { ImageAttributionBadge } from '../common/ImageAttributionBadge';
import {
  Car,
  Utensils,
  MapPin,
  Compass,
  Sunset,
  Hotel,
  Clock,
  Navigation,
  ArrowRight,
} from 'lucide-react';

interface Props {
  item: ItineraryItem;
  onFocusMap?: (coords: { lat: number; lng: number }) => void;
}

export const TimelineItemCard: React.FC<Props> = ({ item, onFocusMap }) => {
  const getItemIcon = () => {
    switch (item.type) {
      case 'departure':
        return <Navigation className="w-4 h-4 text-blue-600" />;
      case 'travel':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'place':
        return <MapPin className="w-4 h-4 text-emerald-700" />;
      case 'activity':
        return <Compass className="w-4 h-4 text-teal-600" />;
      case 'viewpoint':
        return <Sunset className="w-4 h-4 text-rose-500" />;
      case 'stay':
        return <Hotel className="w-4 h-4 text-indigo-600" />;
      case 'return':
        return <ArrowRight className="w-4 h-4 text-purple-600" />;
      default:
        return <MapPin className="w-4 h-4 text-stone-600" />;
    }
  };

  const getBadgeStyle = () => {
    switch (item.type) {
      case 'departure':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'travel':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'place':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'activity':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'viewpoint':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'stay':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'return':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const hasCoords = item.latitude !== undefined && item.longitude !== undefined;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-stone-100 flex items-center justify-center">
            {getItemIcon()}
          </div>
          <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
            {item.time}
          </span>
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {item.type}
          </span>
        </div>

        {item.recommendedDuration && (
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Duration: {item.recommendedDuration}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className={item.image ? 'md:col-span-8' : 'md:col-span-12'}>
          <h4 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            {item.title}
          </h4>

          {item.subtitle && (
            <p className="text-xs font-medium text-emerald-700 mt-0.5">
              {item.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            {item.description}
          </p>

          {/* Travel Information segment */}
          {item.travelInfo && (
            <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700 flex flex-wrap items-center gap-4">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Route</span>
                <span className="font-semibold">{item.travelInfo.from} → {item.travelInfo.to}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Distance</span>
                <span className="font-semibold">~{item.travelInfo.distanceKm} km</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Est. Duration</span>
                <span className="font-semibold">{Math.floor(item.travelInfo.durationMinutes / 60)}h {item.travelInfo.durationMinutes % 60}m</span>
              </div>
            </div>
          )}

          {/* Food must-try tag */}
          {item.foodDetails && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
              <span className="font-semibold text-amber-800">Must Try:</span>
              <span>{item.foodDetails.mustTry}</span>
            </div>
          )}

          {/* Accommodation details */}
          {item.accommodation && (
            <div className="mt-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
              <div className="flex items-center justify-between font-semibold mb-1">
                <span>{item.accommodation.name} ({item.accommodation.tier})</span>
                <span className="text-indigo-700 font-bold">₹{item.accommodation.approxPricePerNight}/night</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.accommodation.amenities.map(a => (
                  <span key={a} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-indigo-800 border border-indigo-200/60">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom actions & cost */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{item.districtName}</span>
            </span>

            {hasCoords && onFocusMap && (
              <button
                type="button"
                onClick={() => onFocusMap({ lat: item.latitude!, lng: item.longitude! })}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View on Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Real verified Image thumbnail with Wikipedia attribution */}
        {item.image && (
          <div className="md:col-span-4 relative rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-full min-h-[140px] shadow-inner group">
            <img
              src={item.image.imageUrl}
              alt={item.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <ImageAttributionBadge metadata={item.image} dark />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
