import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { formatIndonesianDate } from '../../lib/whatsapp';

export const ExportReport = () => {
  const { userProfile, kpis, tasks, progressMetrics, showToast } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [executiveNotes, setExecutiveNotes] = useState(
    'Fokus R&D bulan ini diarahkan pada audit root cause penurunan donasi dan perancangan inovasi retensi. Melalui analisis database, ditemukan titik kritis drop-off donatur Adik Asuh karena minimnya laporan perkembangan anak (bukan semata faktor ekonomi). R&D merancang 2 inovasi: auto-debet Sedekah Subuh dan Personalized Impact Report Wali Asuh.'
  );

  const completedTasks = tasks.filter((t) => t.is_completed);
  const pendingTasks = tasks.filter((t) => !t.is_completed);

  const handlePrintPdf = () => {
    showToast('Mempersiapkan pratinjau cetak PDF resmi NGO...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header Card (Hidden when printing via CSS @media print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <FileText className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Export Laporan Manajemen R&D Penghimpunan
              </h1>
            </div>
          </div>

          {/* Prominent Export to PDF Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Export to PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Periode Laporan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-500"
            >
              <option value="Oktober 2026">Bulan Ini (Oktober 2026)</option>
              <option value="September 2026">September 2026</option>
              <option value="Kuartal 4 (Q4 2026)">Kuartal 4 Penuh (Q4 2026)</option>
            </select>
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
                LAP-RD/RETENTION/{new Date().getFullYear()}/10
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
            <p className="font-bold text-slate-900 mt-0.5">{selectedMonth}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Overall KRA Score</span>
            <p className="font-bold text-brand-600 mt-0.5">{progressMetrics.weightedKRA}% Tercapai</p>
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
              Target Sasaran Bulan Ini ({selectedMonth}):
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
              {userProfile?.monthly_target || userProfile?.quarterly_target}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Catatan Naratif Progres Bulan Ini:
            </span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
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
                    {progressMetrics.categoryStats.outcome.percent}%
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
                    {progressMetrics.categoryStats.output.percent}%
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
                    {progressMetrics.categoryStats.activity.percent}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Completed Tasks Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-growth-600" />
            3. Daftar Deliverable Selesai (Completed Tasks)
          </h3>

          {completedTasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada tugas yang diselesaikan pada periode ini.</p>
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
                      <td className="py-2.5 px-3 text-slate-600">
                        {formatIndonesianDate(t.completed_at || t.due_date)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                        {t.estimated_hours || 2} Jam
                      </td>
                      <td className="py-2.5 px-3 text-center">
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
            4. Prioritas Tindak Lanjut Bulan Depan (Pending Priorities)
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
