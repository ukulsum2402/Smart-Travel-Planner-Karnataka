import React from 'react';
import { BudgetEstimate } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Car, Hotel, Utensils, Compass, ShieldAlert, IndianRupee } from 'lucide-react';

interface Props {
  budget: BudgetEstimate;
  travelersCount: number;
}

const COLORS = ['#059669', '#0284c7', '#d97706', '#8b5cf6', '#64748b'];

export const BudgetBreakdown: React.FC<Props> = ({ budget, travelersCount }) => {
  const chartData = [
    { name: 'Transport', value: budget.transportCost, icon: Car },
    { name: 'Accommodation', value: budget.accommodationCost, icon: Hotel },
    { name: 'Food & Dining', value: budget.foodCost, icon: Utensils },
    { name: 'Activities & Entry', value: budget.activitiesCost, icon: Compass },
    { name: 'Misc & Buffer', value: budget.miscellaneousCost, icon: ShieldAlert },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <span>Estimated Trip Budget</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Calculated for {travelersCount} {travelersCount > 1 ? 'travelers' : 'traveler'} (Estimated realistic expenses)
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-100 rounded-xl px-4 py-2.5">
          <div className="text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Total Estimate
            </span>
            <span className="text-2xl font-black text-emerald-950">
              ₹{budget.totalCost.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-8 w-px bg-emerald-200/80" />
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Per Person
            </span>
            <span className="text-lg font-bold text-emerald-900">
              ₹{budget.perPersonCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
        {/* Recharts Donut */}
        <div className="md:col-span-5 h-56 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Estimate']}
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Items List */}
        <div className="md:col-span-7 space-y-2.5">
          {chartData.map((item, idx) => {
            const Icon = item.icon;
            const percentage = Math.round((item.value / budget.totalCost) * 100) || 0;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200/60"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-stone-800 block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {percentage}% of overall trip
                    </span>
                  </div>
                </div>

                <div className="text-right font-semibold text-stone-900 text-sm">
                  ₹{item.value.toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
