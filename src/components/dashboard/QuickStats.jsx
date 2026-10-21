import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock4, 
  Smartphone, 
  Zap,
  ArrowRight,
  TrendingDown,
  Star,
  Lightbulb
} from 'lucide-react';

export const QuickStats = () => {
  const { tasks, progressMetrics, userProfile, setActiveTab, syncStatus } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate overdue or due today
  const urgentTasks = tasks.filter((t) => !t.is_completed && t.due_date <= todayStr);
  
  // Calculate remaining estimated hours
  const remainingHours = tasks
    .filter((t) => !t.is_completed)
    .reduce((sum, t) => sum + (parseFloat(t.estimated_hours) || 1.5), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Urgent / Today Tasks */}
      <div 
        onClick={() => setActiveTab('agenda')}
        className={`p-4 rounded-2xl border transition cursor-pointer shadow-xs ${
          urgentTasks.length > 0 
            ? 'bg-rose-50/80 border-rose-200 hover:border-rose-300' 
            : 'bg-white/95 border-teal-200/80 hover:border-teal-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`p-2 rounded-xl text-xs ${
            urgentTasks.length > 0 ? 'bg-rose-500 text-white' : 'bg-teal-50 text-teal-800'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Tenggat Dekat
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-heading ${
              urgentTasks.length > 0 ? 'text-rose-700' : 'text-teal-950'
            }`}>
              {urgentTasks.length}
            </span>
            <span className="text-xs text-teal-800/80">Tugas Hari Ini/Telat</span>
          </div>
          <p className="text-[11px] text-teal-700 mt-1 flex items-center gap-1">
            <span>Audit & Wawancara Donatur</span>
            <ArrowRight className="w-3 h-3 text-teal-600" />
          </p>
        </div>
      </div>

      {/* 2. Target Churn Rate */}
      <div className="bg-white/95 p-4 rounded-2xl border border-teal-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <TrendingDown className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Target Churn
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 font-heading">
              10%
            </span>
            <span className="text-xs text-teal-800/80">dari baseline 30%</span>
          </div>
          <p className="text-[11px] text-teal-700 mt-1">
            Penurunan 20% donatur berhenti
          </p>
        </div>
      </div>

      {/* 3. Inovasi Retensi Piloting */}
      <div className="bg-white/95 p-4 rounded-2xl border border-teal-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-teal-50 text-brand-700">
            <Lightbulb className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Inovasi Uji Coba
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-teal-950 font-heading">
              2 Produk
            </span>
            <span className="text-xs text-teal-800/80">/ Kuartal</span>
          </div>
          <p className="text-[11px] text-brand-700 font-semibold mt-1">
            Auto-Debet & Impact Report Personal
          </p>
        </div>
      </div>

      {/* 4. Target Kepuasan Donatur */}
      <div className="bg-white/95 p-4 rounded-2xl border border-teal-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Star className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Target CSAT
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700 font-heading">
              &gt;8.5
            </span>
            <span className="text-xs text-teal-800/80">/ 10 Skala Kepuasan</span>
          </div>
          <p className="text-[11px] text-teal-700 mt-1">
            Evaluasi transparansi penyaluran
          </p>
        </div>
      </div>

    </div>
  );
};
