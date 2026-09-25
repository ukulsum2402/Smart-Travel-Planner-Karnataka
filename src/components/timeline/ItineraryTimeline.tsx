import React, { useState } from 'react';
import { TripDay } from '../../types';
import { TimelineItemCard } from './TimelineItemCard';
import { Calendar, ArrowDown } from 'lucide-react';

interface Props {
  days: TripDay[];
  onFocusMap?: (coords: { lat: number; lng: number }) => void;
  activeDayFilter?: number | null;
  onSelectDayFilter?: (dayNumber: number | null) => void;
}

export const ItineraryTimeline: React.FC<Props> = ({
  days,
  onFocusMap,
  activeDayFilter = null,
  onSelectDayFilter,
}) => {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    // Expand all days by default
    const init: Record<number, boolean> = {};
    days.forEach(d => {
      init[d.dayNumber] = true;
    });
    return init;
  });

  const toggleDay = (dayNumber: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  const displayedDays =
    activeDayFilter !== null && activeDayFilter !== undefined
      ? days.filter(d => d.dayNumber === activeDayFilter)
      : days;

  return (
    <div className="space-y-8">
      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectDayFilter && onSelectDayFilter(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDayFilter === null
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All Days ({days.length})
        </button>

        {days.map(d => (
          <button
            key={d.dayNumber}
            type="button"
            onClick={() => onSelectDayFilter && onSelectDayFilter(d.dayNumber)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeDayFilter === d.dayNumber
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Day {d.dayNumber}: {d.districtName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Day Sections */}
      <div className="space-y-12">
        {displayedDays.map(day => {
          const isExpanded = expandedDays[day.dayNumber] ?? true;

          return (
            <div
              key={day.dayNumber}
              className="bg-stone-50/50 rounded-2xl border border-stone-200/90 p-4 sm:p-7 shadow-xs"
            >
              {/* Day Header */}
              <div
                onClick={() => toggleDay(day.dayNumber)}
                className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 cursor-pointer gap-2"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-emerald-700 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      DAY {day.dayNumber}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight uppercase">
                      {day.districtName}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                    {day.theme}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{day.items.length} Timeline Stops</span>
                </div>
              </div>

              {/* Day Summary */}
              <p className="text-xs sm:text-sm text-stone-600 my-4 bg-white/70 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
                {day.summary}
              </p>

              {/* Items Timeline */}
              {isExpanded && (
                <div className="mt-6 space-y-4 relative">
                  {day.items.map((item, index) => {
                    const isLastItem = index === day.items.length - 1;

                    return (
                      <div key={item.id} className="relative">
                        <TimelineItemCard item={item} onFocusMap={onFocusMap} />

                        {/* Downward connecting indicator */}
                        {!isLastItem && (
                          <div className="flex justify-center my-2 text-stone-400">
                            <div className="flex flex-col items-center">
                              <span className="w-0.5 h-3 bg-stone-300"></span>
                              <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
