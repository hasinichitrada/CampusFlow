import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import {
  Menu,
  Bell,
  Sparkles,
  Zap,
  Calendar,
  ChevronDown,
} from 'lucide-react';

interface Props {
  onToggleMobile: () => void;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleMobile, onOpenCreate }) => {
  const {
    activeTab,
    events,
    selectedEventId,
    setSelectedEventId,
    unreadNotificationCount,
    runAutomation,
    isAutomating,
  } = useEvents();

  const [notifOpen, setNotifOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Campus Operations Dashboard';
      case 'events':
        return 'Campus Event Catalog';
      case 'event-detail':
        return 'Event Plan & Execution';
      case 'tasks':
        return 'Universal Task Board';
      case 'calendar':
        return 'Master Schedule & Deadlines';
      case 'assistant':
        return 'Gemini AI Event Co-Pilot';
      case 'automation':
        return 'Automated Deadline Workflows';
      default:
        return 'CampusFlow';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 md:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-heading font-semibold text-stone-900 text-sm sm:text-base tracking-tight flex items-center gap-2">
            <span>{getPageTitle()}</span>
          </h1>
          <p className="hidden sm:block text-[11px] text-stone-600 font-medium">
            AI-powered event logistics & task automation for campus organizers
          </p>
        </div>
      </div>

      {/* Right: Quick switcher, Automation trigger, Notifications, Create button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Event Switcher (visible when in event-related views) */}
        {events.length > 0 && activeTab !== 'landing' && (
          <div className="relative hidden md:block">
            <select
              value={selectedEventId || ''}
              onChange={e => setSelectedEventId(e.target.value)}
              className="appearance-none bg-white text-stone-800 text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl border border-stone-200/80 hover:border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/20 cursor-pointer shadow-2xs"
            >
              {events.map(evt => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.progress}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Run Automation Quick Button */}
        <button
          onClick={() => runAutomation()}
          disabled={isAutomating}
          title="Run daily deadline audit & progress summary"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-600 ${isAutomating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isAutomating ? 'Auditing...' : 'Run Automation'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 relative transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <NotificationsDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Create Plan Button */}
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Plan Event</span>
        </button>
      </div>
    </header>
  );
};
