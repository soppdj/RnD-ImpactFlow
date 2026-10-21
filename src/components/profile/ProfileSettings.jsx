import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Building2, 
  Target, 
  Clock, 
  Phone, 
  Save, 
  Mail,
  Camera, 
  Upload, 
  Trash2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const ProfileSettings = () => {
  const { userProfile, updateProfile, showToast } = useApp();

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
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormData((prev) => ({ ...prev, avatar_url: compressedDataUrl }));
        setIsProcessingImg(false);
        showToast('Foto profil berhasil dimuat!', 'success');
      };

      img.onerror = () => {
        setIsProcessingImg(false);
        showToast('Gagal memproses gambar', 'error');
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      setIsProcessingImg(false);
      showToast('Gagal membaca file gambar', 'error');
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
        foundation_name: userProfile.foundation_name || 'Yayasan Khoirur Rooziqiin',
        monthly_target: userProfile.monthly_target || userProfile.quarterly_target || '',
        quarterly_target: userProfile.quarterly_target || userProfile.monthly_target || '',
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Cleaned according to user annotation */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60 shadow-2xs">
              <User className="w-5 h-5 text-brand-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-teal-950 font-heading">
                Profil & Pengaturan R&D
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isSupabaseConfigured()
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-600' : 'bg-amber-500'}`} />
              {isSupabaseConfigured() ? 'Supabase Synced' : 'Mode Demo Sandbox'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Profile Form Grid (2 Columns: Identitas di Kiri, Operasional & Kontak di Kanan) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri (7 cols): Foto, Nama, Yayasan, Target */}
        <div className="lg:col-span-7 bg-white/95 rounded-2xl border border-teal-200/80 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-teal-950 border-b border-teal-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Identitas & Sasaran Riset</span>
          </h2>

          {/* Avatar Section */}
          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">
              Foto Profil
            </label>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-teal-200/80 bg-teal-50/50">
              {/* Circular Avatar Preview with Camera Overlay */}
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500 shadow-sm flex-shrink-0 bg-teal-100">
                <img
                  src={formData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
                  title="Ganti Foto"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">UBAH</span>
                </button>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImg}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessingImg ? 'Memproses...' : 'Pilih File Foto'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-teal-200 text-teal-800 hover:bg-teal-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Foto</span>
                  </button>
                </div>

                <p className="text-[11px] text-teal-700 leading-relaxed">
                  Pilih file gambar dari komputer atau smartphone Anda (JPG, PNG, WEBP).
                </p>
              </div>
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
              Nama Lengkap & Gelar *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Contoh: Sopianto Djahar, S.Sos., M.M."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Nama Yayasan */}
          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
              Nama Yayasan / Lembaga Filantropi *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.foundation_name}
                onChange={(e) => setFormData({ ...formData, foundation_name: e.target.value })}
                placeholder="Contoh: Yayasan Khoirur Rooziqiin"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Target Bulan Ini */}
          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
              Target Bulan Ini (Tampil di Subtitle Dashboard) *
            </label>
            <div className="relative">
              <textarea
                rows={3}
                required
                value={formData.monthly_target || formData.quarterly_target}
                onChange={(e) => setFormData({ ...formData, monthly_target: e.target.value, quarterly_target: e.target.value })}
                placeholder="Tuliskan target sasaran riset bulan ini..."
                className="w-full text-xs p-3 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none leading-relaxed"
              />
            </div>
            <p className="text-[11px] text-teal-700 mt-1">
              Teks sasaran bulanan ini secara otomatis disinkronkan ke Subtitle Header Dashboard dan Laporan Bulanan.
            </p>
          </div>
        </div>

        {/* Kolom Kanan (5 cols): Dipindahkan ke sini sesuai panah user */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-teal-950 border-b border-teal-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Operasional & Kontak WhatsApp</span>
            </h2>

            {/* Kapasitas Jam Kerja Harian */}
            <div>
              <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
                Kapasitas Jam Kerja Harian
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="16"
                  step="0.5"
                  value={formData.daily_working_hours}
                  onChange={(e) => setFormData({ ...formData, daily_working_hours: parseFloat(e.target.value) || 8 })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500"
                />
              </div>
              <span className="text-[11px] text-teal-700 mt-1 block">Jam kerja produktif per hari</span>
            </div>

            {/* Nomor WhatsApp Aktif */}
            <div>
              <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="Contoh: 6287896368519"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500"
                />
              </div>
              <span className="text-[11px] text-teal-700 mt-1 block">Tujuan pengiriman reminder agenda R&D</span>
            </div>

            {/* Email Akun Privat */}
            <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-200/80 text-xs space-y-1">
              <div className="flex items-center gap-2 text-teal-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Akun Privat Terdaftar</span>
              </div>
              <p className="text-teal-800 text-[11px]">
                idnsopianto@gmail.com (Hak Akses Owner)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 active:scale-95 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil & Target'}</span>
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
