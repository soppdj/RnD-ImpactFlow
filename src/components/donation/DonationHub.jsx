import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Wallet, 
  Percent, 
  ArrowUpRight,
  Plus,
  Edit3,
  Save,
  Trash2,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const DonationHub = () => {
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

  const formatShortRupiah = (value) => {
    const num = parseFloat(value) || 0;
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} M`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)} Jt`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)} Rb`;
    return `Rp ${num}`;
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
  const totalRemaining = Math.max(0, totalTarget - totalActual);
  const totalPercentage = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '0';

  // Chart Data preparation
  const chartData = useMemo(() => {
    return activeList.map((item) => {
      const target = parseFloat(item.target) || 0;
      const actual = parseFloat(item.actual) || 0;
      const pct = target > 0 ? ((actual / target) * 100).toFixed(1) : '0';
      return {
        name: item.program,
        Target: target,
        Realisasi: actual,
        Persentase: pct
      };
    });
  }, [activeList]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const targetVal = payload.find((p) => p.dataKey === 'Target')?.value || 0;
      const actualVal = payload.find((p) => p.dataKey === 'Realisasi')?.value || 0;
      const pct = targetVal > 0 ? ((actualVal / targetVal) * 100).toFixed(1) : '0';

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Target:</span>
            <span className="font-semibold text-slate-200">{formatRupiah(targetVal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400">Realisasi:</span>
            <span className="font-bold text-emerald-400">{formatRupiah(actualVal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400">Pencapaian:</span>
            <span className="font-extrabold text-amber-400">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

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
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-growth-50 text-growth-700 border border-growth-200/60">
                <Coins className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Progres Penghimpunan Donasi
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Monitoring realisasi target vs aktual donasi (Zakat, Wakaf, Infaq & Sedekah, Wali Asuh) untuk memandu inovasi retensi R&D.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-growth-600 hover:bg-growth-700 text-white shadow-sm transition active:scale-95"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Tambah Program</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapsible Form Tambah Program Baru */}
        {isAddingNew && (
          <form onSubmit={handleCreateNew} className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Tambah Program Donasi Baru</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Qurban Berkah"
                  value={newProgram.program}
                  onChange={(e) => setNewProgram({ ...newProgram, program: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  placeholder="Contoh: 30000000"
                  value={newProgram.target}
                  onChange={(e) => setNewProgram({ ...newProgram, target: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Realisasi Saat Ini (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="Contoh: 15000000"
                  value={newProgram.actual}
                  onChange={(e) => setNewProgram({ ...newProgram, actual: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm"
              >
                Simpan Program
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Target</p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">{formatRupiah(totalTarget)}</p>
          </div>
        </div>

        {/* Total Realisasi */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-growth-50 text-growth-700">
            <Wallet className="w-5 h-5 text-growth-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Terkumpul (Actual)</p>
            <p className="text-base sm:text-lg font-extrabold text-growth-700 mt-0.5">{formatRupiah(totalActual)}</p>
          </div>
        </div>

        {/* Capaian Rata-Rata */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-50 text-brand-700">
            <Percent className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Capaian</p>
              <span className="text-xs font-bold text-brand-700">{totalPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(parseFloat(totalPercentage) || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sisa Target */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <ArrowUpRight className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sisa Perlu Dihimpun</p>
            <p className="text-base sm:text-lg font-extrabold text-amber-700 mt-0.5">{formatRupiah(totalRemaining)}</p>
          </div>
        </div>
      </div>

      {/* Grafik Batang: Komparasi Target vs Realisasi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-brand-600">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              Grafik Batang Komparasi: Target vs Realisasi
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Unit: Rupiah (IDR)
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={formatShortRupiah} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 600 }}
              />
              <Bar dataKey="Target" fill="#94a3b8" radius={[6, 6, 0, 0]} maxBarSize={45} />
              <Bar dataKey="Realisasi" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Progres Penghimpunan Donasi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Coins className="w-4 h-4 text-brand-600" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              Rincian Tabel Progres Penghimpunan Donasi
            </h2>
          </div>
          {isEditing && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              Mode Edit Aktif
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Target Donasi</th>
                <th className="py-3 px-4">Actual (Terkumpul)</th>
                <th className="py-3 px-4 min-w-[170px]">Persentase Realisasi</th>
                {isEditing && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeList.map((row) => {
                const targetNum = parseFloat(row.target) || 0;
                const actualNum = parseFloat(row.actual) || 0;
                const pct = targetNum > 0 ? ((actualNum / targetNum) * 100).toFixed(1) : '0';

                return (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition group">
                    {/* Program */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.program}
                          onChange={(e) => handleRowChange(row.id, 'program', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-semibold"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                          <span>{row.program}</span>
                        </div>
                      )}
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={row.target}
                            onChange={(e) => handleRowChange(row.id, 'target', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-mono"
                          />
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                            {formatRupiah(row.target)}
                          </span>
                        </div>
                      ) : (
                        formatRupiah(row.target)
                      )}
                    </td>

                    {/* Actual */}
                    <td className="py-3.5 px-4 font-mono font-bold text-growth-700">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={row.actual}
                            onChange={(e) => handleRowChange(row.id, 'actual', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-brand-500 font-mono"
                          />
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                            {formatRupiah(row.actual)}
                          </span>
                        </div>
                      ) : (
                        formatRupiah(row.actual)
                      )}
                    </td>

                    {/* Persentase */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPercentageColor(pct)}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${getBarColor(pct)}`}
                            style={{ width: `${Math.min(parseFloat(pct) || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action in edit mode */}
                    {isEditing && (
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => deleteDonationProgram(row.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
            <tfoot className="bg-slate-50/90 font-bold border-t-2 border-slate-200">
              <tr>
                <td className="py-3.5 px-4 text-slate-900 uppercase text-[11px]">
                  Total Akumulasi
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-900">
                  {formatRupiah(totalTarget)}
                </td>
                <td className="py-3.5 px-4 font-mono text-growth-700">
                  {formatRupiah(totalActual)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{totalPercentage}%</span>
                    <span className="text-[11px] text-slate-400 font-normal">tercapai</span>
                  </div>
                </td>
                {isEditing && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
