import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLogo } from '../common/AppLogo';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Building2
} from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan email dan password akses Anda.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (!success) {
        setErrorMessage('Email atau password tidak sesuai. Akses privat dibatasi.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala saat autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('idnsopianto@gmail.com');
    setPassword('jY7#kliat64Sz');
  };

  return (
    <div className="min-h-screen bg-[#e3f2ee] bg-gradient-to-br from-[#d9f0ea] via-[#e5f5f0] to-[#d3ede5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200/50 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 ring-4 ring-white/90 rounded-2xl shadow-xl shadow-brand-600/20">
            <AppLogo size={60} className="w-15 h-15 drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight font-heading">
            R&D ImpactFlow
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-teal-800 flex items-center justify-center gap-1.5 font-medium">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Portal Privat R&D Yayasan Khoirur Rooziqiin</span>
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white/95 py-8 px-6 sm:px-10 shadow-xl shadow-teal-900/5 rounded-3xl border border-teal-200/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-teal-100">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-teal-950">Autentikasi Terproteksi</h2>
              <p className="text-[11px] text-teal-700">Masuk untuk mengelola agenda & data progres donasi.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-shake">
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5">
                Email
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  required
                  autoComplete="username"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-teal-950 bg-teal-50/40 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-teal-950 bg-teal-50/40 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-teal-700 hover:text-teal-950 transition"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-md shadow-brand-500/20 transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick autofill helper for the owner */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Khusus Akun Owner:</span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 transition underline underline-offset-2"
            >
              Isi Kredensial Saya
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          R&D ImpactFlow &bull; Powered by FatherLab &copy; 2026
        </p>
      </div>
    </div>
  );
};
