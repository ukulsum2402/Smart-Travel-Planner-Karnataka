import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { KARNATAKA_DISTRICTS } from '../data/districts';
import { KARNATAKA_INTERESTS } from '../data/interests';
import { destinationService } from '../services/destinationService';
import { Destination } from '../types';
import { ImageAttributionBadge } from '../components/common/ImageAttributionBadge';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Compass,
  Check,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialDistrict = searchParams.get('district') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialHidden = searchParams.get('hidden') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [onlyHiddenGems, setOnlyHiddenGems] = useState(initialHidden);
  const [destinationsList, setDestinationsList] = useState<Destination[]>(KARNATAKA_DESTINATIONS);

  useEffect(() => {
    destinationService.getDestinations().then(data => {
      if (data && data.length > 0) {
        setDestinationsList(data);
      }
    });
  }, []);

  // Sync state with URL params
  const updateUrl = (district: string, category: string, hidden: boolean, query: string) => {
    const params: Record<string, string> = {};
    if (query) params.search = query;
    if (district !== 'all') params.district = district;
    if (category !== 'all') params.category = category;
    if (hidden) params.hidden = 'true';
    setSearchParams(params);
  };

  const filteredDestinations = useMemo(() => {
    return destinationsList.filter(dest => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesDesc = dest.shortDescription.toLowerCase().includes(q) || dest.fullDescription.toLowerCase().includes(q);
        const matchesDistrict = dest.districtName.toLowerCase().includes(q);
        const matchesCat = dest.categories.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesDistrict && !matchesCat) {
          return false;
        }
      }

      // District filter
      if (selectedDistrict !== 'all') {
        if (dest.districtId !== selectedDistrict) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!dest.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Hidden gem filter
      if (onlyHiddenGems && !dest.isHiddenGem) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDistrict, selectedCategory, onlyHiddenGems]);

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Karnataka Explorer Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1">
            Destinations & Heritage
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Browse authentic places across Karnataka with verified photos from Wikipedia & Wikimedia Commons. Filter by district, travel interests, or hidden gems.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  updateUrl(selectedDistrict, selectedCategory, onlyHiddenGems, e.target.value);
                }}
                placeholder="Search by place name, district, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-emerald-600 transition-colors"
              />
            </div>

            {/* District Select */}
            <div className="sm:col-span-3">
              <select
                value={selectedDistrict}
                onChange={e => {
                  setSelectedDistrict(e.target.value);
                  updateUrl(e.target.value, selectedCategory, onlyHiddenGems, searchQuery);
                }}
                className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:outline-hidden focus:border-emerald-600 transition-colors cursor-pointer"
              >
                <option value="all">All Districts ({KARNATAKA_DISTRICTS.length})</option>
                {KARNATAKA_DISTRICTS.map(dist => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden Gems Checkbox Button */}
            <div className="sm:col-span-3 flex items-center">
              <button
                type="button"
                onClick={() => {
                  const next = !onlyHiddenGems;
                  setOnlyHiddenGems(next);
                  updateUrl(selectedDistrict, selectedCategory, next, searchQuery);
                }}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  onlyHiddenGems
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Hidden Gems Only</span>
                {onlyHiddenGems && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                updateUrl(selectedDistrict, 'all', onlyHiddenGems, searchQuery);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Categories
            </button>

            {KARNATAKA_INTERESTS.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  updateUrl(selectedDistrict, cat.id, onlyHiddenGems, searchQuery);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-stone-500">
            Showing <span className="text-stone-900">{filteredDestinations.length}</span> places
          </p>

          {(searchQuery || selectedDistrict !== 'all' || selectedCategory !== 'all' || onlyHiddenGems) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('all');
                setSelectedCategory('all');
                setOnlyHiddenGems(false);
                setSearchParams({});
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDestinations.map(dest => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Destination Real Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={dest.image.imageUrl}
                    alt={dest.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-stone-900/85 backdrop-blur-md text-white font-medium text-[11px] px-2.5 py-1 rounded-lg">
                      {dest.districtName}
                    </span>
                    {dest.isHiddenGem && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Hidden Gem
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <ImageAttributionBadge metadata={dest.image} dark />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {dest.categories.map(c => (
                        <span
                          key={c}
                          className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {dest.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                      {dest.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{dest.visitDuration}</span>
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        ★ {dest.rating || 4.8}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-400 font-medium">
                        {dest.entryFee ? 'Entry Fee Applies' : 'Free Entry'}
                      </span>

                      <Link
                        to={`/destination/${dest.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        <span>View Place Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <Compass className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No destinations match your filters</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, changing category pills, or selecting all districts.
            </p>
          </div>
        )}

        {/* Districts Section */}
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="max-w-xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Regional Gateways
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-1">
              Browse by District
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Explore all key districts with comprehensive travel profiles and authentic culinary heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {KARNATAKA_DISTRICTS.map(dist => (
              <Link
                key={dist.id}
                to={`/district/${dist.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-16/10 bg-stone-900 shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={dist.heroImage.imageUrl}
                  alt={dist.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {dist.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {dist.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-1">
                    {dist.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
