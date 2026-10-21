import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Building2, 
  Target, 
  Clock, 
  Phone, 
  Save, 
  Database, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Camera,
  Upload,
  Trash2
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const ProfileSettings = () => {
  const { userProfile, updateProfile, resetToRetentionTemplate, syncStatus, showToast } = useApp();

  const [formData, setFormData] = useState({
    full_name: '',
    foundation_name: '',
    monthly_target: '',
    quarterly_target: '',
    daily_working_hours: 8,
    whatsapp_number: '',
    avatar_url: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const fileInputRef = useRef(null);

  // Client-side image resize & compression to ensure ultra-lightweight storage
  const processAndSetImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('File yang dipilih harus berupa gambar (JPG, PNG, WEBP, dll)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran file maksimal 10MB', 'error');
      return;
    }

    setIsProcessingImg(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 400x400 to keep base64 ultra-lightweight
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-standard high quality JPEG (~35-65 KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setFormData((prev) => ({ ...prev, avatar_url: compressedDataUrl }));
        setIsProcessingImg(false);
        showToast('Foto profil berhasil diunggah! Klik "Simpan Profil & Target" untuk menyimpan permanen.', 'success');
      };
      img.onerror = () => {
        setIsProcessingImg(false);
        showToast('Gagal memproses file gambar.', 'error');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }));
    showToast('Foto profil direset ke default', 'info');
  };

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        foundation_name: userProfile.foundation_name || '',
        monthly_target: userProfile.monthly_target || userProfile.quarterly_target || '',
        quarterly_target: userProfile.monthly_target || userProfile.quarterly_target || '',
        daily_working_hours: userProfile.daily_working_hours || 8,
        whatsapp_number: userProfile.whatsapp_number || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      ...formData,
      monthly_target: formData.monthly_target || formData.quarterly_target,
      quarterly_target: formData.monthly_target || formData.quarterly_target
    });
    setIsSaving(false);
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOi...`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    showToast('Contoh konfigurasi .env disalin ke clipboard!', 'info');
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <User className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Profil & Pengaturan R&D
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Data terhubung langsung ke tabel <code className="bg-slate-100 text-brand-700 px-1.5 py-0.5 rounded font-mono text-[11px]">user_profile</code> di Supabase
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Muat ulang template default Program Retensi Donatur & LogFrame Q4?')) {
                  resetToRetentionTemplate();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
              title="Reset data ke template insight Retensi Donatur & LogFrame"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Muat Template Retensi</span>
            </button>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isSupabaseConfigured()
                ? 'bg-growth-50 text-growth-700 border-growth-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-growth-600' : 'bg-amber-500'}`} />
              {isSupabaseConfigured() ? 'Supabase Synced' : 'Mode Demo Sandbox'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Profile Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Avatar Section (Manual File Upload) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Foto Profil (Unggah Manual dari Perangkat)
              </label>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                
                {/* Circular Avatar Preview with Camera Overlay */}
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500 shadow-sm flex-shrink-0 bg-slate-200">
                  <img
                    src={formData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition select-none"
                    title="Klik untuk memilih foto dari galeri/folder"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[9px] font-bold mt-0.5">Ubah</span>
                  </div>
                </div>

                {/* Upload Action Buttons */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      disabled={isProcessingImg}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition active:scale-95 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isProcessingImg ? 'Mengompres...' : 'Pilih File Foto'}</span>
                    </button>

                    {formData.avatar_url && formData.avatar_url.startsWith('data:image') && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset Foto</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Pilih file gambar langsung dari komputer atau smartphone Anda (format JPG, PNG, WEBP, maks 10MB). Foto akan dikompresi otomatis agar ringan dan cepat tersinkronisasi.
                  </p>
                </div>

              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Contoh: Rizky Pratama, M.Sc."
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Nama Yayasan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Yayasan / Lembaga Filantropi *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.foundation_name}
                  onChange={(e) => setFormData({ ...formData, foundation_name: e.target.value })}
                  placeholder="Contoh: Yayasan Harapan Nusantara"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Target Bulan Ini */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Bulan Ini (Tampil di Subtitle Dashboard) *
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={formData.monthly_target || formData.quarterly_target}
                  onChange={(e) => setFormData({ ...formData, monthly_target: e.target.value, quarterly_target: e.target.value })}
                  placeholder="Tuliskan target sasaran riset bulan ini..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Teks sasaran bulanan ini secara otomatis disinkronkan ke Subtitle Header Dashboard dan Laporan Bulanan.
              </p>
            </div>

            {/* Kapasitas Jam Kerja & Nomor WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kapasitas Jam Kerja Harian
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={formData.daily_working_hours}
                    onChange={(e) => setFormData({ ...formData, daily_working_hours: parseFloat(e.target.value) || 8 })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Jam kerja produktif per hari</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="Contoh: 6281234567890"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Tujuan pengiriman reminder agenda R&D</span>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 active:scale-95 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil & Target'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Supabase & Architecture Guidance (1 col) */}
        <div className="space-y-4">
          
          {/* Supabase Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-2">
              <Database className="w-4 h-4 text-brand-600" />
              <span>Status Koneksi Supabase</span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              {isSupabaseConfigured()
                ? 'Aplikasi terhubung ke Supabase backend. Operasi CRUD dan update data di sinkronkan secara real-time via Postgres CDC.'
                : 'Saat ini berjalan dalam Mode Demo Sandbox Lokal. Data Anda tetap tersimpan di browser (localStorage) dan tersinkronisasi antar-tab.'}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Langkah Aktivasi Supabase:
              </p>
              <ol className="text-[11px] text-slate-600 space-y-1.5 list-decimal pl-4">
                <li>Buka proyek di <strong>supabase.com</strong>.</li>
                <li>Buka <strong>SQL Editor</strong> lalu jalankan skrip <code className="text-brand-600 font-mono">supabase_schema.sql</code>.</li>
                <li>Salin <strong>Project URL</strong> & <strong>Anon Public Key</strong> ke file <code className="text-brand-600 font-mono">.env</code>.</li>
              </ol>
            </div>

            <button
              onClick={copyEnvSnippet}
              className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedEnv ? 'Tersalin!' : 'Salin Format .env'}</span>
            </button>
          </div>

          {/* LogFrame & R&D Method Card */}
          <div className="bg-gradient-to-br from-brand-50/60 to-growth-50/60 rounded-2xl border border-brand-100 p-5 shadow-sm text-xs">
            <div className="flex items-center gap-2 text-brand-900 font-bold mb-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Karakteristik LogFrame R&D</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Metodologi Logical Framework (LogFrame) memastikan setiap tugas operasional memiliki rantai nilai langsung terhadap Output riset dan Outcome dampak kebijakan yayasan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
