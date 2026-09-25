import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Heart, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { KARNATAKA_DISTRICTS } from '../../data/districts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <TreePine className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Karnataka <span className="text-emerald-400">Travel Guide</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Discover the fabled land of sandalwood, coffee hills, UNESCO stone marvels, and Arabian Sea beaches. Dynamic, interest-driven multi-day itineraries designed specifically for genuine Karnataka explorers.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real verified destination photographs via Wikipedia & Wikimedia Commons</span>
            </div>
          </div>

          {/* Col 3: Popular Districts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Explore Districts
            </h4>
            <ul className="space-y-2 text-xs">
              {KARNATAKA_DISTRICTS.slice(0, 6).map(dist => (
                <li key={dist.id}>
                  <Link
                    to={`/district/${dist.slug}`}
                    className="text-stone-400 hover:text-emerald-400 transition-colors"
                  >
                    {dist.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Experiences */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/explore?category=Nature" className="hover:text-emerald-400">Nature & Western Ghats</Link></li>
              <li><Link to="/explore?category=Trekking" className="hover:text-emerald-400">Mountain Treks & Peaks</Link></li>
              <li><Link to="/explore?category=Heritage" className="hover:text-emerald-400">UNESCO World Heritage</Link></li>
              <li><Link to="/explore?category=Beaches" className="hover:text-emerald-400">Coastal Shacks & Islands</Link></li>
              <li><Link to="/explore?category=Food" className="hover:text-emerald-400">Regional Gastronomy</Link></li>
              <li><Link to="/explore?category=Spiritual" className="hover:text-emerald-400">Pilgrimage & Shrines</Link></li>
            </ul>
          </div>

          {/* Col 5: Smart Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Smart Planner
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/plan-trip" className="text-emerald-400 font-semibold hover:underline">Create New Travel Plan</Link></li>
              <li><Link to="/my-trips" className="hover:text-emerald-400">My Saved Trips</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400">Traveler Profile</Link></li>
              <li><span className="text-stone-500">FastAPI & PostgreSQL Ready</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Karnataka Travel Guide & Smart Trip Planner. Dedicated to Karnataka Tourism.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted with pride for Karnataka</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
