import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  Archive, 
  Coins,
  User, 
  Plus
} from 'lucide-react';

export const BottomNav = () => {
  const { 
    activeTab, 
    setActiveTab, 
    progressMetrics
  } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-safe shadow-lg pwa-bottom-nav">
      <div className="grid grid-cols-6 h-16 max-w-xl mx-auto items-center px-1">
        
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </button>

        {/* Agenda */}
        <button
          onClick={() => setActiveTab('agenda')}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'agenda' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'agenda' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {progressMetrics.pendingTasks > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold bg-amber-500 text-white flex items-center justify-center shadow-sm">
                {progressMetrics.pendingTasks}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Agenda</span>
        </button>

        {/* Jurnal Mingguan */}
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'journal' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'journal' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Jurnal</span>
        </button>

        {/* Donasi */}
        <button
          onClick={() => setActiveTab('donasi')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'donasi' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className={`w-5 h-5 ${activeTab === 'donasi' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Donasi</span>
        </button>

        {/* Histori Bulanan */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'history' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Archive className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Histori</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'profile' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </button>

      </div>
    </div>
  );
};
