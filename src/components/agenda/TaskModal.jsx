import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Layers, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TaskModal = () => {
  const { 
    isTaskModalOpen, 
    setIsTaskModalOpen, 
    editingTask, 
    setEditingTask, 
    addTask, 
    updateTask,
    kpis 
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'output',
    kpi_id: '',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    estimated_hours: 2.0
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        category: editingTask.category || 'output',
        kpi_id: editingTask.kpi_id || '',
        due_date: editingTask.due_date || new Date().toISOString().split('T')[0],
        priority: editingTask.priority || 'medium',
        estimated_hours: editingTask.estimated_hours || 2.0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'output',
        kpi_id: kpis[0]?.id || '',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        estimated_hours: 2.0
      });
    }
    setError('');
  }, [editingTask, isTaskModalOpen, kpis]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Judul tugas agenda wajib diisi.');
      return;
    }
    if (!formData.due_date) {
      setError('Tenggat waktu (deadline) wajib diisi.');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const filteredKpis = kpis.filter((k) => k.category === formData.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              {editingTask ? 'Edit Agenda R&D' : 'Tambah Agenda Riset Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Sinkron otomatis dengan Supabase & LogFrame KPI Tracker
            </p>
          </div>
          <button
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Tugas / Deliverable *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Audit Churn Rate Donatur Adik Asuh & Sedekah Subuh"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* LogFrame Level & Linked KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori LogFrame *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const newCat = e.target.value;
                  const firstMatchingKpi = kpis.find((k) => k.category === newCat);
                  setFormData({
                    ...formData,
                    category: newCat,
                    kpi_id: firstMatchingKpi ? firstMatchingKpi.id : ''
                  });
                }}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500"
              >
                <option value="goal">Goal (Dampak Jangka Panjang)</option>
                <option value="outcome">Outcome (Adopsi & Retensi)</option>
                <option value="output">Output (Deliverable/Fitur Baru)</option>
                <option value="activity">Activity (Aktivitas/Survei R&D)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kaitkan ke Indikator KPI
              </label>
              <select
                value={formData.kpi_id}
                onChange={(e) => setFormData({ ...formData, kpi_id: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500"
              >
                <option value="">-- Pilih KPI Terkait --</option>
                {filteredKpis.map((kpi) => (
                  <option key={kpi.id} value={kpi.id}>
                    {kpi.code}: {kpi.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Work Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tenggat Waktu (Deadline) *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimasi Waktu (Jam)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 1 })}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tingkat Prioritas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((p) => {
                const labels = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi' };
                const isSelected = formData.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      isSelected
                        ? p === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300'
                          : 'bg-brand-50 text-brand-700 border-brand-300 ring-1 ring-brand-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi & Catatan Teknis (Opsional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Catatan metodologi, tautan dokumen kerja Google Drive, atau kontak mitra..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition active:scale-95"
            >
              {editingTask ? 'Simpan Perubahan' : 'Buat Agenda'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
