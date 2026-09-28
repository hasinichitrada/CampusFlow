import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { TaskItem } from './TaskItem';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { Priority, TaskStatus } from '../../types';
import {
  Calendar,
  Sparkles,
  Bot,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ShieldAlert,
  ArrowLeft,
  Users,
  CheckSquare,
  DollarSign,
  Tag,
  ListTodo,
  CalendarRange,
} from 'lucide-react';

export const EventDetailsPage: React.FC = () => {
  const {
    currentEvent,
    setActiveTab,
    addTask,
    togglePrepStep,
    deleteTask,
    events,
    setSelectedEventId,
  } = useEvents();

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'tasks' | 'prep' | 'blindspots' | 'timeline'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');

  // New task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState(currentEvent?.date || '2026-10-15');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newRole, setNewRole] = useState('Volunteer Team');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!currentEvent) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-600">No event selected.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-4 px-4 py-2 bg-[#4E785F] text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask(currentEvent.id, {
      title: newTitle.trim(),
      description: newDesc.trim(),
      deadline: newDeadline,
      priority: newPriority,
      role: newRole.trim() || 'Logistics',
      assignedTo: newAssignee.trim() || undefined,
      status: 'pending',
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddTask(false);
  };

  const tasks = currentEvent.tasks || [];
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const overdueCount = tasks.filter(
    t => t.status === 'overdue' || (t.status !== 'completed' && t.deadline && t.deadline < '2026-09-27')
  ).length;

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'overdue') {
      return t.status === 'overdue' || (t.status !== 'completed' && t.deadline && t.deadline < '2026-09-27');
    }
    return t.status === taskFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button & top meta */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setAssistantOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Main Event Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[#2F4A38]">
                {currentEvent.eventType}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {currentEvent.date}
              </span>
              {currentEvent.budget && (
                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                  Budget: {currentEvent.budget}
                </span>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              {currentEvent.title}
            </h1>

            {/* AI-Generated Event Summary */}
            <div className="mt-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 max-w-3xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4E785F] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Generated Event Summary:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {currentEvent.summary || currentEvent.description}
              </p>
            </div>
          </div>

          {/* Progress Box */}
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200 min-w-[240px] flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span>Overall Completion</span>
              <span className="text-base font-heading font-bold text-[#4E785F]">
                {currentEvent.progress}%
              </span>
            </div>
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4E785F] rounded-full transition-all duration-500"
                style={{ width: `${currentEvent.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>{completedCount} of {tasks.length} finished</span>
              {overdueCount > 0 ? (
                <span className="text-rose-600 font-bold">{overdueCount} Overdue</span>
              ) : (
                <span className="text-emerald-700 font-bold">On Schedule</span>
              )}
            </div>
          </div>
        </div>

        {/* Team Members List */}
        {currentEvent.teamMembers && currentEvent.teamMembers.length > 0 && (
          <div className="pt-4 border-t border-stone-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" /> Committee:
            </span>
            {currentEvent.teamMembers.map((member, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium"
              >
                {member}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTabSection('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabSection === 'tasks'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tasks & Milestones ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTabSection('prep')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabSection === 'prep'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Preparation Steps ({currentEvent.prepSteps?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTabSection('blindspots')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabSection === 'blindspots'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Potential Blind Spots ({currentEvent.blindSpots?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTabSection('timeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabSection === 'timeline'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Suggested Timeline ({currentEvent.timeline?.length || 0})</span>
          </button>
        </div>

        {activeTabSection === 'tasks' && (
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:border-stone-300 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddTask ? 'Close Form' : 'Add Task'}</span>
          </button>
        )}
      </div>

      {/* 1. TASKS TAB */}
      {activeTabSection === 'tasks' && (
        <div className="space-y-4">
          {/* Add Task Collapsible Form */}
          {showAddTask && (
            <form
              onSubmit={handleCreateTask}
              className="p-5 rounded-2xl bg-white border border-stone-300 shadow-sm space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Add Manual Task to {currentEvent.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. Confirm audio mixer technician)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30"
                />
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as Priority)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <input
                  type="text"
                  placeholder="Role (e.g. Logistics)"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
                />

                <input
                  type="text"
                  placeholder="Assignee name"
                  value={newAssignee}
                  onChange={e => setNewAssignee(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
                />
              </div>

              <textarea
                placeholder="Detailed instructions or deliverable notes (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={2}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="text-xs px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-1.5 rounded-lg bg-[#4E785F] text-white font-semibold hover:bg-[#3D634C]"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-medium">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                taskFilter === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setTaskFilter('in-progress')}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                taskFilter === 'in-progress'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setTaskFilter('pending')}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                taskFilter === 'pending'
                  ? 'bg-stone-700 text-white border-stone-700'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setTaskFilter('overdue')}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                taskFilter === 'overdue'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-rose-600 border-rose-200 hover:border-rose-300'
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setTaskFilter('completed')}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                taskFilter === 'completed'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p className="text-sm font-semibold text-stone-700">No tasks in this category</p>
                <p className="text-xs text-stone-400 mt-1">Change filter or click "Add Task" to create one.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} eventId={currentEvent.id} />
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. PREP STEPS TAB */}
      {activeTabSection === 'prep' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900">
              Important Preparation Steps & Compliance
            </h3>
            <p className="text-xs text-stone-500">
              Institutional safety, permits, catering, and equipment checklist generated by Gemini.
            </p>
          </div>

          <div className="space-y-3">
            {currentEvent.prepSteps?.map(step => (
              <div
                key={step.id}
                onClick={() => togglePrepStep(currentEvent.id, step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  step.isDone
                    ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                    : 'bg-white border-stone-200 hover:border-[#4E785F]/50 shadow-2xs'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                    step.isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {step.isDone && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-stone-900">{step.title}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {step.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POTENTIAL BLIND SPOTS TAB */}
      {activeTabSection === 'blindspots' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Potential Missing Tasks & Risks</span>
            </h3>
            <p className="text-xs text-stone-500">
              High-impact operational bottlenecks commonly overlooked by collegiate organizing committees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentEvent.blindSpots?.map(bs => (
              <div
                key={bs.id}
                className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                    {bs.severity} severity
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-xs font-bold text-stone-900">{bs.risk}</h4>
                <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/50 text-xs text-stone-600">
                  <strong className="text-amber-900">Mitigation: </strong>
                  {bs.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUGGESTED TIMELINE TAB */}
      {activeTabSection === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-5">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900">
              Suggested Phase Timeline
            </h3>
            <p className="text-xs text-stone-500">
              Strategic execution cadence leading up to the event date.
            </p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
            {currentEvent.timeline?.map((phase, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-2">
                <div className="w-4 h-4 rounded-full bg-[#4E785F] border-2 border-white shadow-xs shrink-0 mt-1" />
                <div className="flex-1 p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="text-xs font-bold text-stone-900">{phase.phaseName}</h4>
                    <span className="text-[11px] font-semibold text-[#4E785F]">{phase.timeframe}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-stone-600">
                    {phase.keyDeliverables?.map((deliv, dIdx) => (
                      <li key={dIdx}>{deliv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        event={currentEvent}
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
};
