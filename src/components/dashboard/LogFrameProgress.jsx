import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitCommit, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  ListFilter,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  FileSearch,
  Sparkles
} from 'lucide-react';

export const LogFrameProgress = () => {
  const { kpis, tasks, progressMetrics, setActiveTab } = useApp();
  const { categoryStats } = progressMetrics;
  const [expandedCategory, setExpandedCategory] = useState('outcome'); // default expanded

  const categories = [
    {
      key: 'goal',
      label: '1. GOAL (Dampak Jangka Panjang)',
      narrative: 'Terjaganya keberlanjutan pendanaan program sosial, pendidikan (Adik Asuh), dan dakwah lembaga.',
      kpiText: 'Churn rate donatur rutin turun dari 30% ke 10% dalam 1 tahun & volume donasi stabil/meningkat 20%.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      barColor: 'bg-indigo-600',
      evidence: 'Laporan Keuangan Tahunan & Dashboard Database Donatur',
      assumptionsRisks: 'Tujuan akhir, asumsi makro stabil.',
      stats: categoryStats.goal || { total: 1, completed: 0, percent: 15 }
    },
    {
      key: 'outcome',
      label: '2. OUTCOME (Hasil & Trust Donatur)',
      narrative: 'Meningkatnya kepercayaan (trust) dan kemudahan berdonasi bagi donatur aktif maupun pasif.',
      kpiText: '60% donatur pasif kembali berdonasi pasca Impact Report & 1.000 donatur beralih ke auto-debet Sedekah Subuh.',
      badgeColor: 'bg-brand-50 text-brand-700 border-brand-200',
      barColor: 'bg-brand-600',
      evidence: 'Analisis data recovery dari CRM & data transaksi auto-debet',
      assumptionsRisks: 'Asumsi: Ekonomi kelas menengah relatif stabil. Risiko: Sentimen negatif media nasional.',
      stats: categoryStats.outcome
    },
    {
      key: 'output',
      label: '3. OUTPUT (Inovasi Fitur & Laporan R&D)',
      narrative: 'Inovasi sistem pelayanan donasi minim friction dan laporan emosional yang dihasilkan R&D.',
      kpiText: 'Rilis fitur donasi langganan di platform digital & tersusunnya Personalized Impact Report Wali Asuh (foto/rapor anak).',
      badgeColor: 'bg-growth-50 text-growth-700 border-growth-200',
      barColor: 'bg-growth-500',
      evidence: 'Tautan aplikasi fitur baru & dokumen template pelaporan Wali Asuh',
      assumptionsRisks: 'Asumsi: Tim IT mampu mengeksekusi rancangan platform dari R&D tepat waktu.',
      stats: categoryStats.output
    },
    {
      key: 'activity',
      label: '4. ACTIVITIES (Aktivitas Riset Lapangan)',
      narrative: 'Kegiatan taktis diagnosis root cause dan evaluasi donor journey yang dilakukan R&D.',
      kpiText: 'Survei churn rate ke 100 donatur pasif & re-desain alur komunikasi Wali Asuh (storytelling vs sekadar tagihan).',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      barColor: 'bg-amber-500',
      evidence: 'Rekap database survei, rekaman panggilan donatur, & notulensi workshop',
      assumptionsRisks: 'Asumsi: Tim Fundraising/CS kooperatif memberikan data kontak donatur.',
      stats: categoryStats.activity
    }
  ];

  const toggleExpand = (catKey) => {
    setExpandedCategory(expandedCategory === catKey ? null : catKey);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-growth-50 text-growth-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Logical Framework (LogFrame): Program Pemulihan & Retensi Donatur
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rantai nilai logis: Goal ➔ Outcome ➔ Output ➔ Activities terhubung langsung ke tugas operasional
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('agenda')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 self-start sm:self-auto"
        >
          <span>Agenda Tugas Terkait</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bars Stack */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.key;
          const catKpis = kpis.filter((k) => k.category === cat.key);
          const catTasks = tasks.filter((t) => t.category === cat.key);

          return (
            <div
              key={cat.key}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'border-brand-300 bg-slate-50/60 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Category Header Bar */}
              <div 
                onClick={() => toggleExpand(cat.key)}
                className="p-4 cursor-pointer select-none"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-900">
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-900">
                      {cat.stats.percent}%
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${cat.barColor}`}
                    style={{ width: `${Math.min(100, Math.max(8, cat.stats.percent))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span className="line-clamp-1">{cat.narrative}</span>
                  <span className="font-semibold whitespace-nowrap ml-2 text-slate-700">
                    {cat.stats.completed} dari {cat.stats.total} tugas selesai
                  </span>
                </div>
              </div>

              {/* Expanded Breakdown: Indicators, Verification, Assumptions, and Linked Tasks */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200/60 space-y-3.5">
                  
                  {/* Indicators & Verification from Image 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-1.5 text-brand-700 font-bold text-[11px] uppercase tracking-wider mb-1">
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>Indikator Capaian (KPI) & Pembuktian:</span>
                      </div>
                      <p className="text-slate-800 font-medium text-[11px] leading-relaxed">
                        {cat.kpiText}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <strong>Sumber Bukti:</strong> {cat.evidence}
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/70">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px] uppercase tracking-wider mb-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Asumsi & Risiko:</span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        {cat.assumptionsRisks}
                      </p>
                    </div>
                  </div>

                  {/* Linked KPIs & Active Tasks */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Indikator Spesifik & Checklist Tugas Terkait:
                    </p>

                    <div className="space-y-2.5">
                      {catKpis.map((kpi) => {
                        const linkedTasks = tasks.filter((t) => t.kpi_id === kpi.id);
                        const completedLinked = linkedTasks.filter((t) => t.is_completed).length;
                        const kpiPercent = linkedTasks.length > 0 
                          ? Math.round((completedLinked / linkedTasks.length) * 100) 
                          : 0;

                        return (
                          <div key={kpi.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {kpi.code}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-800">{kpi.title}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">{kpi.description}</p>
                              </div>
                              <span className="text-xs font-bold text-slate-700 flex-shrink-0">
                                {kpiPercent}%
                              </span>
                            </div>

                            {/* Mini Progress */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                                style={{ width: `${kpiPercent}%` }}
                              />
                            </div>

                            {/* Linked Tasks List */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                              {linkedTasks.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic">Tidak ada tugas terhubung secara langsung.</p>
                              ) : (
                                linkedTasks.map((task) => (
                                  <div key={task.id} className="flex items-center gap-2 text-[11px]">
                                    {task.is_completed ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-growth-600 flex-shrink-0" />
                                    ) : (
                                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    )}
                                    <span className={task.is_completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                                      {task.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                                      {task.due_date}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
