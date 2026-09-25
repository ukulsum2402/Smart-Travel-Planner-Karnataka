import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanner } from '../context/PlannerContext';
import { tripService } from '../services/tripService';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_INTERESTS, STARTING_LOCATIONS } from '../data/interests';
import { TransportMode, BudgetTier } from '../types';
import {
  MapPin,
  Calendar,
  Compass,
  Car,
  IndianRupee,
  Users,
  Navigation,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  HelpCircle,
  Clock,
  Bike,
  Bus,
  Train,
  SlidersHorizontal,
} from 'lucide-react';

export const PlanTripPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    plannerState,
    currentStep,
    setCurrentStep,
    setStartingPoint,
    toggleDistrict,
    setSelectedDistricts,
    setDurationDays,
    toggleInterest,
    setInterests,
    setTransport,
    setBudgetTier,
    setTravelersCount,
    setEndPoint,
  } = usePlanner();

  const [isGenerating, setIsGenerating] = useState(false);
  const [customStartInput, setCustomStartInput] = useState('');
  const [customEndInput, setCustomEndInput] = useState('');

  // Transport options
  const transportOptions: { mode: TransportMode; label: string; icon: any; note: string }[] = [
    { mode: 'Car', label: 'Car / SUV', icon: Car, note: 'Best flexibility for Ghat roads, waterfalls, and family travel.' },
    { mode: 'Bike', label: 'Motorbike', icon: Bike, note: 'Exciting for solo & duo riders on Western Ghats mountain curves.' },
    { mode: 'Bus', label: 'KSRTC / Bus', icon: Bus, note: 'Economical, extensive Airavat & Rajahamsa connectivity across Karnataka.' },
    { mode: 'Train', label: 'Indian Railways', icon: Train, note: 'Scenic & comfortable for long-distance routes like Hampi, Mysuru, Gokarna.' },
    { mode: 'Public Transport', label: 'Public Transit', icon: Navigation, note: 'Local district buses and shared autorickshaws.' },
    { mode: 'Let Planner Decide', label: 'Let Planner Decide', icon: Sparkles, note: 'We will suggest optimal transport for your specific route.' },
  ];

  // Budget tiers
  const budgetTiers: { tier: BudgetTier; title: string; desc: string; approxDaily: string }[] = [
    { tier: 'Budget', title: 'Budget Explorer', desc: 'Homestays, cozy dorms, local bus transit, and authentic tiffin centers.', approxDaily: '~₹1,200 – ₹1,800/day' },
    { tier: 'Moderate', title: 'Comfort & Balanced', desc: 'Estate homestays, 3-star AC hotels, private car/cab, and popular regional restaurants.', approxDaily: '~₹3,500 – ₹5,000/day' },
    { tier: 'Premium', title: 'Luxury & Heritage', desc: 'Boutique heritage resorts, private SUVs, guided tours, and fine dining.', approxDaily: '~₹8,000 – ₹15,000/day' },
  ];

  // Quick Preset Handlers (for easy 1-click test cases)
  const applyTestCase1 = () => {
    setStartingPoint('Mangaluru');
    setSelectedDistricts(['kodagu', 'chikkamagaluru']);
    setDurationDays(4);
    setInterests(['Nature', 'Trekking', 'Food']);
    setTransport('Car');
    setBudgetTier('Moderate');
    setTravelersCount(2);
    setEndPoint('Return to starting point');
    setCurrentStep(8);
  };

  const applyTestCase2 = () => {
    setStartingPoint('Bengaluru');
    setSelectedDistricts(['mysuru']);
    setDurationDays(2);
    setInterests(['History', 'Heritage']);
    setTransport('Bus');
    setBudgetTier('Budget');
    setTravelersCount(3);
    setEndPoint('Return to starting point');
    setCurrentStep(8);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const trip = await tripService.generateTripAsync(plannerState);
      setIsGenerating(false);
      navigate(`/trip/${trip.id}`);
    } catch {
      const trip = tripService.generateTrip(plannerState);
      setIsGenerating(false);
      navigate(`/trip/${trip.id}`);
    }
  };

  const stepLabels = [
    'Start',
    'Districts',
    'Duration',
    'Interests',
    'Transport',
    'Budget',
    'End Point',
    'Generate',
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Smart Dynamic Trip Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Plan Your Karnataka Journey
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Complete the 8 steps below to generate a tailored day-by-day roadmap and timeline.
          </p>

          {/* Quick Preset Buttons for Test Cases */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase">Quick Presets:</span>
            <button
              type="button"
              onClick={applyTestCase1}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Test Case 1: Mangaluru → Coorg & Chikka (4 Days)
            </button>
            <button
              type="button"
              onClick={applyTestCase2}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Test Case 2: Bengaluru → Mysuru Heritage (2 Days)
            </button>
          </div>
        </div>

        {/* 8-Step Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-1 sm:gap-2">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCurrentStep(stepNum)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-white text-emerald-800 font-bold' : isPassed ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-300 text-stone-700'
                  }`}>
                    {stepNum}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Card Container */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm min-h-[460px] flex flex-col justify-between">
          <div>
            {/* STEP 1: STARTING POINT */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 1 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>Where will you start your journey?</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select your departure city. Our engine calculates travel segments, distances, and day 1 departure from here.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STARTING_LOCATIONS.map(city => {
                    const isSelected = plannerState.startingPoint === city;
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setStartingPoint(city)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                            : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span>{city}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom starting city input */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Or enter another custom town / starting location:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customStartInput}
                      onChange={e => setCustomStartInput(e.target.value)}
                      placeholder="e.g., Uppinangady, Sirsi, Kundapura..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customStartInput.trim()) {
                          setStartingPoint(customStartInput.trim());
                        }
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl"
                    >
                      Set Custom
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-medium">
                  Selected starting point: <strong className="text-emerald-950">{plannerState.startingPoint}</strong>
                </div>
              </div>
            )}

            {/* STEP 2: DISTRICT SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Step 2 of 8
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-600" />
                      <span>Select District(s) to Visit</span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Choose one or more districts. The engine strictly recommends places only from your selected districts.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                    {plannerState.selectedDistricts.length} District(s) Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {KARNATAKA_DISTRICTS.map(dist => {
                    const isSelected = plannerState.selectedDistricts.includes(dist.id);
                    return (
                      <div
                        key={dist.id}
                        onClick={() => toggleDistrict(dist.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={dist.heroImage.imageUrl}
                            alt={dist.name}
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">
                              {dist.name}
                            </span>
                            <span className="text-[10px] text-stone-500 block line-clamp-1">
                              {dist.tagline}
                            </span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                          isSelected ? 'bg-emerald-700 text-white' : 'border border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: TRIP DURATION */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 3 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>How many days will you travel?</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    The itinerary will contain exactly this number of day-by-day itineraries (e.g., 4 Days).
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center py-6 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-5xl font-black text-emerald-800 font-mono">
                    {plannerState.durationDays}
                  </span>
                  <span className="text-xs uppercase font-bold text-stone-500 mt-1">
                    {plannerState.durationDays === 1 ? 'Day Travel Itinerary' : 'Days Travel Itinerary'}
                  </span>

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      disabled={plannerState.durationDays <= 1}
                      onClick={() => setDurationDays(Math.max(1, plannerState.durationDays - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-lg hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-stone-600">Adjust Duration</span>
                    <button
                      type="button"
                      disabled={plannerState.durationDays >= 10}
                      onClick={() => setDurationDays(Math.min(10, plannerState.durationDays + 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-lg hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { days: 2, label: '2 Days (Weekend Trip)' },
                    { days: 3, label: '3 Days (Long Weekend)' },
                    { days: 4, label: '4 Days (Popular Trail)' },
                    { days: 5, label: '5 Days (Grand Circuit)' },
                  ].map(preset => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setDurationDays(preset.days)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        plannerState.durationDays === preset.days
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: INTERESTS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Step 4 of 8
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>What are your travel interests?</span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Destinations matching your selected interests are prioritized in daily schedules.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                    {plannerState.interests.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {KARNATAKA_INTERESTS.map(interest => {
                    const isSelected = plannerState.interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold">{interest.name}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] line-clamp-2 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {interest.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: TRANSPORT MODE */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 5 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <Car className="w-5 h-5 text-emerald-600" />
                    <span>How will you travel?</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Transport mode affects route planning, travel durations, and estimated fuel / ticket expenses.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {transportOptions.map(opt => {
                    const Icon = opt.icon;
                    const isSelected = plannerState.transport === opt.mode;

                    return (
                      <div
                        key={opt.mode}
                        onClick={() => setTransport(opt.mode)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 block">{opt.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{opt.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: BUDGET & TRAVELERS */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 6 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    <span>Budget & Number of Travelers</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Directly controls accommodation category, dining tier, and per-person cost calculations.
                  </p>
                </div>

                {/* Travelers count */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Number of Travelers</span>
                      <span className="text-[11px] text-stone-500">Helps allocate room counts and food costs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTravelersCount(Math.max(1, plannerState.travelersCount - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-stone-900 w-6 text-center font-mono">
                      {plannerState.travelersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelersCount(plannerState.travelersCount + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Budget tier selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Choose Budget Tier:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {budgetTiers.map(tier => {
                      const isSelected = plannerState.budgetTier === tier.tier;
                      return (
                        <div
                          key={tier.tier}
                          onClick={() => setBudgetTier(tier.tier)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                              : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-900">{tier.title}</span>
                              {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                            </div>
                            <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{tier.desc}</p>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-800">
                            {tier.approxDaily}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: END POINT */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 7 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    <span>Where will your trip conclude?</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    The final day’s timeline will incorporate your return journey segment to this city.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setEndPoint('Return to starting point')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      plannerState.endPoint.includes('Return to starting point')
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        Return to Starting Point ({plannerState.startingPoint})
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Most common for round-trip road trips and self-drive vehicles.
                      </span>
                    </div>
                    {plannerState.endPoint.includes('Return to starting point') && (
                      <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                    )}
                  </button>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <span className="text-xs font-bold text-stone-800 block">
                      Or conclude in a different city:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEndInput}
                        onChange={e => setCustomEndInput(e.target.value)}
                        placeholder="e.g., Bengaluru, Mangaluru, Goa..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customEndInput.trim()) {
                            setEndPoint(customEndInput.trim());
                          }
                        }}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Set End Point
                      </button>
                    </div>
                    {plannerState.endPoint !== 'Return to starting point' && (
                      <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                        Active End Destination: {plannerState.endPoint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: REVIEW & GENERATE */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Step 8 of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Review & Generate My Travel Plan</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Verify your trip parameters. Clicking generate will construct a dynamic day-by-day timeline.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Start Location</span>
                      <span className="font-bold text-stone-900">{plannerState.startingPoint}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Duration</span>
                      <span className="font-bold text-stone-900">{plannerState.durationDays} Days</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Transport</span>
                      <span className="font-bold text-stone-900">{plannerState.transport}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Travelers</span>
                      <span className="font-bold text-stone-900">{plannerState.travelersCount} People ({plannerState.budgetTier})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1.5">
                      Selected Districts ({plannerState.selectedDistricts.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {plannerState.selectedDistricts.map(dId => {
                        const dist = KARNATAKA_DISTRICTS.find(d => d.id === dId);
                        return (
                          <span
                            key={dId}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-900 font-semibold text-[11px]"
                          >
                            {dist?.name || dId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1.5">
                      Prioritized Interests ({plannerState.interests.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {plannerState.interests.map(i => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[10px] font-medium"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-stone-600">
                    <span>Concluding at: <strong>{plannerState.endPoint}</strong></span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Edit selections
                    </button>
                  </div>
                </div>

                {/* Big Generate Button */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGeneratePlan}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating Your Karnataka Roadmap & Timeline...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-200" />
                        <span>Generate My Travel Plan</span>
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 8 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
