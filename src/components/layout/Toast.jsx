import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-growth-600 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
  };

  const bgStyles = {
    success: 'bg-white border-growth-200 text-slate-800 shadow-lg shadow-growth-500/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-lg shadow-rose-500/10',
    info: 'bg-white border-brand-200 text-slate-800 shadow-lg shadow-brand-500/10'
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short toast-container">
      <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-xs font-medium flex-1 leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
