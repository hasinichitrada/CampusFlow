import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { TaskItem } from '../events/TaskItem';
import { TaskStatus, Priority } from '../../types';
import {
  Search,
  CheckCircle2,
  Filter,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

export const AllTasksPage: React.FC = () => {
  const { events } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');

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

  const filteredTasks = allTasks.filter(t => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchAssignee = t.assignedTo?.toLowerCase().includes(q);
      const matchRole = t.role?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee && !matchRole) return false;
    }

    // Event filter
    if (selectedEventFilter !== 'all' && t.eventId !== selectedEventFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'overdue') {
        const isOvd = t.status === 'overdue' || (t.status !== 'completed' && t.deadline && t.deadline < '2026-09-27');
        if (!isOvd) return false;
      } else if (t.status !== statusFilter) {
        return false;
      }
    }

    // Priority filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Universal Task Board
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tracking {allTasks.length} deliverables across {events.length} active campus initiatives.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, roles, or team members..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
            />
          </div>

          {/* Event Filter */}
          <select
            value={selectedEventFilter}
            onChange={e => setSelectedEventFilter(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden bg-white"
          >
            <option value="all">All Events ({events.length})</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm font-semibold text-stone-700">No tasks match your criteria</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting search filters or keywords.</p>
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
  );
};
