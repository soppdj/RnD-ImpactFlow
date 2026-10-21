import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  Plus, 
  Edit3, 
  Check, 
  Trash2, 
  TrendingUp, 
  BarChart3, 
  Sparkles,
  Save,
  RotateCcw,
  AlertCircle,
  Percent
} from 'lucide-react';

export const DonationProgressTable = () => {
  const { 
    donationPrograms, 
    updateDonationProgram, 
    addDonationProgram, 
    deleteDonationProgram, 
    saveAllDonationPrograms,
    showToast 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [localRows, setLocalRows] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProgram, setNewProgram] = useState({
    program: '',
    target: '',
    actual: '',
    notes: ''
  });

  // Currency formatter
  const formatRupiah = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleStartEdit = () => {
    setLocalRows(JSON.parse(JSON.stringify(donationPrograms)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveAll = () => {
    saveAllDonationPrograms(localRows);
    setIsEditing(false);
  };

  const handleRowChange = (id, field, value) => {
    setLocalRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newProgram.program.trim()) {
      showToast('Nama program donasi wajib diisi', 'error');
      return;
    }
    addDonationProgram({
      program: newProgram.program,
      target: parseFloat(newProgram.target) || 0,
      actual: parseFloat(newProgram.actual) || 0,
      notes: newProgram.notes
    });
    setNewProgram({ program: '', target: '', actual: '', notes: '' });
    setIsAddingNew(false);
  };

  // Calculations
  const activeList = isEditing ? localRows : donationPrograms;
  const totalTarget = activeList.reduce((acc, curr) => acc + (parseFloat(curr.target) || 0), 0);
  const totalActual = activeList.reduce((acc, curr) => acc + (parseFloat(curr.actual) || 0), 0);
  const totalPercentage = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '0';

  const getPercentageColor = (pct) => {
    const p = parseFloat(pct) || 0;
    if (p >= 75) return 'text-growth-700 bg-growth-50 border-growth-200';
    if (p >= 40) return 'text-brand-700 bg-brand-50 border-brand-200';
    if (p >= 20) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (pct) => {
    const p = parseFloat(pct) || 0;
    if (p >= 75) return 'bg-growth-600';
    if (p >= 40) return 'bg-brand-600';
    if (p >= 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-growth-50 text-growth-700 border border-growth-200/60">
              <Coins className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
              Tabel Progres Penghimpunan Donasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Monitoring realisasi donasi program yayasan (Zakat, Wakaf, Infaq, Wali Asuh) untuk memandu inovasi retensi R&D.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-growth-600 hover:bg-growth-700 text-white shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-600" />
                <span>Tambah Program</span>
              </button>
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Tabel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Summary KPI Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Target Penghimpunan
          </span>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 font-heading mt-0.5">
            {formatRupiah(totalTarget)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-growth-50/60 border border-growth-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-growth-700">
            Total Realisasi (Actual)
          </span>
          <p className="text-base sm:text-lg font-extrabold text-growth-800 font-heading mt-0.5">
            {formatRupiah(totalActual)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Capaian Rata-Rata Donasi
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-base sm:text-lg font-extrabold text-brand-700 font-heading">
              {totalPercentage}%
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              Sisa: {formatRupiah(Math.max(0, totalTarget - totalActual))}
            </span>
          </div>
        </div>
      </div>

      {/* Add New Program Form (Collapsible) */}
      {isAddingNew && (
        <form onSubmit={handleCreateNew} className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-brand-600" />
              Tambah Baris Program Donasi Baru
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Program *
              </label>
              <input
                type="text"
                required
                value={newProgram.program}
                onChange={(e) => setNewProgram({ ...newProgram, program: e.target.value })}
                placeholder="Contoh: Sedekah Subuh"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Target (Rp) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={newProgram.target}
                onChange={(e) => setNewProgram({ ...newProgram, target: e.target.value })}
                placeholder="44100000"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
              />
              {newProgram.target && (
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                  {formatRupiah(newProgram.target)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Actual / Realisasi (Rp) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={newProgram.actual}
                onChange={(e) => setNewProgram({ ...newProgram, actual: e.target.value })}
                placeholder="12675646"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
              />
              {newProgram.actual && (
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                  {formatRupiah(newProgram.actual)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
            >
              Tambahkan ke Tabel
            </button>
          </div>
        </form>
      )}

      {/* Editable Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                Program
              </th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">
                Target (Rp)
              </th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">
                Actual (Rp)
              </th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-center min-w-[150px]">
                Persentase (%)
              </th>
              {isEditing && (
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-center w-16">
                  Aksi
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {activeList.map((row) => {
              const targetNum = parseFloat(row.target) || 0;
              const actualNum = parseFloat(row.actual) || 0;
              const percentage = targetNum > 0 ? ((actualNum / targetNum) * 100).toFixed(1) : '0';
              const clampedPct = Math.min(100, Math.max(0, parseFloat(percentage) || 0));

              return (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Program Name */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.program}
                        onChange={(e) => handleRowChange(row.id, 'program', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-semibold text-xs"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{row.program}</p>
                          {row.notes && (
                            <p className="text-[11px] text-slate-400 font-normal">{row.notes}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Target Amount */}
                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          step="1000"
                          value={row.target}
                          onChange={(e) => handleRowChange(row.id, 'target', parseFloat(e.target.value) || 0)}
                          className="w-32 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-mono text-xs"
                        />
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {formatRupiah(row.target)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                        {formatRupiah(row.target)}
                      </span>
                    )}
                  </td>

                  {/* Actual Amount */}
                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          step="1000"
                          value={row.actual}
                          onChange={(e) => handleRowChange(row.id, 'actual', parseFloat(e.target.value) || 0)}
                          className="w-32 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-mono text-xs font-semibold text-growth-700"
                        />
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {formatRupiah(row.actual)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-growth-700 text-xs sm:text-sm">
                        {formatRupiah(row.actual)}
                      </span>
                    )}
                  </td>

                  {/* Percentage with Visual Bar */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5 max-w-[160px] mx-auto">
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${getPercentageColor(percentage)}`}>
                          {percentage}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {targetNum > actualNum ? `-${formatRupiah(targetNum - actualNum)}` : 'Tercapai!'}
                        </span>
                      </div>
                      
                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
                          style={{ width: `${clampedPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions in Edit Mode */}
                  {isEditing && (
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => deleteDonationProgram(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}

                </tr>
              );
            })}
          </tbody>

          {/* Total Footer Row */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
              <td className="py-3.5 px-4 uppercase tracking-wider text-xs">
                Total Akumulasi Program
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs sm:text-sm text-slate-900">
                {formatRupiah(totalTarget)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs sm:text-sm text-growth-700">
                {formatRupiah(totalActual)}
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-brand-600 text-white shadow-2xs">
                  {totalPercentage}% Capaian Total
                </span>
              </td>
              {isEditing && <td className="py-3.5 px-4" />}
            </tr>
          </tfoot>

        </table>
      </div>

      {/* R&D Action Insight Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>
            <strong>Insight R&D:</strong> Program <strong>Zakat</strong> saat ini berada di 28.7% (butuh dorongan edukasi literasi zakat profesi), sedangkan <strong>Infaq & Sedekah</strong> telah mencapai 73.0%.
          </span>
        </div>
        <span className="text-slate-400 whitespace-nowrap hidden sm:inline">
          Data real-time disinkronkan otomatis
        </span>
      </div>

    </div>
  );
};
