import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trip } from '../types';
import { tripService } from '../services/tripService';
import { pdfService } from '../services/pdfService';
import { usePlanner } from '../context/PlannerContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { ItineraryTimeline } from '../components/timeline/ItineraryTimeline';
import { BudgetBreakdown } from '../components/common/BudgetBreakdown';
import {
  MapPin,
  Calendar,
  Car,
  Users,
  Compass,
  Bookmark,
  Share2,
  Printer,
  FileDown,
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    setStartingPoint,
    setSelectedDistricts,
    setDurationDays,
    setInterests,
    setTransport,
    setBudgetTier,
    setTravelersCount,
    setEndPoint,
    setCurrentStep,
  } = usePlanner();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<number | null>(null);
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      const found = tripService.getTripById(id);
      if (found) setTrip(found);

      tripService.fetchTripById(id).then(fetched => {
        if (fetched) setTrip(fetched);
      });
    }
  }, [id]);

  if (!trip) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-stone-400 mb-3" />
        <h2 className="text-xl font-bold text-stone-800">Trip Itinerary Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          The requested trip plan could not be located or has expired.
        </p>
        <Link
          to="/plan-trip"
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
        >
          Create New Trip Plan
        </Link>
      </div>
    );
  }

  const handleToggleSave = () => {
    const updated = tripService.toggleSaveTrip(trip.id);
    if (updated) setTrip(updated);
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    await pdfService.exportTripPdf(trip);
    setIsExportingPdf(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: `Check out my ${trip.durationDays}-day Karnataka travel plan!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleEditTrip = () => {
    // Load this trip's parameters back into the Planner context
    setStartingPoint(trip.startingPoint);
    setSelectedDistricts(trip.selectedDistricts);
    setDurationDays(trip.durationDays);
    setInterests(trip.interests);
    setTransport(trip.transport);
    setBudgetTier(trip.budgetTier);
    setTravelersCount(trip.travelersCount);
    setEndPoint(trip.endPoint);
    setCurrentStep(1);
    navigate('/plan-trip');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 print:bg-white print:p-0">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-18 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/plan-trip"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Plan Another Trip</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                trip.isCustomSaved
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${trip.isCustomSaved ? 'fill-rose-600' : ''}`} />
              <span>{trip.isCustomSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Preparing PDF...' : 'Export / Print PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Share Trip Plan"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink && <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>}
            </button>

            <button
              type="button"
              onClick={handleEditTrip}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Modify</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-stone-900 text-white py-10 sm:py-14 print:bg-white print:text-stone-900 print:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
              Karnataka Travel Itinerary & Roadmap
            </span>
            <span className="text-xs text-stone-400 print:text-stone-600">
              Generated {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white print:text-stone-900 leading-tight">
            {trip.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 print:text-stone-700 mt-2 max-w-3xl">
            A verified {trip.durationDays}-day Karnataka exploration through {trip.selectedDistrictNames.join(', ')} prioritizing {trip.interests.join(', ')}.
          </p>

          {/* Badges Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs print:text-stone-800">
            <span className="flex items-center gap-1.5 bg-stone-800/90 print:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-700 print:border-stone-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="font-bold">{trip.durationDays} Days</strong>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-800/90 print:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-700 print:border-stone-300">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transport: <strong>{trip.transport}</strong></span>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-800/90 print:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-700 print:border-stone-300">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{trip.travelersCount} Travelers ({trip.budgetTier} Tier)</span>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-800/90 print:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-700 print:border-stone-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Starts: {trip.startingPoint} • Concludes: {trip.endPoint}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Leaflet Roadmap Map (Sticks on desktop) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs sticky top-36">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Route Roadmap</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {trip.waypoints.length} Route Stops
                </span>
              </div>

              {/* Leaflet Map with Waypoints & Polyline */}
              <LeafletMap
                waypoints={trip.waypoints}
                activeDay={activeDayFilter}
                height="380px"
                focusLocation={focusLocation}
              />

              {/* Waypoints Sequence List */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">
                  Route Waypoint Sequence
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                  {trip.waypoints.map((wp, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFocusLocation({ lat: wp.latitude, lng: wp.longitude })}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                          wp.type === 'start' ? 'bg-blue-600' : wp.type === 'end' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {wp.type === 'start' ? 'S' : wp.type === 'end' ? 'E' : wp.day}
                        </span>
                        <span className="font-semibold text-stone-800 truncate">{wp.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 capitalize shrink-0">{wp.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Day-by-Day Timeline */}
          <div className="lg:col-span-7 space-y-10">
            {/* Timeline Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Day-by-Day Schedule
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                    Itinerary Timeline
                  </h2>
                </div>
              </div>

              <ItineraryTimeline
                days={trip.days}
                activeDayFilter={activeDayFilter}
                onSelectDayFilter={setActiveDayFilter}
                onFocusMap={coords => setFocusLocation(coords)}
              />
            </div>

            {/* Budget Breakdown Section */}
            <div className="pt-6">
              <BudgetBreakdown
                budget={trip.budgetEstimate}
                travelersCount={trip.travelersCount}
              />
            </div>

            {/* Packing Essentials Checklist */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Packing Essentials for This Route</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Tailored for your selected districts ({trip.selectedDistrictNames.join(', ')}) and activities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {trip.essentialsToCarry.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Tips & Route Advice */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-6 text-xs text-emerald-950 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">Karnataka Route Advisory</h4>
              </div>

              <ul className="space-y-1.5 list-disc pl-4 text-emerald-900">
                {trip.seasonalTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
