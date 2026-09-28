import React, { useRef, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Info, X, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, selectEventAndNavigate } = useEvents();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#4E785F]" />
          <h3 className="font-semibold text-stone-900 text-sm">System Notifications</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#4E785F]/10 text-[#4E785F] font-bold">
            {notifications.length}
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-stone-400">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs text-stone-400 mt-1">No pending warnings or overdue alerts.</p>
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              className={`p-3.5 hover:bg-stone-50/80 transition-colors ${
                !item.read ? 'bg-amber-50/20' : ''
              }`}
              onClick={() => markNotificationRead(item.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-lg bg-stone-100">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">{item.title}</h4>
                    {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-2">{item.message}</p>
                  {item.eventId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectEventAndNavigate(item.eventId!);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4E785F] hover:text-[#375743]"
                    >
                      View in event <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
