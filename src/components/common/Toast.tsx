import React from 'react';
import { useEvents } from '../../context/EventContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useEvents();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-stone-800 shadow-emerald-900/5',
    error: 'bg-white border-rose-200 text-stone-800 shadow-rose-900/5',
    warning: 'bg-white border-amber-200 text-stone-800 shadow-amber-900/5',
    info: 'bg-white border-indigo-200 text-stone-800 shadow-indigo-900/5',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-md ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium tracking-tight leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
