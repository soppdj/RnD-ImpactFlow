import React, { useState, useMemo } from 'react';
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

  const [selectedWeek, setSelectedWeek] = useState(3); // Default to Week 3 (current active week of Oct 2026)
  const [selectedMonthKey, setSelectedMonthKey] = useState('2026-10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formEntry, setFormEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    day_name: 'Jumat',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 7.5,
    summary: '',
    notes: '',
    tags: 'R&D, Analisis',
    is_completed: true
  });

  const weeksList = [
    { num: 1, label: 'Minggu 1', range: '1 - 4 Okt 2026' },
    { num: 2, label: 'Minggu 2', range: '5 - 11 Okt 2026' },
    { num: 3, label: 'Minggu 3', range: '12 - 18 Okt 2026', current: true },
    { num: 4, label: 'Minggu 4', range: '19 - 25 Okt 2026' },
    { num: 5, label: 'Minggu 5', range: '26 - 31 Okt 2026' }
  ];

  // Filter entries for selected week
  const weekEntries = useMemo(() => {
    return journalEntries
      .filter((j) => j.week_number === selectedWeek && (j.month_key === selectedMonthKey || !j.month_key))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [journalEntries, selectedWeek, selectedMonthKey]);

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

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormEntry({
      date: new Date().toISOString().split('T')[0],
      day_name: new Date().toLocaleDateString('id-ID', { weekday: 'long' }),
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
      week_number: entry.week_number,
      month_key: entry.month_key || '2026-10',
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

    const payload = {
      ...formEntry,
      tags: formEntry.tags ? formEntry.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    };

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, payload);
    } else {
      addJournalEntry(payload);
    }

    setIsModalOpen(false);
  };

  const liveCategory = useMemo(() => {
    return categorizeFromTags(formEntry.tags, formEntry.summary, formEntry.notes);
  }, [formEntry.tags, formEntry.summary, formEntry.notes]);

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

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Jurnal Hari Ini</span>
          </button>
        </div>

        {/* Weekly Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {weeksList.map((w) => (
            <button
              key={w.num}
              onClick={() => setSelectedWeek(w.num)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex flex-col items-start ${
                selectedWeek === w.num
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{w.label}</span>
                {w.current && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                    selectedWeek === w.num ? 'bg-brand-700 text-white' : 'bg-growth-100 text-growth-700'
                  }`}>
                    Minggu Ini
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${selectedWeek === w.num ? 'text-brand-100' : 'text-slate-400'}`}>
                {w.range}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Waktu Minggu Ini</span>
            <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">
              {weekStats.totalHours.toFixed(1)} Jam
            </p>
            <span className="text-[11px] text-slate-500">dari alokasi {weekStats.capacityHours} Jam</span>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Hari Kerja Terdokumentasi</span>
            <p className="text-xl font-extrabold text-growth-700 font-heading mt-0.5">
              {weekStats.daysLogged} Hari
            </p>
            <span className="text-[11px] text-growth-600 font-semibold">Tercatat di Jurnal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-growth-50 text-growth-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Pemanfaatan Kapasitas</span>
            <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">
              {weekStats.utilizationRate}%
            </p>
            <span className="text-[11px] text-slate-500">Produktif Solo R&D</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Daily Entries Timeline / Cards */}
      <div className="space-y-4">
        {weekEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-heading">
              Belum ada catatan jurnal untuk {weeksList.find(w => w.num === selectedWeek)?.label}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Dokumentasikan aktivitas harian Anda untuk merefleksikan progres riset dan insight donatur.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition"
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
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex flex-col items-center justify-center text-brand-700 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{entry.day_name}</span>
                      <span className="text-base font-extrabold font-heading leading-none">
                        {entry.date ? entry.date.split('-')[2] : '16'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{entry.summary}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatIndonesianDate(entry.date)}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes & Insight Details */}
                <div className="pt-3">
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {entry.notes}
                  </p>

                  {/* Tasks on that day */}
                  {dayTasks.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        Agenda Tugas Terkait Hari Ini:
                      </span>
                      <div className="space-y-1">
                        {dayTasks.map((t) => (
                          <div key={t.id} className="flex items-center gap-2 text-[11px]">
                            {t.is_completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-growth-600 flex-shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                            <span className={t.is_completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                              {t.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-50">
                      {entry.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
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
            className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {editingEntry ? 'Edit Catatan Jurnal Harian' : 'Tulis Jurnal Kerja Harian'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Date & Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul / Fokus Kerja Hari Ini *
                </label>
                <input
                  type="text"
                  required
                  value={formEntry.summary}
                  onChange={(e) => setFormEntry({ ...formEntry, summary: e.target.value })}
                  placeholder="Contoh: Wawancara 10 Donatur Pasif & Analisis Penyebab Berhenti"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detail Catatan & Temuan Kunci Riset
                </label>
                <textarea
                  rows={4}
                  value={formEntry.notes}
                  onChange={(e) => setFormEntry({ ...formEntry, notes: e.target.value })}
                  placeholder="Tuliskan temuan penting, kendala lapangan, atau hipotesis yang tervalidasi hari ini..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tag / Topik (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formEntry.tags}
                  onChange={(e) => setFormEntry({ ...formEntry, tags: e.target.value })}
                  placeholder="Contoh: Analisis, Wawancara, Desain, Retensi"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ketik kata kunci seperti <code>analisis</code>, <code>survei</code>, <code>desain</code>, atau <code>retensi</code> untuk klasifikasi otomatis.
                </span>
              </div>

              {/* Status Toggle in Agenda */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-100/60 transition select-none">
                <input
                  type="checkbox"
                  checked={formEntry.is_completed !== false}
                  onChange={(e) => setFormEntry({ ...formEntry, is_completed: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Tandai Langsung Selesai di Agenda (✅)
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition active:scale-95"
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
