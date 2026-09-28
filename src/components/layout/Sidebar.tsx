import React from 'react';
import { useEvents, NavigationTab } from '../../context/EventContext';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Bot,
  Zap,
  FolderKanban,
  Sparkles,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenCreate: () => void;
}

export const Sidebar: React.FC<Props> = ({ mobileOpen, setMobileOpen, onOpenCreate }) => {
  const { activeTab, setActiveTab, unreadNotificationCount, resetDemoData } = useEvents();

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'events', label: 'Events & Plans', icon: <FolderKanban className="w-4 h-4" /> },
    { tab: 'tasks', label: 'All Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { tab: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { tab: 'assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    {
      tab: 'automation',
      label: 'Automation Hub',
      icon: <Zap className="w-4 h-4" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#F8F7F3] border-r border-stone-200/80 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-200/70 flex items-center justify-between">
          <div
            onClick={() => {
              setActiveTab('landing');
              setMobileOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#4E785F] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-[#3D634C] transition-colors">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg tracking-tight text-stone-900 leading-none">
                Campus<span className="text-[#4E785F]">Flow</span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-600 block mt-0.5">
                AI Event Ops
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              onOpenCreate();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-sm transition-all hover:shadow active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Event Plan</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5">
            Main Workspace
          </div>
          {navItems.map(item => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#EAE8E0] text-[#1C2024] font-semibold shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-[#4E785F]' : 'text-stone-600'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3 h-3 text-[#4E785F]" />
                ) : null}
              </button>
            );
          })}

          <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5">
            Overview
          </div>
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-stone-600" />
            <span>Landing & Demo Pitch</span>
          </button>
        </nav>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-stone-200/70 space-y-2">
          <button
            onClick={resetDemoData}
            title="Reset to pre-configured demo data"
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-white/70 hover:bg-white text-stone-700 text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-stone-600" />
            <span>Reset Demo Data</span>
          </button>

          <div className="p-2.5 rounded-xl bg-white border border-stone-200/70 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8E2F2] text-[#6A4B95] flex items-center justify-center text-xs font-bold shrink-0">
              SM
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-stone-900 truncate">Sarah Miller</p>
              <div className="flex items-center gap-1 text-[10px] text-stone-600">
                <ShieldCheck className="w-3 h-3 text-[#4E785F]" />
                <span>Student Council Lead</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
