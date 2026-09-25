import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TravelStyle, BudgetTier } from '../types';
import { KARNATAKA_INTERESTS } from '../data/interests';
import { User, Sparkles, Check, Heart, Shield, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Karnataka Traveler');
  const [email, setEmail] = useState(user?.email || 'traveler@example.com');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(user?.travelStyle || 'Relaxed');
  const [budgetPref, setBudgetPref] = useState<BudgetTier>(user?.budgetPreference || 'Moderate');
  const [interests, setInterests] = useState<string[]>(user?.interests || ['Nature', 'Trekking', 'Food']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const travelStyles: TravelStyle[] = [
    'Relaxed',
    'Moderate',
    'Fast-Paced',
    'Adventure',
    'Backpacker',
    'Luxury',
    'Solo',
    'Family',
  ];

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      travelStyle,
      budgetPreference: budgetPref,
      interests,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Account & Traveler Persona
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Traveler Profile & Preferences
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your saved travel style and preferred categories shape personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          {/* User Details */}
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20"
            />
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-lg font-bold text-stone-900 border-b border-transparent focus:border-emerald-600 focus:outline-hidden w-full"
                placeholder="Your Name"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="text-xs text-stone-500 border-b border-transparent focus:border-emerald-600 focus:outline-hidden w-full"
                placeholder="Your Email"
              />
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Primary Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {travelStyles.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    travelStyle === style
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Preferred Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Budget', 'Moderate', 'Premium'] as BudgetTier[]).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudgetPref(tier)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    budgetPref === tier
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Interests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Favorite Interests
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {KARNATAKA_INTERESTS.map(int => {
                const isSelected = interests.includes(int.id);
                return (
                  <button
                    key={int.id}
                    type="button"
                    onClick={() => toggleInterest(int.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{int.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Profile preferences updated successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-stone-400">
                FastAPI JWT Authentication Ready
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
