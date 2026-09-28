import React from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileCode,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AutomationHub: React.FC = () => {
  const {
    lastAutomationResult,
    runAutomation,
    isAutomating,
    selectEventAndNavigate,
    events,
  } = useEvents();

  const result = lastAutomationResult;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Automated Workflows & Deadlines
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Vercel Cron Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            CampusFlow background engine continuously audits overdue items, upcoming milestones, and committee deliverables.
          </p>
        </div>

        <button
          onClick={() => runAutomation()}
          disabled={isAutomating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Zap className={`w-4 h-4 ${isAutomating ? 'animate-spin' : ''}`} />
          <span>{isAutomating ? 'Executing Daily Audit...' : 'Run Daily Automation Now'}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Health Score & Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-heading font-extrabold text-2xl shadow-2xs ${
                    result.healthScore >= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : result.healthScore >= 50
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {result.healthScore}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      System Health Rating
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Last evaluated: {new Date(result.checkedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-stone-900 mt-0.5">
                    {result.healthScore >= 80
                      ? '🌟 Optimal Momentum — Committees Tracking Well'
                      : result.healthScore >= 50
                      ? '⚠️ Moderate Risk — Overdue Deliverables Detected'
                      : '🚨 Critical Attention Needed — Immediate Lead Intervention Required'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/70 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total Tasks</span>
                  <div className="text-base font-bold text-stone-800">{result.totalTasks}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Completed</span>
                  <div className="text-base font-bold text-emerald-600">{result.completedTasksCount}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Overdue</span>
                  <div className="text-base font-bold text-rose-600">{result.overdueTasksCount}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Due Soon</span>
                  <div className="text-base font-bold text-amber-600">{result.approachingTasksCount}</div>
                </div>
              </div>
            </div>

            {/* Generated Executive Summary Text */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong className="text-stone-900 font-semibold block mb-1">
                📋 Automated Daily Briefing:
              </strong>
              {result.executiveSummary}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4E785F]" />
              <span>Recommended Autonomous Interventions</span>
            </h3>

            <div className="space-y-3">
              {result.recommendedActions.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
                        rec.urgency === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {rec.urgency} urgency
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{rec.action}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">{rec.reason}</p>
                    </div>
                  </div>

                  {rec.eventId && (
                    <button
                      onClick={() => selectEventAndNavigate(rec.eventId!)}
                      className="text-xs font-semibold text-[#4E785F] hover:text-[#375743] shrink-0 inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Jump to event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Two-column layout for Overdue vs Approaching */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overdue Tasks Column */}
            <div className="p-6 rounded-3xl bg-white border border-rose-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Overdue Tasks ({result.overdueTasks.length})</span>
                </h3>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Requires Lead Follow-up
                </span>
              </div>

              {result.overdueTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl">
                  No overdue tasks recorded!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.overdueTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => selectEventAndNavigate(task.eventId)}
                      className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/70 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-stone-900 truncate max-w-[200px]">
                          {task.title}
                        </span>
                        <span className="text-rose-700 font-semibold">Due {task.deadline}</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Assigned: <strong>{task.assignedTo || task.role}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approaching Tasks Column (Within 72 Hours) */}
            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Approaching in 72h ({result.approachingTasks.length})</span>
                </h3>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Upcoming Milestones
                </span>
              </div>

              {result.approachingTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl">
                  No tasks due in next 72 hours.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.approachingTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => selectEventAndNavigate(task.eventId)}
                      className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-stone-900 truncate max-w-[200px]">
                          {task.title}
                        </span>
                        <span className="text-amber-800 font-semibold">{task.deadline}</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Assigned: <strong>{task.assignedTo || task.role}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vercel Cron Architecture Details Box */}
          <div className="p-6 rounded-3xl bg-stone-900 text-white space-y-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h4 className="font-heading font-bold text-sm text-white">
                Vercel Cron & Production Automation Architecture
              </h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              CampusFlow separates UI state from background automation logic. The backend endpoint <code className="text-emerald-300 bg-stone-800 px-1 py-0.5 rounded font-mono">POST /api/automation/daily-check</code> can be configured in <code className="text-emerald-300 bg-stone-800 px-1 py-0.5 rounded font-mono">vercel.json</code> to execute every day at 8:00 AM UTC.
            </p>
            <div className="p-3 rounded-xl bg-stone-800/80 font-mono text-[11px] text-stone-300 overflow-x-auto">
              <pre>{`// vercel.json snippet for automatic scheduled runs
{
  "crons": [
    {
      "path": "/api/automation/daily-check",
      "schedule": "0 8 * * *"
    }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
