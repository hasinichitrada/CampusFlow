import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { events, selectEventAndNavigate } = useEvents();

  // Reference month: October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-15');

  // Collect all tasks with dates
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getFormattedDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const selectedDateTasks = allTasks.filter(t => t.deadline === selectedDateStr);
  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Master Campus Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Visual calendar of target deadlines, rehearsal dates, and fest events.
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-stone-800 min-w-32 text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on lg) */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-100">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 p-1 bg-stone-50/50 rounded-xl" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = getFormattedDate(day);
              const dayTasks = allTasks.filter(t => t.deadline === dateStr);
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSelected = selectedDateStr === dateStr;
              const hasOverdue = dayTasks.some(
                t => t.status === 'overdue' || (t.status !== 'completed' && dateStr < '2026-09-27')
              );

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4E785F] bg-[#4E785F]/5 shadow-2xs ring-2 ring-[#4E785F]/20'
                      : 'border-stone-100 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#4E785F]' : 'text-stone-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Event Day" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className="text-[9px] font-bold truncate px-1 py-0.5 rounded bg-emerald-100 text-emerald-800"
                      >
                        🎉 {e.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className={`text-[9px] truncate px-1 rounded ${
                          t.status === 'completed'
                            ? 'bg-stone-100 text-stone-400 line-through'
                            : hasOverdue
                            ? 'bg-rose-100 text-rose-800 font-semibold'
                            : 'bg-amber-50 text-amber-900 font-medium'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-stone-400 block px-1">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Selected Date
              </span>
              <h3 className="font-heading font-bold text-base text-stone-900">
                {selectedDateStr}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Events on this date */}
          {selectedDateEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Events on this Day
              </h4>
              {selectedDateEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => selectEventAndNavigate(evt.id)}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100/70 transition-colors"
                >
                  <p className="text-xs font-bold text-emerald-950">{evt.title}</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{evt.eventType} • {evt.progress}% ready</p>
                </div>
              ))}
            </div>
          )}

          {/* Tasks due on this date */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Deliverables Due ({selectedDateTasks.length})
            </h4>

            {selectedDateTasks.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 text-stone-400 text-xs">
                No tasks scheduled for this day.
              </div>
            ) : (
              selectedDateTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => selectEventAndNavigate(task.eventId)}
                  className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-stone-300 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {task.eventName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-stone-900 leading-snug">
                    {task.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>{task.assignedTo || task.role}</span>
                    <span className="capitalize font-medium">{task.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
