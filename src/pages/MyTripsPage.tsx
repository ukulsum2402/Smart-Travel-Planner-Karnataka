import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';
import { tripService } from '../services/tripService';
import {
  Calendar,
  Car,
  Compass,
  Trash2,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  IndianRupee,
} from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const all = tripService.getAllTrips();
    setTrips(all);

    // Fetch latest trips from PostgreSQL backend
    tripService.fetchTrips().then(fetched => {
      if (fetched && fetched.length > 0) {
        setTrips(fetched);
      }
    });
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Remove this trip from your saved itineraries?')) {
      tripService.deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Trip History & Bookmarks
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              My Karnataka Trips
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Review, access, and share your generated travel itineraries and roadmaps.
            </p>
          </div>

          <Link
            to="/plan-trip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Create New Trip</span>
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover */}
                  <div className="relative h-44 overflow-hidden bg-stone-900">
                    <img
                      src={trip.coverImage.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-emerald-700 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {trip.durationDays} DAYS
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={e => handleDelete(trip.id, e)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-900/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <p className="text-[11px] font-semibold text-emerald-300">
                        {trip.selectedDistrictNames.join(' • ')}
                      </p>
                      <h3 className="text-base font-bold text-white truncate">
                        {trip.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-stone-400" />
                        <span>Transport: {trip.transport}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>{trip.travelersCount} Travelers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-stone-400" />
                        <span>Est. ₹{trip.budgetEstimate.totalCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Starts: {trip.startingPoint}</span>
                      </div>
                    </div>

                    {/* Interests tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trip.interests.slice(0, 3).map(interest => (
                        <span
                          key={interest}
                          className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/trip/${trip.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Full Itinerary & Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <Compass className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900">No Saved Trips Yet</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Use the Smart Trip Planner to generate customized itineraries tailored to your time and budget.
            </p>
            <Link
              to="/plan-trip"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              <span>Plan My First Trip</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
