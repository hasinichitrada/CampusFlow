import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../../types';
import { useEvents } from '../../context/EventContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';

interface Props {
  task: Task;
  eventId: string;
  showEventName?: boolean;
  eventName?: string;
}

export const TaskItem: React.FC<Props> = ({ task, eventId, showEventName, eventName }) => {
  const { toggleTaskComplete, updateTask, deleteTask } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(task.deadline);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');

  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue' || (!isCompleted && task.deadline && task.deadline < '2026-09-27');

  const handleSave = () => {
    updateTask(eventId, task.id, {
      title,
      deadline,
      priority,
      assignedTo: assignedTo.trim() || undefined,
    });
    setIsEditing(false);
  };

  const priorityColors = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-stone-100 text-stone-600 border-stone-200',
  };

  const statusColors = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'in-progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending: 'bg-stone-100 text-stone-700 border-stone-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div
      className={`group p-4 rounded-xl border transition-all ${
        isCompleted
          ? 'bg-stone-50/70 border-stone-200/60 opacity-80'
          : isOverdue
          ? 'bg-white border-rose-200 hover:border-rose-300 shadow-2xs'
          : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30"
            placeholder="Task title"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-stone-500 uppercase">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-stone-500 uppercase">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-hidden"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-stone-500 uppercase">Assignee</label>
              <input
                type="text"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                placeholder="Assignee name"
                className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-hidden"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-[#4E785F] text-white font-medium hover:bg-[#3D634C]"
            >
              <Check className="w-3 h-3" /> Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleTaskComplete(eventId, task.id)}
            className="mt-0.5 text-stone-400 hover:text-[#4E785F] transition-colors cursor-pointer shrink-0"
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Circle className="w-5 h-5 text-stone-300 hover:text-[#4E785F]" />
            )}
          </button>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                className={`text-xs sm:text-sm font-semibold tracking-tight transition-all ${
                  isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                }`}
              >
                {task.title}
              </h4>

              {/* Priority badge */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>

              {/* Status badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                  isOverdue && !isCompleted ? statusColors.overdue : statusColors[task.status]
                }`}
              >
                {isOverdue && !isCompleted ? 'Overdue' : task.status}
              </span>

              {showEventName && eventName && (
                <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {eventName}
                </span>
              )}
            </div>

            {task.description && (
              <p
                className={`text-xs leading-relaxed mb-2.5 ${
                  isCompleted ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Meta Row: Deadline & Assignee */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
              <div
                className={`flex items-center gap-1.5 ${
                  isOverdue && !isCompleted ? 'text-rose-600 font-semibold' : 'text-stone-600'
                }`}
              >
                {isOverdue && !isCompleted ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>Due {task.deadline || 'TBD'}</span>
                {isOverdue && !isCompleted && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 rounded">Action needed</span>}
              </div>

              <div className="flex items-center gap-1.5 text-stone-600">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {task.assignedTo ? (
                    <strong className="font-medium text-stone-800">{task.assignedTo}</strong>
                  ) : (
                    <span className="italic text-stone-400">Unassigned</span>
                  )}{' '}
                  <span className="text-stone-400">({task.role})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteTask(eventId, task.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
