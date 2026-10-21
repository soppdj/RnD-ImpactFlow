import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Clock, Building2, Sparkles, TrendingUp, Calendar, HeartHandshake, ShieldCheck } from 'lucide-react';

export const HeaderBanner = () => {
  const { userProfile, progressMetrics } = useApp();

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-7 shadow-xs">
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-teal-100/70 to-emerald-100/60 rounded-full blur-3xl opacity-70 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        
        {/* Welcome & Target Kuartal Ini */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
              <Sparkles className="w-3 h-3 text-teal-600" />
              R&D Penghimpunan & Retensi Donatur
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70">
              <HeartHandshake className="w-3 h-3 text-emerald-600" />
              Target Churn: 30% ➔ 10%
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50/80 text-teal-800 border border-teal-200/70">
              <Calendar className="w-3 h-3 text-teal-600" />
              {today}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight font-heading">
            Selamat datang kembali, <span className="text-brand-600">{userProfile?.full_name || 'R&D Lead'}</span>
          </h1>

          {/* Subtitle: Target Bulan Ini (fetched from Supabase user_profile) */}
          <div className="mt-3 flex items-start gap-2.5 p-3 sm:p-3.5 bg-teal-50/60 rounded-xl border border-teal-200/80">
            <div className="p-1.5 bg-brand-600 text-white rounded-lg mt-0.5 flex-shrink-0 shadow-xs">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Target Bulan Ini (Fokus Sasaran Riset R&D)
              </p>
              <p className="text-sm font-semibold text-teal-950 mt-0.5 leading-relaxed">
                {userProfile?.monthly_target || userProfile?.quarterly_target || 'Target penelitian bulan ini belum disetel.'}
              </p>
            </div>
          </div>

          {/* Special Principle Callout */}
          <div className="mt-3.5 flex items-start sm:items-center gap-2.5 text-sm sm:text-base text-teal-950 bg-gradient-to-r from-teal-50/90 to-amber-50/80 px-4 py-3 rounded-xl border border-teal-200/90 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              <strong className="text-teal-950 font-bold">Prinsip KPI R&D:</strong> Performa diukur dari <em>kualitas riset</em>, <em>inovasi program retensi</em>, dan <em>akurasi solusi</em> <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">BUKAN jumlah donasi yang terkumpul</span>, <strong className="text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md font-bold underline decoration-amber-500">tapi WAJIB TAHU progres donasi!</strong>.
            </span>
          </div>
        </div>

        {/* Work Capacity & Quick KPI Pulse Card */}
        <div className="flex sm:flex-row md:flex-col gap-3 flex-shrink-0">
          <div className="flex-1 md:flex-initial bg-gradient-to-br from-teal-50/70 to-teal-100/50 p-3.5 rounded-xl border border-teal-200/80">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Kapasitas Kerja</span>
              </div>
              <span className="text-sm font-bold text-teal-950">
                {userProfile?.daily_working_hours || 8} Jam/Hari
              </span>
            </div>
            <p className="text-[11px] text-teal-700 mt-1">Solo R&D operational budget</p>
          </div>

          <div className="flex-1 md:flex-initial bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Total Selesai</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-800">
                {progressMetrics.completedTasks} / {progressMetrics.totalTasks} Tugas
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">
              {progressMetrics.flatCompletionRate}% deliverable terverifikasi
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
