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
        className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
          urgentTasks.length > 0 
            ? 'bg-rose-50/70 border-rose-200/80 hover:border-rose-300' 
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`p-2 rounded-xl text-xs ${
            urgentTasks.length > 0 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tenggat Dekat
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-heading ${
              urgentTasks.length > 0 ? 'text-rose-700' : 'text-slate-900'
            }`}>
              {urgentTasks.length}
            </span>
            <span className="text-xs text-slate-500">Tugas Hari Ini/Telat</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Audit & Wawancara Donatur</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>
      </div>

      {/* 2. Target Churn Rate */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-growth-50 text-growth-700">
            <TrendingDown className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Target Churn
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-growth-600 font-heading">
              10%
            </span>
            <span className="text-xs text-slate-500">dari baseline 30%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Penurunan 20% donatur berhenti
          </p>
        </div>
      </div>

      {/* 3. Inovasi Retensi Piloting */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-brand-50 text-brand-700">
            <Lightbulb className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Inovasi Uji Coba
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-heading">
              2 Produk
            </span>
            <span className="text-xs text-slate-500">/ Kuartal</span>
          </div>
          <p className="text-[11px] text-brand-600 font-semibold mt-1">
            Auto-Debet & Impact Report Personal
          </p>
        </div>
      </div>

      {/* 4. Target Kepuasan Donatur */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Star className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Target CSAT
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700 font-heading">
              &gt;8.5
            </span>
            <span className="text-xs text-slate-500">/ 10 Skala Kepuasan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Evaluasi transparansi penyaluran
          </p>
        </div>
      </div>

    </div>
  );
};
