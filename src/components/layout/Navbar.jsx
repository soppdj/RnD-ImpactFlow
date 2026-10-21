import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppLogo } from '../common/AppLogo';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  CalendarCheck, 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Archive, 
  Coins, 
  LogOut 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    userProfile, 
    activeTab, 
    setActiveTab, 
    progressMetrics, 
    logout 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & NGO Title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <AppLogo size={40} className="w-10 h-10 drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-teal-950 tracking-tight">
                  R&D ImpactFlow
                </span>
              </div>
              <p className="text-xs text-teal-700 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-600" />
                <span className="truncate max-w-[180px] sm:max-w-[240px] font-medium">
                  {userProfile?.foundation_name || 'Yayasan Khoirur Rooziqiin'}
                </span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-teal-100/60 p-1 rounded-xl border border-teal-200/80 shadow-2xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-700" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'agenda'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-teal-700" />
              Agenda
              {progressMetrics.pendingTasks > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {progressMetrics.pendingTasks}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'journal'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-700" />
              Jurnal
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-teal-700" />
              Histori
            </button>
            <button
              onClick={() => setActiveTab('donasi')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'donasi'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-teal-700" />
              Donasi
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'report'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              Laporan
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-teal-900 shadow-xs border border-teal-200/50 font-bold'
                  : 'text-teal-900/80 hover:text-teal-950 hover:bg-white/60'
              }`}
            >
              <User className="w-3.5 h-3.5 text-teal-700" />
              Profil
            </button>
          </nav>

          {/* Right Section: Profile Avatar & Logout */}
          <div className="flex items-center gap-2.5">
            {/* User Avatar */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-teal-300 ring-2 ring-transparent hover:ring-brand-500 cursor-pointer transition ml-1"
              title="Pengaturan Profil"
            >
              <img
                src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={userProfile?.full_name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-teal-700 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Keluar Sesi (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
