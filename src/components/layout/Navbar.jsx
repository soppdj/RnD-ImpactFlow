import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  FileText, 
  CalendarCheck, 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Archive,
  LogOut 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    userProfile, 
    setIsTaskModalOpen, 
    setEditingTask,
    activeTab,
    setActiveTab,
    progressMetrics,
    logout
  } = useApp();

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & NGO Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                  R&D ImpactFlow
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[180px] sm:max-w-[240px] font-medium">
                  {userProfile?.foundation_name || 'Yayasan Philanthropy'}
                </span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'agenda'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
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
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Jurnal
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              Histori
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'report'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Laporan
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profil
            </button>
          </nav>

          {/* Right Section: Action Button & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Add Task Button */}
            <button
              onClick={handleNewTask}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah Tugas</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* User Avatar */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-brand-400 cursor-pointer transition ml-1"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
