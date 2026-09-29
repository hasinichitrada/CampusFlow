import React from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Bot,
  Zap,
  BarChart3,
  Layers,
  ChevronRight,
  Users,
} from 'lucide-react';

interface Props {
  onOpenCreate: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenCreate }) => {
  const { setActiveTab, selectEventAndNavigate, events } = useEvents();

  const handleViewDemo = () => {
    selectEventAndNavigate('evt-techfest-2026');
  };

  return (
    <div className="min-h-full pb-16">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE8E0] text-[#2F4A38] text-xs font-semibold mb-6 border border-stone-200/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#4E785F]" />
          <span>Next-Generation College Event Infrastructure</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1C2024] tracking-tight leading-[1.15] mb-5">
          Plan campus events. <br className="hidden sm:inline" />
          <span className="text-[#4E785F]">Let AI handle the busy work.</span>
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          CampusFlow turns your event idea into tasks, deadlines and automated follow-ups. Built specifically for collegiate student councils, tech clubs, and fest committees.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onOpenCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-sm font-semibold shadow-md shadow-[#4E785F]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create an Event</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={handleViewDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 text-sm font-semibold shadow-2xs transition-all hover:border-stone-300 cursor-pointer"
          >
            <span>View Demo (TechFest 2026)</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E785F]" />
            Free for student clubs
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E785F]" />
            Powered by Gemini AI
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E785F]" />
            Automated deadline audits
          </span>
        </div>
      </section>

      {/* Visual Preview of CampusFlow Dashboard */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-20">
        <div className="relative rounded-2xl p-2 sm:p-3 bg-stone-200/60 border border-stone-200/90 shadow-xl shadow-stone-900/5">
          <div className="bg-[#FAF9F5] rounded-xl border border-stone-200/80 overflow-hidden">
            {/* Window bar */}
            <div className="px-4 py-2.5 bg-stone-100/90 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-stone-500 font-mono ml-2">campusflow.internal/workspace/techfest-2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  LIVE WORKSPACE
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Event Header Banner */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200/70 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[#2F4A38] font-semibold">
                      Flagship Symposium
                    </span>
                    <span className="text-xs text-stone-500 font-medium">October 15, 2026</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-stone-900">TechFest 2026 — Annual Engineering Gala</h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    300+ attendees registered across coding hackathons, robotics arena, and guest keynote tracks.
                  </p>
                </div>
                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-stone-200 min-w-48">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                    <span>Overall Progress</span>
                    <span className="text-[#4E785F]">70%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4E785F] rounded-full" style={{ width: '70%' }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span>8 Tasks Total</span>
                    <span className="text-rose-600 font-medium">1 Overdue</span>
                  </div>
                </div>
              </div>

              {/* Sample Task Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Completed
                    </span>
                    <span className="text-[11px] text-stone-400">Oct 01</span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 line-through text-stone-400">
                    Finalize event poster & branding
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1">Design Team • Priya Sharma</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      In Progress
                    </span>
                    <span className="text-[11px] text-stone-400">Oct 08</span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    Assign 25 student volunteers
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1">Student Council • Sarah Miller</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      Needs Action
                    </span>
                    <span className="text-[11px] text-rose-600 font-semibold">Overdue</span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    Prepare certificates & mementos
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1">Media Team • Dean signature pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Engineered for Campus Realities
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Traditional project tools are too generic. CampusFlow is tailored for the chaos of college clubs, festivals, and deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: AI Event Planning */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#EAE8E0] text-[#2F4A38] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#4E785F]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">AI Event Planning</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              Describe your event in plain student slang or faculty briefs. Gemini extracts full task breakdowns, priority tiers, role assignments, and potential blind spots.
            </p>
            <div className="text-xs font-semibold text-[#4E785F] flex items-center gap-1">
              <span>Structured JSON output with zero hallucination</span>
            </div>
          </div>

          {/* Card 2: Smart Task Management */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#E8E2F2] text-[#6A4B95] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">Smart Task Management</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              Organize tasks across logistics, marketing, sponsorship, and technical stages. Inline edit deadlines, change assignees, and filter by status effortlessly.
            </p>
            <div className="text-xs font-semibold text-[#6A4B95] flex items-center gap-1">
              <span>Interactive checklist & timeline phases</span>
            </div>
          </div>

          {/* Card 3: Automated Reminders */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">Automated Reminders</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              CampusFlow automatically audits upcoming deadlines, identifies overdue bottlenecks, and formats copyable announcements for WhatsApp or Discord.
            </p>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Vercel Cron ready architecture</span>
            </div>
          </div>

          {/* Card 4: Progress Tracking */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">Progress Tracking</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              Live completion analytics, system health ratings (0-100), and instant summary reports give faculty advisors and lead organizers full visibility.
            </p>
            <div className="text-xs font-semibold text-rose-700 flex items-center gap-1">
              <span>Real-time completion percentage</span>
            </div>
          </div>
        </div>

        {/* n8n Workflow Agent Live Integration Banner */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EA4B71] to-[#FF6B4A] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              n8n
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Live Cloud Agent Connected
                </span>
                <span className="text-xs text-stone-400">hasinich.app.n8n.cloud</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Powered by your custom n8n AI Agent Workflow
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
                Connect your event management workflows to n8n triggers. Click the floating widget in the bottom-right corner or open the AI Co-Pilot to converse with your autonomous n8n agent directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://hasinich.app.n8n.cloud/webhook/4e208ad8-a989-4e3a-88e6-b74c707abc06/chat"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold transition-all"
            >
              View Webhook
            </a>
            <button
              onClick={() => {
                const widgetBtn = document.querySelector('button[aria-label="Toggle n8n Agent Chat"]') as HTMLButtonElement;
                if (widgetBtn) widgetBtn.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA4B71] to-[#FF6B4A] hover:opacity-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Open n8n Chat 💬
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F0EDE4] border border-stone-300/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E785F]">Simple Workflow</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight mt-1">
              How CampusFlow Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              From a rough event concept to an execution-ready plan in under 10 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-2xs relative">
              <div className="w-7 h-7 rounded-full bg-[#4E785F] text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Describe your event</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Provide dates, budget, attendee goals, and natural requirements in one simple box.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-2xs relative">
              <div className="w-7 h-7 rounded-full bg-[#4E785F] text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">AI creates the plan</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gemini structures deadlines, roles, permit checklists, and contingency steps.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-2xs relative">
              <div className="w-7 h-7 rounded-full bg-[#4E785F] text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Assign tasks</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Team members get designated responsibilities, priority badges, and target dates.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-2xs relative">
              <div className="w-7 h-7 rounded-full bg-[#4E785F] text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">CampusFlow tracks all</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Automated workflows monitor deadlines, trigger alerts, and keep everyone on track.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Explore the Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
