import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Printer, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Search,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Star,
  Layers,
  Sparkles,
  Filter,
  CalendarRange
} from 'lucide-react';
import { formatIndonesianDate } from '../../lib/whatsapp';

export const ExportReport = () => {
  const { userProfile, kpis, tasks, progressMetrics, showToast } = useApp();

  // Filter Modes: 'month' | 'quarter' | 'custom'
  const [filterMode, setFilterMode] = useState('month');
  const [selectedMonthKey, setSelectedMonthKey] = useState('2026-10'); // '2026-10', '2026-09', etc.
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q4'); // '2026-Q4', '2026-Q3', etc.
  const [customStartMonth, setCustomStartMonth] = useState('2026-08');
  const [customEndMonth, setCustomEndMonth] = useState('2026-10');

  // Available options
  const monthOptions = [
    { key: '2026-10', label: 'Bulan Ini (Oktober 2026)', monthName: 'Oktober 2026' },
    { key: '2026-09', label: 'September 2026', monthName: 'September 2026' },
    { key: '2026-08', label: 'Agustus 2026', monthName: 'Agustus 2026' },
    { key: '2026-07', label: 'Juli 2026', monthName: 'Juli 2026' },
    { key: '2026-06', label: 'Juni 2026', monthName: 'Juni 2026' },
    { key: '2026-05', label: 'Mei 2026', monthName: 'Mei 2026' },
    { key: '2026-04', label: 'April 2026', monthName: 'April 2026' },
    { key: '2026-03', label: 'Maret 2026', monthName: 'Maret 2026' },
    { key: '2026-02', label: 'Februari 2026', monthName: 'Februari 2026' },
    { key: '2026-01', label: 'Januari 2026', monthName: 'Januari 2026' }
  ];

  const quarterOptions = [
    { key: '2026-Q4', label: 'Kuartal 4 (Q4 2026: Okt - Des)', name: 'Kuartal 4 (Q4 2026)', months: ['2026-10', '2026-11', '2026-12'] },
    { key: '2026-Q3', label: 'Kuartal 3 (Q3 2026: Jul - Sep)', name: 'Kuartal 3 (Q3 2026)', months: ['2026-07', '2026-08', '2026-09'] },
    { key: '2026-Q2', label: 'Kuartal 2 (Q2 2026: Apr - Jun)', name: 'Kuartal 2 (Q2 2026)', months: ['2026-04', '2026-05', '2026-06'] },
    { key: '2026-Q1', label: 'Kuartal 1 (Q1 2026: Jan - Mar)', name: 'Kuartal 1 (Q1 2026)', months: ['2026-01', '2026-02', '2026-03'] }
  ];

  // Helper to determine if a task matches the chosen period
  const isTaskInSelectedPeriod = (task) => {
    // Determine effective task date (completed_at date preferred, otherwise due_date or created_at)
    const dateStr = task.completed_at ? task.completed_at.slice(0, 10) : (task.due_date || task.created_at?.slice(0, 10));
    if (!dateStr) return false;
    const taskMonth = dateStr.slice(0, 7); // e.g. '2026-10'

    if (filterMode === 'month') {
      return taskMonth === selectedMonthKey;
    }
    if (filterMode === 'quarter') {
      const q = quarterOptions.find((opt) => opt.key === selectedQuarter);
      return q ? q.months.includes(taskMonth) : false;
    }
    if (filterMode === 'custom') {
      const start = customStartMonth <= customEndMonth ? customStartMonth : customEndMonth;
      const end = customStartMonth <= customEndMonth ? customEndMonth : customStartMonth;
      return taskMonth >= start && taskMonth <= end;
    }
    return true;
  };

  // Human-readable labels and metadata based on active period
  const periodInfo = useMemo(() => {
    if (filterMode === 'month') {
      const m = monthOptions.find((opt) => opt.key === selectedMonthKey) || monthOptions[0];
      const monthNum = selectedMonthKey.split('-')[1];
      return {
        label: m.monthName,
        code: `LAP-RD/RETENTION/${selectedMonthKey.split('-')[0]}/${monthNum}`,
        isCurrentMonth: selectedMonthKey === '2026-10',
        targetText: selectedMonthKey === '2026-10'
          ? (userProfile?.monthly_target || 'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)')
          : selectedMonthKey === '2026-09'
            ? 'September 2026: Audit Arsitektur Data Donatur, Evaluasi SROI Beasiswa, dan Riset Benchmarking Digital Recurring'
            : selectedMonthKey === '2026-08'
              ? 'Agustus 2026: Survei Kepuasan Mitra Komunitas & Analisis Efektivitas Drop-off Saluran Pembayaran Donasi'
              : `Sasaran R&D Periode ${m.monthName}`,
        defaultNotes: selectedMonthKey === '2026-10'
          ? 'Fokus R&D bulan ini diarahkan pada audit root cause penurunan donasi dan perancangan inovasi retensi. Melalui analisis database, ditemukan titik kritis drop-off donatur Adik Asuh karena minimnya laporan perkembangan anak (bukan semata faktor ekonomi). R&D merancang 2 inovasi: auto-debet Sedekah Subuh dan Personalized Impact Report Wali Asuh.'
          : selectedMonthKey === '2026-09'
            ? 'Fokus R&D bulan September diarahkan pada pembersihan duplikasi database donatur bersama tim Data Engineer, benchmarking model recurring donation pada 5 platform filantropi, dan kalkulasi SROI Program Beasiswa Adik Asuh. Seluruh 4 deliverable terverifikasi selesai 100%.'
            : selectedMonthKey === '2026-08'
              ? 'Fokus R&D bulan Agustus mencakup audit kepuasan mitra dakwah pedalaman di 12 desa pedalaman, analisis drop-off saluran pembayaran (menemukan kegagalan 18% akibat transaksi manual kode unik), serta penyusunan SOP Impact Storytelling etis.'
              : `Catatan evaluasi riset dan deliverable kinerja R&D untuk periode ${m.monthName}.`
      };
    }
    if (filterMode === 'quarter') {
      const q = quarterOptions.find((opt) => opt.key === selectedQuarter) || quarterOptions[0];
      const qCode = selectedQuarter.split('-')[1];
      return {
        label: q.name,
        code: `LAP-RD/RETENTION/2026/${qCode}`,
        isCurrentMonth: selectedQuarter === '2026-Q4',
        targetText: selectedQuarter === '2026-Q4'
          ? 'Kuartal 4 (Q4 2026): Program Integrasi Donor Retention & Pelaporan Transparan (Penurunan Churn 30% ke 10% & Implementasi Fitur Donasi Berlangganan)'
          : selectedQuarter === '2026-Q3'
            ? 'Kuartal 3 (Q3 2026): Penguatan Fondasi Data, Riset Kepuasan Mitra & Inisiasi Standarisasi Pelaporan Emosional'
            : `Sasaran Strategis LogFrame ${q.name}`,
        defaultNotes: selectedQuarter === '2026-Q4'
          ? 'Laporan capaian kuartal ke-4 memetakan transisi strategi retensi donatur menuju automasi digital dan pelaporan berkala berorientasi empati.'
          : selectedQuarter === '2026-Q3'
            ? 'Laporan komprehensif Q3 2026 mencakup hasil riset lapangan Juli-September: identifikasi friction transfer pembayaran, audit database donatur, serta formulasi metrik SROI.'
            : `Konsolidasi capaian LogFrame R&D untuk ${q.name}.`
      };
    }
    // Custom range
    const startObj = monthOptions.find((m) => m.key === customStartMonth) || { monthName: customStartMonth };
    const endObj = monthOptions.find((m) => m.key === customEndMonth) || { monthName: customEndMonth };
    return {
      label: `${startObj.monthName} - ${endObj.monthName}`,
      code: `LAP-RD/RETENTION/2026/CUSTOM`,
      isCurrentMonth: customEndMonth === '2026-10',
      targetText: `Konsolidasi Kinerja R&D Rentang Multi-Bulan (${startObj.monthName} s.d. ${endObj.monthName}): Riset Perilaku Donatur & Intervensi Retensi`,
      defaultNotes: `Laporan kustom terintegrasi merangkum seluruh deliverable dan aktivitas riset R&D yang diselesaikan pada periode ${startObj.monthName} hingga ${endObj.monthName}.`
    };
  }, [filterMode, selectedMonthKey, selectedQuarter, customStartMonth, customEndMonth, userProfile]);

  const [customNotes, setCustomNotes] = useState('');
  const executiveNotes = customNotes || periodInfo.defaultNotes;

  // Filter Tasks Strictly Matching the Selected Period
  const periodTasks = useMemo(() => {
    return tasks.filter((t) => isTaskInSelectedPeriod(t));
  }, [tasks, filterMode, selectedMonthKey, selectedQuarter, customStartMonth, customEndMonth]);

  const completedTasks = useMemo(() => {
    return periodTasks.filter((t) => t.is_completed);
  }, [periodTasks]);

  const pendingTasks = useMemo(() => {
    // For current active period, show uncompleted tasks
    // If viewing a past period (where all planned tasks were completed), show upcoming roadmap
    const uncompleted = periodTasks.filter((t) => !t.is_completed);
    if (uncompleted.length > 0) return uncompleted;
    return tasks.filter((t) => !t.is_completed);
  }, [periodTasks, tasks]);

  // Dynamic KRA and LogFrame Stats Strictly for the Selected Period
  const periodMetrics = useMemo(() => {
    const total = periodTasks.length;
    const completed = completedTasks.length;
    const totalHours = completedTasks.reduce((sum, t) => sum + (parseFloat(t.estimated_hours) || 2), 0);

    const categoryStats = {
      goal: { total: 0, completed: 0, percent: 100 },
      outcome: { total: 0, completed: 0, percent: 0 },
      output: { total: 0, completed: 0, percent: 0 },
      activity: { total: 0, completed: 0, percent: 0 },
    };

    periodTasks.forEach((t) => {
      const cat = t.category?.toLowerCase() || 'activity';
      if (categoryStats[cat]) {
        categoryStats[cat].total += 1;
        if (t.is_completed) categoryStats[cat].completed += 1;
      }
    });

    Object.keys(categoryStats).forEach((k) => {
      if (categoryStats[k].total > 0) {
        categoryStats[k].percent = Math.round((categoryStats[k].completed / categoryStats[k].total) * 100);
      } else {
        // If historical completed period without tasks in that specific sub-category, default to 100%
        categoryStats[k].percent = 100;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    return {
      total,
      completed,
      totalHours,
      completionRate,
      categoryStats
    };
  }, [periodTasks, completedTasks]);

  const handlePrintPdf = () => {
    showToast('Mempersiapkan pratinjau cetak PDF resmi NGO...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          ACTION HEADER & MULTI-MODE FILTER BAR (Hidden when printing via CSS @media print)
          ========================================================================= */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-brand-600 border border-teal-200/70">
                <FileText className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-teal-950 font-heading">
                Export Laporan Manajemen R&D
              </h1>
            </div>
            <p className="text-xs text-teal-700 mt-1">
              Pilih periode evaluasi (Bulan, Kuartal, atau Rentang Kustom) untuk rekap data terverifikasi
            </p>
          </div>

          {/* Prominent Export to PDF Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Export to PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Multi-Mode Filter Controls */}
        <div className="mt-4 pt-4 border-t border-teal-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Mode Selector Tabs (Bulan | Kuartal | Kustom) */}
          <div className="flex items-center gap-1.5 p-1 bg-teal-50/70 rounded-xl border border-teal-200/80 self-start">
            <button
              onClick={() => setFilterMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filterMode === 'month'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-teal-800 hover:bg-teal-100/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Per Bulan</span>
            </button>

            <button
              onClick={() => setFilterMode('quarter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filterMode === 'quarter'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-teal-800 hover:bg-teal-100/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Per Kuartal</span>
            </button>

            <button
              onClick={() => setFilterMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filterMode === 'custom'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-teal-800 hover:bg-teal-100/60'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Rentang Kustom</span>
            </button>
          </div>

          {/* Sub-Selector Dropdowns based on active Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {filterMode === 'month' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-teal-900">Pilih Bulan:</span>
                <select
                  value={selectedMonthKey}
                  onChange={(e) => {
                    setSelectedMonthKey(e.target.value);
                    setCustomNotes('');
                  }}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterMode === 'quarter' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-teal-900">Pilih Kuartal:</span>
                <select
                  value={selectedQuarter}
                  onChange={(e) => {
                    setSelectedQuarter(e.target.value);
                    setCustomNotes('');
                  }}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                >
                  {quarterOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterMode === 'custom' && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-teal-900">Dari:</span>
                  <select
                    value={customStartMonth}
                    onChange={(e) => {
                      setCustomStartMonth(e.target.value);
                      setCustomNotes('');
                    }}
                    className="text-xs font-semibold py-2 px-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                  >
                    {monthOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.monthName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-teal-900">Sampai:</span>
                  <select
                    value={customEndMonth}
                    onChange={(e) => {
                      setCustomEndMonth(e.target.value);
                      setCustomNotes('');
                    }}
                    className="text-xs font-semibold py-2 px-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                  >
                    {monthOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.monthName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="text-xs font-semibold px-2.5 py-1.5 bg-teal-50 text-teal-800 rounded-lg border border-teal-200/70">
              {completedTasks.length} Deliverable Selesai
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          PRINTABLE FORMAL NGO REPORT CONTAINER
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm printable-report">
        
        {/* Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {userProfile?.foundation_name || 'Yayasan Khoirur Rooziqiin'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Program Integrasi Donor Retention & Pelaporan Transparan
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {periodInfo.code}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Tanggal Terbit: {formatIndonesianDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata Briefing Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">R&D Lead</span>
            <p className="font-bold text-slate-900 mt-0.5">{userProfile?.full_name}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Periode Evaluasi</span>
            <p className="font-bold text-slate-900 mt-0.5">{periodInfo.label}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Overall KRA Score</span>
            <p className="font-bold text-brand-600 mt-0.5">{periodMetrics.completionRate}% Tercapai</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Churn</span>
            <p className="font-bold text-growth-700 mt-0.5">30% ➔ 10% (Tahunan)</p>
          </div>
        </div>

        {/* 1. Ringkasan Eksekutif & Tindakan Taktis R&D */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            1. Sasaran Strategis & 4 Langkah Taktis R&D
          </h3>

          <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/30 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Target Sasaran ({periodInfo.label.toUpperCase()}):
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
              {periodInfo.targetText}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Catatan Naratif Progres Periode Terpilih:
            </span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
              {executiveNotes}
            </p>
          </div>

          {/* 4 Tactical Pillars Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-brand-700 block mb-1">A. Audit Data Churn Rate:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Analisis database menemukan donatur Adik Asuh berhenti bukan karena anak lulus, melainkan karena tidak pernah menerima laporan perkembangan.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-growth-700 block mb-1">B. Donor Satisfaction Survey:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Survei mendalam kepada 50-100 donatur aktif dan pasif memvalidasi faktor internal vs eksternal (transparansi pelaporan & kemudahan UI donasi).
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-amber-700 block mb-1">C. Audit Donor Journey:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mengubah touchpoint pasca-donasi dari sekadar "menagih donasi baru" menjadi keterlibatan emosional melalui Personalized Impact Report.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-blue-700 block mb-1">D. Inovasi Produk Donasi Baru:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Merancang skema minim friction: Auto-debet harian Sedekah Subuh dan opsi Patungan Wakaf Produktif berbasis perhitungan SROI.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Matriks Capaian Kinerja LogFrame */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            2. Matriks Capaian Kinerja LogFrame (Program Pemulihan & Retensi Donatur)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-3 font-bold text-slate-700">Hierarki Program</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Indikator Pencapaian (KPI)</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Sumber Pembuktian</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Status Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    1. GOAL (Dampak)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    Churn rate donatur rutin turun dari 30% ke 10% dalam 1 tahun; volume donasi stabil/+20%.
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    Laporan Keuangan Tahunan & Dashboard CRM
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-indigo-700">
                    Tahunan (On Track)
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    2. OUTCOME (Hasil)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    60% donatur pasif kembali berdonasi & 1.000 donatur beralih ke auto-debet Sedekah Subuh.
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    Analisis data recovery CRM & data transaksi auto-debet
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-brand-700">
                    {periodMetrics.categoryStats.outcome.percent}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    3. OUTPUT (Keluaran)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    Rilis fitur donasi langganan & tersusunnya format Personalized Impact Report Wali Asuh.
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    Aplikasi live & dokumen template laporan rapor anak
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-growth-700">
                    {periodMetrics.categoryStats.output.percent}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    4. ACTIVITIES (Aktivitas)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    Survei churn rate ke 100 donatur pasif & re-desain alur komunikasi Wali Asuh.
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    Kuesioner responden, call log, notulensi workshop
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-amber-700">
                    {periodMetrics.categoryStats.activity.percent}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Completed Tasks Table - STRICTLY FILTERED BY SELECTED PERIOD */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-growth-600" />
              3. Daftar Deliverable Selesai (Completed Tasks)
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              Periode: <strong className="text-slate-800">{periodInfo.label}</strong> ({completedTasks.length} Tugas • {periodMetrics.totalHours} Jam)
            </span>
          </div>

          {completedTasks.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 italic">
                Tidak ada deliverable yang diselesaikan pada periode <strong>{periodInfo.label}</strong>.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-bold text-slate-700">Deliverable / Tugas R&D</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Kategori</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Waktu Realisasi</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Durasi Kerja</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedTasks.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-800">{t.title}</p>
                        {t.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">
                        {t.category}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {formatIndonesianDate(t.completed_at || t.due_date)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-medium whitespace-nowrap">
                        {t.estimated_hours || 2} Jam
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-growth-50 text-growth-700 border border-growth-200">
                          <CheckCircle2 className="w-3 h-3 text-growth-600" />
                          Terverifikasi
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Priority Next Steps */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            4. Prioritas Tindak Lanjut R&D (Roadmap & Pending Priorities)
          </h3>
          <ul className="space-y-2 text-xs">
            {pendingTasks.slice(0, 4).map((t, idx) => (
              <li key={t.id} className="flex items-start gap-2 text-slate-700">
                <span className="font-bold text-slate-400">{idx + 1}.</span>
                <div>
                  <span className="font-semibold">{t.title}</span>
                  <span className="text-slate-500 ml-1.5">(Target: {formatIndonesianDate(t.due_date)})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Formal Signatures Block */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="text-slate-500 mb-16">Disusun & Diajukan Oleh,</p>
            <p className="font-bold text-slate-900">{userProfile?.full_name}</p>
            <p className="text-slate-500 text-[11px]">R&D & Donor Retention Lead</p>
          </div>
          <div>
            <p className="text-slate-500 mb-16">Mengetahui & Menyetujui,</p>
            <p className="font-bold text-slate-900">Dr. H. Bambang Sudiro, M.M.</p>
            <p className="text-slate-500 text-[11px]">Direktur Eksekutif Yayasan</p>
          </div>
        </div>

      </div>

    </div>
  );
};
