import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Toast } from './components/layout/Toast';
import { HeaderBanner } from './components/dashboard/HeaderBanner';
import { DonationProgressTable } from './components/dashboard/DonationProgressTable';
import { QuickStats } from './components/dashboard/QuickStats';
import { OverallKraChart } from './components/dashboard/OverallKraChart';
import { LogFrameProgress } from './components/dashboard/LogFrameProgress';
import { TaskList } from './components/agenda/TaskList';
import { TaskModal } from './components/agenda/TaskModal';
import { WhatsAppModal } from './components/agenda/WhatsAppModal';
import { WeeklyJournal } from './components/journal/WeeklyJournal';
import { CompletedHistory } from './components/history/CompletedHistory';
import { ExportReport } from './components/report/ExportReport';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { LoginScreen } from './components/auth/LoginScreen';
import { Loader2 } from 'lucide-react';

export const MainContent = () => {
  const { activeTab, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memuat ImpactFlow R&D Hub...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <HeaderBanner />
          <DonationProgressTable />
          <QuickStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <OverallKraChart />
            </div>
            <div className="lg:col-span-2">
              <LogFrameProgress />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agenda' && <TaskList />}

      {activeTab === 'journal' && <WeeklyJournal />}

      {activeTab === 'history' && <CompletedHistory />}

      {activeTab === 'report' && <ExportReport />}

      {activeTab === 'profile' && <ProfileSettings />}
    </main>
  );
};

function App() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-100 selection:text-brand-900">
        <LoginScreen />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      <MainContent />
      <footer className="hidden md:block py-6 border-t border-slate-200/60 bg-white/40 text-center text-xs text-slate-500 font-medium">
        <p>R&D ImpactFlow &bull; Powered by FatherLab &copy; 2026</p>
      </footer>
      <BottomNav />
      <TaskModal />
      <WhatsAppModal />
      <Toast />
    </div>
  );
}

export default App;
