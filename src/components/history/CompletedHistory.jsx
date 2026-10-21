import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Archive, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Layers, 
  FileText, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Printer,
  Sparkles
} from 'lucide-react';
import { formatIndonesianDate } from '../../lib/whatsapp';

export const CompletedHistory = () => {
  const { 
    tasks, 
    completedTasksByMonth, 
    selectedHistoryMonth, 
    setSelectedHistoryMonth,
    setActiveTab 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Month configurations
  const availableMonths = [
    { key: '2026-10', label: 'Oktober 2026', subtitle: 'Bulan Ini (Aktif)' },
    { key: '2026-09', label: 'September 2026', subtitle: 'Bulan Lalu' },
    { key: '2026-08', label: 'Agustus 2026', subtitle: '2 Bulan Lalu' }
  ];

  // Active month's completed tasks
  const rawMonthTasks = completedTasksByMonth[selectedHistoryMonth] || [];

  // Filtered by search and category
  const filteredTasks = useMemo(() => {
    return rawMonthTasks.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.completed_at || b.due_date) - new Date(a.completed_at || a.due_date));
  }, [rawMonthTasks, searchQuery, categoryFilter]);

  // Statistics for selected month
  const monthStats = useMemo(() => {
    const totalCount = rawMonthTasks.length;
    const totalHours = rawMonthTasks.reduce((sum, t) => sum + (parseFloat(t.estimated_hours) || 2), 0);
    const outcomes = rawMonthTasks.filter((t) => t.category === 'outcome').length;
    const outputs = rawMonthTasks.filter((t) => t.category === 'output').length;
    const activities = rawMonthTasks.filter((t) => t.category === 'activity').length;
    return { totalCount, totalHours, outcomes, outputs, activities };
  }, [rawMonthTasks]);

  const activeMonthLabel = availableMonths.find((m) => m.key === selectedHistoryMonth)?.label || selectedHistoryMonth;

  const categoryPills = {
    goal: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    outcome: 'bg-brand-50 text-brand-700 border-brand-200',
    output: 'bg-growth-50 text-growth-700 border-growth-200',
    activity: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-growth-50 text-growth-700">
                <Archive className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Histori Kegiatan Selesai (Arsip Per Bulan)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Klik bulan untuk melihat rekam jejak deliverable riset, durasi kerja, dan pencapaian sebelumnya
            </p>
          </div>

          <button
            onClick={() => setActiveTab('report')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Export Laporan Manajemen</span>
          </button>
        </div>

        {/* Interactive Month Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          {availableMonths.map((m) => {
            const count = (completedTasksByMonth[m.key] || []).length;
            const hours = (completedTasksByMonth[m.key] || []).reduce((sum, t) => sum + (parseFloat(t.estimated_hours) || 2), 0);
            const isSelected = selectedHistoryMonth === m.key;

            return (
              <div
                key={m.key}
                onClick={() => setSelectedHistoryMonth(m.key)}
                className={`p-4 rounded-xl border cursor-pointer transition select-none flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm ring-1 ring-brand-500'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-900">{m.label}</span>
                    {isSelected && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-brand-600 text-white">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.subtitle}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-base font-extrabold text-slate-900 font-heading block">
                    {count} Selesai
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {hours.toFixed(1)} Jam Riset
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Month Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Periode Terpilih</span>
          <p className="font-extrabold text-slate-900 text-sm mt-0.5">{activeMonthLabel}</p>
          <span className="text-[10px] text-slate-400">Rekap arsip otomatis</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Selesai</span>
          <p className="font-extrabold text-growth-700 text-sm mt-0.5">{monthStats.totalCount} Kegiatan</p>
          <span className="text-[10px] text-growth-600 font-semibold">100% Terverifikasi</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Waktu Riset</span>
          <p className="font-extrabold text-brand-600 text-sm mt-0.5">{monthStats.totalHours.toFixed(1)} Jam</p>
          <span className="text-[10px] text-slate-400">Jam kerja tercurah</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Distribusi LogFrame</span>
          <p className="font-semibold text-slate-800 text-xs mt-1">
            {monthStats.outcomes} OC • {monthStats.outputs} OP • {monthStats.activities} AC
          </p>
          <span className="text-[10px] text-slate-400">Outcome / Output / Activity</span>
        </div>
      </div>

      {/* Filter and Search Bar for Histori */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari deliverable di ${activeMonthLabel}...`}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Filter Level:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">Semua Level</option>
            <option value="outcome">Outcome (Dampak)</option>
            <option value="output">Output (Deliverable)</option>
            <option value="activity">Activity (Aktivitas)</option>
          </select>
        </div>

      </div>

      {/* Historical Completed Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-heading">
              Tidak ada arsip kegiatan di {activeMonthLabel}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ada deliverable yang selesai sesuai filter pencarian Anda.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 p-1.5 rounded-full bg-growth-50 text-growth-700 border border-growth-200 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-growth-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      categoryPills[task.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {task.category}
                    </span>

                    <span className="text-[10px] font-semibold text-slate-400">
                      ID: #{task.id.toString().substring(0, 8)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Selesai: {formatIndonesianDate(task.completed_at || task.due_date)}</span>
                    </span>

                    {task.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.estimated_hours} Jam Riset</span>
                      </span>
                    )}

                    <span className="text-growth-700 bg-growth-50 px-2 py-0.5 rounded border border-growth-200 text-[10px] font-bold">
                      ✓ Terarsip
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
