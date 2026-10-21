import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from './TaskItem';
import { 
  PlusCircle, 
  Search, 
  CalendarCheck, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Layers,
  ArrowUpDown
} from 'lucide-react';

export const TaskList = () => {
  const { tasks, setIsTaskModalOpen, setEditingTask } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [deadlineFilter, setDeadlineFilter] = useState('all'); // all | today_overdue | tomorrow | upcoming | completed
  const [categoryFilter, setCategoryFilter] = useState('all'); // all | outcome | output | activity

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Automatic sorting by closest deadline
  const sortedAndFilteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = task.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) {
          return false;
        }

        // Deadline filter
        if (deadlineFilter === 'today_overdue') {
          return !task.is_completed && task.due_date <= todayStr;
        }
        if (deadlineFilter === 'tomorrow') {
          return !task.is_completed && task.due_date === tomorrowStr;
        }
        if (deadlineFilter === 'upcoming') {
          return !task.is_completed && task.due_date > tomorrowStr;
        }
        if (deadlineFilter === 'completed') {
          return task.is_completed;
        }

        return true;
      })
      .sort((a, b) => {
        // Completed items always sorted towards the bottom unless filtering specifically for completed
        if (deadlineFilter === 'all') {
          if (a.is_completed !== b.is_completed) {
            return a.is_completed ? 1 : -1;
          }
        }
        // Primary sort: closest deadline first
        return new Date(a.due_date) - new Date(b.due_date);
      });
  }, [tasks, searchQuery, deadlineFilter, categoryFilter, todayStr, tomorrowStr]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      today_overdue: tasks.filter((t) => !t.is_completed && t.due_date <= todayStr).length,
      tomorrow: tasks.filter((t) => !t.is_completed && t.due_date === tomorrowStr).length,
      upcoming: tasks.filter((t) => !t.is_completed && t.due_date > tomorrowStr).length,
      completed: tasks.filter((t) => t.is_completed).length
    };
  }, [tasks, todayStr, tomorrowStr]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white/95 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-teal-950 font-heading">
              Agenda Riset & Tindakan
            </h1>
            <p className="text-xs text-teal-700 mt-0.5">
              Daftar periksa deadline-driven tersortir otomatis dari tenggat terdekat
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Agenda Baru</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-4 border-t border-teal-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari agenda tugas atau kata kunci..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-teal-200 bg-teal-50/40 text-teal-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* LogFrame Category Select */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-teal-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>LogFrame:</span>
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-teal-200 bg-white text-teal-950 focus:outline-none focus:border-brand-500"
            >
              <option value="all">Semua Level</option>
              <option value="outcome">Outcome (Dampak)</option>
              <option value="output">Output (Deliverable)</option>
              <option value="activity">Activity (Lapangan)</option>
            </select>
          </div>

        </div>

        {/* Deadline Filter Tabs with Visual Badge Counters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-4 scrollbar-none">
          <button
            onClick={() => setDeadlineFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              deadlineFilter === 'all'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200/70'
            }`}
          >
            <span>Semua</span>
            <span className={`text-[10px] px-1.5 rounded-full ${
              deadlineFilter === 'all' ? 'bg-teal-800 text-white' : 'bg-teal-200 text-teal-950'
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setDeadlineFilter('today_overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              deadlineFilter === 'today_overdue'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <span>Hari Ini & Telat</span>
            {counts.today_overdue > 0 && (
              <span className={`text-[10px] px-1.5 rounded-full ${
                deadlineFilter === 'today_overdue' ? 'bg-rose-700 text-white' : 'bg-rose-200 text-rose-800'
              }`}>
                {counts.today_overdue}
              </span>
            )}
          </button>

          <button
            onClick={() => setDeadlineFilter('tomorrow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              deadlineFilter === 'tomorrow'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <span>Besok</span>
            {counts.tomorrow > 0 && (
              <span className={`text-[10px] px-1.5 rounded-full ${
                deadlineFilter === 'tomorrow' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                {counts.tomorrow}
              </span>
            )}
          </button>

          <button
            onClick={() => setDeadlineFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              deadlineFilter === 'upcoming'
                ? 'bg-growth-600 text-white shadow-sm'
                : 'bg-growth-50 text-growth-700 hover:bg-growth-100 border border-growth-200/60'
            }`}
          >
            <span>Mendatang</span>
            <span className={`text-[10px] px-1.5 rounded-full ${
              deadlineFilter === 'upcoming' ? 'bg-growth-700 text-white' : 'bg-growth-200 text-growth-800'
            }`}>
              {counts.upcoming}
            </span>
          </button>

          <button
            onClick={() => setDeadlineFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              deadlineFilter === 'completed'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Selesai</span>
            <span className={`text-[10px] px-1.5 rounded-full ${
              deadlineFilter === 'completed' ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.completed}
            </span>
          </button>
        </div>

      </div>

      {/* Task List Items Container */}
      <div className="space-y-3">
        {sortedAndFilteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-heading">
              Tidak ada agenda dalam kategori ini
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Semua tugas selesai atau coba sesuaikan filter pencarian Anda.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Tugas Baru</span>
            </button>
          </div>
        ) : (
          sortedAndFilteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>

    </div>
  );
};
