import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_INTERESTS } from '../data/interests';
import { ImageAttributionBadge } from '../components/common/ImageAttributionBadge';
import {
  Sparkles,
  ArrowRight,
  Search,
  MapPin,
  Compass,
  Calendar,
  CheckCircle2,
  Mountain,
  Heart,
  ShieldCheck,
  Trees,
  Footprints,
  Waves,
  Landmark,
  Utensils,
  Camera,
  Coffee,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDestinations = KARNATAKA_DESTINATIONS.filter(d => d.isFeatured).slice(0, 6);
  const hiddenGems = KARNATAKA_DESTINATIONS.filter(d => d.isHiddenGem).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center text-white overflow-hidden">
        {/* Real Karnataka Western Ghats & Coffee Hills Hero Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1920&q=85"
            alt="Karnataka Western Ghats and Coffee Hills"
            className="w-full h-full object-cover object-center scale-105 transform animate-in fade-in duration-700"
          />
          {/* Nature deep forest green gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Subtle Verified Real Media Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discover Karnataka • 31 Districts • Authentic Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Explore Karnataka.<br />
            <span className="text-emerald-400">Plan Your Journey.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-stone-200/90 max-w-2xl mx-auto leading-relaxed">
            Discover beautiful places, hidden gems and personalized travel experiences across Karnataka. Build a trip that matches your interests, time, budget and travel style.
          </p>

          {/* Search Box Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <div className="pl-3 text-stone-400">
              <Search className="w-5 h-5 text-emerald-700" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Mullayanagiri, Abbey Falls, Hampi, Gokarna..."
              className="flex-1 bg-transparent border-none text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm font-medium focus:outline-hidden py-2"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
            >
              Explore
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/plan-trip"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-200" />
              <span>Plan My Trip</span>
            </Link>

            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all"
            >
              <span>Explore Karnataka</span>
            </Link>
          </div>
        </div>

        {/* Real photo credit badge */}
        <div className="absolute bottom-4 right-4 z-10 hidden sm:block">
          <div className="text-[10px] text-white/70 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            Photo: Western Ghats Coffee Slopes • CC BY-SA
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Must-Visit Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Featured Destinations
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
              Verified real photographs of Karnataka’s most celebrated landscapes and monuments.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredDestinations.map(dest => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Destination Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={dest.image.imageUrl}
                  alt={dest.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-stone-900/80 backdrop-blur-md text-white font-medium text-[11px] px-2.5 py-1 rounded-lg border border-white/10">
                    {dest.districtName}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <ImageAttributionBadge metadata={dest.image} dark />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {dest.categories.slice(0, 2).map(cat => (
                      <span
                        key={cat}
                        className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"
                      >
                        {cat}
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
                  <span className="text-[11px] text-stone-400 font-medium">
                    Best: {dest.bestMonths[0]} – {dest.bestMonths[dest.bestMonths.length - 1]}
                  </span>

                  <Link
                    to={`/destination/${dest.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>Explore Place</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE BY EXPERIENCE */}
      <section className="py-16 bg-stone-100/70 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Personalized Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Explore by Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
              Select what moves you — our smart trip engine tailors recommendations to your passions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {KARNATAKA_INTERESTS.slice(0, 14).map(interest => (
              <Link
                key={interest.id}
                to={`/explore?category=${interest.id}`}
                className="group bg-white rounded-xl sm:rounded-2xl p-4 border border-stone-200/80 text-center hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors">
                  {interest.id === 'Nature' && <Trees className="w-5 h-5" />}
                  {interest.id === 'Trekking' && <Footprints className="w-5 h-5" />}
                  {interest.id === 'Adventure' && <Compass className="w-5 h-5" />}
                  {interest.id === 'Beaches' && <Waves className="w-5 h-5" />}
                  {interest.id === 'History' && <Landmark className="w-5 h-5" />}
                  {interest.id === 'Heritage' && <Landmark className="w-5 h-5" />}
                  {interest.id === 'Food' && <Utensils className="w-5 h-5" />}
                  {interest.id === 'Photography' && <Camera className="w-5 h-5" />}
                  {interest.id === 'Relaxation' && <Coffee className="w-5 h-5" />}
                  {interest.id === 'Viewpoints' && <Mountain className="w-5 h-5" />}
                  {!['Nature', 'Trekking', 'Adventure', 'Beaches', 'History', 'Heritage', 'Food', 'Photography', 'Relaxation', 'Viewpoints'].includes(interest.id) && (
                    <Compass className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-700">
                  {interest.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HIDDEN GEMS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Off The Beaten Path</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Karnataka Hidden Gems
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Untouched karst monoliths, submerged Gothic ruins, and secluded shola cascades.
            </p>
          </div>

          <Link
            to="/explore?hidden=true"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Hidden Gems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hiddenGems.map(gem => (
            <Link
              key={gem.id}
              to={`/destination/${gem.slug}`}
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={gem.image.imageUrl}
                  alt={gem.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Hidden Gem
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <ImageAttributionBadge metadata={gem.image} dark />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 block mb-1">
                    {gem.districtName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {gem.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {gem.shortDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span>Explore gem details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-20 bg-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Effortless Travel Planning
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              How The Smart Trip Planner Works
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-2">
              From your starting city to an optimized day-by-day timeline in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Starting Point',
                desc: 'Start from Mangaluru, Bengaluru, Mysuru, Hubballi, or any custom Karnataka town.',
              },
              {
                step: '02',
                title: 'Select Districts & Interests',
                desc: 'Pick single or multi-districts and your passions (Trekking, Waterfalls, Heritage, Cuisine).',
              },
              {
                step: '03',
                title: 'Set Budget & Transport',
                desc: 'Specify number of travel days, group size, car/bike/bus mode, and budget preference.',
              },
              {
                step: '04',
                title: 'Receive Dynamic Timeline',
                desc: 'Generate a day-by-day chronological roadmap with meals, stops, stays, and budget estimates.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-6 backdrop-blur-sm"
              >
                <span className="text-3xl font-black text-emerald-400 font-mono block mb-3">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-xl hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <span>Launch Travel Planner</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY USE KARNATAKA TRAVEL GUIDE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Craftsmanship & Precision
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                Why Use Karnataka Travel Guide?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Unlike generic static travel blogs or one-size-fits-all travel packages, our system generates custom plans grounded in real geography.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Strict District & Interest Respect', desc: 'If you pick Kodagu and Chikkamagaluru, only destinations from those districts are recommended.' },
                { title: 'Multi-District Feasibility', desc: 'Smart route sequencing connecting Mangaluru, Western Ghats, and the Coastal belt without back-tracking.' },
                { title: 'Integrated Regional Dining', desc: 'Real Kodava pandi curry, Udupi sattvic feasts, and Mangalorean ghee roast recommended along the way.' },
                { title: 'Interactive Leaflet Roadmap', desc: 'Explore each day’s waypoints on a responsive map powered by OpenStreetMap.' },
                { title: 'Verified Wikipedia Photography', desc: 'Every place features actual photographs credited with CC BY-SA licenses.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1600100397608-f010f443b745?auto=format&fit=crop&w=1200&q=80"
                alt="Mysore Palace Karnataka Heritage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-mono font-bold text-emerald-300">UNESCO & ROYAL HERITAGE</span>
                <p className="text-lg font-bold">Mysore Palace (Amba Vilas)</p>
                <p className="text-xs text-stone-300 mt-1">Illuminated with 97,000 golden bulbs every Sunday evening.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 bg-stone-900 text-white text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center mx-auto text-white shadow-lg">
            <Compass className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Your Karnataka adventure starts here.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Ready to experience the misty coffee hills, ancient stone chariots, and tranquil beaches? Generate your personalized itinerary in under two minutes.
          </p>

          <div className="pt-2">
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Create My Travel Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
