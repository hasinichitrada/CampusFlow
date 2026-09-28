import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { TaskItem } from '../events/TaskItem';
import { TaskStatus } from '../../types';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Zap,
  Bell,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface Props {
  onOpenCreate: () => void;
}

export const Dashboard: React.FC<Props> = ({ onOpenCreate }) => {
  const {
    events,
    selectEventAndNavigate,
    notifications,
    runAutomation,
    isAutomating,
    lastAutomationResult,
  } = useEvents();

  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');

  // Compute metrics across all events
  const totalEvents = events.length;
  let allTasks: any[] = [];
  events.forEach(evt => {
    allTasks = allTasks.concat(
      evt.tasks.map(t => ({
        ...t,
        eventName: evt.title,
        eventId: evt.id,
      }))
    );
  });

  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const pendingCount = allTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length;
  const overdueCount = allTasks.filter(
    t => t.status === 'overdue' || (t.status !== 'completed' && t.deadline && t.deadline < '2026-09-27')
  ).length;

  const totalTasks = allTasks.length;
  const overallProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Filter tasks for task section
  const filteredTasks = allTasks.filter(t => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'overdue') {
      return t.status === 'overdue' || (t.status !== 'completed' && t.deadline && t.deadline < '2026-09-27');
    }
    return t.status === taskFilter;
  });

  // Critical notifications
  const urgentNotifications = notifications.filter(n => n.type === 'alert' || n.type === 'warning');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Greeting & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Good morning 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[#2F4A38] font-semibold">
              Fall Semester 2026
            </span>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Here is what’s happening across your campus committees and events today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => runAutomation()}
            disabled={isAutomating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-600 ${isAutomating ? 'animate-spin' : ''}`} />
            <span>{isAutomating ? 'Auditing...' : 'Run Automation'}</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-sm transition-all hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Notification Banner / Attention Needed Area */}
      {urgentNotifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <span>🔔 {urgentNotifications.length} tasks need immediate attention</span>
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                "{urgentNotifications[0].message}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setTaskFilter('overdue')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline self-start md:self-center shrink-0 cursor-pointer"
          >
            Review overdue tasks &rarr;
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Events */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Events</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAE8E0] text-[#2F4A38] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#4E785F]" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-stone-900">
            {totalEvents}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Across 3 college committees</p>
        </div>

        {/* Pending Tasks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-stone-900">
            {pendingCount + inProgressCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {inProgressCount} in progress, {pendingCount} queued
          </p>
        </div>

        {/* Overdue Tasks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Overdue Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-rose-600">
            {overdueCount}
          </div>
          <p className="text-[11px] text-rose-600/80 mt-1">Requires student lead follow-up</p>
        </div>

        {/* Overall Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Overall Progress</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-stone-900">
            {overallProgress}%
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-[#4E785F] rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-stone-500">
              Active projects and milestones tracked in CampusFlow
            </p>
          </div>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#4E785F] hover:text-[#375743]"
          >
            <Plus className="w-3.5 h-3.5" /> Plan another event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => selectEventAndNavigate(event.id)}
              className="group p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE8E0] text-[#2F4A38]">
                    {event.eventType}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{event.date}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-[#4E785F] transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {event.summary || event.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-500 font-medium">Event Completion</span>
                  <span className="font-bold text-[#4E785F]">{event.progress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4E785F] rounded-full transition-all duration-500"
                    style={{ width: `${event.progress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{event.tasks.length} tasks scheduled</span>
                  <span className="inline-flex items-center gap-0.5 text-[#4E785F] font-semibold group-hover:translate-x-0.5 transition-transform">
                    View plan <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Section with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
              Action Items & Tasks
            </h2>
            <p className="text-xs text-stone-500">
              Assigned deliverables across all campus initiatives
            </p>
          </div>

          {/* Filter Tabs: Completed, In Progress, Pending, Overdue */}
          <div className="inline-flex p-1 bg-stone-200/60 rounded-xl text-xs font-semibold text-stone-600 gap-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                taskFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'hover:text-stone-900'
              }`}
            >
              All ({allTasks.length})
            </button>
            <button
              onClick={() => setTaskFilter('in-progress')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                taskFilter === 'in-progress'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'hover:text-stone-900'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setTaskFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                taskFilter === 'pending'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'hover:text-stone-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setTaskFilter('overdue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                taskFilter === 'overdue'
                  ? 'bg-rose-50 text-rose-700 shadow-2xs font-bold'
                  : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setTaskFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                taskFilter === 'completed'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'hover:text-stone-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-stone-200/80 text-center text-stone-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="text-sm font-semibold text-stone-700">No tasks in this view</p>
              <p className="text-xs text-stone-400 mt-1">Try switching filters or add a new task.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={`${task.eventId}-${task.id}`}
                task={task}
                eventId={task.eventId}
                showEventName={true}
                eventName={task.eventName}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
