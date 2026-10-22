import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { categorizeFromTags } from '../../lib/categorizer';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  FileText,
  Save,
  X
} from 'lucide-react';
import { formatIndonesianDate } from '../../lib/whatsapp';

// Dynamic Month Calendar Week Generator
// Generates weeks for any year and month with Monday-based calendar weeks
export const getMonthWeeks = (year, monthIndex) => {
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthName = monthNamesShort[monthIndex];
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const weeks = [];
  
  let currentStart = 1;
  let weekNum = 1;
  
  while (currentStart <= lastDay) {
    const startDate = new Date(year, monthIndex, currentStart);
    // Sunday is 0, Monday is 1, ..., Saturday is 6
    const dayOfWeek = startDate.getDay();
    // Distance to next Sunday (Sunday closes the weekly cycle)
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    let currentEnd = currentStart + daysToSunday;
    if (currentEnd > lastDay) {
      currentEnd = lastDay;
    }
    
    // Check if today falls in this week in realtime
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex;
    const isCurrent = isCurrentMonth && now.getDate() >= currentStart && now.getDate() <= currentEnd;
    
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const startStr = `${year}-${mStr}-${String(currentStart).padStart(2, '0')}`;
    const endStr = `${year}-${mStr}-${String(currentEnd).padStart(2, '0')}`;
    
    weeks.push({
      num: weekNum,
      label: `Minggu ${weekNum}`,
      range: `${currentStart} - ${currentEnd} ${monthName} ${year}`,
      startDate: startStr,
      endDate: endStr,
      startDay: currentStart,
      endDay: currentEnd,
      current: isCurrent
    });
    
    weekNum++;
    currentStart = currentEnd + 1;
  }
  return weeks;
};

export const WeeklyJournal = () => {
  const { 
    journalEntries, 
    addJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry, 
    tasks, 
    userProfile,
    showToast 
  } = useApp();

  // Current system date
  const now = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(() => now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => now.getMonth());

  // Dynamic Month Key (e.g. '2026-10')
  const selectedMonthKey = useMemo(() => {
    return `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
  }, [selectedYear, selectedMonthIndex]);

  // Dynamically generated weeks based on real calendar days
  const weeksList = useMemo(() => {
    return getMonthWeeks(selectedYear, selectedMonthIndex);
  }, [selectedYear, selectedMonthIndex]);

  // Find the realtime active week (if viewing current month) or default to week 1
  const initialActiveWeekNum = useMemo(() => {
    const active = weeksList.find((w) => w.current);
    return active ? active.num : 1;
  }, [weeksList]);

  const [selectedWeek, setSelectedWeek] = useState(initialActiveWeekNum);

  // When month changes, adjust selectedWeek to active week or week 1
  useEffect(() => {
    const active = weeksList.find((w) => w.current);
    setSelectedWeek(active ? active.num : 1);
  }, [selectedMonthKey, weeksList]);

  const activeWeekObj = useMemo(() => {
    return weeksList.find((w) => w.num === selectedWeek) || weeksList[0];
  }, [weeksList, selectedWeek]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formEntry, setFormEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    day_name: new Date().toLocaleDateString('id-ID', { weekday: 'long' }),
    week_number: initialActiveWeekNum,
    month_key: selectedMonthKey,
    hours_worked: 7.5,
    summary: '',
    notes: '',
    tags: 'R&D, Analisis',
    is_completed: true
  });

  // Filter entries for selected week (matches by date range or fallback week number)
  const weekEntries = useMemo(() => {
    if (!activeWeekObj) return [];
    return journalEntries
      .filter((j) => {
        if (j.date) {
          return j.date >= activeWeekObj.startDate && j.date <= activeWeekObj.endDate;
        }
        return j.week_number === selectedWeek && (j.month_key === selectedMonthKey || !j.month_key);
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [journalEntries, activeWeekObj, selectedWeek, selectedMonthKey]);

  // Aggregate stats for this week
  const weekStats = useMemo(() => {
    const totalHours = weekEntries.reduce((sum, e) => sum + (parseFloat(e.hours_worked) || 0), 0);
    const daysLogged = weekEntries.length;
    const capacityHours = (userProfile?.daily_working_hours || 8) * 5; // 5 working days
    return {
      totalHours,
      daysLogged,
      capacityHours,
      utilizationRate: Math.round((totalHours / capacityHours) * 100)
    };
  }, [weekEntries, userProfile]);

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedYear((prev) => prev - 1);
      setSelectedMonthIndex(11);
    } else {
      setSelectedMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedYear((prev) => prev + 1);
      setSelectedMonthIndex(0);
    } else {
      setSelectedMonthIndex((prev) => prev + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    const curNow = new Date();
    setSelectedYear(curNow.getFullYear());
    setSelectedMonthIndex(curNow.getMonth());
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    const todayStr = new Date().toISOString().split('T')[0];
    const initialDate = (todayStr >= activeWeekObj?.startDate && todayStr <= activeWeekObj?.endDate)
      ? todayStr
      : activeWeekObj?.startDate || todayStr;
    const dateObj = new Date(initialDate);
    const day = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });

    setFormEntry({
      date: initialDate,
      day_name: day,
      week_number: selectedWeek,
      month_key: selectedMonthKey,
      hours_worked: 7.5,
      summary: '',
      notes: '',
      tags: 'Analisis, Retensi',
      is_completed: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setFormEntry({
      date: entry.date,
      day_name: entry.day_name,
      week_number: entry.week_number || selectedWeek,
      month_key: entry.month_key || selectedMonthKey,
      hours_worked: entry.hours_worked,
      summary: entry.summary,
      notes: entry.notes || '',
      tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''),
      is_completed: entry.is_completed !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formEntry.summary.trim()) {
      showToast('Ringkasan kerjaan harian wajib diisi', 'error');
      return;
    }

    // Determine week number based on date
    let derivedWeekNum = selectedWeek;
    const matchingWeek = weeksList.find((w) => formEntry.date >= w.startDate && formEntry.date <= w.endDate);
    if (matchingWeek) {
      derivedWeekNum = matchingWeek.num;
    }

    const payload = {
      ...formEntry,
      week_number: derivedWeekNum,
      month_key: formEntry.date.slice(0, 7),
      tags: formEntry.tags ? formEntry.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    };

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, payload);
    } else {
      addJournalEntry(payload);
    }

    setIsModalOpen(false);
  };

  const monthNamesLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const isViewingCurrentMonth = now.getFullYear() === selectedYear && now.getMonth() === selectedMonthIndex;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60">
                <BookOpen className="w-4 h-4 text-brand-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-teal-950 font-heading">
                Jurnal
              </h1>
            </div>
            <p className="text-xs text-teal-700 mt-1">
              Dokumentasi aktivitas riset, wawancara donatur, dan catatan harian terstruktur per minggu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Jurnal Hari Ini</span>
            </button>
          </div>
        </div>

        {/* Realtime Calendar Month Navigation */}
        <div className="mt-4 pt-4 border-t border-teal-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200/80 transition"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-bold text-teal-950 px-2">
              {monthNamesLong[selectedMonthIndex]} {selectedYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200/80 transition"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isViewingCurrentMonth && (
              <button
                onClick={handleResetToCurrentMonth}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200/70 transition ml-1"
              >
                Kembali ke Bulan Ini
              </button>
            )}
          </div>

          <div className="text-xs text-teal-800">
            Total {weeksList.length} Minggu Kalender
          </div>
        </div>

        {/* Dynamic Weekly Selector Tabs with Realtime 'Minggu Ini' Badge */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {weeksList.map((w) => {
            const isSelected = selectedWeek === w.num;
            return (
              <button
                key={w.num}
                onClick={() => setSelectedWeek(w.num)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex flex-col items-start ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-teal-900 hover:bg-teal-50/70 border border-teal-200/70'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{w.label}</span>
                  {w.current && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected 
                        ? 'bg-brand-700 text-white' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      Minggu Ini
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-brand-100' : 'text-teal-600'}`}>
                  {w.range}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-700">Total Waktu {activeWeekObj?.label}</span>
            <p className="text-xl font-extrabold text-teal-950 font-heading mt-0.5">
              {weekStats.totalHours.toFixed(1)} Jam
            </p>
            <span className="text-[11px] text-teal-600">dari alokasi {weekStats.capacityHours} Jam</span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-brand-600 border border-teal-200/70">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-700">Hari Kerja Terdokumentasi</span>
            <p className="text-xl font-extrabold text-emerald-700 font-heading mt-0.5">
              {weekStats.daysLogged} Hari
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold">Tercatat di Jurnal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/70">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-700">Pemanfaatan Kapasitas</span>
            <p className="text-xl font-extrabold text-teal-950 font-heading mt-0.5">
              {weekStats.utilizationRate}%
            </p>
            <span className="text-[11px] text-teal-600">Produktif Solo R&D</span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-brand-600 border border-teal-200/70">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Daily Entries Timeline / Cards */}
      <div className="space-y-4">
        {weekEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-teal-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-teal-950 font-heading">
              Belum ada catatan jurnal untuk {activeWeekObj?.label} ({activeWeekObj?.range})
            </h3>
            <p className="text-xs text-teal-700 mt-1 max-w-sm mx-auto">
              Dokumentasikan aktivitas harian Anda untuk merefleksikan progres riset dan insight donatur.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition border border-brand-200/60"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Catatan Harian Pertama</span>
            </button>
          </div>
        ) : (
          weekEntries.map((entry) => {
            // Find tasks associated or due on this date
            const dayTasks = tasks.filter((t) => t.due_date === entry.date);

            return (
              <div 
                key={entry.id}
                className="bg-white rounded-2xl border border-teal-200/80 p-5 shadow-xs hover:border-teal-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-teal-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-800 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{entry.day_name}</span>
                      <span className="text-base font-extrabold font-heading leading-none">
                        {entry.date ? entry.date.split('-')[2] : '16'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-teal-950 leading-snug">{entry.summary}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-teal-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-500" />
                          <span>{formatIndonesianDate(entry.date)}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-teal-800">
                          <Clock className="w-3 h-3 text-brand-600" />
                          <span>{entry.hours_worked} Jam Kerja</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg text-teal-600 hover:text-teal-900 hover:bg-teal-50 transition"
                      title="Edit Jurnal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Hapus catatan jurnal ini?')) {
                          deleteJournalEntry(entry.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-teal-600 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes & Insight Details */}
                <div className="pt-3">
                  <p className="text-xs text-teal-900 leading-relaxed whitespace-pre-line">
                    {entry.notes}
                  </p>

                  {/* Tasks on that day */}
                  {dayTasks.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-xl bg-teal-50/50 border border-teal-200/70 text-xs">
                      <span className="text-[10px] uppercase font-bold text-teal-700 block mb-1.5">
                        Agenda Tugas Terkait Hari Ini:
                      </span>
                      <div className="space-y-1">
                        {dayTasks.map((t) => (
                          <div key={t.id} className="flex items-center gap-2 text-[11px]">
                            {t.is_completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                            )}
                            <span className={t.is_completed ? 'line-through text-teal-500' : 'text-teal-950 font-medium'}>
                              {t.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-teal-50">
                      {entry.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
                          <Tag className="w-2.5 h-2.5 text-teal-500" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Journal Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-teal-200 shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-teal-50/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="font-heading font-bold text-base text-teal-950">
                  {editingEntry ? 'Edit Catatan Jurnal Harian' : 'Tulis Jurnal Kerja Harian'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-teal-600 hover:text-teal-900 hover:bg-teal-100/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Date & Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                    Tanggal Kerja *
                  </label>
                  <input
                    type="date"
                    required
                    value={formEntry.date}
                    onChange={(e) => {
                      const d = e.target.value;
                      const dateObj = new Date(d);
                      const day = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });
                      setFormEntry({ ...formEntry, date: d, day_name: day });
                    }}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-teal-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                    Durasi Kerja (Jam) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="16"
                    required
                    value={formEntry.hours_worked}
                    onChange={(e) => setFormEntry({ ...formEntry, hours_worked: parseFloat(e.target.value) || 7.5 })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-teal-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                  Judul / Fokus Kerja Hari Ini *
                </label>
                <input
                  type="text"
                  required
                  value={formEntry.summary}
                  onChange={(e) => setFormEntry({ ...formEntry, summary: e.target.value })}
                  placeholder="Contoh: Wawancara 10 Donatur Pasif & Analisis Penyebab Berhenti"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-teal-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                  Detail Catatan & Temuan Kunci Riset
                </label>
                <textarea
                  rows={4}
                  value={formEntry.notes}
                  onChange={(e) => setFormEntry({ ...formEntry, notes: e.target.value })}
                  placeholder="Tuliskan temuan penting, kendala lapangan, atau hipotesis yang tervalidasi hari ini..."
                  className="w-full text-xs p-3 rounded-xl border border-teal-200 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                  Tag / Topik (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formEntry.tags}
                  onChange={(e) => setFormEntry({ ...formEntry, tags: e.target.value })}
                  placeholder="Contoh: Analisis, Wawancara, Desain, Retensi"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-teal-200 focus:outline-none focus:border-brand-500"
                />
                <span className="text-[11px] text-teal-600 mt-1 block">
                  Ketik kata kunci seperti <code>analisis</code>, <code>survei</code>, <code>desain</code>, atau <code>retensi</code> untuk klasifikasi otomatis.
                </span>
              </div>

              {/* Status Toggle in Agenda */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-teal-200 bg-teal-50/70 cursor-pointer hover:bg-teal-100/60 transition select-none">
                <input
                  type="checkbox"
                  checked={formEntry.is_completed !== false}
                  onChange={(e) => setFormEntry({ ...formEntry, is_completed: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-teal-300 focus:ring-brand-500"
                />
                <span className="text-xs font-bold text-teal-950">
                  Tandai Langsung Selesai di Agenda (✅)
                </span>
              </label>

              <div className="pt-3 border-t border-teal-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition active:scale-95"
                >
                  Simpan Catatan Jurnal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
