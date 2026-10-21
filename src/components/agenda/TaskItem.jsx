import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  Calendar, 
  Clock, 
  Send, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Layers, 
  AlertCircle,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { formatIndonesianDate } from '../../lib/whatsapp';

export const TaskItem = ({ task }) => {
  const { 
    toggleTaskCompletion, 
    setEditingTask, 
    setIsTaskModalOpen, 
    deleteTask,
    setWaModalTask,
    kpis
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Linked KPI details
  const linkedKpi = kpis.find((k) => k.id === task.kpi_id);

  // Deadline calculation
  const getDeadlineStatus = () => {
    if (task.is_completed) {
      return {
        label: 'Selesai',
        category: 'completed',
        badgeClass: 'bg-growth-50 text-growth-700 border-growth-200',
        borderClass: 'border-slate-200 bg-slate-50/50'
      };
    }

    if (task.due_date < todayStr) {
      return {
        label: 'Terlewat / Overdue',
        category: 'overdue',
        badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        borderClass: 'border-rose-200 bg-rose-50/20'
      };
    }

    if (task.due_date === todayStr) {
      return {
        label: 'Hari Ini (Urgent)',
        category: 'today',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        borderClass: 'border-rose-200 bg-white'
      };
    }

    if (task.due_date === tomorrowStr) {
      return {
        label: 'Besok',
        category: 'tomorrow',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        borderClass: 'border-amber-200 bg-white'
      };
    }

    // Future
    return {
      label: 'Mendatang',
      category: 'future',
      badgeClass: 'bg-growth-50 text-growth-700 border-growth-200',
      borderClass: 'border-slate-200 bg-white'
    };
  };

  const deadline = getDeadlineStatus();

  // Category badge colors
  const categoryPills = {
    outcome: 'bg-blue-50 text-blue-700 border-blue-200',
    output: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activity: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all shadow-2xs hover:shadow-sm ${deadline.borderClass} ${
        task.is_completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Custom Interactive Checkbox (Updates Supabase & triggers auto KPI calculation) */}
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 active:scale-90 ${
            task.is_completed
              ? 'bg-growth-600 border-growth-600 text-white shadow-sm'
              : 'border-slate-300 bg-white hover:border-brand-500 hover:ring-2 hover:ring-brand-100'
          }`}
          title={task.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* Deadline Visual Badge (Red / Yellow / Green) */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeClass}`}>
              {deadline.label}
            </span>

            {/* LogFrame Level */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
              categoryPills[task.category] || 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {task.category}
            </span>

            {/* Priority Indicator */}
            {task.priority === 'high' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200/60">
                Tinggi
              </span>
            )}

            {/* From Journal Badge */}
            {(task.id?.startsWith('task-jnl-') || task.description?.includes('[Otomatis dari Jurnal')) && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 inline-flex items-center gap-1">
                <BookOpen className="w-2.5 h-2.5 text-brand-600" />
                Dari Jurnal
              </span>
            )}
          </div>

          {/* Task Title */}
          <h3
            onClick={() => toggleTaskCompletion(task.id)}
            className={`text-sm font-bold cursor-pointer transition-colors leading-snug ${
              task.is_completed
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-900 hover:text-brand-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Linked LogFrame indicator */}
          {linkedKpi && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 w-fit">
              <Layers className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-600">{linkedKpi.code}:</span>
              <span className="truncate max-w-[280px]">{linkedKpi.title}</span>
            </div>
          )}

          {/* Metadata Row: Date & Workload */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className={task.due_date <= todayStr && !task.is_completed ? 'text-rose-600 font-semibold' : ''}>
                {formatIndonesianDate(task.due_date)}
              </span>
            </span>

            {task.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.estimated_hours} Jam</span>
              </span>
            )}
          </div>

        </div>

        {/* Action Buttons: WhatsApp Reminder & Edit/Delete */}
        <div className="flex items-center gap-1 flex-shrink-0">
          
          {/* WhatsApp Reminder Button */}
          <button
            onClick={() => setWaModalTask(task)}
            className="p-1.5 rounded-lg text-growth-700 bg-growth-50 hover:bg-growth-100 border border-growth-200/80 transition shadow-2xs hover:shadow-xs active:scale-95"
            title="Kirim Pengingat WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-growth-600 text-growth-600" />
          </button>

          {/* Edit Task */}
          <button
            onClick={() => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Edit Tugas"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Task */}
          <button
            onClick={() => {
              if (window.confirm(`Hapus tugas "${task.title}"?`)) {
                deleteTask(task.id);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Hapus Tugas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
