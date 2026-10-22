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

// Custom 3D Isometric Bar Component for Recharts
const Custom3DBar = (props) => {
  const { x, y, width, height } = props;
  const isRealisasi = props.isRealisasi ?? (props.dataKey === 'Realisasi');

  if (!height || height <= 0 || isNaN(y) || isNaN(x) || isNaN(width)) return null;

  // Depth of 3D extrusion, dynamically constrained
  const depth = Math.min(10, Math.max(5, (width || 32) * 0.28));

  // 3D Facet Fills (Front, Top Highlight, Side Shadow)
  const frontFill = isRealisasi ? 'url(#tosca3dGrad)' : 'url(#target3dGrad)';
  const topFill = isRealisasi ? '#5eead4' : '#cbd5e1'; // crisp light reflection on top
  const sideFill = isRealisasi ? '#0f766e' : '#475569'; // deeper ambient shadow on right facet
  const strokeColor = isRealisasi ? '#115e59' : '#334155';

  return (
    <g className="transition-all duration-300">
      {/* Front Face */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={frontFill}
        stroke={strokeColor}
        strokeWidth={0.75}
        rx={1}
      />
      {/* Top Face (3D Roof Highlight) */}
      <polygon
        points={`
          ${x},${y} 
          ${x + depth},${y - depth} 
          ${x + width + depth},${y - depth} 
          ${x + width},${y}
        `}
        fill={topFill}
        stroke={strokeColor}
        strokeWidth={0.75}
        opacity={0.98}
      />
      {/* Right Side Face (3D Depth Shadow) */}
      <polygon
        points={`
          ${x + width},${y} 
          ${x + width + depth},${y - depth} 
          ${x + width + depth},${y + height - depth} 
          ${x + width},${y + height}
        `}
        fill={sideFill}
        stroke={strokeColor}
        strokeWidth={0.75}
        opacity={0.95}
      />
    </g>
  );
};

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
    if (num >= 1000000000) {
      const v = num / 1000000000;
      return `Rp ${v % 1 === 0 ? v : v.toFixed(1)} M`;
    }
    if (num >= 1000000) {
      const v = num / 1000000;
      return `Rp ${v % 1 === 0 ? v : v.toFixed(1)} Jt`;
    }
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
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 border border-teal-500/30">
          <p className="font-bold text-slate-100 border-b border-slate-700/80 pb-1.5 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-medium">3D Monitor</span>
          </p>
          <div className="flex items-center justify-between gap-4 pt-0.5">
            <span className="text-slate-400">Target Donasi:</span>
            <span className="font-semibold text-slate-200">{formatRupiah(targetVal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-teal-300 font-semibold">Realisasi:</span>
            <span className="font-bold text-teal-300">{formatRupiah(actualVal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400">Persentase Capaian:</span>
            <span className="font-extrabold text-amber-400">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getPercentageColor = (pct) => {
    const p = parseFloat(pct) || 0;
    if (p >= 75) return 'text-teal-800 bg-teal-50 border-teal-200';
    if (p >= 40) return 'text-brand-700 bg-brand-50 border-brand-200';
    if (p >= 20) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (pct) => {
    const p = parseFloat(pct) || 0;
    if (p >= 75) return 'bg-teal-600';
    if (p >= 40) return 'bg-brand-600';
    if (p >= 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      
      {/* Global SVG 3D Gradients */}
      <svg className="sr-only" width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="tosca3dGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="target3dGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header Card - Cleaned subtitle per user request */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 text-brand-600 border border-teal-200/60 shadow-xs">
              <Coins className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-teal-950 font-heading tracking-tight">
              Progres Penghimpunan Donasi
            </h1>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-teal-200 text-teal-800 hover:bg-teal-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition active:scale-95"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-teal-200 bg-white hover:bg-teal-50/50 text-teal-900 transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Tambah Program</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 transition active:scale-95 shadow-2xs"
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
          <form onSubmit={handleCreateNew} className="mt-5 pt-4 border-t border-teal-100/80 bg-teal-50/40 p-4 rounded-xl border border-teal-100">
            <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Tambah Program Donasi Baru</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">Nama Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Qurban Berkah"
                  value={newProgram.program}
                  onChange={(e) => setNewProgram({ ...newProgram, program: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-teal-200 text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">Target Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  placeholder="Contoh: 30000000"
                  value={newProgram.target}
                  onChange={(e) => setNewProgram({ ...newProgram, target: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-teal-200 text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">Realisasi Saat Ini (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="Contoh: 15000000"
                  value={newProgram.actual}
                  onChange={(e) => setNewProgram({ ...newProgram, actual: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-teal-200 text-teal-950 focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs text-teal-700 hover:text-teal-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-xs"
              >
                Simpan Program
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4 Summary Stat Cards - Soft Warm Tosca & White Gradient */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target */}
        <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-800">
            <Target className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Total Target</p>
            <p className="text-base sm:text-lg font-extrabold text-teal-950 mt-0.5">{formatRupiah(totalTarget)}</p>
          </div>
        </div>

        {/* Total Realisasi */}
        <div className="bg-gradient-to-br from-white via-teal-50/20 to-teal-50/40 p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-100/70 text-teal-800">
            <Wallet className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Terkumpul (Actual)</p>
            <p className="text-base sm:text-lg font-extrabold text-teal-800 mt-0.5">{formatRupiah(totalActual)}</p>
          </div>
        </div>

        {/* Capaian Rata-Rata */}
        <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-50 text-brand-700">
            <Percent className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Capaian</p>
              <span className="text-xs font-bold text-brand-700">{totalPercentage}%</span>
            </div>
            <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(parseFloat(totalPercentage) || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sisa Target */}
        <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <ArrowUpRight className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Sisa Perlu Dihimpun</p>
            <p className="text-base sm:text-lg font-extrabold text-amber-700 mt-0.5">{formatRupiah(totalRemaining)}</p>
          </div>
        </div>
      </div>

      {/* Grafik Progres Penghimpunan Donasi (3D Bar Chart) */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-brand-600 border border-teal-200/60 shadow-2xs">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-teal-950 font-heading">
              Grafik Progres Penghimpunan Donasi
            </h2>
          </div>
          <span className="text-xs font-medium text-teal-700 hidden sm:inline">
            Unit: Rupiah (IDR)
          </span>
        </div>

        <div className="w-full pt-2" style={{ height: '360px', minHeight: '360px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={340}>
            <BarChart data={chartData} barGap={1} barCategoryGap="28%" margin={{ top: 25, right: 20, left: 10, bottom: 20 }}>
              {/* SVG 3D Gradients Definition */}
              <defs>
                <linearGradient id="tosca3dGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="target3dGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4f1" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#0f3d36', fontSize: 11, fontWeight: 600 }} 
                axisLine={{ stroke: '#99f6e4' }}
                tickLine={false}
              />
              <YAxis 
                width={72}
                tickFormatter={formatShortRupiah} 
                tick={{ fill: '#134e4a', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="rect"
                wrapperStyle={{ paddingBottom: '14px', fontSize: '12px', fontWeight: 600 }}
              />
              <Bar 
                dataKey="Target" 
                name="Target Donasi" 
                fill="#64748b" 
                maxBarSize={40} 
                shape={(barProps) => <Custom3DBar {...barProps} isRealisasi={false} />}
                isAnimationActive={false}
              />
              <Bar 
                dataKey="Realisasi" 
                name="Realisasi" 
                fill="#0d9488" 
                maxBarSize={40} 
                shape={(barProps) => <Custom3DBar {...barProps} isRealisasi={true} />}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Progres Penghimpunan Donasi */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-teal-100/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-brand-600 border border-teal-200/50">
              <Coins className="w-4 h-4 text-brand-600" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-teal-950 font-heading">
              Rincian Tabel Progres Penghimpunan Donasi
            </h2>
          </div>
          {isEditing && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              Mode Edit Aktif
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-teal-200/70">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-teal-50/70 text-teal-900 font-bold uppercase tracking-wider text-[11px] border-b border-teal-200/80">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Target Donasi</th>
                <th className="py-3 px-4">Actual (Terkumpul)</th>
                <th className="py-3 px-4 min-w-[170px]">Persentase Realisasi</th>
                {isEditing && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-100/60">
              {activeList.map((row) => {
                const targetNum = parseFloat(row.target) || 0;
                const actualNum = parseFloat(row.actual) || 0;
                const pct = targetNum > 0 ? ((actualNum / targetNum) * 100).toFixed(1) : '0';

                return (
                  <tr key={row.id} className="hover:bg-teal-50/40 transition group">
                    {/* Program */}
                    <td className="py-3.5 px-4 font-semibold text-teal-950">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.program}
                          onChange={(e) => handleRowChange(row.id, 'program', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white text-teal-950 rounded-lg border border-teal-200 focus:outline-none focus:border-brand-500 font-semibold"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                          <span>{row.program}</span>
                        </div>
                      )}
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4 font-mono font-medium text-teal-900">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={row.target}
                            onChange={(e) => handleRowChange(row.id, 'target', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white text-teal-950 rounded-lg border border-teal-200 focus:outline-none focus:border-brand-500 font-mono"
                          />
                          <span className="text-[10px] text-teal-700 block mt-0.5 font-sans">
                            {formatRupiah(row.target)}
                          </span>
                        </div>
                      ) : (
                        formatRupiah(row.target)
                      )}
                    </td>

                    {/* Actual */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-900">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={row.actual}
                            onChange={(e) => handleRowChange(row.id, 'actual', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white text-teal-950 rounded-lg border border-teal-200 focus:outline-none focus:border-brand-500 font-mono"
                          />
                          <span className="text-[10px] text-teal-700 block mt-0.5 font-sans">
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
                        <div className="w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
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
                          className="p-1.5 rounded-lg text-teal-700 hover:text-rose-600 hover:bg-rose-50 transition"
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
            <tfoot className="bg-teal-50/70 font-bold border-t-2 border-teal-200/90">
              <tr>
                <td className="py-3.5 px-4 text-teal-950 uppercase text-[11px]">
                  Total Akumulasi
                </td>
                <td className="py-3.5 px-4 font-mono text-teal-950">
                  {formatRupiah(totalTarget)}
                </td>
                <td className="py-3.5 px-4 font-mono text-teal-950">
                  {formatRupiah(totalActual)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">{totalPercentage}%</span>
                    <span className="text-[11px] text-teal-700 font-normal">tercapai</span>
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
