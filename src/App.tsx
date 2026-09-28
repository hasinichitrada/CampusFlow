import React, { useState } from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventCatalogPage } from './components/events/EventCatalogPage';
import { EventDetailsPage } from './components/events/EventDetailsPage';
import { AllTasksPage } from './components/tasks/AllTasksPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { AutomationHub } from './components/automation/AutomationHub';
import { StandaloneAssistantPage } from './components/assistant/StandaloneAssistantPage';
import { CreateEventModal } from './components/events/CreateEventModal';
import { Toast } from './components/common/Toast';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // If on landing page, display hero and full landing experience
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col">
        {/* Landing Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#4E785F] text-white flex items-center justify-center font-bold text-base shadow-xs">
              ⚡
            </div>
            <div className="font-heading font-extrabold text-xl tracking-tight text-stone-900">
              Campus<span className="text-[#4E785F]">Flow</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              ✨ Plan an Event
            </button>
          </div>
        </header>

        <main className="flex-1">
          <LandingPage onOpenCreate={() => setCreateModalOpen(true)} />
        </main>

        <footer className="py-6 border-t border-stone-200/70 text-center text-xs text-stone-500">
          <p>© 2026 CampusFlow. Designed for college organizing teams & student committees.</p>
        </footer>

        <CreateEventModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
        <Toast />
      </div>
    );
  }

  // Dashboard & Workspace App Layout
  return (
    <div className="flex min-h-screen bg-[#FAF9F5]">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        onOpenCreate={() => setCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobile={() => setMobileMenuOpen(true)}
          onOpenCreate={() => setCreateModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard onOpenCreate={() => setCreateModalOpen(true)} />}
          {activeTab === 'events' && <EventCatalogPage onOpenCreate={() => setCreateModalOpen(true)} />}
          {activeTab === 'event-detail' && <EventDetailsPage />}
          {activeTab === 'tasks' && <AllTasksPage />}
          {activeTab === 'calendar' && <CalendarPage />}
          {activeTab === 'assistant' && <StandaloneAssistantPage />}
          {activeTab === 'automation' && <AutomationHub />}
        </main>
      </div>

      {/* Modals & Toasts */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
}
