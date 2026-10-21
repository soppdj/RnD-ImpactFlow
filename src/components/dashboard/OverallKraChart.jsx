import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, CheckCircle2, TrendingUp, Layers, Search, Lightbulb, BarChart3, Star } from 'lucide-react';

export const OverallKraChart = () => {
  const { progressMetrics } = useApp();
  const { weightedKRA, flatCompletionRate, kraCards, categoryStats } = progressMetrics;

  // Chart data: Completed vs Remaining (Affirmed Tosca Palette)
  const data = [
    { name: 'KRA Kinerja Tercapai', value: weightedKRA, color: '#0d9488' },
    { name: 'Dalam Proses / Sisa Target', value: Math.max(0, 100 - weightedKRA), color: '#ccfbf1' }
  ];

  // Performance status badge
  const getStatus = (score) => {
    if (score >= 80) return { label: 'Optimal / On Track', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { label: 'Progres Signifikan', color: 'text-teal-800 bg-teal-50 border-teal-200' };
    return { label: 'Perlu Akselerasi', color: 'text-amber-800 bg-amber-50 border-amber-200' };
  };

  const status = getStatus(weightedKRA);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-teal-500/30">
          <p className="font-semibold text-teal-300">{payload[0].name}</p>
          <p className="text-slate-200">{payload[0].value}% dari Target</p>
        </div>
      );
    }
    return null;
  };

  const kraIcons = {
    diagnosa: <Search className="w-3.5 h-3.5 text-teal-700" />,
    inovasi: <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />,
    efektivitas: <BarChart3 className="w-3.5 h-3.5 text-teal-600" />,
    evaluasi: <Star className="w-3.5 h-3.5 text-amber-500" />
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base text-teal-950">
              Overall KRA Score
            </h2>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-xs text-teal-700">
          Kinerja 4 Area Riset Penghimpunan & Retensi Donatur
        </p>
      </div>

      {/* Donut Chart with Centered KPI Percentage */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="w-48 h-48 sm:w-52 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-teal-950 tracking-tight font-heading">
            {weightedKRA}%
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mt-0.5">
            R&D Performance
          </span>
        </div>
      </div>

      {/* 4 KRA Area Progress Metrics */}
      <div className="space-y-2.5 pt-3 border-t border-teal-100">
        <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
          Capaian 4 Key Result Areas (KRA):
        </p>
        
        {kraCards && kraCards.map((kra) => (
          <div key={kra.key} className="bg-teal-50/50 p-2.5 rounded-xl border border-teal-200/70 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-950 truncate">
                {kraIcons[kra.key]}
                <span className="truncate">{kra.title}</span>
              </div>
              <span className="font-extrabold text-brand-700 text-[11px] flex-shrink-0">
                {kra.percent}%
              </span>
            </div>

            <div className="w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${kra.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1 text-[10px] text-teal-700">
              <span className="truncate max-w-[200px]" title={kra.target}>Target: {kra.target}</span>
              <span className="font-semibold text-teal-900 bg-white px-1.5 py-0.2 rounded border border-teal-200">
                {kra.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
